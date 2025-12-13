import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { SignedIn } from "@/services/next-auth/components/SignStatus";

export function AppSidebar({
  content,
  footerButton,
  children,
}: {
  content: React.ReactNode;
  footerButton: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <SidebarProvider className="overflow-y-hidden">
      <Sidebar collapsible="icon" className="overflow-hidden">
        <SidebarHeader className="flex-row">
          <SidebarTrigger />
        </SidebarHeader>
        <SidebarContent>{content}</SidebarContent>
        <SignedIn>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>{footerButton}</SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </SignedIn>
      </Sidebar>
      <main className="h-screen w-full">{children}</main>
    </SidebarProvider>
  );
}
