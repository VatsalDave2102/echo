"use client";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal-store";

// modal to create or join servers
export const AccessServerModal = () => {
	// hook to modal state
	const { onOpen, isOpen, onClose, type } = useModal();

	// boolean to open/close modal
	const isModalOpen = isOpen && type === "accessServer";

	return (
		<Dialog open={isModalOpen} onOpenChange={onClose}>
			<DialogContent className="bg-white text-black p-0 overflow-hidden dark:bg-[#2b2d31] dark:text-zinc-200">
				<DialogHeader className="pt-8 px-6">
					<DialogTitle className="text-2xl text-center">
						Create or Join a Server
					</DialogTitle>
				</DialogHeader>
				<div>
					<div className="flex flex-col mt-2 gap-y-2 ">
						<div className="py-2 px-4 flex flex-col gap-y-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50  text-zinc-500 hover:text-zinc-500 dark:text-zinc-400 dark:hover:text-zinc-300  transition">
							<p>
								Initiate your own server and unleash your creativity by
								customizing channels, roles, and permissions
							</p>
							<Button
								variant={"rose"}
								className="self-end mr-3"
								onClick={() => {
									onClose();
									onOpen("createServer");
								}}
							>
								Create server
							</Button>
						</div>
						<div className="py-2 px-4 flex flex-col gap-y-2   hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50  text-zinc-500 hover:text-zinc-500 dark:text-zinc-400 dark:hover:text-zinc-300  transition">
							<p>
								Discover and join an existing server using an invite code to
								connect with like-minded individuals, engage in discussions, and
								participate in communities you&apos;re interested in
							</p>
							<Button
								variant={"rose"}
								className="self-end mr-3"
								onClick={() => {
									onClose();
									onOpen("joinServer");
								}}
							>
								Join server
							</Button>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};
