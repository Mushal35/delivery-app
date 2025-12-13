"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ArrowDownIcon, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const STATUS_OPTIONS = ["placed", "packed", "assigned", "picked", "delivered"] as const;

export function OrderFilter({ currentStatus }: { currentStatus?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleFilter = (status: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!status || status === "all") {
      params.delete("status");
    } else {
      params.set("status", status);
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2 capitalize shadow-sm">
          {currentStatus || "All Orders"}
          <ArrowDownIcon className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 p-1">
        <DropdownMenuItem 
          onClick={() => handleFilter("all")}
          className={cn(!currentStatus && "bg-slate-100 font-medium")}
        >
          All Orders {!currentStatus && <Check className="ml-auto h-4 w-4" />}
        </DropdownMenuItem>
        {STATUS_OPTIONS.map((status) => (
          <DropdownMenuItem
            key={status}
            onClick={() => handleFilter(status)}
            className={cn("capitalize", currentStatus === status && "bg-slate-100 font-medium")}
          >
            {status}
            {currentStatus === status && <Check className="ml-auto h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}