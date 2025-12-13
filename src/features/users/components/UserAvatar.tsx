"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function UserAvatar({
	name,
	imageUrl,
	className,
}: {
	name: string;
	imageUrl: string;
	className?: string;
}) {
	const initials = name
		.split(" ")
		.slice(0, 2)
		.map((w) => w[0])
		.join("")
		.toUpperCase();

	return (
		<Avatar className={className}>
			<AvatarImage src={imageUrl} alt={name} />
			<AvatarFallback className="uppercase bg-primary text-primary-foreground">
				{initials}
			</AvatarFallback>
		</Avatar>
	);
}
