"use client";

import * as z from "zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { LoginSchema } from "@/schemas";
import { login } from "@/actions/auth/login";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/common/form-error";
import { CardWrapper } from "@/components/auth/card-wrapper";
import { FormSuccess } from "@/components/common/form-success";

export const LoginForm = () => {
	// states to show form messages
	const [error, setError] = useState<string | undefined>();
	const [success, setSuccess] = useState<string | undefined>();

	// get error from url
	const searchParams = useSearchParams();
	const urlError =
		searchParams.get("error") === "OAuthAccountNotLinked"
			? "Email already in use with different provider"
			: "";

	// to show loading state during form submission
	const [isPending, startTransition] = useTransition();

	const form = useForm<z.infer<typeof LoginSchema>>({
		resolver: zodResolver(LoginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});
	const { handleSubmit, control } = form;

	const onSubmit = (values: z.infer<typeof LoginSchema>) => {
		setError("");
		setSuccess("");
		startTransition(async () => {
			// call login action
			try {
				const data = await login(values);
				if (data?.error) {
					form.reset();
					setError(data.error);
				}
				if (data?.success) {
					setSuccess(data.success);
				}
			} catch (error) {
				setError("Something went wrong!");
			}
		});
	};

	return (
		<CardWrapper
			headerLabel="Login to your account"
			backButtonLabel="Don't have an account?"
			backButtonHref="/auth/signup"
			showSocial
		>
			<Form {...form}>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
					<div className="space-y-4">
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
									<Button
										size="sm"
										variant="link"
										asChild
										className="px-0 font-normal"
									>
										<Link href="/auth/reset">Forgot password?</Link>
									</Button>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<FormError message={error || urlError} />
					<FormSuccess message={success} />
					<Button
						type="submit"
						className="w-full"
						disabled={isPending}
						variant={"rose"}
					>
						Login
					</Button>
				</form>
			</Form>
		</CardWrapper>
	);
};
