"use client";
import { useRoles } from "@/providers/RoleProvider";
import { hasRole } from "@/utils/rbac";

export const RoleGuard = ({
  children,
  allowedRoles,
  notAllowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles?: string[];
  notAllowedRoles?: string[];
}) => {
  const { roles } = useRoles();
  if (notAllowedRoles?.length && hasRole(roles, notAllowedRoles)) return null;
  if (allowedRoles?.length && !hasRole(roles, allowedRoles)) return null;
  return <>{children}</>;
};
