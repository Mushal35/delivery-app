"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner"

export function DashboardLiveUpdater() {
  const router = useRouter();

  useEffect(() => {
    const eventSource = new EventSource("/api/sse/dashboard-updates");

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === "REMOVE") {
          // 1. Refresh the data (Server Component re-fetch)
          router.refresh();
          toast.info(`Order ${data.orderId} was taken by another partner.`)
        }
      } catch (e) {
        console.error("SSE Parse Error", e);
      }
    };

    return () => {
      eventSource.close();
    };
  }, [router]);

  return null; // This component renders nothing
}