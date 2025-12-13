import { eventBus } from "@/lib/event-bus";
import { NextRequest } from "next/server";
import { getCurrentUser } from "@/services/next-auth/lib/getCurrentAuth";

export async function GET(req: NextRequest) {
  // Secure: Only drivers can listen
  const { userId } = await getCurrentUser();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      const onDashboardUpdate = (data: any) => {
        // Send a signal to the client
        const message = `data: ${JSON.stringify(data)}\n\n`;
        controller.enqueue(encoder.encode(message));
      };

      // Listen to the global dashboard channel
      eventBus.on("dashboard:available:update", onDashboardUpdate);

      req.signal.addEventListener("abort", () => {
        eventBus.off("dashboard:available:update", onDashboardUpdate);
        controller.close();
      });
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}