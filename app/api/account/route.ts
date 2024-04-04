import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	// extracting searched parameter from request
	const { searchParams } = new URL(request.url);

	const userId = searchParams.get("userId");
	// if account is searched using id

	try {
		const account = await db.account.findFirst({
			where: {
				id: userId!,
			},
		});
		if (account) {
			return NextResponse.json(account, { status: 200 });
		} else {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}
	} catch (error) {
		return null;
	}
}
