"use client";

import { BeatLoader } from "react-spinners";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { CardWrapper } from "./card-wrapper";
import { FormError } from "../common/form-error";
import { FormSuccess } from "../common/form-success";
import { newVerification } from "@/actions/auth/new-verification";

export const NewVerificationForm = () => {
	const [error, setError] = useState<string | undefined>();
	const [success, setSuccess] = useState<string | undefined>();

	const searchParams = useSearchParams();

	const token = searchParams.get("token");

	// onSubmit will called as the component mounts
	const onSubmit = useCallback(async () => {
		// if already verified or have error
		if (success || error) return;

		// if token is missing in params
		if (!token) {
			setError("Missing token!");
			return;
		}

		// verify the token
		try {
			const data = await newVerification(token);
			if (data) {
				setSuccess(data.success);
				setError(data.error);
			}
		} catch (error) {
			setError("Something went wrong!");
		}
	}, [token, success, error]);

	useEffect(() => {
		onSubmit();
	});

	return (
		<CardWrapper
			headerLabel="Confirming your verification"
			backButtonHref="/auth/login"
			backButtonLabel="Back to login"
		>
			<div className="flex items-center w-full justify-center">
				{!success && !error && <BeatLoader color="#f43f5e" />}
				<FormSuccess message={success} />
				{!success && <FormError message={error} />}
			</div>
		</CardWrapper>
	);
};
