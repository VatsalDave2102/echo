import { FaUser } from "react-icons/fa";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserAvatarProps {
	src?: string | null;
	className?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ src, className }) => {
	return (
		<Avatar className={cn("h-7 w-7 md:h-10 md:w-10", className)}>
			<AvatarImage src={src || ""} />
			<AvatarFallback className="bg-rose-500">
				<FaUser className="text-white" />
			</AvatarFallback>
		</Avatar>
	);
};
