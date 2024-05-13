import { Metadata } from "next";

export const metadata: Metadata = {
	title: {
		template: "%s | Authentication",
		default: "Authentication",
	},
	description: "Authenticate your account",
};

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="h-full flex items-center justify-center bg-gradient-to-r from-rose-500">
			{children}
		</div>
	);
}
