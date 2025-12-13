"use client";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "../ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";

export function SidebarNavMenuSubGroup({
  item,
  className,
}: {
  item: {
    href: string;
    icon: ReactNode;
    label: string;
    subMenu: { href: string; icon: ReactNode; label: string }[];
  };
  className?: string;
}) {
  const pathname = usePathname();
  return (
    <SidebarGroup className={className}>
      <SidebarMenu>
        <Collapsible defaultOpen={true} className="group/collapsible">
          <SidebarMenuItem key={item.href}>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton
                isActive={pathname.startsWith(item.href)}
                className="group"
              >
                {item.icon}
                <span>{item.label}</span>
                <ChevronRight className="ml-auto group-data-[active=true]:block hidden group-hover:block" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              {item.subMenu.map((subItem) => (
                <SidebarMenuSub key={subItem.href}>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton
                      asChild
                      isActive={pathname.startsWith(subItem.href)}
                    >
                      <Link href={subItem.href} className="group">
                        {subItem.icon}
                        <span>{subItem.label}</span>
                        <ChevronRight className="ml-auto group-data-[active=true]:block hidden group-hover:block" />
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              ))}
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      </SidebarMenu>
    </SidebarGroup>
  );
}
