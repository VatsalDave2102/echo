"use client";

import { ServerWithMembersWithProfiles } from "@/types";
import { ChannelType, MemberRole } from "@prisma/client";
import { ActionTooltip } from "../common/action-tooltip";
import { Plus, Settings } from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";

interface ServerSectionProps {
	label: string;
	role?: MemberRole;
	sectionType: "channels" | "members";
	channelType?: ChannelType;
	server?: ServerWithMembersWithProfiles;
}

// component to show heading to sections in server sidebar
export const ServerSection: React.FC<ServerSectionProps> = ({
	label,
	role,
	sectionType,
	channelType,
	server,
}) => {
	const { onOpen } = useModal();
	return (
		<div className="flex items-center justify-between py-2">
			<p className="text-xs uppercase font-semibold text-neutral-500 dark:text-neutral-400">
				{label}
			</p>

			{/* button to add channel */}
			{role !== MemberRole.GUEST && sectionType === "channels" && (
				<ActionTooltip label="Create Channel" side="top">
					<button
						onClick={() => onOpen("createChannel", { channelType })}
						className="text-neutral-500 hover:text-neutral-600 dark:text-neutral-400 dark:hover:text-neutral-300 transition"
					>
						<Plus className="h-4 w-4" />
					</button>
				</ActionTooltip>
			)}

			{/* if section is member, then show manage members option */}
			{role === MemberRole.ADMIN && sectionType === "members" && (
				<ActionTooltip label="Manage Members" side="top">
					<button
						onClick={() => onOpen("members", { server })}
						className="text-neutral-500 hover:text-neutral-600 dark:text-neutral-400 dark:hover:text-neutral-300 transition"
					>
						<Settings className="h-4 w-4" />
					</button>
				</ActionTooltip>
			)}
		</div>
	);
};
