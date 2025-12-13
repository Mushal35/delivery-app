"use server";

import { db } from "@/drizzle/db";
import { AgentTable, OrderStatusTable, OrderTable } from "@/drizzle/schema";
import { getCurrentUser } from "@/services/next-auth/lib/getCurrentAuth";
import { eq, and, isNull } from "drizzle-orm/sql";
import { eventBus } from "@/lib/event-bus"; // 1. Import your EventBus

export async function assignOrderToSelf(orderId: string) {
  const { userId } = await getCurrentUser();
  if (!userId) return { error: true, message: "Not Authenticated" };

  const agent = await getAgent(userId);
  if (!agent) return { error: true, message: "Not Authorized" };

  const result = await db.transaction(async (tx) => {
    const order = await tx
      .select({ agentId: OrderTable.agentId })
      .from(OrderTable)
      .where(and(eq(OrderTable.id, orderId), isNull(OrderTable.agentId)))
      .for("update");

    if (!order || order.length === 0)
      return {
        error: true,
        message: "Invalid Order ID OR Order Already Taken",
      };

    await tx
      .update(OrderTable)
      .set({
        agentId: agent.id,
        currentStatus: "assigned",
      })
      .where(eq(OrderTable.id, orderId));

    return { error: false, message: "Order Accepted Successfully" };
  });

  // 2. Emit event if successful
  if (!result.error) {
    eventBus.emit(`order:${orderId}`, { status: "assigned" });
    eventBus.emit("dashboard:available:update", {
      type: "REMOVE",
      message: "A new order is available in your area!",
      timestamp: new Date().toISOString(),
    });
  }

  return result;
}

export async function updateOrderStatus(
  orderId: string,
  nextStatus: "picked" | "delivered"
) {
  const { userId } = await getCurrentUser();
  if (!userId) return { error: true, message: "Not Authenticated" };

  const agent = await db.query.AgentTable.findFirst({
    where: eq(AgentTable.userId, userId),
  });
  if (!agent)
    return { error: true, message: "Not Authorized as Delivery Agent" };

  try {
    const result = await db.transaction(async (tx) => {
      const order = await tx.query.OrderTable.findFirst({
        where: and(
          eq(OrderTable.id, orderId),
          eq(OrderTable.agentId, agent.id)
        ),
        columns: { id: true, currentStatus: true },
      });

      if (!order) return { error: true, message: "Order not found" };

      // Flow Control Validation
      const ALLOWED_TRANSITIONS: Record<string, string[]> = {
        assigned: ["picked"],
        picked: ["delivered"],
      };

      const validNextStatuses = ALLOWED_TRANSITIONS[order.currentStatus] || [];
      if (!validNextStatuses.includes(nextStatus)) {
        return {
          error: true,
          message: `Cannot change from ${order.currentStatus} to ${nextStatus}`,
        };
      }

      await tx
        .update(OrderTable)
        .set({ currentStatus: nextStatus })
        .where(eq(OrderTable.id, orderId));
      await tx.insert(OrderStatusTable).values({ orderId, status: nextStatus });

      return { error: false, message: "Order status updated successfully" };
    });

    // 3. Emit event to notify the User via SSE
    if (!result.error) {
      eventBus.emit(`order:${orderId}`, {
        status: nextStatus,
        updatedAt: new Date().toISOString(),
      });
    }

    return result;
  } catch (error) {
    console.error("Update Status Error:", error);
    return { error: true, message: "Database transaction failed" };
  }
}

async function getAgent(userId: string) {
  return await db.query.AgentTable.findFirst({
    where: eq(AgentTable.userId, userId),
    columns: { id: true },
  });
}
