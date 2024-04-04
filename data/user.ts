import { User } from "@prisma/client";

export const getUserByEmail = async (email: string) => {
	try {
		const result = await fetch(`http://localhost:3000/api/user?email=${email}`);
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

export const getUserById = async (id: string) => {
	try {
		const result = await fetch(`http://localhost:3000/api/user?id=${id}`);
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
