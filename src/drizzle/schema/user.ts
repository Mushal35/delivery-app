import { relations } from "drizzle-orm";
import { pgTable, varchar } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schemaHelpers";
import { AddressTable } from "./address";
import { OrderTable } from "./order";
import { UserToRoleTable } from "./role";

export const UserTable = pgTable("users", {
	id,
	name: varchar().notNull(),
	imageUrl: varchar().notNull(),
	email: varchar().notNull().unique(),
    passwordHash: varchar().notNull(),
	createdAt,
	updatedAt,
});

export const userRelations = relations(UserTable, ({ many }) => ({
	orders: many(OrderTable),
	addresses: many(AddressTable),
    userToRoles: many(UserToRoleTable),
}));
