"use client";

import { cn } from "@/lib/utils";
import { Member, MemberRole, Profile, Server } from "@prisma/client";
import { ShieldEllipsis, ShieldPlus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { UserAvatar } from "@/components/common/user-avatar";

interface ServerMemberProps {
	member: Member & { profile: Profile };
	server: Server;
}

const roleIconMap = {
	[MemberRole.GUEST]: null,
	[MemberRole.MODERATOR]: (
		<ShieldEllipsis className="h-4 w-4 ml-2 text-indigo-500" />
	),
	[MemberRole.ADMIN]: <ShieldPlus className="h-4 w-4 ml-2 text-rose-500" />,
};

// component to show members of server
export const ServerMember: React.FC<ServerMemberProps> = ({
	member,
	server,
}) => {
	const router = useRouter();
	const params = useParams();

	const icon = roleIconMap[member.role];

	// redirect user to one on one conversation with member
	const onClick = () => {
		router.push(`/servers/${params?.serverId}/conversations/${member.id}`);
	};

	return (
		<button
			onClick={onClick}
			className={cn(
				"group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
				params?.memberId === member.id && "bg-zinc-700/20 dark:bg-zinc-700"
			)}
		>
			<UserAvatar
				src={member.profile.imageUrl}
				className="h-8 w-8 md:h-8 md:w-8"
			/>
			<p
				className={cn(
					"font-semibold text-sm text-neutral-500 group-hover:text-neutral-600 dark:text-neutral-400 dark:group-hover:text-neutral-300 transition",
					params?.memberId === member.id &&
						"text-primary dark:text-neutral-300 dark:group-hover:text-white"
				)}
			>
				{member.profile.name}
			</p>
			{icon}
		</button>
	);
};
