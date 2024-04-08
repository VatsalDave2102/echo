import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";

import {
	PasswordResetToken,
	TwoFactorToken,
	VerificationToken,
} from "@prisma/client";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import { getVerificationTokenByEmail } from "@/data/verification-token";
import { getPasswordResetTokenByEmail } from "@/data/reset-password-token";

// function to generate verification token
export const generateVerificationToken = async (email: string) => {
	// generating token and expiry date
	const token = uuidv4();
	const expires = new Date(new Date().getTime() + 3600 * 1000);

	// getting exisiting token and deleting it
	const existingToken = await getVerificationTokenByEmail(email);

	if (existingToken) {
		await fetch("http://localhost:3000/api/auth/new-verification", {
			method: "DELETE",
			headers: {
				"Content-type": "application/json",
			},
			body: JSON.stringify({ id: existingToken.id }),
		});
	}

	// storing new token in database
	const result = await fetch(
		"http://localhost:3000/api/auth/new-verification",
		{
			method: "POST",
			headers: {
				"Content-type": "application/json",
			},
			body: JSON.stringify({ email, token, expires }),
		}
	);

	const verificationToken: VerificationToken = await result.json();

	return verificationToken;
};

// function to generate password reset token
export const generatePasswordResetToken = async (email: string) => {
	const token = uuidv4();
	const expires = new Date(new Date().getTime() + 3600 * 1000);

	const existingToken = await getPasswordResetTokenByEmail(email);

	if (existingToken) {
		await fetch("http://localhost:3000/api/auth/reset-password-token", {
			method: "DELETE",
			headers: {
				"Content-type": "application/json",
			},
			body: JSON.stringify({ id: existingToken.id }),
		});
	}

	// storing new token in database
	const result = await fetch(
		"http://localhost:3000/api/auth/reset-password-token",
		{
			method: "POST",
			headers: {
				"Content-type": "application/json",
			},
			body: JSON.stringify({ email, token, expires }),
		}
	);

	const passwordResetToken = await result.json();

	return passwordResetToken as PasswordResetToken;
};

// function to generate two factor token
export const generateTwoFactorToken = async (email: string) => {
	// generate token and expiration time
	const token = crypto.randomInt(100000, 1000000).toString();
	const expires = new Date(new Date().getTime() + 5 * 60 * 1000);

	// if already token exist, delete it
	const exisitingToken = await getTwoFactorTokenByEmail(email);

	if (exisitingToken) {
		await fetch("http://localhost:3000/api/auth/two-factor-token", {
			method: "DELETE",
			headers: {
				"Content-type": "application/json",
			},
			body: JSON.stringify({ id: exisitingToken.id }),
		});
	}

	const result = await fetch(
		"http://localhost:3000/api/auth/two-factor-token",
		{
			method: "POST",
			headers: {
				"Content-type": "application/json",
			},
			body: JSON.stringify({
				email,
				token,
				expires,
			}),
		}
	);

	const twoFactorToken = await result.json();

	return twoFactorToken as TwoFactorToken;
};
