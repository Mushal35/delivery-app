import { relations } from "drizzle-orm";
import { index, pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schemaHelpers";
import { UserTable } from "./user";
import { OrderTable } from "./order";

export const AgentTable = pgTable(
    "agents",
    {
        id,
        userId: uuid()
            .notNull()
            .references(() => UserTable.id, { onDelete: "cascade" }),
        createdAt,
        updatedAt,
    },
);

export const agentRelations = relations(
    AgentTable,
    ({ one, many }) => ({
        user: one(UserTable, {
            fields: [AgentTable.userId],
            references: [UserTable.id],
        }),
        orders: many(OrderTable),
    }),
);
