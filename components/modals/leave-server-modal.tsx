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

// modal to leave servers
export const LeaveServerModal = () => {
	const [isPending, startTransition] = useTransition();
	const router = useRouter();
	// hook to modal state
	const { isOpen, onClose, type, data } = useModal();

	const { server } = data;

	// boolean to open/close modal
	const isModalOpen = isOpen && type === "leaveServer";

	const onClick = () => {
		try {
			startTransition(async () => {
				await axios.patch(`/api/servers/${server?.id}/leave`);

				onClose();
				router.refresh();
				router.push("/");
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
						Leave Server
					</DialogTitle>
					<DialogDescription className="text-center text-neutral-500">
						Are you sure you want to leave{" "}
						<span className="font-semibold text-rose-500">{server?.name}</span>
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
