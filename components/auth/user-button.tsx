import { FaUser } from "react-icons/fa";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { currentUser } from "@/lib/auth";
import LogoutButon from "@/components/auth/logout-button";
import { ExitIcon } from "@radix-ui/react-icons";

export default async function UserButton() {
	const user = await currentUser();
	return (
		<DropdownMenu>
			<DropdownMenuTrigger>
				<Avatar className="w-[48px] h-[48px]">
					<AvatarImage src={user?.image || ""} />
					<AvatarFallback className="bg-rose-500">
						<FaUser className="text-white" />
					</AvatarFallback>
				</Avatar>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-40 bg-[#222222]" align="end">
				<LogoutButon>
					<DropdownMenuItem>
						<ExitIcon className="h-4 w-4 mr-2" />
						Logout
					</DropdownMenuItem>
				</LogoutButon>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
