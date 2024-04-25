"use client";

import axios from "axios";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal-store";

// modal to delete servers
export const DeleteChannelModal = () => {
	const [isPending, startTransition] = useTransition();
	const router = useRouter();

	// hook to modal state
	const { isOpen, onClose, type, data } = useModal();

	const { server, channel } = data;

	// boolean to open/close modal
	const isModalOpen = isOpen && type === "deleteChannel";

	const onClick = async () => {
		try {
			startTransition(async () => {
				await axios.delete(
					`/api/channels/${channel?.id}?serverId=${server?.id}`
				);

				onClose();
				router.refresh();
			});
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<Dialog open={isModalOpen} onOpenChange={onClose}>
			<DialogContent className="bg-white text-black p-0 overflow-hidden">
				<DialogHeader className="pt-8 px-6">
					<DialogTitle className="text-2xl text-center">
						Delete Channel
					</DialogTitle>
					<DialogDescription className="text-center text-neutral-500">
						Are you sure you want to do this? <br />{" "}
						<span className="font-semibold text-rose-500">
							#{channel?.name}
						</span>{" "}
						will be permanently deleted.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter className="bg-gray-100 px-6 py-4">
					<div className="flex items-center justify-between w-full">
						<Button disabled={isPending} onClick={onClose} variant={"ghost"}>
							Cancel
						</Button>
						<Button disabled={isPending} onClick={onClick} variant={"rose"}>
							Confirm
						</Button>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
