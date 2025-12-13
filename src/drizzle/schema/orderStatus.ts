import { relations } from "drizzle-orm";
import { pgEnum, pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schemaHelpers";
import { OrderTable } from "./order";

export const statusType = [
  "placed",
  "packed",
  "assigned",
  "picked",
  "delivered",
] as const
export type StatusType = (typeof statusType)[number]
export const statusTypeEnum = pgEnum(
  "status_type",
  statusType
)

export const OrderStatusTable = pgTable(
    "order_statuses",
    {
        id,
        orderId: uuid()
            .notNull()
            .references(() => OrderTable.id, { onDelete: "cascade" }),
        status: statusTypeEnum().notNull(),
        createdAt,
        updatedAt,
    },
);

export const orderStatusRelations = relations(
    OrderStatusTable,
    ({ one }) => ({
        order: one(OrderTable, {
            fields: [OrderStatusTable.orderId],
            references: [OrderTable.id],
        }),
    }),
);
