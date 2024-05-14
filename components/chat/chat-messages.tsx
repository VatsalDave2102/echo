"use client";

import { format } from "date-fns";
import { Member } from "@prisma/client";
import { Loader2, ServerCrash } from "lucide-react";
import { Fragment, useRef, ElementRef } from "react";

import ChatItem from "@/components/chat/chat-item";
import { useChatQuery } from "@/hooks/use-chat-query";
import { MessageWithMemberWithProfile } from "@/types";
import { useChatScroll } from "@/hooks/use-chat-scroll";
import { useChatSocket } from "@/hooks/use-chat-socket";
import ChatWelcome from "@/components/chat/chat-welcome";
import { ChatMessagesSkeleton } from "@/components/skeletons/chat-messages-skeleton";

const DATE_FORMAT = "d MMM yyyy, HH:mm";

interface ChatMessagesProps {
	name: string;
	member: Member;
	chatId: string;
	apiUrl: string;
	socketUrl: string;
	socketQuery: Record<string, string>;
	paramKey: "channelId" | "conversationId";
	paramValue: string;
	type: "channel" | "conversation";
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
	name,
	member,
	chatId,
	apiUrl,
	socketUrl,
	socketQuery,
	paramKey,
	paramValue,
	type,
}) => {
	const queryKey = `chat:${chatId}`;
	const addKey = `chat:${chatId}:messages`;
	const updateKey = `chat:${chatId}:messages:update`;

	// refs to load messages while scrolling
	const chatRef = useRef<ElementRef<"div">>(null);
	const bottomRef = useRef<ElementRef<"div">>(null);

	const { data, hasNextPage, fetchNextPage, isFetchingNextPage, status } =
		useChatQuery({
			queryKey,
			apiUrl,
			paramKey,
			paramValue,
		});

	useChatSocket({ queryKey, addKey, updateKey });
	useChatScroll({
		chatRef,
		bottomRef,
		loadMore: fetchNextPage,
		shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
		count: data?.pages?.[0]?.items?.length ?? 0,
	});

	// if messages are loading
	if (status === "loading") {
		return <ChatMessagesSkeleton />;
	}

	// if there is an issue while fetching messages
	if (status === "error") {
		return (
			<div className="flex flex-col flex-1 justify-center items-center">
				<ServerCrash className="h-7 w-7 text-zinc-500 my-4" />
				<p className="text-xs text-zinc-500 dark:text-zinc-400">
					Something went wrong...
				</p>
			</div>
		);
	}

	// display messages
	return (
		<div ref={chatRef} className="flex-1 flex flex-col py-4 overflow-y-auto">
			{/* empty div to cover space */}
			{hasNextPage === false ? <div className="flex-1" /> : null}

			{/* only show welcome message on last page */}
			{hasNextPage === false ? <ChatWelcome type={type} name={name} /> : null}
 
			{/* show button to load previous message if there are */}
			{hasNextPage ? (
				<div className="flex justify-center">
					{isFetchingNextPage ? (
						<Loader2 className="h-6 w-6 text-zinc-500 animate-spin my-4" />
					) : (
						<button
							onClick={() => fetchNextPage()}
							className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 text-xs my-4 dark:hover:text-zinc-300 transition"
						>
							Load previous messages
						</button>
					)}
				</div>
			) : null}

			{/* render messages */}
			<div className="flex flex-col-reverse mt-auto">
				{data?.pages?.map((group, i) => (
					<Fragment key={i}>
						{group.items.map((message: MessageWithMemberWithProfile) => (
							<ChatItem
								id={message.id}
								key={message.id}
								currentMember={member}
								member={message.member}
								content={message.content}
								fileUrl={message.fileUrl}
								deleted={message.deleted}
								timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
								isUpdated={message.updatedAt !== message.createdAt}
								socketUrl={socketUrl}
								socketQuery={socketQuery}
							/>
						))}
					</Fragment>
				))}
			</div>
			<div ref={bottomRef} />
		</div>
	);
};

export default ChatMessages;
