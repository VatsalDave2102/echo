import { getUserByEmail } from "@/data/user";
import { SignupSchema } from "@/schemas";
import * as z from "zod";

export const signup = async (values: z.infer<typeof SignupSchema>) => {
	// field validation
	const validatedFields = SignupSchema.safeParse(values);

	// invalid fields error
	if (!validatedFields.success) {
		return {
			error: "Invalid fields",
		};
	}

	const { name, email, password } = validatedFields.data;

	// check if user already exists
	const existingUser = await getUserByEmail(email);
	if (existingUser) {
		return {
			error: "Email already in use!",
		};
	}

	// create user
	const result = await fetch(`/api/user`, {
		method: "POST",
		headers: {
			"Content-type": "application/json",
		},
		body: JSON.stringify({ name, email, password }),
	});

	if (result.ok) {
		return { success: "User created successfully!" };
	} else {
		return { error: "Failed to create user!" };
	}
};
