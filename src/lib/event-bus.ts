import { EventEmitter } from "events";

// Use a global variable so it survives hot-reloads in development
const globalForEvents = globalThis as unknown as {
  eventBus: EventEmitter | undefined;
};

export const eventBus = globalForEvents.eventBus ?? new EventEmitter();
eventBus.setMaxListeners(1000); 

globalForEvents.eventBus = eventBus;

// if (process.env.NODE_ENV !== "production") {
//   globalForEvents.eventBus = eventBus;
// }