"use client";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import {
	type ReadonlyURLSearchParams,
	usePathname,
	useSearchParams,
} from "next/navigation";
import type { ReactNode } from "react";
import { SignedIn, SignedOut } from "@/services/next-auth/components/SignStatus";
import {
	SidebarGroup,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "../ui/sidebar";

export function SidebarNavMenuGroup({
	items,
	className,
}: {
	items: {
		href: string;
		icon: ReactNode;
		label: string;
		authStatus?: "signedOut" | "signedIn";
	}[];
	className?: string;
}) {
	const pathname = usePathname();
	return (
		<SidebarGroup className={className}>
			<SidebarMenu>
				{items.map((item) => {
					const html = (
						<SidebarMenuItem key={item.href}>
							<SidebarMenuButton
								asChild
								isActive={pathname.startsWith(item.href)}
							>
								<Link href={item.href} className="group">
									{item.icon}
									<span>{item.label}</span>
									<ChevronRight className="ml-auto group-data-[active=true]:block hidden group-hover:block" />
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					);

					if (item.authStatus === "signedOut") {
						return <SignedOut key={item.href}>{html}</SignedOut>;
					}

					if (item.authStatus === "signedIn") {
						return <SignedIn key={item.href}>{html}</SignedIn>;
					}

					return html;
				})}
			</SidebarMenu>
		</SidebarGroup>
	);
}

