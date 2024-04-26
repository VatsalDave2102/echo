import { Hash } from "lucide-react";
import MobileToggle from "../common/mobile-toggle";

interface ChatHeaderProps {
	serverId: string;
	name: string;
	type: "channel" | "conversation";
	imageUrl?: string;
}
const ChatHeader: React.FC<ChatHeaderProps> = ({
	serverId,
	name,
	type,
	imageUrl,
}) => {
	return (
		<div className="text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2">
			<MobileToggle serverId={serverId} />
			{type === "channel" && (
				<Hash className="w-5 h-5 text-neutral-500 dark:text-neutral-400 mr-2" />
			)}
			<p className="font-semibold text-xl text-black dark:text-white">{name}</p>
		</div>
	);
};

export default ChatHeader;