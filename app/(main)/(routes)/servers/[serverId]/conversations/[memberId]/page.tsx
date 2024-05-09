import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

import { db } from "@/lib/db";
import ChatInput from "@/components/chat/chat-input";
import { currentProfile } from "@/lib/current-profile";
import ChatHeader from "@/components/chat/chat-header";
import ChatMessages from "@/components/chat/chat-messages";
import { getOrCreateConversation } from "@/lib/conversation";
import { MediaRoom } from "@/components/common/media-room";

interface MemberIdPageProps {
	params: {
		memberId: string;
		serverId: string;
	};
	searchParams: {
		video?: boolean;
	};
}

export default async function MemberIdPage({
	params,
	searchParams,
}: MemberIdPageProps) {
	const profile = await currentProfile();

	if (!profile) {
		return auth().redirectToSignIn();
	}

	// gettting current member
	const currentMember = await db.member.findFirst({
		where: {
			serverId: params.serverId,
			profileId: profile.id,
		},
		include: {
			profile: true,
		},
	});

	if (!currentMember) {
		redirect("/");
	}

	// get or create conversation between current user and other user
	const conversation = await getOrCreateConversation(
		currentMember.id,
		params.memberId
	);

	// if no conversation found or an error occured while creating conversation, redirect to server
	if (!conversation) {
		redirect(`/servers/${params.serverId}`);
	}

	const { memberOne, memberTwo } = conversation;

	const otherMember =
		memberOne.profileId === profile.id ? memberTwo : memberOne;

	return (
		<div className="bg-white dark:bg-[#313338] flex flex-col h-full">
			<ChatHeader
				name={otherMember.profile.name}
				imageUrl={otherMember.profile.imageUrl}
				serverId={params.serverId}
				type="conversation"
			/>
			{searchParams.video && (
				<MediaRoom chatId={conversation.id} video={true} audio={true} />
			)}
			{!searchParams.video && (
				<>
					<ChatMessages
						member={currentMember}
						name={otherMember.profile.name}
						chatId={conversation.id}
						type="conversation"
						apiUrl="/api/direct-messages"
						paramKey="conversationId"
						paramValue={conversation.id}
						socketUrl="/api/socket/direct-messages"
						socketQuery={{
							conversationId: conversation.id,
						}}
					/>
					<ChatInput
						name={otherMember.profile.name}
						type="conversation"
						apiUrl="/api/socket/direct-messages"
						query={{
							conversationId: conversation.id,
						}}
					/>
				</>
			)}
		</div>
	);
}
