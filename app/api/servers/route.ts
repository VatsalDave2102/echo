import { v4 as uuidv4 } from "uuid";
import { MemberRole } from "@prisma/client";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

// handler to create server and store it
export async function POST(request: NextRequest) {
	try {
		// extracting server name and image
		const { name, imageUrl } = await request.json();

		// getting user's profile
		const profile = await currentProfile();

		if (!profile) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// creating server
		const server = await db.server.create({
			data: {
				profileId: profile.id,
				name,
				imageUrl,
				inviteCode: uuidv4(),
				channels: {
					create: [{ name: "general", profileId: profile.id }],
				},
				members: {
					create: [{ profileId: profile.id, role: MemberRole.ADMIN }],
				},
			},
		});

		return NextResponse.json(server, { status: 201 });
	} catch (error) {
		console.log("[SERVERS_POST]", error);
		return NextResponse.json({ error: "Internal error" }, { status: 500 });
	}
}
