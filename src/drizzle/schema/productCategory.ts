import { relations } from "drizzle-orm";
import { pgTable, varchar } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schemaHelpers";
import { ProductTable } from "./product";

export const ProductCategoryTable = pgTable(
    "product_categories",
    {
        id,
        title: varchar().notNull(),
        description: varchar().notNull(),
        createdAt,
        updatedAt,
    },
);

export const productCategoryRelations = relations(
    ProductCategoryTable,
    ({ many }) => ({
        products: many(ProductTable),
    }),
);
