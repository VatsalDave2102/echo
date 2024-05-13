"use client";

import * as z from "zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { JoinServerSchema } from "@/schemas";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal-store";

// modal to join a server
export const JoinServerModal = () => {
	// hook to modal state
	const { isOpen, onClose, type } = useModal();
	const router = useRouter();

	// boolean to open/close modal
	const isModalOpen = isOpen && type === "joinServer";

	// transition to disable fields
	const [isPending, startTransition] = useTransition();

	// react hook form
	const form = useForm<z.infer<typeof JoinServerSchema>>({
		resolver: zodResolver(JoinServerSchema),
		defaultValues: {
			code: "",
		},
	});

	const { handleSubmit, control } = form;

	// form submit handler
	const onSubmit = async (values: z.infer<typeof JoinServerSchema>) => {
		// redirect to invite route
		startTransition(async () => {
			form.reset();
			router.push(`/invite/${values.code}`);
			router.refresh();
			onClose();
		});
	};

	// handler to close modal
	const handleClose = () => {
		form.reset();
		onClose();
	};

	return (
		<Dialog open={isModalOpen} onOpenChange={handleClose}>
			<DialogContent className="bg-white text-black p-0 overflow-hidden dark:bg-[#2b2d31] dark:text-zinc-200">
				{/* Form heading */}
				<DialogHeader className="pt-8 px-6">
					<DialogTitle className="text-2xl text-center">
						Join a server
					</DialogTitle>
					{/* Form description */}
					<DialogDescription className="text-center text-zinc-500 dark:text-zinc-300">
						Enter an invite code to join a server.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
						<div className="space-y-8 px-6">
							{/* Invite code field */}
							<FormField
								control={control}
								name="code"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-zinc-200">
											Invite code
										</FormLabel>
										<FormControl>
											<Input
												disabled={isPending}
												className="bg-zinc-300/50 dark:bg-zinc-700 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0"
												placeholder="Enter invite code"
												{...field}
											/>
										</FormControl>
										<FormMessage className="text-rose-500" />
									</FormItem>
								)}
							/>
						</div>
						<DialogFooter className="bg-gray-100 px-6 py-4 dark:bg-[#202124]">
							<Button disabled={isPending} variant={"rose"} type="submit">
								Join
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};
