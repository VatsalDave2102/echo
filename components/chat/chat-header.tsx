import { Hash } from "lucide-react";

import MobileToggle from "@/components/common/mobile-toggle";
import { UserAvatar } from "@/components/common/user-avatar";
import ChatVideoButton from "@/components/chat/chat-video-button";
import SocketIndicator from "@/components/common/socket-indicator";

interface ChatHeaderProps {
	serverId: string;
	name: string;
	type: "channel" | "conversation";
	imageUrl?: string | null;
}
const ChatHeader: React.FC<ChatHeaderProps> = ({
	serverId,
	name,
	type,
	imageUrl,
}) => {
	return (
		<div className="text-md font-semibold px-3 flex items-center h-12 border-zinc-200 dark:border-zinc-800 border-b-2">
			<MobileToggle serverId={serverId} />
			{type === "channel" ? (
				<Hash className="w-5 h-5 text-zinc-500 dark:text-zinc-400 mr-2" />
			) : null}
			{type === "conversation" ? (
				<UserAvatar src={imageUrl} className="h-8 w-8 md:h-8 md:w-8 mr-2" />
			) : null}
			<p className="font-semibold text-xl text-black dark:text-white">{name}</p>
			<div className="ml-auto flex items-center">
				{type === "conversation" ? <ChatVideoButton /> : null}
				<SocketIndicator />
			</div>
		</div>
	);
};

export default ChatHeader;
