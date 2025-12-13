"use client";
import { LogOutIcon, UserPlusIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SignOutButton } from "@/services/next-auth/components/AuthButtons";
import { UserAvatar } from "./UserAvatar";
import Link from "next/link";
import { RoleGuard } from "@/components/RoleGuard";

type User = {
  name: string;
  imageUrl: string;
  email: string;
};

export function UserDropdownClient({
  user,
  trigger,
}: {
  user: User;
  trigger: React.ReactNode; // the clickable UI that opens dropdown
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        side={"right"}
        className="min-w-64 max-w-80"
      >
        <DropdownMenuLabel className="font-normal p-1">
          <div className="flex items-center gap-2">
            <UserAvatar
              name={user.name}
              imageUrl={user.imageUrl}
              className="size-8"
            />
            <div className="flex flex-col">
              <span className="font-semibold text-sm">{user.name}</span>
              <span className="text-xs truncate">{user.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <SignOutButton>
          <DropdownMenuItem>
            <LogOutIcon className="mr-1" /> Log Out
          </DropdownMenuItem>
        </SignOutButton>
        <RoleGuard notAllowedRoles={["agent"]}>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={"/enrollment"}>
              <UserPlusIcon className="mr-1" /> Become Partner
            </Link>
          </DropdownMenuItem>
        </RoleGuard>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
