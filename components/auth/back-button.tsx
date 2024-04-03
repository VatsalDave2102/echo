import Link from "next/link";
import { Button } from "../ui/button";

interface BackButtonProps {
	href: string;
	label: string;
}

export const BackButton: React.FC<BackButtonProps> = ({ label, href }) => {
	return (
		<Button className="font-normal mx-auto" variant="link" size="sm" asChild>
			<Link href={href}>{label}</Link>
		</Button>
	);
};
