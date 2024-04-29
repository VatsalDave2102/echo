import { v4 as uuidv4 } from "uuid";
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";

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
				profileId: profile.id,
			},
			data: {
				inviteCode: uuidv4(),
			},
		});

		return NextResponse.json(server);
	} catch (error) {
		console.log("[SERVER_ID]", error);
		return NextResponse.json({ error: "Internal Error" }), { status: 500 };
	}
}
