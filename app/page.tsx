"use client";
import { logout } from "@/actions/auth/logout";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

export default function Home() {
	const onClick = async () => {
		await logout();
	};
	const session = useSession();
	return (
		<div>
			<p className="text-3xl font-bold text-rose-500">
				{session.data?.user?.email}
			</p>
			<Button className="bg-rose-500 text-white" onClick={onClick}>
				Logout
			</Button>
		</div>
	);
}
