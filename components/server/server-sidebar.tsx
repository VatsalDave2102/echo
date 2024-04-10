import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/auth";
import { ChannelType } from "@prisma/client";
import { ServerHeader } from "@/components/server/server-header";

interface ServerSidebarProps {
	serverId: string;
}

export const ServerSidebar: React.FC<ServerSidebarProps> = async ({
	serverId,
}) => {
	// fetching profile
	const profile = await currentProfile();

	if (!profile) {
		redirect("/");
	}

	// fetching server with channels and their members
	const server = await db.server.findUnique({
		where: {
			id: serverId,
		},
		include: {
			channels: {
				orderBy: {
					createdAt: "asc",
				},
			},
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

	if (!server) {
		redirect("/");
	}

	const textChannels = server?.channels.filter(
		(channel) => channel.type === ChannelType.TEXT
	);

	const audioChannels = server?.channels.filter(
		(channel) => channel.type === ChannelType.AUDIO
	);

	const videoChannels = server?.channels.filter(
		(channel) => channel.type === ChannelType.VIDEO
	);

	const members = server?.members.filter(
		(member) => member.profileId !== profile.id
	);

	const role = server.members.find(
		(member) => member.profileId === profile.id
	)?.role;

	return (
		<div className="flex flex-col h-full text-primary w-full dark:bg-[#2b2d31] bg-[#f5f2f2]">
			<ServerHeader server={server} role={role} />
		</div>
	);
};
