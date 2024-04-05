import NextAuth from "next-auth";

import authConfig from "./auth.config";
import {
	DEFAULT_LOGIN_REDIRECT,
	publicRoutes,
	authRoutes,
	apiPrefix,
} from "./routes";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
	const { nextUrl } = req;
	const isLoggedIn = !!req.auth;

	// boolean for api routes
	const isApiRoute = nextUrl.pathname.startsWith(apiPrefix);

	// boolean for public routes
	const isPublicRoutes = publicRoutes.includes(nextUrl.pathname);

	// boolean for authentication routes
	const isAuthRoutes = authRoutes.includes(nextUrl.pathname);

	if (isApiRoute) {
		return;
	}

	if (isAuthRoutes) {
		if (isLoggedIn) {
			return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
		}
		return;
	}

	if (!isLoggedIn && !isPublicRoutes) {
		return Response.redirect(new URL(`/auth/login`, nextUrl));
	}
	return;
});

// Optionally, don't invoke Middleware on some paths
export const config = {
	matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
