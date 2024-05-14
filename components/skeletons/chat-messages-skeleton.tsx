import { Skeleton } from "@/components/ui/skeleton";

export const ChatMessagesSkeleton = () => {
	return (
		<>
			<div className="flex-1 py-4" />
			<div className="flex flex-col mt-auto">
				<div className="p-4">
					<div className="flex gap-x-2 items-start w-full">
						<Skeleton className="h-8 w-8 md:h-10 md:w-10 rounded-full" />
						<div className="flex flex-col w-full gap-y-2">
							<Skeleton className="h-4 w-72" />
							<Skeleton className="h-4 w-full" />
						</div>
					</div>
				</div>
				<div className="p-4">
					<div className="flex gap-x-2 items-start w-full">
						<Skeleton className="h-7 w-7 md:h-10 md:w-10 rounded-full" />
						<div className="flex flex-col w-full gap-y-2">
							<Skeleton className="h-4 w-72" />
							<Skeleton className="h-4 w-full" />
						</div>
					</div>
				</div>
				<div className="p-4">
					<div className="flex gap-x-2 items-start w-full">
						<Skeleton className="h-7 w-7 md:h-10 md:w-10 rounded-full" />
						<div className="flex flex-col w-full gap-y-2">
							<Skeleton className="h-4 w-72" />
							<Skeleton className="h-4 w-full" />
						</div>
					</div>
				</div>
				<div className="p-4">
					<div className="flex gap-x-2 items-start w-full">
						<Skeleton className="h-7 w-7 md:h-10 md:w-10 rounded-full" />
						<div className="flex flex-col w-full gap-y-2">
							<Skeleton className="h-4 w-72" />
							<Skeleton className="h-4 w-full" />
						</div>
					</div>
				</div>
				<div className="p-4">
					<div className="flex gap-x-2 items-start w-full">
						<Skeleton className="h-7 w-7 md:h-10 md:w-10 rounded-full" />
						<div className="flex flex-col w-full gap-y-2">
							<Skeleton className="h-4 w-72" />
							<Skeleton className="h-4 w-full" />
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
