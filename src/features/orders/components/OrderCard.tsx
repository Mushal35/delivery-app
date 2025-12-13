import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatCurrency, formatDate } from "../utils/formatter";
import { StatusBadge } from "./StatusBadge";
import Link from "next/link";
import { Calendar, ChevronRight, CreditCard, Banknote } from "lucide-react";

export function OrderCard({
  order,
}: {
  order: {
    id: string;
    createdAt: Date;
    totalAmount: string;
    currentStatus: string | null;
    payment: string;
  };
}) {
  // 1. Determine Stripe Color
  const stripeColor =
    order.currentStatus === "delivered"
      ? "bg-green-500"
      : "bg-blue-500";

  // 2. Determine Payment Icon & Label
  const isOnline = order.payment === "online";
  const PaymentIcon = isOnline ? CreditCard : Banknote;
  const paymentLabel = isOnline ? "Paid Online" : "Pay on Delivery";

  return (
    <Card className="group overflow-hidden transition-all p-0 hover:shadow-md border-slate-200">
      <div className="flex flex-col md:flex-row">
        {/* Status Stripe */}
        <div className={`w-full md:w-2 h-2 md:h-auto ${stripeColor}`} />

        <div className="flex-1 p-5 sm:p-6">
          <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
            {/* Left Side: Order Info */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-slate-400">
                  #{order.id.slice(0, 8)}
                </span>
                <StatusBadge status={order.currentStatus} />
              </div>

              {/* Amount & Payment Method */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                <h3 className="font-bold text-xl text-slate-900">
                  {formatCurrency(order.totalAmount)}
                </h3>
                <span className="hidden sm:inline text-slate-300">|</span>
                <div className="flex items-center gap-1.5 text-sm text-slate-600 font-medium">
                  <PaymentIcon className="h-4 w-4 text-slate-400" />
                  <span>{paymentLabel}</span>
                </div>
              </div>
            </div>

            {/* Right Side: Meta & Action */}
            <div className="flex items-center justify-between md:justify-end gap-6 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(order.createdAt)}</span>
              </div>

              <Separator
                orientation="vertical"
                className="h-8 hidden md:block"
              />

              {/* Navigation Link */}
              <Button
                asChild
                variant="outline"
                size="sm"
                className="gap-2 group-hover:border-slate-400 transition-colors"
              >
                <Link href={`/orders/${order.id}`}>
                  View Order
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
