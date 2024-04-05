import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "../ui/card";
import { BackButton } from "./back-button";
import { Social } from "./social";

interface CardWrapperProps {
	children: React.ReactNode;
	headerLabel: string;
	backButtonLabel: string;
	backButtonHref: string;
	showSocial?: boolean;
}

export const CardWrapper: React.FC<CardWrapperProps> = ({
	children,
	headerLabel,
	backButtonLabel,
	backButtonHref,
	showSocial,
}) => {
	return (
		<Card className="w-[400px] shadow-md">
			{/* Card Header */}
			<CardHeader>
				<CardTitle className="text-rose-500">{headerLabel}</CardTitle>
			</CardHeader>

			{/* Card Content */}
			<CardContent>{children}</CardContent>

			{/* Card Footer */}
			{showSocial && (
				<CardFooter>
					<Social />
				</CardFooter>
			)}
			<CardFooter>
				<BackButton label={backButtonLabel} href={backButtonHref} />
			</CardFooter>
		</Card>
	);
};
