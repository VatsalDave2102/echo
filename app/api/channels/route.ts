import { currentProfile } from "@/lib/auth";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

// handler to create channels
export async function POST(request: NextRequest) {
	try {
		const profile = await currentProfile();

		const { searchParams } = new URL(request.url);
		const serverId = searchParams.get("serverId");

		const { name, type } = await request.json();

		if (!profile) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		if (!serverId) {
			return NextResponse.json({ error: "Missing server ID" }, { status: 400 });
		}

		if (name === "general") {
			return NextResponse.json(
				{ error: `Name cannot be "general"` },
				{ status: 400 }
			);
		}

		const server = await db.server.update({
			where: {
				id: serverId,
				members: {
					some: {
						profileId: profile.id,
						role: {
							in: [MemberRole.ADMIN, MemberRole.MODERATOR],
						},
					},
				},
			},
			data: {
				channels: {
					create: {
						profileId: profile.id,
						name,
						type,
					},
				},
			},
		});

		return NextResponse.json(server);
	} catch (error) {
		console.log("[CHANNEL_POST]", error);
		return NextResponse.json("Internal error", { status: 500 });
	}
}
