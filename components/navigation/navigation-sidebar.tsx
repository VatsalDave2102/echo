import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/auth";
import { Separator } from "@/components/ui/separator";
import UserButton from "@/components/auth/user-button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ModeToggle } from "@/components/common/mode-toggle";
import { NavigationItem } from "@/components/navigation/navigation-item";
import { NavigationAction } from "@/components/navigation/navigation-action";

// navigation sidebar
export const NavigationSidebar = async () => {
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
		<div className="space-y-4 flex flex-col items-center h-full text-primary w-full py-3 dark:bg-[#1e1e22]">
			<NavigationAction />
			<Separator className="h-[2px] bg-neutral-300 dark:bg-neutral-700 rounded-md w-10 mx-auto" />
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
			<div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
				<ModeToggle />
				<UserButton />
			</div>
		</div>
	);
};
