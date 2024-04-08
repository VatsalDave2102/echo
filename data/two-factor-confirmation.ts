import { TwoFactorConfirmation } from "@prisma/client";

export const getTwoFactorConfirmationByUserId = async (userId: string) => {
	try {
		const result = await fetch(
			`http://localhost:3000/api/auth/two-factor-confirmation?userId=${userId}`
		);

		if (result.ok) {
			const twoFactorConfirmation = await result.json();
			return twoFactorConfirmation as TwoFactorConfirmation;
		}
		return null;
	} catch (error) {
		return null;
	}
};
