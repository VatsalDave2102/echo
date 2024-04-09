"use client";

import * as z from "zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useTransition } from "react";

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
import { FileUpload } from "@/components/common/file-upload";

export const InitialModal = () => {
	// state to check whether modal mounted or not, due to hydration error
	const [isMounted, setIsMounted] = useState(false);
	const router = useRouter();
	// effect to set isMounted true once the modal mounts
	useEffect(() => {
		setIsMounted(true);
	}, []);

	const [isPending, startTransition] = useTransition();
	const form = useForm<z.infer<typeof ServerFormSchema>>({
		resolver: zodResolver(ServerFormSchema),
		defaultValues: {
			name: "",
			imageUrl: "",
		},
	});

	const { handleSubmit, control } = form;
	const onSubmit = async (values: z.infer<typeof ServerFormSchema>) => {
		// call server api
		startTransition(async () => {
			await axios.post("/api/servers", values);
			form.reset();
			router.refresh();
			window.location.reload();
		});
	};

	if (!isMounted) {
		return null;
	}

	return (
		<Dialog open>
			<DialogContent className="bg-white text-black p-0 overflow-hidden">
				{/* Form heading */}
				<DialogHeader className="pt-8 px-6">
					<DialogTitle className="text-2xl text-center">
						Customize your server
					</DialogTitle>
					{/* Form description */}
					<DialogDescription className="text-center text-neutral-500">
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
										<FormLabel className="uppercase text-xs font-bold text-neutral-500 dark:text-secondary/70">
											Server name
										</FormLabel>
										<FormControl>
											<Input
												disabled={isPending}
												className="bg-neutral-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
												placeholder="Enter server name"
												{...field}
											/>
										</FormControl>
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