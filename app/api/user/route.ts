import * as z from "zod";
import bcryptjs from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";
import { SignupSchema } from "@/schemas";

export async function GET(request: NextRequest) {
	// extracting searched parameter from request
	const { searchParams } = new URL(request.url);

	const email = searchParams.get("email");
	const id = searchParams.get("id");

	// if user is searched using id
	if (id && !email) {
		try {
			const user = await db.user.findUnique({
				where: {
					id,
				},
			});
			if (user) {
				return NextResponse.json(user);
			} else {
				return NextResponse.json({ error: "User not found" }, { status: 404 });
			}
		} catch (error) {
			return null;
		}
	}

	// if user is searched using email
	if (email && !id) {
		try {
			const user = await db.user.findFirst({
				where: {
					email,
				},
			});
			if (user) {
				return NextResponse.json(user, { status: 200 });
			} else {
				return NextResponse.json({ error: "User not found" }, { status: 404 });
			}
		} catch (error) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}
	}
}

// post method to create user in database
export async function POST(request: NextRequest) {
	// getting values from request
	const values: z.infer<typeof SignupSchema> = await request.json();

	// validating fields
	const validatedFields = SignupSchema.safeParse(values);

	// invalidation error
	if (!validatedFields.success) {
		return NextResponse.json({ error: "Invalid fields" }, { status: 400 });
	}

	const { name, email, password } = validatedFields.data;

	const hashedPassword = await bcryptjs.hash(password, 10);

	// creating user in database
	const user = await db.user.create({
		data: {
			name,
			email,
			password: hashedPassword,
		},
	});

	if (user) {
		return NextResponse.json(
			{
				success: "User Created Successfully",
			},
			{ status: 200 }
		);
	} else {
		return NextResponse.json(
			{
				error: "Failed to create user",
			},
			{ status: 500 }
		);
	}
}
