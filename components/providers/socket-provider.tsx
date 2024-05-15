"use client";

import { useContext, useEffect, useState, createContext } from "react";
import { Socket } from "socket.io";
import { io as ClientIO } from "socket.io-client";

type SocketContentType = {
	socket: any | null | Socket;
	isConnected: boolean;
};

// context for socket
const SocketContext = createContext<SocketContentType>({
	socket: null,
	isConnected: false,
});

// hook to provide socket context
export const useSocket = () => {
	return useContext(SocketContext);
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
	const [socket, setSocket] = useState<Socket | null>(null);
	const [isConnected, setIsConnected] = useState(false);

	useEffect(() => {
		const socketInstance = new (ClientIO as any)(
			process.env.NEXT_PUBLIC_SITE_URL!,
			{
				path: "/api/socket/io",
				addTrailingSlash: false,
			}
		);

		socketInstance.on("connect", () => {
			setIsConnected(true);
		});

		socketInstance.on("disconnect", () => {
			setIsConnected(false);
		});

		setSocket(socketInstance);

		return () => {
			socketInstance.disconnect();
		};
	}, []);

	return (
		<SocketContext.Provider value={{ socket, isConnected }}>
			{children}
		</SocketContext.Provider>
	);
};
