"use client";

import { useEffect, useState } from "react";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import "@livekit/components-styles";
import { Channel } from "@prisma/client";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

interface MediaRoomProps {
	chatId: string;
	video: boolean;
	audio: boolean;
}

// component to display livekit room using token
export const MediaRoom = ({ chatId, video, audio }: MediaRoomProps) => {
	// getting user
	const { user } = useUser();

	// state to store livekit token
	const [token, setToken] = useState("");

	// effect to create livekit room and set token
	useEffect(() => {
		if (!user?.firstName || !user.lastName) return;
		const name = `${user.firstName} ${user.lastName}`;

		(async () => {
			try {
				const resp = await fetch(
					`/api/livekit?room=${chatId}&username=${name}`
				);
				const data = await resp.json();
				setToken(data.token);
			} catch (error) {
				console.log(error);
			}
		})();
	}, [user?.firstName, user?.lastName, chatId]);

	// if no token available
	if (token === "") {
		return (
			<div className="flex flex-col flex-1 justify-center items-center">
				<Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
				<p className="text-xs text-zinc-500 dark:text-zinc-400">Loading...</p>
			</div>
		);
	}

	return (
		<LiveKitRoom
			data-lk-theme="default"
			serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
			token={token}
			connect={true}
			video={video}
			audio={audio}
		>
			<VideoConference />
		</LiveKitRoom>
	);
};
