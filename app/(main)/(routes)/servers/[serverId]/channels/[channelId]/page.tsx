import { Metadata } from "next";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { ChannelType } from "@prisma/client";
import ChatInput from "@/components/chat/chat-input";
import ChatHeader from "@/components/chat/chat-header";
import { currentProfile } from "@/lib/current-profile";
import ChatMessages from "@/components/chat/chat-messages";
import { MediaRoom } from "@/components/common/media-room";

interface ChannedlIdPageProps {
	params: {
		serverId: string;
		channelId: string;
	};
}

// to generate metadata
export async function generateMetadata({
	params,
}: ChannedlIdPageProps): Promise<Metadata> {
	const serverId = params.serverId;
	const channelId = params.channelId;

	const server = await db.server.findFirst({
		where: {
			id: serverId,
		},
	});

	const channel = await db.channel.findUnique({
		where: { id: channelId },
	});

	return {
		title: `${channel?.name} | ${server?.name}`,
		description: `Communicate with ${server?.name}`,
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
			{channel.type === ChannelType.TEXT ? (
				<>
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
				</>
			) : null}

			{channel.type === ChannelType.AUDIO ? (
				<MediaRoom chatId={channel.id} video={false} audio={true} />
			) : null}
			{channel.type === ChannelType.VIDEO ? (
				<MediaRoom chatId={channel.id} video={true} audio={false} />
			) : null}
		</div>
	);
}
