import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/auth";

// handler to update server settings
export async function PATCH(
	request: NextRequest,
	{ params }: { params: { serverId: string } }
) {
	try {
		const profile = await currentProfile();
		const { name, imageUrl } = await request.json();
		if (!profile) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const server = await db.server.update({
			where: {
				id: params.serverId,
				profileId: profile.id,
			},
			data: {
				name,
				imageUrl,
			},
		});

		return NextResponse.json(server);
	} catch (error) {
		console.log("[SERVER_ID_PATCH]", error);
		return NextResponse.json({ error: "Internal error" }, { status: 500 });
	}
}

// handler to delete server
export async function DELETE(
	request: NextRequest,
	{ params }: { params: { serverId: string } }
) {
	try {
		const profile = await currentProfile();

		if (!profile) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const server = await db.server.delete({
			where: {
				id: params.serverId,
				profileId: profile.id,
			},
		});

		return NextResponse.json(server);
	} catch (error) {
		console.log("[SERVER_ID_DELETE]", error);
		return NextResponse.json({ error: "Internal error" }, { status: 500 });
	}
}
