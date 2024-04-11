"use client";

import {
	Check,
	Gavel,
	MoreVertical,
	Shield,
	ShieldPlus,
	ShieldEllipsis,
	ShieldQuestion,
	Loader2,
} from "lucide-react";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { MemberRole } from "@prisma/client";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuTrigger,
	DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { useModal } from "@/hooks/use-modal-store";
import { ServerWithMembersWithProfiles } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserAvatar } from "@/components/common/user-avatar";

// to map icons according to role of members
const roleIconMap = {
	GUEST: null,
	MODERATOR: <ShieldEllipsis className="h-4 w-4 ml-2 text-indigo-500" />,
	ADMIN: <ShieldPlus className="h-4 w-4 text-rose-500" />,
};

// modal to invite other members
export const MembersModal = () => {
	// state to store id of that member upon an action is performed
	const [loadingId, setLoadingId] = useState("");
	const router = useRouter();

	// hook to modal state
	const { onOpen, isOpen, onClose, type, data } = useModal();

	// extracting server data
	const { server } = data as { server: ServerWithMembersWithProfiles };

	// boolean to open/close modal
	const isModalOpen = isOpen && type === "members";

	// function to kick members
	const onKick = async (memberId: string) => {
		try {
			setLoadingId(memberId);

			// request to delete member
			const response = await axios.delete(
				`/api/members/${memberId}?serverId=${server.id}`
			);

			router.refresh();
			// open modal with new server data
			onOpen("members", { server: response.data });
		} catch (error) {
			console.log(error);
		} finally {
			setLoadingId("");
		}
	};

	// function to change role of members
	const onRoleChange = async (memberId: string, role: MemberRole) => {
		try {
			setLoadingId(memberId);

			// updating role request
			const response = await axios.patch(
				`/api/members/${memberId}?serverId=${server.id}`,
				{ role }
			);
			router.refresh();
			onOpen("members", { server: response.data });
		} catch (error) {
			console.log(error);
		} finally {
			setLoadingId("");
		}
	};

	return (
		<Dialog open={isModalOpen} onOpenChange={onClose}>
			<DialogContent className="bg-white text-black overflow-hidden">
				<DialogHeader className="pt-8 px-6">
					<DialogTitle className="text-2xl text-center">
						Manage Members
					</DialogTitle>
					<DialogDescription className="text-center text-neutral-500">
						{server?.members.length} Members
					</DialogDescription>
				</DialogHeader>
				<ScrollArea className="mt-8 max-h-[420px] pr-6">
					{/* mapping server members */}
					{server?.members.map((member) => (
						<div key={member.id} className="flex items-center gap-x-2 mb-6">
							{/* member avatar, name and email */}
							<UserAvatar src={member.profile.imageUrl} />
							<div className="flex flex-col gap-y-1">
								<div className="text-xs font-semibold flex items-center gap-x-2">
									{member.profile.name}
									{roleIconMap[member.role]}
								</div>
								<p className="text-xs text-neutral-500">
									{member.profile.email}
								</p>
							</div>

							{/* actions menu */}
							{server.profileId !== member.profileId &&
								loadingId !== member.id && (
									<div className="ml-auto">
										<DropdownMenu>
											<DropdownMenuTrigger>
												<MoreVertical className="h-4 w-4 text-neutral-500" />
											</DropdownMenuTrigger>
											<DropdownMenuContent side="left">
												<DropdownMenuSub>
													<DropdownMenuSubTrigger className="flex- items-center">
														<ShieldQuestion className="h-4 w-4 mr-2" />
														<span>Role</span>
													</DropdownMenuSubTrigger>
													<DropdownMenuPortal>
														<DropdownMenuSubContent>
															<DropdownMenuItem
																onClick={() => onRoleChange(member.id, "GUEST")}
															>
																<Shield className="h-4 w-4 mr-2" />
																Guest
																{member.role === "GUEST" && (
																	<Check className="h-4 w-4 ml-auto" />
																)}
															</DropdownMenuItem>
															<DropdownMenuItem
																onClick={() =>
																	onRoleChange(member.id, "MODERATOR")
																}
															>
																<ShieldEllipsis className="h-4 w-4 mr-2" />
																Moderator
																{member.role === "MODERATOR" && (
																	<Check className="h-4 w-4 ml-auto" />
																)}
															</DropdownMenuItem>
														</DropdownMenuSubContent>
													</DropdownMenuPortal>
												</DropdownMenuSub>
												<DropdownMenuSeparator />
												<DropdownMenuItem onClick={() => onKick(member.id)}>
													<Gavel className="h-4 w-4 mr-2" />
													Kick
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</div>
								)}
							{loadingId === member.id && (
								<Loader2 className="animate-spin text-neutral-500 ml-auto" />
							)}
						</div>
					))}
				</ScrollArea>
			</DialogContent>
		</Dialog>
	);
};
