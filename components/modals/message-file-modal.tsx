"use client";

import * as z from "zod";
import axios from "axios";
import qs from "query-string";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";

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
	FormMessage,
} from "@/components/ui/form";
import { MessageFileSchema } from "@/schemas";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal-store";
import { FileUpload } from "@/components/common/file-upload";

// modal to upload attachments
export const MessageFileModal = () => {
	const { isOpen, onClose, type, data } = useModal();

	const router = useRouter();

	const isModalOpen = isOpen && type === "messageFile";
	const { apiUrl, query } = data;

	const [isPending, startTransition] = useTransition();

	const form = useForm<z.infer<typeof MessageFileSchema>>({
		resolver: zodResolver(MessageFileSchema),
		defaultValues: {
			fileUrl: "",
		},
	});

	const { handleSubmit, control, reset, setError } = form;

	const handleClose = () => {
		reset();
		onClose();
	};

	const onSubmit = async (values: z.infer<typeof MessageFileSchema>) => {
		try {
			const url = qs.stringifyUrl({
				url: apiUrl || "",
				query,
			});
			// call message api
			startTransition(async () => {
				await axios.post(url, { ...values, content: values.fileUrl });

				form.reset();
				router.refresh();
				handleClose();
			});
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<Dialog open={isModalOpen} onOpenChange={handleClose}>
			<DialogContent className="bg-white text-black p-0 overflow-hidden dark:bg-[#2b2d31] dark:text-zinc-200">
				{/* Form heading */}
				<DialogHeader className="pt-8 px-6">
					<DialogTitle className="text-2xl text-center">
						Add an attachment
					</DialogTitle>
					{/* Form description */}
					<DialogDescription className="text-center text-zinc-500 dark:text-zinc-300">
						Send a file
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
						<div className="space-y-8 px-6">
							{/* File upload field */}
							<div className="flex items-center justify-center text-center">
								<FormField
									control={control}
									name="fileUrl"
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<FileUpload
													endpoint="messageFile"
													value={field.value}
													onChange={field.onChange}
													setError={setError}
													fieldName={"fileUrl"}
												/>
											</FormControl>
											<FormMessage className="text-rose-500" />
										</FormItem>
									)}
								/>
							</div>
						</div>
						<DialogFooter className="bg-gray-100 px-6 py-4 dark:bg-[#202124]">
							<Button disabled={isPending} variant={"rose"} type="submit">
								Send
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};
