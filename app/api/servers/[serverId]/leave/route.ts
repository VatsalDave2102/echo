import { currentProfile } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// handler to leave server
export async function PATCH(
	request: NextRequest,
	{ params }: { params: { serverId: string } }
) {
	try {
		const profile = await currentProfile();

		if (!profile) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		if (!params.serverId) {
			return NextResponse.json({ error: "Server ID missing" }, { status: 400 });
		}

		const server = await db.server.update({
			where: {
				id: params.serverId,
				// admin cannot leave
				profileId: {
					not: profile.id,
				},
				// person is part of server
				members: {
					some: {
						profileId: profile.id,
					},
				},
			},
			// deleting the member
			data: {
				members: {
					deleteMany: {
						profileId: profile.id,
					},
				},
			},
		});

		return NextResponse.json(server);
	} catch (error) {
		console.log("[SERVER_ID_LEAVE]", error);
		return NextResponse.json({ error: "Internal error" }, { status: 500 });
	}
}
