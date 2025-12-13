import { Package } from "lucide-react";
import { getCurrentUser } from "@/services/next-auth/lib/getCurrentAuth";
import { db } from "@/drizzle/db";
import { and, eq } from "drizzle-orm/sql";
import { OrderTable, statusType, StatusType } from "@/drizzle/schema";
import { OrderCard } from "@/features/orders/components/OrderCard";
import { OrderFilter } from "@/features/orders/components/OrderFilter";

export default async function OrdersPage({
  searchParams,
}: PageProps<"/orders">) {
  const { status: rawStatus } = await searchParams;
  const status = Array.isArray(rawStatus) ? rawStatus[0] : rawStatus;
  const validatedStatus = statusType.includes(status as StatusType)
    ? (status as StatusType)
    : undefined;
  const ordersData = await getOrders(validatedStatus);

  // Handle Auth Error
  if ("error" in ordersData) {
    return (
      <div className="flex h-screen items-center justify-center bg-rose-50 text-red-500">
        <p>{ordersData.message}</p>
      </div>
    );
  }

  return (
    <div className="font-redhat h-screen w-full bg-rose-50/50">
      <div className="grid grid-cols-1 gap-8 py-10 px-6 max-w-5xl mx-auto h-full">
        {/* Header */}
        <header className="flex justify-between items-start">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl dark:text-white">
              Orders
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              You have {ordersData.length} total orders
            </p>
          </div>
          <OrderFilter currentStatus={validatedStatus} />
        </header>

        {/* Content */}
        <section className="space-y-4 overflow-auto">
          {ordersData.length === 0 ? (
            <EmptyState />
          ) : (
            ordersData.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))
          )}
        </section>
      </div>
    </div>
  );
}

async function getOrders(status: StatusType | undefined) {
  const { userId } = await getCurrentUser();
  if (!userId)
    return {
      error: true,
      message: "Not Authenticated",
    };
  const orders = await db.query.OrderTable.findMany({
    where: and(
      eq(OrderTable.userId, userId),
      status ? eq(OrderTable.currentStatus, status) : undefined
    ),
    columns: {
      id: true,
      createdAt: true,
      totalAmount: true,
      payment: true,
      currentStatus: true,
    },
  });

  return orders;
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-slate-200 rounded-lg">
      <Package className="h-12 w-12 text-slate-300 mb-4" />
      <h3 className="text-lg font-medium text-slate-900">No orders yet</h3>
      <p className="text-slate-500 max-w-sm mt-1">
        Looks like you haven't placed any orders yet. Start shopping to see them
        here.
      </p>
    </div>
  );
}
