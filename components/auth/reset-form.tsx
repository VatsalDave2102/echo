"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
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
import { ResetSchema } from "@/schemas";
import { reset } from "@/actions/auth/reset";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/common/form-error";
import { CardWrapper } from "@/components/auth/card-wrapper";
import { FormSuccess } from "@/components/common/form-success";

export const ResetForm = () => {
	// states to show error and success messages
	const [error, setError] = useState<string | undefined>();
	const [success, setSuccess] = useState<string | undefined>();

	// to show pending state
	const [isPending, startTransition] = useTransition();

	const form = useForm<z.infer<typeof ResetSchema>>({
		resolver: zodResolver(ResetSchema),
		defaultValues: {
			email: "",
		},
	});

	function onSubmit(values: z.infer<typeof ResetSchema>) {
		setError("");
		setSuccess("");
		startTransition(async () => {
			// calling reset action to send reset password link to user
			const data = await reset(values);
			if (data) {
				setError(data.error);
				setSuccess(data.success);
			}
		});
	}
	return (
		<CardWrapper
			headerLabel="Forgot your password?"
			backButtonLabel="Back to login"
			backButtonHref="/auth/login"
		>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
					<div className="space-y-4">
						{/* Email field */}

						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input
											{...field}
											placeholder="abcd.123@gmail.com"
											type="email"
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
						Send reset email
					</Button>
				</form>
			</Form>
		</CardWrapper>
	);
};
