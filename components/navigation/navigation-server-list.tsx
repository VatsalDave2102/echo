import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NavigationItem } from "@/components/navigation/navigation-item";

export const NavigationServerList = async () => {
	const profile = await currentProfile();

	// if profile not found, redirect to home
	if (!profile) {
		redirect("/");
	}

	const servers = await db.server.findMany({
		where: {
			members: {
				some: { profileId: profile.id },
			},
		},
	});

	return (
		<ScrollArea className="flex-1 w-full">
			{/* display user's server */}
			{servers.map((server) => (
				<div key={server.id} className="mb-4">
					<NavigationItem
						id={server.id}
						name={server.name}
						imageUrl={server.imageUrl}
					/>
				</div>
			))}
		</ScrollArea>
	);
};
