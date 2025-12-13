import { pgTable, varchar, primaryKey, unique, uuid } from "drizzle-orm/pg-core";
import { UserTable } from "./user"; // Assuming UserTable is imported
import { createdAt, id, updatedAt } from "../schemaHelpers"; // Assuming this is defined
import { relations } from "drizzle-orm";

export const RoleTable = pgTable("roles", {
    id, 
    name: varchar().notNull(),
    createdAt,
    updatedAt,
}, (table) => [
    unique("user_tag_unique").on(table.name),
]);

export const UserToRoleTable = pgTable("user_to_role", {
    userId: uuid()
        .notNull()
        .references(() => UserTable.id, { onDelete: 'cascade' }),
    roleId: uuid()
        .notNull()
        .references(() => RoleTable.id, { onDelete: 'cascade' }),
        
}, (table) => [
    primaryKey({ columns: [table.userId, table.roleId] }),
]);

export const userToRoleRelations = relations(UserToRoleTable, ({ one }) => ({
    user: one(UserTable, {
        fields: [UserToRoleTable.userId],
        references: [UserTable.id],
    }),
    role: one(RoleTable, {
        fields: [UserToRoleTable.roleId],
        references: [RoleTable.id],
    }),
}));

export const roleRelations = relations(RoleTable, ({ many }) => ({
    userToRoles: many(UserToRoleTable),
}));