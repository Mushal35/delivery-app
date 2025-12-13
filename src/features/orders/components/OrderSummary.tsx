import { CreditCard, Banknote, ShieldCheck, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "../utils/formatter";

export function OrderSummary({
  order,
}: {
  order: {
    id: string;
    createdAt: Date;
    totalAmount: string;
    payment: "online" | "offline";
    address: {
      addressLine: string;
      pincode: string;
    };
    items: {
      name: string;
      imageUrl: string;
      category: string;
      quantity: string;
      unitPrice: string;
      subTotal: string;
    }[];
  };
}) {
  const isOnline = order.payment === "online";

  return (
    <Card className="border-slate-200 h-fit gap-0">
      <CardHeader className="bg-slate-50/50 border-b border-slate-100">
        <CardTitle className="text-lg">Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Shipping Address Section (New) */}
        {order.address && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-slate-500 uppercase tracking-wider">
              Shipping Address
            </h4>
            <div className="flex gap-3 text-slate-900">
              <MapPin className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm leading-relaxed">
                  {order.address.addressLine}
                </p>
                <p className="text-sm font-medium text-slate-500 mt-1">
                  PIN: {order.address.pincode}
                </p>
              </div>
            </div>
          </div>
        )}

        {order.address && <Separator />}

        {/* Payment Method Section */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-slate-500 uppercase tracking-wider">
            Payment Method
          </h4>
          <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50">
            {isOnline ? (
              <div className="p-2 bg-blue-100 rounded-full text-blue-600">
                <CreditCard className="h-5 w-5" />
              </div>
            ) : (
              <div className="p-2 bg-green-100 rounded-full text-green-600">
                <Banknote className="h-5 w-5" />
              </div>
            )}
            <div>
              <p className="font-medium text-sm text-slate-900">
                {isOnline ? "Online Payment" : "Cash on Delivery"}
              </p>
              <p className="text-xs text-slate-500">
                {isOnline ? "Paid securely via gateway" : "Pay upon receipt"}
              </p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Cost Breakdown */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Subtotal</span>
            <span className="text-slate-900 font-medium">
              {formatCurrency(order.totalAmount)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Shipping</span>
            <span className="text-slate-600 font-medium">Free</span>
          </div>
          <Separator />
          <div className="flex justify-between items-center">
            <span className="font-bold text-slate-900">Total</span>
            <span className="font-bold text-xl text-indigo-600">
              {formatCurrency(order.totalAmount)}
            </span>
          </div>
        </div>

        {/* Secure Badge */}
        <div className="bg-slate-50 rounded text-xs text-slate-500 p-3 flex items-center gap-2 justify-center">
          <ShieldCheck className="h-4 w-4" />
          Secure Transaction
        </div>
      </CardContent>
    </Card>
  );
}
