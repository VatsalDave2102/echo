import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { currentProfile } from "@/lib/current-profile";

// handler to update channel
export async function PATCH(
	request: NextRequest,
	{ params }: { params: { channelId: string } }
) {
	try {
		const profile = await currentProfile();
		const { searchParams } = new URL(request.url);
		const { name, type } = await request.json();
		const serverId = searchParams.get("serverId");

		if (!profile) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		if (!serverId) {
			return NextResponse.json({ error: "Server ID missing" }, { status: 400 });
		}

		if (name === "general") {
			return NextResponse.json(
				{ error: "Name can not be general" },
				{ status: 400 }
			);
		}

		if (!params.channelId) {
			return NextResponse.json(
				{ error: "Channel ID is missing" },
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
					update: {
						where: {
							id: params.channelId,
							NOT: {
								name: "general",
							},
						},
						data: {
							name,
							type,
						},
					},
				},
			},
		});

		return NextResponse.json(server);
	} catch (error) {
		console.log("[CHANNEL_ID_PATCH]", error);
		return NextResponse.json({ error: "Internal Error" }, { status: 500 });
	}
}

// handler to delete channel
export async function DELETE(
	request: NextRequest,
	{ params }: { params: { channelId: string } }
) {
	try {
		const profile = await currentProfile();
		const { searchParams } = new URL(request.url);

		const serverId = searchParams.get("serverId");

		if (!profile) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		if (!serverId) {
			return NextResponse.json({ error: "Server ID missing" }, { status: 400 });
		}

		if (!params.channelId) {
			return NextResponse.json(
				{ error: "Channel ID is missing" },
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
					delete: {
						id: params.channelId,
						name: { not: "general" },
					},
				},
			},
		});

		return NextResponse.json(server);
	} catch (error) {
		console.log("[CHANNEL_ID_DELETE]", error);
		return NextResponse.json({ error: "Internal Error" }, { status: 500 });
	}
}
