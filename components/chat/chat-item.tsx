"use client";
import * as z from "zod";
import axios from "axios";
import qs from "query-string";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import {
	Edit,
	FileIcon,
	ShieldEllipsis,
	ShieldPlus,
	Trash,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { ChatInputSchema } from "@/schemas";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal-store";
import { useParams, useRouter } from "next/navigation";
import { Member, MemberRole, Profile } from "@prisma/client";
import { UserAvatar } from "@/components/common/user-avatar";
import { ActionTooltip } from "@/components/common/action-tooltip";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";

interface ChatItemProps {
	id: string;
	content: string;
	member: Member & {
		profile: Profile;
	};
	timestamp: string;
	fileUrl: string | null;
	deleted: boolean;
	currentMember: Member;
	isUpdated: boolean;
	socketUrl: string;
	socketQuery: Record<string, string>;
}

// to render icon according to roles
const roleIconMap = {
	GUEST: null,
	MODERATOR: <ShieldEllipsis className="h-4 w-4 ml-2 text-indigo-500" />,
	ADMIN: <ShieldPlus className="h-4 w-4 ml-2 text-rose-500" />,
};

const ChatItem: React.FC<ChatItemProps> = ({
	id,
	content,
	member,
	timestamp,
	fileUrl,
	deleted,
	currentMember,
	isUpdated,
	socketQuery,
	socketUrl,
}) => {
	// state to check if user is editing message or not
	const [isEditing, setIsEditing] = useState(false);
	const [isPending, startTransition] = useTransition();

	// custom hook for modals
	const { onOpen } = useModal();

	const params = useParams();
	const router = useRouter();

	const onMemberClick = () => {
		if (member.id === currentMember.id) {
			return;
		}
		router.push(`/servers/${params?.serverId}/conversations/${member.id}`);
	};

	// effect to escape editing message using esc key
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				setIsEditing(false);
			}
		};

		window.addEventListener("keydown", handleKeyDown);

		return () => window.removeEventListener("keydown", handleKeyDown);
	});

	// form to store message content
	const form = useForm<z.infer<typeof ChatInputSchema>>({
		resolver: zodResolver(ChatInputSchema),
		defaultValues: {
			content: content,
		},
	});

	// function to hanlde form submission
	const onSubmit = (values: z.infer<typeof ChatInputSchema>) => {
		try {
			startTransition(async () => {
				// call messages api to patch/delete message
				// performing soft delete only
				const url = qs.stringifyUrl({
					url: `${socketUrl}/${id}`,
					query: socketQuery,
				});
				await axios.patch(url, values);
				form.reset();
				setIsEditing(false);
			});
		} catch (error) {
			console.log(error);
		}
	};

	// effect to reset form content
	useEffect(() => {
		form.reset({
			content: content,
		});
	}, [content, form]);

	// extracting file type to distinguish between image and pdf
	const fileType = fileUrl?.split(".").pop();

	const isAdmin = currentMember.role === MemberRole.ADMIN;
	const isModerator = currentMember.role === MemberRole.MODERATOR;
	const isOwner = currentMember.id === member.id;
	const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner);
	const canEditMessage = !deleted && isOwner && !fileUrl;
	const isPDF = fileType === "pdf" && fileUrl;
	const isImage = !isPDF && fileUrl;

	return (
		<div className="relative group flex items-center hover:bg-black/5 p-4 transition w-full">
			<div className="group flex gap-x-2 items-start w-full">
				<div
					className="cursor-pointer hover:drop-shadow-md transition"
					onClick={onMemberClick}
				>
					<UserAvatar src={member.profile.imageUrl} />
				</div>
				<div className="flex flex-col w-full">
					<div className="flex items-center gap-x-2">
						<div className="flex items-center">
							<p
								onClick={onMemberClick}
								className="font-semibold text-sm hover:underline cursor-pointer"
							>
								{member.profile.name}
							</p>
							<ActionTooltip label={member.role}>
								{roleIconMap[member.role]}
							</ActionTooltip>
						</div>
						<span className="text-xs text-zinc-500 dark:text-zinc-400">
							{timestamp}
						</span>
					</div>
					{isImage ? (
						<a
							href={fileUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-48 w-48"
						>
							<Image
								src={fileUrl}
								alt={content}
								fill
								className="object-cover"
							/>
						</a>
					) : null}
					{isPDF ? (
						<div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
							<FileIcon className="h-10 w-10 fill-rose-200 stroke-rose-400" />
							<a
								href={fileUrl}
								target="_black"
								rel="noopener noreferrer"
								className="ml-2 text-sm text-rose-500 dark:text-rose-400 hover:underline"
							>
								PDF file
							</a>
						</div>
					) : null}
					{!fileUrl && !isEditing ? (
						<p
							className={cn(
								"text-sm text-zinc-600 dark:text-zinc-300",
								deleted &&
									"italic text-zinc-500 dark:text-zinc-400 text-xs mt-1"
							)}
						>
							{content}
							{isUpdated && !deleted && (
								<span className="text-[10px] mx-2 text-zinc-500">(edited)</span>
							)}
						</p>
					) : null}
					{!fileUrl && isEditing ? (
						<Form {...form}>
							<form
								className="flex items-center w-full gap-x-2 pt-2"
								onSubmit={form.handleSubmit(onSubmit)}
							>
								<FormField
									control={form.control}
									name="content"
									render={({ field }) => (
										<FormItem className="flex-1">
											<div className="relative w-full">
												<FormControl>
													<Input
														className="p-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
														placeholder="Edited message"
														disabled={isPending}
														{...field}
													/>
												</FormControl>
											</div>
										</FormItem>
									)}
								/>
								<Button size="sm" variant="rose" disabled={isPending}>
									Save
								</Button>
							</form>
							<span className="text-[10px] mt-1 text-zinc-400">
								Press escape to cancel, enter to save
							</span>
						</Form>
					) : null}
				</div>
			</div>
			{canDeleteMessage ? (
				<div className="hidden group-hover:flex items-center gap-x-2 absolute p-1 -top-2 right-5 bg-white dark:bg-zinc-800 border rounded-sm">
					{canEditMessage && (
						<ActionTooltip label="Edit">
							<Edit
								onClick={() => setIsEditing(true)}
								className="cursor-pointer ml-auto h-4 w-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
							/>
						</ActionTooltip>
					)}
					<ActionTooltip label="Delete">
						<Trash
							onClick={() =>
								onOpen("deleteMessage", {
									apiUrl: `${socketUrl}/${id}`,
									query: socketQuery,
								})
							}
							className="cursor-pointer ml-auto h-4 w-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
						/>
					</ActionTooltip>
				</div>
			) : null}
		</div>
	);
};

export default ChatItem;
