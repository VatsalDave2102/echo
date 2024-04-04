import jwt, { JwtPayload } from "jsonwebtoken";

interface SigninOption {
	expiresIn?: string | number;
}

const DEFAULT_SIGN_OPTION: SigninOption = {
	expiresIn: "1d",
};

// method to sign jwt token
export function signJwtAccessToken(
	payload: JwtPayload,
	options: SigninOption = DEFAULT_SIGN_OPTION
) {
	const secretKey = process.env.JWT_SECRET;
	const token = jwt.sign(payload, secretKey!, options);
	return token;
}

// method to verify jwt token
export function verifyJwt(token: string) {
	try {
		const secretKey = process.env.JWT_SECRET;
		const decoded = jwt.verify(token, secretKey!);
		return decoded as JwtPayload;
	} catch (error) {
		if (error instanceof jwt.TokenExpiredError) {
			console.log("session expired");
			return Response.redirect("/auth/login");
		}
		return null;
	}
}
