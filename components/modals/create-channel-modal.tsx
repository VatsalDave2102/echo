"use client";

import * as z from "zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { ChannelType } from "@prisma/client";
import { useEffect, useTransition } from "react";
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
	// hook for modal state
	const { isOpen, onClose, type, data } = useModal();
	const { channelType } = data;

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
			type: ChannelType.TEXT || channelType,
		},
	});

	useEffect(() => {
		if (channelType) {
			form.setValue("type", channelType);
		} else {
			form.setValue("type", ChannelType.TEXT);
		}
	}, [channelType, form]);

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
			<DialogContent className="bg-white text-black p-0 overflow-hidden dark:bg-[#2b2d31] dark:text-zinc-200">
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
										<FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-zinc-200">
											Channel name
										</FormLabel>
										<FormControl>
											<Input
												disabled={isPending}
												className="bg-zinc-300/50 dark:bg-zinc-700 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0"
												placeholder="Enter channel name"
												{...field}
											/>
										</FormControl>
										<FormMessage className="text-rose-500" />
									</FormItem>
								)}
							/>
							{/* Channel type select field */}
							<FormField
								control={control}
								name="type"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-zinc-200">
											Channel Type
										</FormLabel>
										<Select
											disabled={isPending}
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger className="bg-zinc-300/50 dark:bg-zinc-700 border-0 focus:ring-0 text-black dark:text-white ring-offset-0 focus:ring-offset-0 capitalize outline-none">
													<SelectValue placeholder="Select a channel type" />
												</SelectTrigger>
											</FormControl>
											<SelectContent className="dark:bg-zinc-700">
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
										<FormMessage className="text-rose-500" />
									</FormItem>
								)}
							/>
						</div>
						<DialogFooter className="bg-gray-100 px-6 py-4 dark:bg-[#202124]">
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
