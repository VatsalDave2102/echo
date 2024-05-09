import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { DirectMessage } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const MESSAGES_BATCH = 10;

// handler to fetch direct messages
export async function GET(request: NextRequest) {
	try {
		const profile = await currentProfile();
		const { searchParams } = new URL(request.url);

		// get cursor and channelId from search params
		const cursor = searchParams.get("cursor");
		const conversationId = searchParams.get("conversationId");

		if (!profile) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		if (!conversationId) {
			return NextResponse.json(
				{ error: "Conversation ID missing" },
				{ status: 400 }
			);
		}

		let messages: DirectMessage[] = [];

		// if cursor is present
		if (cursor) {
			messages = await db.directMessage.findMany({
				take: MESSAGES_BATCH,
				skip: 1,
				cursor: {
					id: cursor,
				},
				where: {
					conversationId,
				},
				include: {
					member: {
						include: {
							profile: true,
						},
					},
				},
				orderBy: {
					createdAt: "desc",
				},
			});
		} else {
			messages = await db.directMessage.findMany({
				take: MESSAGES_BATCH,
				where: { conversationId },
				include: {
					member: {
						include: {
							profile: true,
						},
					},
				},
				orderBy: {
					createdAt: "desc",
				},
			});
		}

		let nextCursor = null;

		if (messages.length === MESSAGES_BATCH) {
			nextCursor = messages[MESSAGES_BATCH - 1].id;
		}

		return NextResponse.json({ items: messages, nextCursor });
	} catch (error) {
		console.log("[MESSAGES_GET]", error);
		return NextResponse.json({ error: "Internal Error" }, { status: 500 });
	}
}
