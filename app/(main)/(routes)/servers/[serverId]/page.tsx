import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";

interface ServerIdPageProps {
	params: {
		serverId: string;
	};
}

export default async function ServerIdPage({ params }: ServerIdPageProps) {
	const profile = await currentProfile();

	if (!profile) {
		redirect("/login");
	}

	// find current server with general channel
	const server = await db.server.findUnique({
		where: {
			id: params.serverId,
			members: {
				some: {
					profileId: profile.id,
				},
			},
		},
		include: {
			channels: {
				where: {
					name: "general",
				},
				orderBy: {
					createdAt: "asc",
				},
			},
		},
	});

	const initialChannel = server?.channels[0];

	// if server has no general channel
	if (initialChannel?.name !== "general") {
		return null;
	}

	// redirect to general channel
	return redirect(`/servers/${params.serverId}/channels/${initialChannel.id}`);
}
