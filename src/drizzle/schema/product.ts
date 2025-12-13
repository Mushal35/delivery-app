import { relations } from "drizzle-orm";
import { decimal, integer, numeric, pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schemaHelpers";
import { ProductCategoryTable } from "./productCategory";
import { OrderItemTable } from "./orderItem";

export const ProductTable = pgTable("products", {
  id,
  name: varchar().notNull(),
  imageUrl: varchar().notNull(),
  description: text().notNull(),
  price: decimal({ scale: 2 }).notNull(),
  totalStock: integer().notNull().default(0),
  totalSales: integer().notNull().default(0),
  categoryId: uuid()
    .notNull()
    .references(() => ProductCategoryTable.id),
  createdAt,
  updatedAt,
});

export const productRelations = relations(ProductTable, ({ one, many }) => ({
  category: one(ProductCategoryTable, {
    fields: [ProductTable.categoryId],
    references: [ProductCategoryTable.id],
  }),
  orderItems: many(OrderItemTable),
}));
