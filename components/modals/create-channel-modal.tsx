"use client";

import * as z from "zod";
import axios from "axios";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { ChannelType } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";

import {
	Dialog,
	DialogContent,
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { ChannelFormSchema } from "@/schemas";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal-store";

export const CreateChannelModal = () => {
	// hook to modal state
	const { isOpen, onClose, type } = useModal();
	const router = useRouter();
	const params = useParams();

	// boolean to open/close modal
	const isModalOpen = isOpen && type === "createChannel";

	// transition to disable fields
	const [isPending, startTransition] = useTransition();

	// react hook form
	const form = useForm<z.infer<typeof ChannelFormSchema>>({
		resolver: zodResolver(ChannelFormSchema),
		defaultValues: {
			name: "",
			type: ChannelType.TEXT,
		},
	});

	const { handleSubmit, control } = form;

	// form submit handler
	const onSubmit = async (values: z.infer<typeof ChannelFormSchema>) => {
		// call channels api to create channel
		startTransition(async () => {
			await axios.post(`/api/channels?serverId=${params?.serverId}`, values);
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
			<DialogContent className="bg-white text-black p-0 overflow-hidden">
				{/* Form heading */}
				<DialogHeader className="pt-8 px-6">
					<DialogTitle className="text-2xl text-center">
						Create a Channel
					</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
						<div className="space-y-8 px-6">
							{/* Channel name field */}
							<FormField
								control={control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="uppercase text-xs font-bold text-neutral-500 dark:text-secondary/70">
											Channel name
										</FormLabel>
										<FormControl>
											<Input
												disabled={isPending}
												className="bg-neutral-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
												placeholder="Enter channel name"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							{/* Channel type select field */}
							<FormField
								control={control}
								name="type"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Channel Type</FormLabel>
										<Select
											disabled={isPending}
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger className="bg-neutral-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none">
													<SelectValue placeholder="Select a channel type" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{Object.values(ChannelType).map((type) => (
													<SelectItem
														key={type}
														value={type}
														className="capitalize"
													>
														{type.toLowerCase()}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<DialogFooter className="bg-gray-100 px-6 py-4">
							<Button disabled={isPending} variant={"rose"} type="submit">
								Create
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};
