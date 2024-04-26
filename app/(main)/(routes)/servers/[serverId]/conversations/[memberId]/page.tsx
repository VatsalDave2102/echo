import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/auth";
import ChatHeader from "@/components/chat/chat-header";
import { getOrCreateConversation } from "@/lib/conversation";

interface MemberIdPageProps {
	params: {
		memberId: string;
		serverId: string;
	};
}
export default async function MemberIdPage({ params }: MemberIdPageProps) {
	const profile = await currentProfile();

	if (!profile) {
		redirect("/login");
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
		</div>
	);
}
