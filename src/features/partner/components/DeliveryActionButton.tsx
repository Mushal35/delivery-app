"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, PackageOpen, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { updateOrderStatus } from "../actions/actions";

interface DeliveryActionButtonProps {
  orderId: string;
  status: string; // "assigned" | "packed" | "out_for_delivery"
}

export function DeliveryActionButton({
  orderId,
  status,
}: DeliveryActionButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Logic: If it's already "out_for_delivery", the next step is "delivered".
  // Otherwise (assigned/packed), the next step is "out_for_delivery" (Pickup).
  const isPickedUp = status === "picked";
  const nextStatus = isPickedUp ? "delivered" : "picked";

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const result = await updateOrderStatus(orderId, nextStatus);

      if (result.error) {
        toast.error(result.message);
      } else {
        toast.success(
          isPickedUp
            ? "Great job! Order marked as completed."
            : "You are now in transit to the customer."
        );
        router.refresh();
      }
    } catch (e) {
      toast.error("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleUpdate}
      disabled={loading}
      className={`w-full font-bold shadow-md transition-all text-white
        ${
          isPickedUp
            ? "bg-green-600 hover:bg-green-700 active:bg-green-800" // Green for Finish
            : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800" // Blue for Pickup
        }`}
    >
      {loading ? (
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
      ) : isPickedUp ? (
        <CheckCircle2 className="mr-2 h-5 w-5" />
      ) : (
        <PackageOpen className="mr-2 h-5 w-5" />
      )}

      {loading
        ? "Updating..."
        : isPickedUp
        ? "Complete Delivery"
        : "Swipe to Pickup"}
    </Button>
  );
}

