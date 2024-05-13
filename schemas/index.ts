import * as z from "zod";
import { ChannelType } from "@prisma/client";

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

export const ServerFormSchema = z.object({
	name: z.string().min(1, {
		message: "Server name is required!",
	}),
	imageUrl: z.string().min(1, {
		message: "Server image is required!",
	}),
});

export const ChannelFormSchema = z.object({
	name: z
		.string()
		.min(1, { message: "Channel name is required" })
		.refine((name) => name !== "general", {
			message: `Channel name cannot be "general"`,
		}),
	type: z.nativeEnum(ChannelType),
});

export const ChatInputSchema = z.object({
	content: z.string().min(1),
});

export const MessageFileSchema = z.object({
	fileUrl: z.string().min(1, {
		message: "Attachment is required!",
	}),
});

export const JoinServerSchema = z.object({
	code: z.string().min(1),
});
