import { getCurrentUser } from "@/services/next-auth/lib/getCurrentAuth";
import { Card } from "@/components/ui/card";
import { CheckCircle2, WalletCards, Banknote } from "lucide-react";
import { db } from "@/drizzle/db";
import { AgentTable, OrderTable } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm"; // Correct import for operators

export default async function HistoryPage() {
  const { userId } = await getCurrentUser();
  if (!userId) return null;

  const agent = await getAgent(userId);
  if (!agent) return <div className="p-4 text-center text-muted-foreground">Agent profile not found.</div>;

  const orders = await getCompletedOrders(agent.id);

  if (orders.length === 0) {
    return <div className="text-center text-slate-500 py-10">No completed orders yet.</div>;
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => {
        const isCash = order.payment === "offline";
        
        return (
          <Card
            key={order.id}
            className="group flex flex-row items-center p-4 border-slate-200 shadow-sm hover:border-green-200 hover:bg-green-50/10 transition-all"
          >
            {/* 1. Icon Section */}
            <div className="h-10 w-10 rounded-full bg-green-100 border border-green-200 flex items-center justify-center text-green-600 shrink-0 group-hover:scale-105 transition-transform">
              <CheckCircle2 className="h-5 w-5" />
            </div>

            {/* 2. Order Details */}
            <div className="ml-4 flex-1">
              <p className="text-sm font-bold text-slate-900">
                Order #{order.id.slice(0, 8)}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                {/* Format date nicely: "Dec 14, 2:30 PM" */}
                {new Date(order.updatedAt).toLocaleDateString('en-IN', {
                    month: 'short', 
                    day: 'numeric', 
                    hour: '2-digit', 
                    minute: '2-digit'
                })}
              </p>
            </div>

            {/* 3. Payment Stats */}
            <div className="text-right flex flex-col items-end gap-1">
              <p className="text-sm font-bold text-slate-900">
                ₹{order.totalAmount}
              </p>
              
              {/* Payment Method Badge */}
              <div className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                isCash 
                  ? "bg-orange-50 text-orange-700 border-orange-100" 
                  : "bg-blue-50 text-blue-700 border-blue-100"
              }`}>
                {isCash ? <Banknote className="h-3 w-3" /> : <WalletCards className="h-3 w-3" />}
                {isCash ? "Cash" : "Prepaid"}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

// Data Fetching Logic
async function getCompletedOrders(agentId: string) {
  return await db.query.OrderTable.findMany({
    where: and(
      eq(OrderTable.agentId, agentId),
      eq(OrderTable.currentStatus, "delivered")
    ),
    // Descending order to show newest first
    orderBy: (orders, { desc }) => [desc(orders.updatedAt)],
    columns: {
        id: true,
        payment: true,
        updatedAt: true,
        totalAmount: true
    }
  });
}

async function getAgent(userId: string) {
  return await db.query.AgentTable.findFirst({
    where: eq(AgentTable.userId, userId),
    columns: {
      id: true,
    },
  });
}