"use client";

import * as z from "zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";
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
import { ServerFormSchema } from "@/schemas";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal-store";
import { FileUpload } from "@/components/common/file-upload";

export const EditServerModal = () => {
	// hook to modal state
	const { isOpen, onClose, type, data } = useModal();
	const router = useRouter();

	// boolean to open/close modal
	const isModalOpen = isOpen && type === "editServer";
	const { server } = data;

	// transition to disable fields
	const [isPending, startTransition] = useTransition();

	// react hook form
	const form = useForm<z.infer<typeof ServerFormSchema>>({
		resolver: zodResolver(ServerFormSchema),
		defaultValues: {
			name: "",
			imageUrl: "",
		},
	});

	useEffect(() => {
		if (server) {
			form.setValue("name", server.name);
			form.setValue("imageUrl", server.imageUrl);
		}
	}, [server, form]);

	const { handleSubmit, control } = form;

	// form submit handler
	const onSubmit = async (values: z.infer<typeof ServerFormSchema>) => {
		// call server api to update server settings
		startTransition(async () => {
			await axios.patch(`/api/servers/${server?.id}`, values);

			form.reset();
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
						Customize your server
					</DialogTitle>
					{/* Form description */}
					<DialogDescription className="text-center text-zinc-500 dark:text-zinc-300">
						Give your server a unique name and image. You can always change it
						later.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
						<div className="space-y-8 px-6">
							{/* Image upload field */}
							<div className="flex items-center justify-center text-center">
								<FormField
									control={control}
									name="imageUrl"
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<FileUpload
													endpoint="serverImage"
													value={field.value}
													onChange={field.onChange}
												/>
											</FormControl>
										</FormItem>
									)}
								/>
							</div>

							{/* Server name field */}
							<FormField
								control={control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-zinc-200">
											Server name
										</FormLabel>
										<FormControl>
											<Input
												disabled={isPending}
												className="bg-zinc-300/50 dark:bg-zinc-700 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0"
												placeholder="Enter server name"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<DialogFooter className="bg-gray-100 px-6 py-4 dark:bg-[#202124]">
							<Button disabled={isPending} variant={"rose"} type="submit">
								Save
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};
