import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { useSocket } from "@/components/providers/socket-provider";

import { MessageWithMemberWithProfile } from "@/types";
type ChatSockerProps = {
	addKey: string;
	updateKey: string;
	queryKey: string;
};

// hook to implment socket for real time messaging
export const useChatSocket = ({
	addKey,
	updateKey,
	queryKey,
}: ChatSockerProps) => {
	const { socket } = useSocket();
	const queryClient = useQueryClient();

	// if no socket, return
	useEffect(() => {
		if (!socket) {
			return;
		}

		// to update messages in real time
		socket.on(updateKey, (message: MessageWithMemberWithProfile) => {
			queryClient.setQueryData([queryKey], (oldData: any) => {
				if (!oldData || !oldData.pages || oldData.pages.length === 0) {
					return oldData;
				}

				const newData = oldData.pages.map((page: any) => {
					return {
						...page,
						items: page.items.map((item: MessageWithMemberWithProfile) => {
							if (item.id === message.id) {
								return message;
							}
							return item;
						}),
					};
				});

				return {
					...oldData,
					pages: newData,
				};
			});
		});

		// to add messages in real time
		socket.on(addKey, (message: MessageWithMemberWithProfile) => {
			queryClient.setQueryData([queryKey], (oldData: any) => {
				if (!oldData || !oldData.pages || oldData.pages.length === 0) {
					return {
						pages: [
							{
								items: [message],
							},
						],
					};
				}
				const newData = [...oldData.pages];

				newData[0] = {
					...newData[0],
					items: [message, ...newData[0].items],
				};

				return { ...oldData, pages: newData };
			});
		});

		return () => {
			socket.off(addKey);
			socket.off(updateKey);
		};
	}, [socket, queryClient, queryKey, updateKey, addKey]);
};
