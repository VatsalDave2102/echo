import { auth } from "@/auth";
import { db } from "./db";

export const currentUser = async () => {
	const session = await auth();

	if (!session) {
		return null;
	}

	return session?.user;
};

export const currentProfile = async () => {
	const session = await auth();

	if (!session?.user) {
		return null;
	}

	const profile = await db.profile.findUnique({
		where: {
			userId: session.user.id,
		},
	});
	return profile;
};
