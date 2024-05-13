import { Metadata } from "next";
import { SignIn } from "@clerk/nextjs";

export const metadata: Metadata = {
	title: "Sign In",
	description: "Sign In to your Account",
};

export default function Page() {
	return <SignIn path="/sign-in" />;
}
