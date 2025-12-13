import { relations } from "drizzle-orm";
import { decimal, numeric, pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schemaHelpers";
import { OrderTable } from "./order";
import { ProductTable } from "./product";

export const OrderItemTable = pgTable(
  "order_items",
  {
    id,
    orderId: uuid()
      .notNull()
      .references(() => OrderTable.id, { onDelete: "cascade" }),
    productId: uuid()
      .notNull()
      .references(() => ProductTable.id),
    quantity: numeric().notNull(),
    unitPrice: decimal({ scale: 2 }).notNull(),
    subTotal: decimal({ scale: 2 }).notNull(),
    createdAt,
    updatedAt,
  },
  (table) => []
);

export const orderItemRelations = relations(OrderItemTable, ({ one }) => ({
  order: one(OrderTable, {
    fields: [OrderItemTable.orderId],
    references: [OrderTable.id],
  }),
  product: one(ProductTable, {
    fields: [OrderItemTable.productId],
    references: [ProductTable.id],
  }),
}));
