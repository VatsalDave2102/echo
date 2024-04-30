import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";

interface InviteCodePageProps {
	params: {
		inviteCode: string;
	};
}

export default async function InviteCodePage({ params }: InviteCodePageProps) {
	// fetching current profile
	const profile = await currentProfile();

	if (!profile) {
		redirect("/sign-in");
	}

	// if no invite code found
	if (!params.inviteCode) {
		redirect("/");
	}

	// checking for existing server with invite code
	const existingServer = await db.server.findFirst({
		where: {
			inviteCode: params.inviteCode,
			members: {
				some: {
					profileId: profile.id,
				},
			},
		},
	});

	if (existingServer) {
		redirect(`/servers/${existingServer.id}`);
	}

	const server = await db.server.update({
		where: {
			inviteCode: params.inviteCode,
		},
		data: {
			members: {
				create: [
					{
						profileId: profile.id,
					},
				],
			},
		},
	});

	if (server) {
		redirect(`/servers/${server.id}`);
	}
	return null;
}
