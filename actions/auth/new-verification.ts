"use server";

import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user";
import { getVerificationTokenByToken } from "@/data/verification-token";

// action to verify token and then delete it after verification
export const newVerification = async (token: string) => {
	// getting exisiting token body from db
	const exisitingToken = await getVerificationTokenByToken(token);

	if (!exisitingToken) {
		return { error: "Token does not exist!" };
	}

	// checking if token has expired or not
	const hasExpired = new Date(exisitingToken.email) < new Date();

	if (hasExpired) {
		return { error: "Token has expired!" };
	}

	// getting existing user to update the emailVerified boolean
	const exisitingUser = await getUserByEmail(exisitingToken.email);

	// if user has changed it's email
	if (!exisitingUser) {
		return { error: "Email does not exist!" };
	}

	// updating user
	await db.user.update({
		where: { id: exisitingUser.id },
		data: {
			emailVerified: new Date(),
			email: exisitingToken.email,
		},
	});

	// deleting token
	await fetch("http://localhost:3000/api/auth/new-verification", {
		method: "DELETE",
		headers: {
			"Content-type": "application/json",
		},
		body: JSON.stringify({ id: exisitingToken.id }),
	});

	return { success: "Email verified!" };
};
