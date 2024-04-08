import UserButton from "@/components/auth/user-button";
import { ModeToggle } from "@/components/common/mode-toggle";

export default function Home() {
	return (
		<div>
			<UserButton />
			<ModeToggle />
		</div>
	);
}
