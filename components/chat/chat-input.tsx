"use client";

import * as z from "zod";
import axios from "axios";
import qs from "query-string";
import { Plus } from "lucide-react";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { ChatInputSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { useModal } from "@/hooks/use-modal-store";
import EmojiPicker from "@/components/common/emoji-picker";
import { Form, FormItem, FormField, FormControl } from "@/components/ui/form";
import { useRouter } from "next/navigation";

interface ChatInputProps {
	apiUrl: string;
	query: Record<string, any>;
	name: string;
	type: "channel" | "conversation";
}

// component to type messages and send attachements
const ChatInput: React.FC<ChatInputProps> = ({ apiUrl, query, name, type }) => {
	const [isPending, startTransition] = useTransition();
	const router = useRouter();

	const { onOpen } = useModal();

	const form = useForm<z.infer<typeof ChatInputSchema>>({
		defaultValues: {
			content: "",
		},
		resolver: zodResolver(ChatInputSchema),
	});

	const { handleSubmit, control, reset } = form;

	const onSubmit = (values: z.infer<typeof ChatInputSchema>) => {
		try {
			const url = qs.stringifyUrl({
				url: apiUrl,
				query,
			});
			startTransition(async () => {
				await axios.post(url, values);
				reset();
				router.refresh();
			});
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<Form {...form}>
			<form onSubmit={handleSubmit(onSubmit)}>
				<FormField
					control={control}
					name="content"
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<div className="relative p-4 pb-6">
									{/* attachment button */}
									<button
										type="button"
										onClick={() => onOpen("messageFile", { apiUrl, query })}
										className="absolute top-7 left-8 h-[24px] w-[24px] bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 transition rounded-full p-1 flex items-center justify-center"
									>
										<Plus className="text-white dark:text-[#313338]" />
									</button>
									{/* input field */}
									<Input
										disabled={isPending}
										{...field}
										placeholder={`Message ${
											type === "conversation" ? name : "#" + name
										}`}
										className="px-14 py-6 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200 "
									/>
									{/* emoji */}
									<div className="absolute top-7 right-8">
										<EmojiPicker
											onChange={(emoji: string) =>
												field.onChange(`${field.value} ${emoji}`)
											}
										/>
									</div>
								</div>
							</FormControl>
						</FormItem>
					)}
				/>
			</form>
		</Form>
	);
};

export default ChatInput;
