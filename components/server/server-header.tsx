"use client";

import {
	ChevronDown,
	LogOut,
	PlusCircle,
	Settings,
	Trash,
	UserPlus,
	Users,
} from "lucide-react";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MemberRole } from "@prisma/client";
import { useModal } from "@/hooks/use-modal-store";
import { ServerWithMembersWithProfiles } from "@/types";

interface ServerHeaderProps {
	server: ServerWithMembersWithProfiles;
	role?: MemberRole;
}

export const ServerHeader: React.FC<ServerHeaderProps> = ({ server, role }) => {
	const { onOpen } = useModal();

	// booleans for admin and moderators
	const isAdmin = role === MemberRole.ADMIN;
	const isModerator = isAdmin || role === MemberRole.MODERATOR;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger className="focus:outline-none" asChild>
				<button className="w-full text-md font-semibold px-3 flex items-center h-12 border-zinc-200 dark:border-zinc-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition">
					{server.name}
					<ChevronDown className="h-5 w-5 ml-auto" />
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56 font-medium text-black dark:text-zinc-400 space-y-[2px] dark:bg-[#222222]">
				{isModerator ? (
					<DropdownMenuItem
						className="text-rose-600 dark:text-rose-400 px-3 py-2 text-sm cursor-pointer focus:text-rose-700 dark:focus:text-rose-500"
						onClick={() => onOpen("invite", { server })}
					>
						Invite People
						<UserPlus className="h-4 w-4 ml-auto" />
					</DropdownMenuItem>
				) : null}
				{isAdmin ? (
					<DropdownMenuItem
						className="px-3 py-2 text-sm cursor-pointer"
						onClick={() => onOpen("editServer", { server })}
					>
						Server Settings
						<Settings className="h-4 w-4 ml-auto" />
					</DropdownMenuItem>
				) : null}
				{isAdmin ? (
					<DropdownMenuItem
						className="px-3 py-2 text-sm cursor-pointer"
						onClick={() => onOpen("members", { server })}
					>
						Manage Members
						<Users className="h-4 w-4 ml-auto" />
					</DropdownMenuItem>
				) : null}
				{isModerator ? (
					<DropdownMenuItem
						className="px-3 py-2 text-sm cursor-pointer"
						onClick={() => onOpen("createChannel")}
					>
						Create Channel
						<PlusCircle className="h-4 w-4 ml-auto" />
					</DropdownMenuItem>
				) : null}
				{isModerator ? <DropdownMenuSeparator /> : null}
				{isAdmin ? (
					<DropdownMenuItem
						className="text-red-700 dark:text-red-500 focus:text-red-800 dark:focus:text-red-600 px-3 py-2 text-sm cursor-pointer"
						onClick={() => onOpen("deleteServer", { server })}
					>
						Delete Server
						<Trash className="h-4 w-4 ml-auto" />
					</DropdownMenuItem>
				) : null}
				{!isAdmin ? (
					<DropdownMenuItem
						className="text-red-700 dark:text-red-500 px-3 py-2 text-sm cursor-pointer"
						onClick={() => onOpen("leaveServer", { server })}
					>
						Leave Server
						<LogOut className="h-4 w-4 ml-auto" />
					</DropdownMenuItem>
				) : null}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
