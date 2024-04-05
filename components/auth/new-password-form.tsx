"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { NewPasswordSchema } from "@/schemas";
import { Button } from "@/components/ui/button";
import { newPassword } from "@/actions/auth/new-password";
import { FormError } from "@/components/common/form-error";
import { CardWrapper } from "@/components/auth/card-wrapper";
import { FormSuccess } from "@/components/common/form-success";

export const NewPasswordForm = () => {
	// states to show form messages
	const [error, setError] = useState<string | undefined>();
	const [success, setSuccess] = useState<string | undefined>();

	// get token from url
	const searchParams = useSearchParams();
	const token = searchParams.get("token");

	// to show loading state during form submission
	const [isPending, startTransition] = useTransition();

	const form = useForm<z.infer<typeof NewPasswordSchema>>({
		resolver: zodResolver(NewPasswordSchema),
		defaultValues: {
			password: "",
		},
	});

	function onSubmit(values: z.infer<typeof NewPasswordSchema>) {
		setError("");
		setSuccess("");
		startTransition(async () => {
			// calling action to reset password
			const data = await newPassword(values, token);
			if (data) {
				setError(data.error);
				setSuccess(data.success);
			}
		});
	}

	return (
		<CardWrapper
			headerLabel="Enter a new password"
			backButtonLabel="Back to login"
			backButtonHref="/auth/login"
		>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
					<div className="space-y-4">
						{/* Password field */}

						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<Input
											{...field}
											placeholder="*******"
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
						disabled={isPending}
						variant={"rose"}
					>
						Reset Password
					</Button>
				</form>
			</Form>
		</CardWrapper>
	);
};
