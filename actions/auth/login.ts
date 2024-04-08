"use server";

import * as z from "zod";
import { AuthError } from "next-auth";

import { LoginSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import {
	generateTwoFactorToken,
	generateVerificationToken,
} from "@/lib/tokens";
import { sendTwoFactorEmail, sendVerificationEmail } from "@/lib/mail";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";

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

	// check if two factor is enabled
	if (existingUser.isTwoFactorEnabled && existingUser.email) {
		if (code) {
			const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);

			// if token does not exist
			if (!twoFactorToken) {
				return { error: "Invalid code!" };
			}

			// if token does not match code given by user
			if (twoFactorToken.token !== code) {
				return { error: "Invalid conde!" };
			}

			// checking for expiration of code
			const hasExpired = new Date(twoFactorToken.expires) < new Date();

			if (hasExpired) {
				return { error: "Code expired" };
			}

			// delete token due to expiration
			await fetch("http://localhost:3000/api/auth/two-factor-token", {
				method: "DELETE",
				headers: {
					"Content-type": "application/json",
				},
				body: JSON.stringify({ id: twoFactorToken.id }),
			});

			// check for existing confirmation
			const existingConfirmation = await getTwoFactorConfirmationByUserId(
				existingUser.id
			);

			// delete confirmation if exists
			if (existingConfirmation) {
				await fetch("http://localhost:3000/api/auth/two-factor-confirmation", {
					method: "DELETE",
					headers: {
						"Content-type": "application/json",
					},
					body: JSON.stringify({ id: existingConfirmation.id }),
				});
			}

			// create new confirmation
			await fetch("http://localhost:3000/api/auth/two-factor-confirmation", {
				method: "POST",
				headers: {
					"Content-type": "application/json",
				},
				body: JSON.stringify({ userId: existingUser.id }),
			});
		} else {
			// generate new two factor token
			const twoFactorToken = await generateTwoFactorToken(existingUser.email);

			// send token via email to user
			await sendTwoFactorEmail(twoFactorToken.email, twoFactorToken.token);

			return { twoFactor: true };
		}
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
