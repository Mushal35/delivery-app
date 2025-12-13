"use client";

import { signIn, signOut } from "next-auth/react";
import { ReactNode } from "react";
import { Button } from "@/components/ui/button"; // Assuming you have this

interface AuthButtonProps {
  children?: ReactNode;
  mode?: "modal" | "redirect"; // Optional: Mimic Clerk's 'mode' if you want
  callbackUrl?: string;        // Where to go after action
}

export function SignInButton({
  children = <Button>Sign In</Button>,
  callbackUrl,
}: AuthButtonProps) {
  const handleSignIn = () => {
    // NextAuth handles both Sign In and Sign Up via this function
    signIn(undefined, { callbackUrl });
  };

  return (
    <span onClick={handleSignIn} className="cursor-pointer">
      {children}
    </span>
  );
}

export function SignOutButton({
  children = <Button>Sign Out</Button>,
  callbackUrl = "/",
}: AuthButtonProps) {
  const handleSignOut = () => {
    signOut({ callbackUrl });
  };

  return (
    <span onClick={handleSignOut} className="cursor-pointer">
      {children}
    </span>
  );
}