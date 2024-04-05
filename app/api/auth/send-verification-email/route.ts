import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

const domain = process.env.NEXT_PUBLIC_APP_URL;

interface VerificationBodyData {
	email: string;
	token: string;
}

// handler to send email to user with verification token attached
export async function POST(request: NextRequest) {
	const values: VerificationBodyData = await request.json();

	const { email, token } = values;

	const confirmLink = `${domain}/auth/new-verification?token=${token}`;
	try {
		const result = await resend.emails.send({
			from: "onboarding@resend.dev",
			to: email,
			subject: "Confirm your email",
			html: `<p>Click <a href="${confirmLink}">here</a></p> to confirm your email.`,
		});
		return NextResponse.json(result);
	} catch (error) {
		return NextResponse.json(error);
	}
}
