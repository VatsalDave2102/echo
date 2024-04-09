import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

// to create user's initial profile
export const initialProfile = async () => {
	const user = await currentUser();

	// if user doesn't exist
	if (!user) {
		redirect("/auth/login");
	}

	// find existing profile
	const profile = await db.profile.findUnique({
		where: {
			userId: user.id,
		},
	});

	if (profile) {
		return profile;
	}

	// create a new profile
	const newProfile = await db.profile.create({
		data: {
			userId: user.id!,
			name: user.name!,
			imageUrl: user.image,
			email: user.email!,
		},
	});
	return newProfile;
};
