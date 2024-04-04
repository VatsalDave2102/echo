import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export default {
	providers: [
		Credentials({
			async authorize(credentials) {
				// call login api
				const result = await fetch(`${process.env.BASE_URL}/api/auth/login`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						email: credentials.email,
						password: credentials.password,
					}),
				});

				const user = await result.json();
				if (user.id) {
					return user;
				}
				return null;
			},
		}),
	],
} satisfies NextAuthConfig;
