import { TwoFactorToken } from "@prisma/client";

export const getTwoFactorTokenByToken = async (token: string) => {
	try {
		const result = await fetch(
			`http://localhost:3000/api/auth/two-factor-token?token=${token}`
		);
		if (result.ok) {
			const twoFactorToken = await result.json();
			return twoFactorToken as TwoFactorToken;
		} else {
			return null;
		}
	} catch (error) {
		return null;
	}
};

export const getTwoFactorTokenByEmail = async (email: string) => {
	try {
		const result = await fetch(
			`http://localhost:3000/api/auth/two-factor-token?email=${email}`
		);
		if (result.ok) {
			const twoFactorToken = await result.json();
			return twoFactorToken as TwoFactorToken;
		} else {
			return null;
		}
	} catch (error) {
		return null;
	}
};
