import { Separator } from "../ui/separator";
import { Skeleton } from "../ui/skeleton";

export const ServerSidebarSkeleton = () => {
	return (
		<div className="flex flex-col h-full w-full dark:bg-[#2b2d31] bg-[#f5f2f2]">
			{/* server header */}
			<Skeleton className="w-full h-12 px-3 rounded-none" />
			{/* scroll area */}
			<div className="flex-1 px-3">
				{/* search bar */}
				<div className="mt-2">
					<Skeleton className="rounded-md w-full gap-x-2 h-10"></Skeleton>
				</div>
				<Separator className="bg-zinc-300 dark:bg-zinc-600 rounded-md my-2" />
				<div className="mb-2">
					{/* server section */}
					<Skeleton className="h-32 rounded my-2" />
					<Skeleton className="h-24 rounded my-2" />
					<Skeleton className="h-24 rounded my-2" />
					<Skeleton className="h-32 rounded my-2" />
				</div>
			</div>
		</div>
	);
};
