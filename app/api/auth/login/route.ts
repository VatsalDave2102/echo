import * as z from "zod";
import bcryptjs from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

import { LoginSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import { signJwtAccessToken } from "@/lib/jwt";

export async function POST(request: NextRequest) {
	// getting values from request
	const values: z.infer<typeof LoginSchema> = await request.json();

	// validating fields
	const validatedFields = LoginSchema.safeParse(values);

	// invalidation error
	if (!validatedFields.success) {
		return NextResponse.json({ error: "Invalid fields" }, { status: 400 });
	}

	const { email, password } = validatedFields.data;
	const user = await getUserByEmail(email);

	// if user exist but they have logged in using other provider
	if (!user || !user.password) return null;

	// matching passwords for confirmation
	const passwordsMatch = await bcryptjs.compare(password, user?.password);

	// generate a jwt token
	const accessToken = signJwtAccessToken({ userId: user.id });

	const userWithToken = { ...user, accessToken };
	if (passwordsMatch) {
		return NextResponse.json(userWithToken, { status: 200 });
	} else {
		return NextResponse.json({ error: "Invalid Credentials" }, { status: 401 });
	}
}
