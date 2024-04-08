import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);

	const userId = searchParams.get("userId");

	if (userId) {
		try {
			const twoFactorConfirmation = await db.twoFactorConfirmation.findUnique({
				where: { userId },
			});
			if (twoFactorConfirmation) {
				return NextResponse.json(twoFactorConfirmation, { status: 200 });
			} else {
				return NextResponse.json(
					{ error: "Confirmation was not found" },
					{ status: 400 }
				);
			}
		} catch (error) {
			return NextResponse.json(
				{ error: "Confirmation was not found" },
				{ status: 500 }
			);
		}
	}
}

// handler to add two factor confirmation
export async function POST(request: NextRequest) {
	const value: { userId: string } = await request.json();

	try {
		const twoFactorConfirmation = await db.twoFactorConfirmation.create({
			data: {
				userId: value.userId,
			},
		});
		if (twoFactorConfirmation) {
			return NextResponse.json(twoFactorConfirmation, { status: 201 });
		}
		return NextResponse.json(
			{ error: "Failed to add confirmation" },
			{ status: 500 }
		);
	} catch (error) {
		return NextResponse.json(
			{ error: "Failed to add confirmation" },
			{ status: 500 }
		);
	}
}

// handler to delete two factor confirmation
export async function DELETE(request: NextRequest) {
	const value: { id: string } = await request.json();

	try {
		await db.twoFactorConfirmation.delete({
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
