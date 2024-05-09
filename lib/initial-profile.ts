import { db } from "@/lib/db";
import { currentUser, auth } from "@clerk/nextjs/server";

// to create user's initial profile
export const initialProfile = async () => {
	const user = await currentUser();

	// if user doesn't exist
	if (!user) {
		auth().redirectToSignIn();
	}

	// find existing profile
	const profile = await db.profile.findUnique({
		where: {
			userId: user?.id,
		},
	});

	if (profile) {
		return profile;
	}

	// create a new profile
	const newProfile = await db.profile.create({
		data: {
			userId: user?.id!,
			name: `${user?.firstName} ${user?.lastName}`,
			imageUrl: user?.imageUrl,
			email: user?.emailAddresses[0].emailAddress!,
		},
	});
	return newProfile;
};
