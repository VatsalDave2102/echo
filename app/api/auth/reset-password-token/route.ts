import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";

// handler to get reset password token from database
export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);

	// extracting email and token from url params
	const email = searchParams.get("email");
	const token = searchParams.get("token");

	try {
		if (token && !email) {
			// fetching from database
			const passwordResetToken = await db.passwordResetToken.findUnique({
				where: { token },
			});

			// send token if not null
			if (passwordResetToken) {
				return NextResponse.json(passwordResetToken, { status: 200 });
			} else {
				return NextResponse.json(
					{ error: "Token does not exist" },
					{ status: 404 }
				);
			}
		} else if (email && !token) {
			// fetching from database
			const passwordResetToken = await db.passwordResetToken.findFirst({
				where: { email },
			});

			// send token if not null
			if (passwordResetToken) {
				return NextResponse.json(passwordResetToken, { status: 200 });
			} else {
				return NextResponse.json(
					{ error: "Token does not exist" },
					{ status: 404 }
				);
			}
		} else {
			// if not searched using proper parameters
			return NextResponse.json(
				{ error: "Token does not exist" },
				{ status: 404 }
			);
		}
	} catch (error) {
		return NextResponse.json(
			{ error: "Token does not exist" },
			{ status: 404 }
		);
	}
}

interface PasswordResetTokenData {
	token: string;
	email: string;
	expires: Date;
}

// handler to create new reset password token
export async function POST(request: NextRequest) {
	const values: PasswordResetTokenData = await request.json();

	const { token, email, expires } = values;

	try {
		const passwordResetToken = await db.passwordResetToken.create({
			data: {
				email,
				token,
				expires,
			},
		});

		return NextResponse.json(passwordResetToken, { status: 201 });
	} catch (error) {
		return NextResponse.json(
			{ error: "Failed to create token" },
			{ status: 500 }
		);
	}
}

// handler to delete reset password token
export async function DELETE(request: NextRequest) {
	const value: { id: string } = await request.json();

	try {
		await db.passwordResetToken.delete({
			where: {
				id: value.id,
			},
		});
		return NextResponse.json(
			{ success: "Token deleted successfully" },
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json(
			{ error: "Failed to delete token" },
			{ status: 500 }
		);
	}
}
