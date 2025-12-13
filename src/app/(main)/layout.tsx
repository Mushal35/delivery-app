import {
  ArchiveIcon,
  ChartAreaIcon,
  HandshakeIcon,
  HomeIcon,
  ShieldUserIcon,
  StoreIcon,
  WarehouseIcon,
} from "lucide-react";
import { Suspense } from "react";
import { AppSidebar } from "@/components/sidebar/AppSidebar";
import { SidebarNavMenuGroup } from "@/components/sidebar/SidebarNavMenuGroup";
import { SidebarUserButton } from "../../features/users/components/SidebarUserButton";
import { RoleGuard } from "@/components/RoleGuard";
import { SidebarNavMenuSubGroup } from "@/components/sidebar/SideNavMenuSubGroup";

export default function MainLayout({ children }: LayoutProps<"/">) {
  return (
    <AppSidebar
      content={
        <>
          <Suspense>
            <RoleGuard allowedRoles={["admin"]}>
              <SidebarNavMenuSubGroup
                item={{
                  href: "/admin",
                  icon: (
                    <ShieldUserIcon
                      className={"group-data-[active=true]:stroke-blue-500"}
                    />
                  ),
                  label: "Admin",
                  subMenu: [
                    {
                      href: "/admin/warehouse",
                      icon: (
                        <WarehouseIcon
                          className={"group-data-[active=true]:stroke-blue-500"}
                        />
                      ),
                      label: "Warehouse",
                    },
                    // {
                    //   href: "/admin/stats",
                    //   icon: (
                    //     <ChartAreaIcon
                    //       className={"group-data-[active=true]:stroke-blue-500"}
                    //     />
                    //   ),
                    //   label: "Stats",
                    // },
                  ],
                }}
              />
            </RoleGuard>
          </Suspense>
          <Suspense>
            <RoleGuard allowedRoles={["agent"]}>
              <SidebarNavMenuSubGroup
                item={{
                  href: "/partner",
                  icon: (
                    <HandshakeIcon
                      className={"group-data-[active=true]:stroke-blue-500"}
                    />
                  ),
                  label: "Partner",
                  subMenu: [
                    {
                      href: "/partner/home",
                      icon: (
                        <HomeIcon
                          className={"group-data-[active=true]:stroke-blue-500"}
                        />
                      ),
                      label: "Home",
                    },
                  ],
                }}
              />
            </RoleGuard>
          </Suspense>
          <SidebarNavMenuGroup
            className="mt-auto"
            items={[
              {
                href: "/orders",
                icon: (
                  <ArchiveIcon
                    className={"group-data-[active=true]:stroke-blue-500"}
                  />
                ),
                label: "My Orders",
              },
              {
                href: "/products",
                icon: (
                  <StoreIcon
                    className={"group-data-[active=true]:stroke-blue-500"}
                  />
                ),
                label: "Products",
              },
            ]}
          />
        </>
      }
      footerButton={<SidebarUserButton />}
    >
      {children}
    </AppSidebar>
  );
}
