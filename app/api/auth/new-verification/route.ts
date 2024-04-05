import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// handler to get verification token
export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);

	const email = searchParams.get("email");
	const token = searchParams.get("token");
	try {
		if (token && !email) {
			// fetching from database
			const verificationToken = await db.verificationToken.findUnique({
				where: { token },
			});

			// send token if not null
			if (verificationToken) {
				return NextResponse.json(verificationToken, { status: 200 });
			} else {
				return NextResponse.json(
					{ error: "Token does not exist" },
					{ status: 404 }
				);
			}
		} else if (email && !token) {
			// fetching from database
			const verificationToken = await db.verificationToken.findFirst({
				where: { email },
			});

			// send token if not null
			if (verificationToken) {
				return NextResponse.json(verificationToken, { status: 200 });
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

interface VerificationTokenData {
	token: string;
	email: string;
	expires: Date;
}

// handler to store verification token in database
export async function POST(request: NextRequest) {
	const values: VerificationTokenData = await request.json();

	const { token, email, expires } = values;

	// storing token in database
	try {
		const verificationToken = await db.verificationToken.create({
			data: {
				email,
				token,
				expires,
			},
		});

		return NextResponse.json(verificationToken, { status: 201 });
	} catch (error) {
		return NextResponse.json({ error: error }, { status: 500 });
	}
}

// handler to delete the verification token from database
export async function DELETE(request: NextRequest) {
	const value: { id: string } = await request.json();

	try {
		await db.verificationToken.delete({
			where: {
				id: value.id,
			},
		});
		return NextResponse.json(
			{ succes: "Token deleted successfully" },
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json(
			{ error: "Failed to delete token" },
			{ status: 500 }
		);
	}
}
