import { PasswordResetToken } from "@prisma/client";

export const getPasswordResetTokenByToken = async (token: string) => {
	try {
		const result = await fetch(
			`http://localhost:3000/api/auth/reset-password-token?token=${token}`
		);
		if (result.ok) {
			const passwordResetToken = await result.json();
			return passwordResetToken as PasswordResetToken;
		}
	} catch (error) {
		return null;
	}
};

export const getPasswordResetTokenByEmail = async (email: string) => {
	try {
		const result = await fetch(
			`http://localhost:3000/api/auth/reset-password-token?email=${email}`
		);
		if (result.ok) {
			const passwordResetToken = await result.json();
			return passwordResetToken as PasswordResetToken;
		} else {
			return null;
		}
	} catch (error) {
		return null;
	}
};
