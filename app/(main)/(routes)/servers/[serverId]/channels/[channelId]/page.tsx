import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import ChatInput from "@/components/chat/chat-input";
import ChatHeader from "@/components/chat/chat-header";
import { currentProfile } from "@/lib/current-profile";
import ChatMessages from "@/components/chat/chat-messages";

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
			<ChatMessages
				member={member}
				name={channel.name}
				chatId={channel.id}
				type="channel"
				apiUrl="/api/messages"
				socketUrl="/api/socket/messages"
				socketQuery={{ channelId: channel.id, serverId: channel.serverId }}
				paramKey="channelId"
				paramValue={channel.id}
			/>
			<ChatInput
				name={channel.name}
				type="channel"
				apiUrl="/api/socket/messages"
				query={{
					channelId: channel.id,
					serverId: channel.serverId,
				}}
			/>
		</div>
	);
}
