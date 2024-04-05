import NextAuth from "next-auth";
import { UserRole } from "@prisma/client";
import { PrismaAdapter } from "@auth/prisma-adapter";

import { db } from "@/lib/db";
import authConfig from "@/auth.config";
import { getUserById } from "@/data/user";
import { getAccountByUserId } from "./data/account";

export const {
	handlers: { GET, POST },
	auth,
	signIn,
	signOut,
	unstable_update,
} = NextAuth({
	pages: {
		signIn: "/auth/login",
		error: "/auth/error",
	},
	events: {
		async linkAccount({ user }) {
			await db.user.update({
				where: { id: user.id },
				data: { emailVerified: new Date() },
			});
		},
	},
	callbacks: {
		async signIn({ user, account }) {
			// allow OAuth without verification
			if (account?.provider !== "credentials") return true;

			const exisitingUser = await getUserById(user.id!);

			// prevent login without verifcation
			if (!exisitingUser?.emailVerified) return false;

			return true;
		},
		async jwt({ token, user }) {
			if (!token.sub) return { ...token, ...user };

			const exisitingUser = await getUserById(token.sub);

			if (!exisitingUser) return { ...token, ...user };

			const existingAccount = await getAccountByUserId(exisitingUser.id);

			token.isOath = !!existingAccount;

			return { ...token, ...user };
		},

		async session({ session, token }) {
			// add user id to session
			if (token.sub && session.user) {
				session.user.id = token.sub;
			}

			// add user role to session
			if (token.role && session.user) {
				session.user.role = token.role as UserRole;
			}

			// add two factor boolean to session
			if (token.isTwoFactorEnable && session.user) {
				session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
			}

			// add user details to session
			if (session.user) {
				session.user.name = token.name;
				session.user.email = token.email!;
				session.user.isOAuth = token.isOAuth as boolean;
			}
			return session;
		},
	},

	adapter: PrismaAdapter(db),
	session: { strategy: "jwt" },
	secret: process.env.NEXTAUTH_SECRET,
	...authConfig,
});
