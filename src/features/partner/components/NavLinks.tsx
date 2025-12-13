"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils"; // Assuming you have shadcn utils

export function NavLinks() {
  const pathname = usePathname();

  const links = [
    { name: "New", href: "/partner/home/available" },
    { name: "Active", href: "/partner/home/active" },
    { name: "History", href: "/partner/home/completed" },
  ];

  return (
    <div className="grid grid-cols-3 bg-slate-200/50 p-1 h-12 rounded-xl mb-6">
      {links.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            replace={true} // Replaces history so back button works better
            className={cn(
              "flex items-center justify-center text-sm font-medium rounded-lg transition-all",
              isActive
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            )}
          >
            {link.name}
          </Link>
        );
      })}
    </div>
  );
}
