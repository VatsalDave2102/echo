import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
	return (
		<div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-y-5 items-center">
			<h2 className="font-semibold text-3xl">
				Server or Invite code does not exist
			</h2>
			<div>
				<Button variant={"rose"}>
					<Link href="/">Return Home</Link>
				</Button>
			</div>
		</div>
	);
}
