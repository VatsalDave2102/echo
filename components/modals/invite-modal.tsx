"use client";

import axios from "axios";
import { useState, useTransition } from "react";
import { Check, Copy, RefreshCw } from "lucide-react";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useOrigin } from "@/hooks/use-origin";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal-store";

// modal to invite other members
export const InviteModal = () => {
	// state to check copying of link
	const [copied, setCopied] = useState(false);

	const [isPending, startTransition] = useTransition();

	// hook to modal state
	const { onOpen, isOpen, onClose, type, data } = useModal();

	const { server } = data;

	// hook to get origin path
	const origin = useOrigin();

	// boolean to open/close modal
	const isModalOpen = isOpen && type === "invite";

	// generating invite url
	const inviteUrl = `${origin}/invite/${server?.inviteCode}`;

	// function to copy the link to clipboard
	const onCopy = () => {
		navigator.clipboard.writeText(inviteUrl);
		setCopied(true);

		setTimeout(() => {
			setCopied(false);
		}, 2000);
	};

	// function to generate a new link
	const onNew = () => {
		try {
			startTransition(async () => {
				const response = await axios.patch(
					`/api/servers/${server?.id}/invite-code`
				);

				onOpen("invite", { server: response.data });
			});
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<Dialog open={isModalOpen} onOpenChange={onClose}>
			<DialogContent className="bg-white text-black p-0 overflow-hidden dark:bg-[#2b2d31] dark:text-zinc-200">
				<DialogHeader className="pt-8 px-6">
					<DialogTitle className="text-2xl text-center">
						Invite People
					</DialogTitle>
				</DialogHeader>
				<div className="p-6">
					<Label className="uppercase text-xs font-bold text-zinc-500 dark:text-zinc-200">
						Server invite link
					</Label>
					<div className="flex items-center mt-2 gap-x-2">
						<Input
							className="bg-zinc-300/50 dark:bg-zinc-700 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0"
							readOnly
							value={inviteUrl}
							disabled={isPending}
						/>
						<Button
							size="icon"
							onClick={onCopy}
							disabled={copied || isPending}
							className="dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-600"
						>
							{copied ? (
								<Check className="h-4 w-4" />
							) : (
								<Copy className="w-4 h-4" />
							)}
						</Button>
					</div>
					<Button
						variant={"link"}
						size={"sm"}
						className="text-xs text-zinc-500 dark:text-zinc-300 mt-4"
						onClick={onNew}
						disabled={isPending}
					>
						Generate a new link
						<RefreshCw className="w-4 h-4 ml-2" />
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};
