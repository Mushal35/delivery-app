import { Button } from "@/components/ui/button";
import { db } from "@/drizzle/db";
import { OrderTable } from "@/drizzle/schema";
import { DownloadInvoiceButton } from "@/features/orders/components/DownloadButton";
import { OrderItemsList } from "@/features/orders/components/OrderItemsList";
import { OrderSummary } from "@/features/orders/components/OrderSummary";
import { LiveStatusBadge } from "@/features/orders/components/LiveStatusBadge";
import { formatDate } from "@/features/orders/utils/formatter";
import { getCurrentUser } from "@/services/next-auth/lib/getCurrentAuth";
import { and, eq } from "drizzle-orm/sql";
import { ArrowLeft, Calendar } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function OrderDetailsPage({
  params,
}: PageProps<"/orders/[orderId]">) {
  // 1. Fetch Data
  const { orderId } = await params;
  const orderData = await getOrderDetails(orderId);

  // 2. Handle Errors / Not Found
  if (!orderData || "error" in orderData) {
    return (
      <div className="p-10 text-center text-red-500">
        Error: {(orderData as any).message}
      </div>
    );
  }

  // Cast for easier usage since we handled the error above
  const order = orderData as NonNullable<typeof orderData>;

  return (
    <div className="font-redhat h-screen w-full bg-rose-50/50 pb-10 overflow-y-auto">
      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <Button
            variant="ghost"
            className="pl-0 gap-2 hover:bg-transparent hover:text-indigo-600"
            asChild
          >
            <Link href="/orders">
              <ArrowLeft className="h-4 w-4" />
              Back to Orders
            </Link>
          </Button>
        </div>

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-slate-900">
                Order Details
              </h1>
              <LiveStatusBadge
                status={order.currentStatus}
                orderId={order.id}
              />
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <span className="font-mono">#{order.id}</span>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                {formatDate(order.createdAt)}
              </div>
            </div>
          </div>
          <DownloadInvoiceButton order={order} />
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Items */}
          <div className="lg:col-span-2 space-y-6">
            <OrderItemsList items={order.items} />
          </div>

          {/* Right Column: Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-10">
              <OrderSummary order={order} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

async function getOrderDetails(id: string) {
  const { userId } = await getCurrentUser();
  if (!userId)
    return {
      error: true,
      message: "Not Authenticated",
    };
  const order = await db.query.OrderTable.findFirst({
    where: and(eq(OrderTable.userId, userId), eq(OrderTable.id, id)),
    columns: {
      createdAt: true,
      totalAmount: true,
      payment: true,
      id: true,
      currentStatus: true,
    },
    with: {
      address: {
        columns: {
          addressLine: true,
          pincode: true,
        },
      },
      orderItems: {
        columns: {
          quantity: true,
          unitPrice: true,
          subTotal: true,
        },
        with: {
          product: {
            columns: {
              name: true,
              imageUrl: true,
            },
            with: {
              category: {
                columns: {
                  title: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!order) return null;

  const { orderItems, ...rest } = order;

  return {
    ...rest,
    items: order.orderItems.map((item) => ({
      name: item.product.name,
      imageUrl: item.product.imageUrl,
      category: item.product.category.title,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      subTotal: item.subTotal,
    })),
  };
}
