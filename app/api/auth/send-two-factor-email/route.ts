import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

interface TwoFactorBodyData {
	email: string;
	token: string;
}

export async function POST(request: NextRequest) {
	const values: TwoFactorBodyData = await request.json();

	const { email, token } = values;

	try {
		const result = await resend.emails.send({
			from: "onboarding@resend.dev",
			to: email,
			subject: "2FA Code",
			html: `<p>Your 2FA Code: ${token}</>`,
		});
		return NextResponse.json(result);
	} catch (error) {
		return NextResponse.json(error);
	}
}
