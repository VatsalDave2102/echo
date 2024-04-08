import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";

// handler to get two factor token from database
export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);

	const email = searchParams.get("email");
	const token = searchParams.get("token");
	try {
		if (token && !email) {
			// fetching from database
			const twoFactorToken = await db.twoFactorToken.findUnique({
				where: { token },
			});

			// send token if not null
			if (twoFactorToken) {
				return NextResponse.json(twoFactorToken, { status: 200 });
			} else {
				return NextResponse.json(
					{ error: "Token does not exist" },
					{ status: 404 }
				);
			}
		} else if (email && !token) {
			// fetching from database
			const twoFactorToken = await db.twoFactorToken.findFirst({
				where: { email },
			});

			// send token if not null
			if (twoFactorToken) {
				return NextResponse.json(twoFactorToken, { status: 200 });
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

interface TwoFactorTokenData {
	email: string;
	token: string;
	expires: Date;
}

// handler to create two factor token
export async function POST(request: NextRequest) {
	const values: TwoFactorTokenData = await request.json();

	const { email, token, expires } = values;
	try {
		const twoFactorToken = await db.twoFactorToken.create({
			data: {
				email,
				token,
				expires,
			},
		});

		return NextResponse.json(twoFactorToken, { status: 201 });
	} catch (error) {
		return NextResponse.json(
			{ error: "Failed to create token" },
			{ status: 500 }
		);
	}
}

// handler to delete two factor token
export async function DELETE(request: NextRequest) {
	const value: { id: string } = await request.json();

	try {
		await db.twoFactorToken.delete({
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
