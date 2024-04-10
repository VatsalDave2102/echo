import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/auth";
import { ServerSidebar } from "@/components/server/server-sidebar";

export default async function ServerIdLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: { serverId: string };
}) {
	const profile = await currentProfile();

	if (!profile) {
		redirect("/auth/login");
	}

	const server = await db.server.findUnique({
		where: {
			id: params.serverId,
			members: {
				some: {
					profileId: profile.id,
				},
			},
		},
	});

	if (!server) {
		redirect("/");
	}
	return (
		<div className="h-full">
			<div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
				<ServerSidebar serverId={params.serverId} />
			</div>
			<main className="h-full md:pl-60">{children}</main>
		</div>
	);
}