import { NextRequest } from "next/server";
import { db } from "@/drizzle/db";
import { OrderTable } from "@/drizzle/schema";
import { eq, and } from "drizzle-orm";
import { eventBus } from "@/lib/event-bus";
import { getCurrentUser } from "@/services/next-auth/lib/getCurrentAuth";

export async function GET(req: NextRequest) {
  // --------------------------------------------------------------------------
  // 1. Authentication & Validation
  // --------------------------------------------------------------------------
  const { userId } = await getCurrentUser();
  if (!userId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("id");

  if (!orderId) {
    return new Response(JSON.stringify({ error: "Missing Order ID" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // --------------------------------------------------------------------------
  // 2. Authorization (Security Check)
  // --------------------------------------------------------------------------
  // Check if the order actually exists AND belongs to this user.
  // We also fetch the current status to send it immediately.
  const order = await db.query.OrderTable.findFirst({
    where: and(
      eq(OrderTable.id, orderId),
      eq(OrderTable.userId, userId) // <--- CRITICAL SECURITY CHECK
    ),
    columns: { id: true, currentStatus: true }, // We only need the ID to confirm existence
  });

  if (!order) {
    // If order doesn't exist or doesn't belong to user, return 403/404
    return new Response(
      JSON.stringify({ error: "Order not found or access denied" }),
      {
        status: 403,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // --------------------------------------------------------------------------
  // 3. Establish SSE Stream
  // --------------------------------------------------------------------------
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      // Helper to send formatted SSE data
      const sendEvent = (data: any) => {
        const message = `data: ${JSON.stringify(data)}\n\n`;
        controller.enqueue(encoder.encode(message));
      };

      // A. Send Initial Status immediately
      // This ensures the client has the source-of-truth status right away
      const currentStatus = order.currentStatus;
      sendEvent({ status: currentStatus });

      // B. Define Listener for future updates
      const onUpdate = (data: { status: string }) => {
        // You can add logic here to only send if status actually changed
        sendEvent(data);
      };

      // C. Subscribe to the Global Event Bus
      // Channel name convention: `order:{orderId}`
      const channelName = `order:${orderId}`;
      eventBus.on(channelName, onUpdate);

      // D. Cleanup (Handle connection close)
      // This fires when the client disconnects or navigates away
      req.signal.addEventListener("abort", () => {
        eventBus.off(channelName, onUpdate);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
