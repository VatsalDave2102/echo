"use client";

import * as z from "zod";
import axios from "axios";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { Plus, Smile } from "lucide-react";
import { ChatInputSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Form, FormItem, FormField, FormControl } from "@/components/ui/form";

interface ChatInputProps {
	apiUrl: string;
	query: Record<string, any>;
	name: string;
	type: "channel" | "conversation";
}

const ChatInput: React.FC<ChatInputProps> = ({ apiUrl, query, name, type }) => {
	const [isPending, startTransition] = useTransition();
	const form = useForm<z.infer<typeof ChatInputSchema>>({
		defaultValues: {
			content: "",
		},
		resolver: zodResolver(ChatInputSchema),
	});

	const { handleSubmit, control } = form;
	const onSubmit = (values: z.infer<typeof ChatInputSchema>) => {
		try {
			startTransition(async () => {
				await axios.post(
					`${apiUrl}?serverId=${query.serverId}&channelId=${query.channelId}`,
					values
				);
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
									<button
										type="button"
										onClick={() => {}}
										className="absolute top-7 left-8 h-[24px] w-[24px] bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 transition rounded-full p-1 flex items-center justify-center"
									>
										<Plus className="text-white dark:text-[#313338]" />
									</button>
									<Input
										disabled={isPending}
										{...field}
										placeholder={`Message ${
											type === "conversation" ? name : "#" + name
										}`}
										className="px-14 py-6 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200 "
									/>
									<div className="absolute top-7 right-8">
										<Smile />
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
