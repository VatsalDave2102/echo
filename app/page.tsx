import UserButton from "@/components/auth/user-button";

export default function Home() {
	const onClick = async () => {
		await logout();
	};
	const session = useSession();
	return (
		<div>
			<UserButton />
		</div>
	);
}
