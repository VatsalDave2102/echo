import { User } from "@prisma/client";

export const getUserByEmail = async (email: string) => {
	try {
		const result = await fetch(`/api/user?email=${email}`);
		if (result.ok) {
			const user = await result.json();
			return user as User;
		} else {
			return null;
		}
	} catch (error) {
		return null;
	}
};
