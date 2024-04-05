import * as z from "zod";

import { ResetSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import { sendPasswordResetEmail } from "@/lib/mail";
import { generatePasswordResetToken } from "@/lib/tokens";

// handler to generate reset
export const reset = async (values: z.infer<typeof ResetSchema>) => {
	const validatedFields = ResetSchema.safeParse(values);

	// validating email
	if (!validatedFields.success) {
		return { error: "Invalid email!" };
	}

	const { email } = validatedFields.data;

	const existingUser = await getUserByEmail(email);

	if (!existingUser) {
		return { error: "Email not found!" };
	}

	// generating password reset token
	const passwordResetToken = await generatePasswordResetToken(email);

	// sending email to user to reset password
	await sendPasswordResetEmail(
		passwordResetToken.email,
		passwordResetToken.token
	);

	return { success: "Reset email sent!" };
};
