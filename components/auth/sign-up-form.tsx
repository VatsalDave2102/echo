"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { CardWrapper } from "@/components/auth/card-wrapper";
import { Input } from "@/components/ui/input";
import { SignupSchema } from "@/schemas";
import { FormError } from "@/components/common/form-error";
import { FormSuccess } from "@/components/common/form-success";
import { Button } from "@/components/ui/button";
import { signup } from "@/actions/auth/signup";

export const SignUpForm = () => {
	// states to show form messages
	const [error, setError] = useState<string | undefined>();
	const [success, setSuccess] = useState<string | undefined>();

	// to show loading state during form submission
	const [isPending, startTransition] = useTransition();

	const form = useForm<z.infer<typeof SignupSchema>>({
		resolver: zodResolver(SignupSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
		},
	});
	const { handleSubmit, control } = form;

	const onSubmit = (values: z.infer<typeof SignupSchema>) => {
		setError("");
		setSuccess("");
		startTransition(async () => {
			// call signup action
			const data = await signup(values);
			setError(data.error);
			setSuccess(data.success);
		});
	};
	return (
		<CardWrapper
			headerLabel="Create an account"
			backButtonLabel="Already have an account?"
			backButtonHref="/auth/login"
			showSocial
		>
			<Form {...form}>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
					<div className="space-y-4">
						{/* Name field */}
						<FormField
							control={control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input
											{...field}
											placeholder="Enter your name"
											type="text"
											disabled={isPending}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Email field */}
						<FormField
							control={control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input
											{...field}
											placeholder="Enter your email"
											type="email"
											disabled={isPending}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Password field */}
						<FormField
							control={control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<Input
											{...field}
											placeholder="Create password"
											type="password"
											disabled={isPending}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<FormError message={error} />
					<FormSuccess message={success} />
					<Button
						type="submit"
						className="w-full"
						variant={"rose"}
						disabled={isPending}
					>
						Sign up
					</Button>
				</form>
			</Form>
		</CardWrapper>
	);
};
