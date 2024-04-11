import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/auth";

// handler to update role
export async function PATCH(
	request: NextRequest,
	{ params }: { params: { memberId: string } }
) {
	try {
		const profile = await currentProfile();
		const { searchParams } = new URL(request.url);
		const { role } = await request.json();

		const serverId = searchParams.get("serverId");

		if (!profile) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		if (!serverId) {
			return NextResponse.json({ error: "Server ID missing" }, { status: 400 });
		}

		if (!params.memberId) {
			return NextResponse.json({ error: "Member ID missing" }, { status: 400 });
		}

		// updating role in server
		const server = await db.server.update({
			// checking if server and admin are same
			where: {
				id: serverId,
				profileId: profile.id,
			},
			// updating members
			data: {
				members: {
					update: {
						// only admin can update members, vice versa not possible
						where: {
							id: params.memberId,
							profileId: {
								not: profile.id,
							},
						},
						data: {
							role,
						},
					},
				},
			},
			include: {
				members: {
					include: {
						profile: true,
					},
					orderBy: {
						role: "asc",
					},
				},
			},
		});

		return NextResponse.json(server);
	} catch (error) {
		console.log("[MEMBERS_ID_PATCH]", error);
		return NextResponse.json({ error: "Internal Error" }, { status: 500 });
	}
}

// handler to delete member
export async function DELETE(
	request: NextRequest,
	{ params }: { params: { memberId: string } }
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

		if (!params.memberId) {
			return NextResponse.json({ error: "Missing member id" }, { status: 400 });
		}

		const server = await db.server.update({
			where: {
				id: serverId,
				profileId: profile.id,
			},
			data: {
				members: {
					deleteMany: {
						id: params.memberId,
						profileId: {
							not: profile.id,
						},
					},
				},
			},
			include: {
				members: {
					include: {
						profile: true,
					},
					orderBy: {
						role: "asc",
					},
				},
			},
		});

		return NextResponse.json(server);
	} catch (error) {
		console.log("[MEMBER_ID_DELETE]", error);
		return NextResponse.json({ error: "Internal Error" }, { status: 500 });
	}
}
