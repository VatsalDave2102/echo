import { Account } from "@prisma/client";
export const getAccountByUserId = async (userId: string) => {
	try {
		const result = await fetch(
			`http://localhost:3000/api/account?userId=${userId}`
		);

		if (result.ok) {
			const account = await result.json();
			return account as Account;
		} else {
			return null;
		}
	} catch (error) {
		return null;
	}
};
