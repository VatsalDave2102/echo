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
export const DeleteServerModal = () => {
	const [isPending, startTransition] = useTransition();
	const router = useRouter();
	// hook to modal state
	const { isOpen, onClose, type, data } = useModal();

	const { server } = data;

	// boolean to open/close modal
	const isModalOpen = isOpen && type === "deleteServer";

	const onClick = () => {
		try {
			startTransition(async () => {
				await axios.delete(`/api/servers/${server?.id}`);

				onClose();
				router.push("/");
				router.refresh();
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
						Delete Server
					</DialogTitle>
					<DialogDescription className="text-center text-zinc-500 dark:text-zinc-300">
						Are you sure you want to do this? <br />{" "}
						<span className="font-semibold text-rose-500">{server?.name}</span>{" "}
						will be permanently deleted.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter className="bg-gray-100 px-6 py-4 dark:bg-[#202124]">
					<div className="flex items-center justify-between w-full">
						<Button disabled={isPending} onClick={onClose}>
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
