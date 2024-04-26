import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/auth";
import ChatHeader from "@/components/chat/chat-header";

interface ChannedlIdPageProps {
	params: {
		serverId: string;
		channelId: string;
	};
}

export default async function ChannelPage({ params }: ChannedlIdPageProps) {
	const profile = await currentProfile();

	if (!profile) {
		redirect("/login");
	}

	// get channel
	const channel = await db.channel.findUnique({
		where: {
			id: params.channelId,
		},
	});

	// get member to verify only channel member is accessing the channel
	const member = await db.member.findFirst({
		where: {
			serverId: params.serverId,
			profileId: profile.id,
		},
	});

	// if channel not found or member is not in channel
	if (!channel || !member) {
		redirect("/");
	}
	return (
		<div className="bg-white dark:bg-[#313338] flex flex-col h-full">
			<ChatHeader
				name={channel.name}
				serverId={channel.serverId}
				type="channel"
			/>
		</div>
	);
}
