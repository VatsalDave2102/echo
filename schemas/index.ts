import * as z from "zod";

export const SignupSchema = z.object({
	name: z.string().min(2, { message: "Name is required!" }),
	email: z
		.string({ required_error: "Email is required!" })
		.email({ message: "Invalid email address!" }),
	password: z.string().min(6, { message: "Minimum six characters required" }),
});

export const LoginSchema = z.object({
	email: z
		.string({ required_error: "Email is required!" })
		.email({ message: "Invalid email address!" }),
	password: z.string().min(1, { message: "Password is required" }),
	code: z.optional(z.string()),
});

export const ResetSchema = z.object({
	email: z
		.string({ required_error: "Email is required" })
		.email({ message: "Invalid email addess" }),
});

export const NewPasswordSchema = z.object({
	password: z
		.string({ required_error: "Password is required" })
		.min(6, { message: "Minimum six characters required" }),
});
