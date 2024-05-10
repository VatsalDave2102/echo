import { Metadata } from "next";
import { SignUp } from "@clerk/nextjs";

export const metadata: Metadata = {
	title: "Sign Up",
	description: "Create a new account",
};

export default function Page() {
	return <SignUp path="/sign-up" />;
}
