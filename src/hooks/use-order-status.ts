import { useEffect, useState } from "react";
import { OrderSSEManager } from "@/lib/sse-manager";
import { useRouter } from "next/navigation";

export function useOrderStatus(orderId: string, initialStatus: string | null) {
  const [status, setStatus] = useState(initialStatus);
  const router = useRouter();

  useEffect(() => {
    if (!orderId) return;

    // subscribe returns a cleanup function automatically
    const unsubscribe = OrderSSEManager.subscribe(orderId, (newStatus) => {
      // This callback runs whenever the shared connection gets a message
      if (newStatus !== status) {
        setStatus(newStatus);
        router.refresh();
      }
    });

    return () => {
      unsubscribe();
    };
  }, [orderId, router]); 
  return status;
}