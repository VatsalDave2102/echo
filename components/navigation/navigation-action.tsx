"use client";

import { Plus } from "lucide-react";

import { useModal } from "@/hooks/use-modal-store";
import { ActionTooltip } from "@/components/common/action-tooltip";

// action button of sidebar
export const NavigationAction = () => {
	const { onOpen } = useModal();

	return (
		<div>
			<ActionTooltip side="right" align="center" label="Add a server">
				<button
					className="group flex items-center"
					onClick={() => onOpen("accessServer")}
				>
					<div className="flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center bg-background dark:bg-zinc-700 group-hover:bg-rose-500">
						<Plus
							className="group-hover:text-white transition text-rose-500"
							size={25}
						/>
					</div>
				</button>
			</ActionTooltip>
		</div>
	);
};
