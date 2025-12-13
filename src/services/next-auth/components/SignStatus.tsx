"use client";

import { useSession } from "next-auth/react";
import { ReactNode } from "react";

export function SignedIn({ children }: { children: ReactNode }) {
  const { data: session } = useSession();

  if (session) {
    return <>{children}</>;
  }

  return null;
}

export function SignedOut({ children }: { children: ReactNode }) {
  const { data: session } = useSession();

  if (!session) {
    return <>{children}</>;
  }

  return null;
}
