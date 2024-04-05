export const sendVerificationEmail = async (email: string, token: string) => {
	await fetch("http://localhost:3000/api/auth/send-verification-email", {
		method: "POST",
		headers: {
			"Content-type": "application/json",
		},
		body: JSON.stringify({ email, token }),
	});
};
