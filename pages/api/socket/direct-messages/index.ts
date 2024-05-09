import { NextApiRequest } from "next";

import { db } from "@/lib/db";
import { NextApiResponseServerIo } from "@/types";
import { currentProfilePages } from "@/lib/current-profile-pages";

export default async function handler(
	request: NextApiRequest,
	response: NextApiResponseServerIo
) {
	if (request.method !== "POST") {
		return response.status(405).json({ error: "Method not allowed" });
	}

	try {
		const profile = await currentProfilePages(request);
		const { content, fileUrl } = request.body;
		const { conversationId } = request.query;

		if (!profile) {
			return response.status(401).json({ error: "Unauthorized!" });
		}

		if (!conversationId) {
			return response.status(401).json({ error: "Conversation ID missing!" });
		}

		if (!content) {
			return response.status(401).json({ error: "Content missing!" });
		}

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
			return response.status(404).json({ error: "Conversation not found!" });
		}
		const member =
			conversation.memberOne.profileId === profile.id
				? conversation.memberOne
				: conversation.memberTwo;

		if (!member) {
			return response.status(404).json({ message: "Member not found" });
		}

		const message = await db.directMessage.create({
			data: {
				content,
				fileUrl,
				conversationId: conversationId as string,
				memberId: member.id,
			},
			include: {
				member: {
					include: {
						profile: true,
					},
				},
			},
		});

		const channelKey = `chat:${conversationId}:messages`;

		response?.socket?.server?.io?.emit(channelKey, message);

		return response.status(200).json(message);
	} catch (error) {
		console.log(`[DIRECT_MESSAGES_POST]`, error);
		return response.status(500).json({ message: "Internal Error" });
	}
}
