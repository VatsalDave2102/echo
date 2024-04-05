import { VerificationToken } from "@prisma/client";

export const getVerificationTokenByToken = async (token: string) => {
	try {
		const result = await fetch(
			`http://localhost:3000/api/auth/new-verification?token=${token}`
		);
		if (result.ok) {
			const verificationToken = await result.json();
			return verificationToken as VerificationToken;
		}
	} catch (error) {
		return null;
	}
};

export const getVerificationTokenByEmail = async (email: string) => {
	try {
		const result = await fetch(
			`http://localhost:3000/api/auth/new-verification?email=${email}`
		);
		if (result.ok) {
			const verificationToken = await result.json();
			return verificationToken as VerificationToken;
		} else {
			return null;
		}
	} catch (error) {
		return null;
	}
};
