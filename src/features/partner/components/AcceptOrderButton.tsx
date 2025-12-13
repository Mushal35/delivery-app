"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { assignOrderToSelf } from "../actions/actions";

export function AcceptOrderButton({ orderId }: { orderId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAccept = async () => {
    setLoading(true);

    try {
      // Call the server action
      const result = await assignOrderToSelf(orderId);

      if (result.error) {
        // Handle error (e.g., someone else claimed it first)
        toast.error(result.message);

        // Refresh to remove the stale order from the list
        router.refresh();
      } else {
        toast.success("You have successfully claimed this delivery.");

        // Refresh to move the order from "Available" to "Active" tab
        router.refresh();
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleAccept}
      disabled={loading}
      className="w-full bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-100 font-semibold transition-all active:scale-[0.98]"
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Claiming...
        </>
      ) : (
        "Accept Delivery"
      )}
    </Button>
  );
}
