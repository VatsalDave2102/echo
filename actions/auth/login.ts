"use server";

import * as z from "zod";
import { AuthError } from "next-auth";

import { LoginSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export const login = async (values: z.infer<typeof LoginSchema>) => {
	// fields validation
	const validatedFields = LoginSchema.safeParse(values);

	// invalid field error
	if (!validatedFields.success) {
		return {
			error: "Invalid fields",
		};
	}
	const { email, password, code } = validatedFields.data;

	// getting exisiting user
	const existingUser = await getUserByEmail(email);

	// if user is not in database or logged in using other provider than credentials
	if (!existingUser) {
		return { error: "Email does not exist!" };
	}

	if (!existingUser.email || !existingUser.password) {
		return { error: "Email already in use with different provider!" };
	}

	// if email not verified, generate new token and send confirmation mail
	if (!existingUser.emailVerified) {
		const verificationToken = await generateVerificationToken(
			existingUser.email
		);

		await sendVerificationEmail(
			verificationToken.email,
			verificationToken.token
		);

		return { success: "Confirmation email sent!" };
	}

	// signing in user
	try {
		await signIn("credentials", {
			email,
			password,
			redirectTo: DEFAULT_LOGIN_REDIRECT,
		});
	} catch (error) {
		if (error instanceof AuthError) {
			switch (error.type) {
				case "CredentialsSignin":
					return {
						error: "Invalid Credentials",
					};
				default:
					return {
						error: error.type,
					};
			}
		}
		throw error;
	}
};
