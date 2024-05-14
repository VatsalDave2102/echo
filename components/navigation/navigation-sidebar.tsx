import { Suspense } from "react";
import { UserButton } from "@clerk/nextjs";

import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "@/components/common/mode-toggle";
import { NavigationAction } from "@/components/navigation/navigation-action";
import { NavigationServerList } from "@/components/navigation/navigation-server-list";
import NavigationServerListSkeletion from "@/components/skeletons/navigation-server-list-skeleton";

// navigation sidebar
export const NavigationSidebar = () => {
	return (
		<div className="space-y-4 flex flex-col items-center h-full text-primary w-full py-3 dark:bg-[#1e1e22] bg-[#e3e5e8]">
			<NavigationAction />
			<Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto" />
			<Suspense fallback={<NavigationServerListSkeletion />}>
				<NavigationServerList />
			</Suspense>
			<div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
				<ModeToggle />
				<Suspense
					fallback={<Skeleton className="h-[48px] w-[48px] rounded-full" />}
				>
					<UserButton
						afterSignOutUrl="/"
						appearance={{
							elements: {
								avatarBox: "h-[48px] w-[48px]",
								userButtonPopoverMain: "dark:bg-[#2b2d31] dark:text-zinc-300",
								userPreview: "dark:bg-[#2b2d31] dark:text-zinc-300",
								userButtonPopoverActionButton:
									"dark:border-t dark:border-zinc-700 transition hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50",
								userButtonPopoverActionButton__manageAccount:
									"dark:text-zinc-300 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300",
								userButtonPopoverActionButton__signOut:
									"dark:text-rose-300 text-rose-500 hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-300",
								userButtonPopoverFooter: "hidden",
							},
						}}
					/>
				</Suspense>
			</div>
		</div>
	);
};
