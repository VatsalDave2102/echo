import { Skeleton } from "@/components/ui/skeleton";

const NavigationServerListSkeletion = () => {
	return (
		<div className="flex-1 w-full">
			<div className="mb-4">
				<div className="group relative flex items-center">
					<Skeleton className="absolute left-0 w-[4px] h-[36px]" />
					<Skeleton
						className={
							"relative group flex mx-3 h-[48px] w-[48px] rounded-[16px]"
						}
					/>
				</div>
			</div>
			<div className="mb-4">
				<div className="group relative flex items-center">
					<Skeleton className="absolute left-0 w-[4px] h-[36px]" />
					<Skeleton
						className={
							"relative group flex mx-3 h-[48px] w-[48px] rounded-[16px]"
						}
					/>
				</div>
			</div>
		</div>
	);
};

export default NavigationServerListSkeletion;
