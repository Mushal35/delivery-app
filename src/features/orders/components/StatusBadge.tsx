"use client";
import { Badge } from "@/components/ui/badge";

export function StatusBadge({ status }: { status: string | null }) {
  switch (status) {
    case "placed":
      return (
        <Badge
          variant="secondary"
          className="bg-blue-100 text-blue-700 hover:bg-blue-100/80"
        >
          Placed
        </Badge>
      );
    case "packed":
      return (
        <Badge
          variant="secondary"
          className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100/80"
        >
          Packed
        </Badge>
      );
    case "assigned":
      return (
        <Badge
          variant="secondary"
          className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80"
        >
          Assigned
        </Badge>
      );
    case "picked":
      return (
        <Badge
          variant="secondary"
          className="bg-amber-100 text-amber-700 hover:bg-amber-100/80"
        >
          Picked
        </Badge>
      );
    case "delivered":
      return (
        <Badge className="bg-green-600 hover:bg-green-700">Delivered</Badge>
      );
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
}
