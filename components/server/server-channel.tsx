"use client";

import { cn } from "@/lib/utils";
import { Channel, ChannelType, MemberRole, Server } from "@prisma/client";
import { Edit, Hash, Lock, Mic, Trash, Video } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { ActionTooltip } from "../common/action-tooltip";

interface ServerChannelProps {
	channel: Channel;
	server: Server;
	role?: MemberRole;
}

const iconMap = {
	[ChannelType.TEXT]: Hash,
	[ChannelType.AUDIO]: Mic,
	[ChannelType.VIDEO]: Video,
};

// to display channels of server
export const ServerChannel: React.FC<ServerChannelProps> = ({
	channel,
	server,
	role,
}) => {
	const router = useRouter();
	const params = useParams();

	const Icon = iconMap[channel.type];
	return (
		<button
			onClick={() => {}}
			className={cn(
				"group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-neutral-700/10 dark:hover:bg-neutral-700/50 transition mb-1",
				params?.channelId === channel.id &&
					"bg-neutral-700/20 dark:bg-neutral-700"
			)}
		>
			<Icon className="flex-shrink-1 w-5 h-5 text-neutral-400" />
			<p
				className={cn(
					"line-clamp-1 font-semibold text-xs text-neutral-500 group-hover:text-neutral-600 dark:text-neutral-400 dark:group-hover:text-neutral-300 transition",
					params?.channelId === channel.id &&
						"text-primary dark:text-neutral-200 dark:group-hover:text-white"
				)}
			>
				{channel.name}
			</p>

			{/* only mods and admin can see edit and delete icons */}
			{channel.name !== "general" && role !== MemberRole.GUEST && (
				<div className="ml-auto flex items-center gap-x-2">
					<ActionTooltip label="Edit">
						<Edit className="h-4 w-4 hidden group-hover:block text-neutral-500 hover:text-neutral-500 dark:text-neutral-400 dark:hover:text-neutral-300 tranistion" />
					</ActionTooltip>
					<ActionTooltip label="Delete">
						<Trash className="h-4 w-4 hidden group-hover:block text-neutral-500 hover:text-neutral-500 dark:text-neutral-400 dark:hover:text-neutral-300 tranistion" />
					</ActionTooltip>
				</div>
			)}
			{channel.name === "general" && (
				<Lock className="ml-auto h-4 w-4 text-neutral-500 dark:text-neutral-400" />
			)}
		</button>
	);
};
