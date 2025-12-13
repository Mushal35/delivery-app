import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  IndianRupee,
  MapPin,
  Bike,
  User,
  WalletCards,
  Banknote,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns"; // Optional: npm install date-fns
import { db } from "@/drizzle/db";
import { isNull } from "drizzle-orm/sql";
import { OrderTable } from "@/drizzle/schema";
import { AcceptOrderButton } from "@/features/partner/components/AcceptOrderButton";
import { DashboardLiveUpdater } from "@/hooks/dashboard-live-updater";

export default async function AvailableOrdersPage() {
  // Assuming the function returns the ID and Amount as well, as they are essential
  const orders = await getAvailableOrders();

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="bg-slate-100 p-4 rounded-full mb-3">
          <Bike className="h-8 w-8 text-slate-400" />
        </div>
        <h3 className="text-sm font-medium text-slate-900">No new orders</h3>
        <p className="text-xs text-slate-500 max-w-[200px] mt-1">
          Refresh to check for updates.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
        <DashboardLiveUpdater />
      {orders.map((order) => {
        const isCOD = order.payment === "offline";

        return (
          <Card
            key={order.id}
            className="overflow-hidden border-slate-200 shadow-sm transition-all hover:border-indigo-300"
          >
            {/* HEADER: Time and Status */}
            <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex justify-between items-center">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Clock className="h-3.5 w-3.5" />
                {/* "20 mins ago" */}
                <span>
                  {formatDistanceToNow(new Date(order.createdAt))} ago
                </span>
              </div>
              <Badge variant="outline" className="bg-white text-xs font-normal">
                {order.currentStatus.toUpperCase()}
              </Badge>
            </div>

            <CardContent className="p-4 space-y-5">
              {/* PRICE & PAYMENT METHOD */}
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">
                    Earnings
                  </p>
                  <p className="text-2xl font-bold text-slate-900 flex items-center">
                    <IndianRupee className="h-5 w-5 mr-0.5 text-slate-400" />
                    {order.totalAmount}
                  </p>
                </div>

                {/* Payment Badge Logic */}
                <div
                  className={`px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 ${
                    isCOD
                      ? "bg-orange-50 border-orange-200 text-orange-700"
                      : "bg-green-50 border-green-200 text-green-700"
                  }`}
                >
                  {isCOD ? (
                    <Banknote className="h-4 w-4" />
                  ) : (
                    <WalletCards className="h-4 w-4" />
                  )}
                  {isCOD ? "COLLECT CASH" : "PREPAID"}
                </div>
              </div>

              <div className="space-y-3">
                {/* ADDRESS */}
                <div className="flex gap-3 items-start">
                  <div className="mt-1 shrink-0 w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-indigo-600 font-semibold mb-0.5">
                      Pickup Location
                    </p>
                    <p className="text-sm text-slate-800 leading-snug font-medium">
                      {order.address?.addressLine}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      PIN: {order.address?.pincode}
                    </p>
                  </div>
                </div>

                {/* CUSTOMER */}
                <div className="flex gap-3 items-start">
                  <div className="mt-1 shrink-0 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-semibold mb-0.5">
                      Customer
                    </p>
                    <p className="text-sm text-slate-700">{order.user?.name}</p>
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="p-3 pt-0">
              <AcceptOrderButton orderId={order.id} />
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}

async function getAvailableOrders() {
  const orders = await db.query.OrderTable.findMany({
    where: isNull(OrderTable.agentId),
    columns: { id: true, payment: true, createdAt: true, totalAmount: true, currentStatus: true },
    with: {
      address: {
        columns: {
          addressLine: true,
          pincode: true,
        },
      },
      user: {
        columns: {
          name: true,
          email: true,
        },
      },
    },
  });
  return orders;
}
