import { relations } from "drizzle-orm";
import { decimal, index, pgEnum, pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schemaHelpers";
import { UserTable } from "./user";
import { AgentTable } from "./agent";
import { OrderItemTable } from "./orderItem";
import { OrderStatusTable, statusTypeEnum } from "./orderStatus";
import { AddressTable } from "./address";

export const paymentType = [
  "online",
  "offline"
] as const
export type PaymentType = (typeof paymentType)[number]
export const paymentTypeEnum = pgEnum(
  "payment_type",
  paymentType
)

export const OrderTable = pgTable(
  "orders",
  {
    id,
    userId: uuid()
      .notNull()
      .references(() => UserTable.id),
    agentId: uuid().references(() => AgentTable.id),
    addressId: uuid()
      .notNull()
      .references(() => AddressTable.id),
    payment: paymentTypeEnum().notNull(),
    currentStatus: statusTypeEnum("current_status").default("placed").notNull(),
    totalAmount: decimal({ scale: 2 }).notNull(),
    createdAt,
    updatedAt,
  },
  (table) => []
);

export const orderRelations = relations(OrderTable, ({ one, many }) => ({
  user: one(UserTable, {
    fields: [OrderTable.userId],
    references: [UserTable.id],
  }),
  agent: one(AgentTable, {
    fields: [OrderTable.agentId],
    references: [AgentTable.id],
  }),
  orderItems: many(OrderItemTable),
  orderStatuses: many(OrderStatusTable),
  address: one(AddressTable, {
    fields: [OrderTable.addressId],
    references: [AddressTable.id],
  }),
}));
