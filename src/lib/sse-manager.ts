type StatusCallback = (status: string) => void;

interface ActiveConnection {
  source: EventSource;
  listeners: Set<StatusCallback>;
}

// Global map to store active connections by Order ID
const connections = new Map<string, ActiveConnection>();

export const OrderSSEManager = {
  subscribe(orderId: string, onMessage: StatusCallback) {
    // 1. Check if a connection already exists
    let entry = connections.get(orderId);

    if (!entry) {
      // 2. If not, create a NEW EventSource
      console.log(`[SSE] Opening new connection for ${orderId}`);
      const source = new EventSource(`/api/sse/order-status?id=${orderId}`);
      
      entry = {
        source,
        listeners: new Set(),
      };
      
      connections.set(orderId, entry);

      // 3. Set up the single event listener for this connection
      source.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.status) {
            // Broadcast to ALL listeners (components) for this order
            entry!.listeners.forEach((callback) => callback(data.status));
          }
        } catch (err) {
          console.error("[SSE] Parse error", err);
        }
      };

      source.onerror = (err) => {
        console.error("[SSE] Connection error", err);
        // Optional: Implement retry logic or force close here
        source.close();
        connections.delete(orderId);
      };
    }

    // 4. Add the component's callback to the listener list
    entry.listeners.add(onMessage);

    // 5. Return a Cleanup function (unsubscribe)
    return () => {
      if (!entry) return;
      
      entry.listeners.delete(onMessage);

      // If no one is listening anymore, close the connection
      if (entry.listeners.size === 0) {
        console.log(`[SSE] Closing connection for ${orderId} (No listeners)`);
        entry.source.close();
        connections.delete(orderId);
      }
    };
  },
};