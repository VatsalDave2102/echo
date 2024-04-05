import { v4 as uuidv4 } from "uuid";

import { getVerificationTokenByEmail } from "@/data/verification-token";
import { VerificationToken } from "@prisma/client";

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
