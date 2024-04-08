"use client";

import { logout } from "@/actions/auth/logout";

interface LogoutButtonProps {
	children?: React.ReactNode;
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({ children }) => {
	const onClick = async () => {
		await logout();
	};

	return (
		<span className="cursor-pointer" onClick={onClick}>
			{children}
		</span>
	);
};

export default LogoutButton;
