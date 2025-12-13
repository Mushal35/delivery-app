"use client";
import { Badge } from "@/components/ui/badge";
import { useOrderStatus } from "@/hooks/use-order-status";
import { StatusBadge } from "./StatusBadge";

export function LiveStatusBadge({
  status,
  orderId,
}: {
  status: string | null;
  orderId: string;
}) {
  const currentStatus = useOrderStatus(orderId, status);
  return <StatusBadge status={currentStatus} />;
}
