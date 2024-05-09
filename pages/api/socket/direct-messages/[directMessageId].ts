import { NextApiRequest } from "next";

import { NextApiResponseServerIo } from "@/types";
import { currentProfilePages } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";

export default async function handler(
	request: NextApiRequest,
	response: NextApiResponseServerIo
) {
	// to check whether method is other than delete or patch
	if (request.method !== "DELETE" && request.method !== "PATCH") {
		return response.status(405).json({ error: "Method not allowed" });
	}

	try {
		const profile = await currentProfilePages(request);
		const { directMessageId, conversationId } = request.query;
		const { content } = request.body;

		if (!profile) {
			return response.status(401).json({ error: "Unauthorized" });
		}

		if (!conversationId) {
			return response.status(401).json({ error: "Conversation ID missing" });
		}

		// finding conversation
		const conversation = await db.conversation.findFirst({
			where: {
				id: conversationId as string,
				OR: [
					{
						memberOne: {
							profileId: profile.id,
						},
					},
					{
						memberTwo: {
							profileId: profile.id,
						},
					},
				],
			},
			include: {
				memberOne: {
					include: {
						profile: true,
					},
				},
				memberTwo: {
					include: {
						profile: true,
					},
				},
			},
		});

		if (!conversation) {
			return response.status(404).json({ error: "Conversation not found" });
		}

		// getting member
		const member =
			conversation.memberOne.profileId === profile.id
				? conversation.memberOne
				: conversation.memberTwo;

		if (!member) {
			return response.status(404).json({ error: "Member not found" });
		}

		let directMessage = await db.directMessage.findFirst({
			where: {
				id: directMessageId as string,
				conversationId: conversationId as string,
			},
			include: {
				member: {
					include: { profile: true },
				},
			},
		});

		if (!directMessage || directMessage.deleted) {
			return response.status(404).json({ error: "Message not found" });
		}

		const isMessageOwner = directMessage.memberId === member.id;
		const isAdmin = member.role === MemberRole.ADMIN;
		const isModerator = member.role === MemberRole.MODERATOR;
		const canModify = isMessageOwner || isAdmin || isModerator;

		if (!canModify) {
			return response
				.status(401)
				.json({ error: "Unauthorized to do this action" });
		}

		// delete message by changing content and file url
		if (request.method === "DELETE") {
			directMessage = await db.directMessage.update({
				where: {
					id: directMessageId as string,
				},
				data: {
					fileUrl: null,
					content: "This message has been deleted",
					deleted: true,
				},
				include: {
					member: {
						include: { profile: true },
					},
				},
			});
		}

		// only message owner can update messages
		if (request.method === "PATCH") {
			if (!isMessageOwner) {
				return response.status(401).json({ error: "Unauthorized" });
			}

			directMessage = await db.directMessage.update({
				where: {
					id: directMessageId as string,
				},
				data: {
					content,
				},
				include: {
					member: {
						include: { profile: true },
					},
				},
			});
		}

		const updateKey = `chat:${conversation.id}:messages:update`;

		response?.socket?.server?.io?.emit(updateKey, directMessage);

		return response.status(200).json(directMessage);
	} catch (error) {
		console.log("[MESSAGE_ID]", error);
		return response.status(500).json({ error: "Internal error" });
	}
}
