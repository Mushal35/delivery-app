import { getCurrentUser } from "@/services/next-auth/lib/getCurrentAuth";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Navigation,
  User,
  PackageOpen,
  Banknote,
  WalletCards,
  Phone,
  PackageCheck,
  Truck,
} from "lucide-react";
import { db } from "@/drizzle/db";
import { and, eq, ne } from "drizzle-orm/sql";
import { AgentTable, OrderTable } from "@/drizzle/schema";
import { DeliveryActionButton } from "@/features/partner/components/DeliveryActionButton";

export default async function ActiveOrdersPage() {
  const { userId } = await getCurrentUser();
  if (!userId) return null;
  const agent = await getAgent(userId);
  if (!agent) return null;
  const orders = await getActiveOrders(agent.id);

  if (orders.length === 0) {
    return (
      <div className="text-center text-slate-500 py-10">
        No active deliveries. Go to "New" to pick one up!
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => {
        // Use the mapped status from your function
        const currentStatus = order.currentStatus || "assigned";
        const isPickedUp = currentStatus === "picked";
        const isCOD = order.payment === "offline";

        return (
          <Card
            key={order.id}
            className="overflow-hidden gap-0 border-blue-200 shadow-md ring-1 ring-blue-50"
          >
            {/* 1. TOP STATUS BAR */}
            <div
              className={`px-4 py-3 flex justify-between items-center text-white
            ${isPickedUp ? "bg-green-600" : "bg-blue-600"}`}
            >
              <div className="flex items-center gap-2">
                {isPickedUp ? (
                  <Truck className="h-4 w-4" />
                ) : (
                  <PackageCheck className="h-4 w-4" />
                )}
                <span className="font-bold text-sm uppercase">
                  {isPickedUp ? "In Transit" : "Pickup Pending"}
                </span>
              </div>
              <span className="font-mono text-xs opacity-80">
                #{order.id?.slice(0, 6)}
              </span>
            </div>

            <CardContent className="p-5 space-y-6">
              {/* 2. PROGRESS VISUALIZER */}
              <div className="relative flex items-center justify-between text-xs font-medium text-slate-500 z-0">
                {/* Connecting Line */}
                <div className="absolute top-3 left-2 right-2 h-0.5 bg-slate-100 -z-10" />

                {/* Step 1: Assigned */}
                <div className="flex flex-col items-center gap-1 bg-white px-1">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center">
                    <User className="h-3 w-3" />
                  </div>
                  <span className="text-blue-600 font-bold">Assigned</span>
                </div>

                {/* Step 2: Picked Up */}
                <div className="flex flex-col items-center gap-1 bg-white px-1">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors
                        ${
                          isPickedUp ? "bg-blue-600 text-white" : "bg-slate-200"
                        }`}
                  >
                    <PackageOpen className="h-3 w-3" />
                  </div>
                  <span className={isPickedUp ? "text-blue-600 font-bold" : ""}>
                    Picked Up
                  </span>
                </div>

                {/* Step 3: Delivered */}
                <div className="flex flex-col items-center gap-1 bg-white px-1">
                  <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center">
                    <MapPin className="h-3 w-3" />
                  </div>
                  <span>Delivered</span>
                </div>
              </div>

              {/* 3. PAYMENT ALERT (Crucial for Driver) */}
              {isCOD ? (
                <div className="bg-orange-50 border border-orange-200 rounded-md p-3 flex items-center gap-3">
                  <div className="bg-orange-100 p-2 rounded-full text-orange-700">
                    <Banknote className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-orange-800 uppercase">
                      Collect Cash
                    </p>
                    <p className="text-lg font-bold text-slate-900">
                      ₹{order.totalAmount}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-md p-3 flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-full text-green-700">
                    <WalletCards className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-green-800 uppercase">
                      Prepaid Order
                    </p>
                    <p className="text-sm text-slate-600">
                      Do not collect cash.
                    </p>
                  </div>
                </div>
              )}

              {/* 4. DETAILS */}
              <div className="space-y-4 pt-2">
                {/* Customer Info */}
                <div className="flex gap-3">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                      <User className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-slate-400 uppercase font-semibold">
                      Customer
                    </p>
                    <p className="text-sm font-medium text-slate-900">
                      {order.user?.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs gap-1"
                      >
                        <Phone className="h-3 w-3" /> Call
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="flex gap-3">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                      <MapPin className="h-4 w-4" />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-semibold">
                      Drop Location
                    </p>
                    <p className="text-sm font-medium text-slate-900 leading-snug">
                      {order.address?.addressLine}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      PIN: {order.address?.pincode}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>

            {/* 5. ACTIONS */}
            <CardFooter className="p-4 bg-slate-50 flex flex-col gap-3">
              <div className="flex gap-3 w-full">
                <Button
                  variant="outline"
                  className="flex-1 border-slate-300 bg-white"
                >
                  <Navigation className="h-4 w-4 mr-2" /> Map
                </Button>
              </div>

              {/* SMART ACTION BUTTON: Handles both Pickup and Delivery logic */}
              <DeliveryActionButton orderId={order.id} status={currentStatus} />
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}

async function getActiveOrders(agentId: string) {
  const orders = await db.query.OrderTable.findMany({
    where: and(
      eq(OrderTable.agentId, agentId),
      ne(OrderTable.currentStatus, "delivered")
    ),
    columns: {
      currentStatus: true,
      payment: true,
      createdAt: true,
      totalAmount: true,
      id: true,
    },
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
      orderStatuses: {
        orderBy: (row, { desc }) => [desc(row.createdAt)],
        limit: 1,
        columns: {
          status: true,
        },
      },
    },
  });
  return orders;
}

async function getAgent(userId: string) {
  return await db.query.AgentTable.findFirst({
    where: eq(AgentTable.userId, userId),
    columns: {
      id: true,
    },
  });
}
