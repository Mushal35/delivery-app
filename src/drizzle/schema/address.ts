import { relations } from "drizzle-orm";
import { boolean, foreignKey, pgEnum, pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schemaHelpers";
import { UserTable } from "./user";
import { OrderTable } from "./order";

export const addressType = [
  "delivery",
  "user"
] as const
export type AddressType = (typeof addressType)[number]
export const addressTypeEnum = pgEnum(
  "address_type",
  addressType
)

export const AddressTable = pgTable(
    "addresses",
    {
        id,
        userId: uuid()
            .notNull()
            .references(() => UserTable.id, { onDelete: "cascade" }),
        addressLine: varchar().notNull(),
        pincode: varchar().notNull(),
        active: boolean().notNull().default(true),
        type: addressTypeEnum().notNull(),
        ref: uuid(),
        createdAt,
        updatedAt,
    },
    (table) => ([
        foreignKey({
            columns: [table.ref],
            foreignColumns: [table.id],
        }),
    ])
);

export const addressRelations = relations(
    AddressTable,
    ({ one, many }) => ({
        user: one(UserTable, {
            fields: [AddressTable.userId],
            references: [UserTable.id],
        }),
        orders: many(OrderTable),
    }),
);
