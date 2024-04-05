import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

const domain = process.env.NEXT_PUBLIC_APP_URL;

interface PasswordResetBodyData {
	email: string;
	token: string;
}

// handler to send email to user with reset password token attached
export async function POST(request: NextRequest) {
	const values: PasswordResetBodyData = await request.json();

	const { email, token } = values;

	const resetLink = `${domain}/auth/new-password?token=${token}`;
	try {
		const result = await resend.emails.send({
			from: "onboarding@resend.dev",
			to: email,
			subject: "Password reset",
			html: `<p>Click <a href="${resetLink}">here</a></p> to reset your password.`,
		});
		return NextResponse.json(result);
	} catch (error) {
		return NextResponse.json(error);
	}
}
