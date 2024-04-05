"use server";

import * as z from "zod";
import bcryptjs from "bcryptjs";

import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user";
import { NewPasswordSchema } from "@/schemas";
import { getPasswordResetTokenByToken } from "@/data/reset-password-token";

// action to verify token and then delete it after verification
export const newPassword = async (
	values: z.infer<typeof NewPasswordSchema>,
	token: string | null
) => {
	// if token doesn't exist
	if (!token) {
		return { error: "Missing token!" };
	}

	// validating field
	const validatedFields = NewPasswordSchema.safeParse(values);

	if (!validatedFields.success) {
		return { error: "Invalid field!" };
	}

	const { password } = values;

	// getting exisiting token
	const exisitingToken = await getPasswordResetTokenByToken(token);

	if (!exisitingToken) {
		return { error: "Invalid token!" };
	}

	// checking if token expired
	const hasExpired = new Date(exisitingToken.expires) < new Date();

	if (hasExpired) {
		return { error: "Token has expired!" };
	}

	// getting existing user
	const existingUser = await getUserByEmail(exisitingToken.email);

	if (!existingUser) {
		return { error: "User does not exist!" };
	}

	// checking if new password is same as old
	const samePassword = await bcryptjs.compare(password, existingUser.password!);

	if (samePassword) {
		return {
			error: "New password cannot be same as old password!",
		};
	}

	// encrypting new password
	const hashedPassword = await bcryptjs.hash(password, 10);

	await db.user.update({
		where: {
			id: existingUser.id,
		},
		data: {
			password: hashedPassword,
		},
	});

	// deleting the token
	await fetch("http://localhost:3000/api/auth/reset-password-token", {
		method: "DELETE",
		headers: {
			"Content-type": "application/json",
		},
		body: JSON.stringify({ id: exisitingToken.id }),
	});

	return { success: "Password updated successfully!" };
};
