"use server";

import z from "zod";
import { combinedSchema } from "./schemas";
import { getCurrentUser } from "@/services/next-auth/lib/getCurrentAuth";
import { db } from "@/drizzle/db";
import {
  AddressTable,
  AgentTable,
  RoleTable,
  UserToRoleTable,
} from "@/drizzle/schema";
import { eq } from "drizzle-orm/sql";

export async function registerPartner(
  unsafeData: z.infer<typeof combinedSchema>
) {
  // 1. Validation
  const { success, data } = combinedSchema.safeParse(unsafeData);
  if (!success) return { error: true, message: "Invalid Data" };

  const { userId } = await getCurrentUser();
  if (!userId) return { error: true, message: "Not Authenticated" };

  // 2. OPTIMIZATION: Run independent reads in parallel
  // This cuts the initial waiting time roughly in half.
  const [existingAgent, role] = await Promise.all([
    db.query.AgentTable.findFirst({
      where: eq(AgentTable.userId, userId),
      columns: { id: true },
    }),
    db.query.RoleTable.findFirst({
      where: eq(RoleTable.name, "agent"),
      columns: { id: true },
    }),
  ]);

  // 3. Logic Checks
  if (existingAgent) {
    return { error: true, message: "You are already registered as a partner." };
  }

  if (!role) {
    return { error: true, message: "System Error: Role not found." };
  }

  try {
    // 4. Transaction
    await db.transaction(async (tx) => {
      await Promise.all([
        tx.insert(AddressTable).values({
          ...data,
          type: "user",
          userId,
        }),
        // Safety net: onConflictDoNothing handles race conditions
        tx.insert(AgentTable).values({ userId }).onConflictDoNothing(),
        tx
          .insert(UserToRoleTable)
          .values({ userId, roleId: role.id }) // role.id is safe here (no '?')
          .onConflictDoNothing(),
      ]);
    });

    return { error: false, message: "Partner registered successfully" };
  } catch (error) {
    console.error("Partner registration error:", error);
    return { error: true, message: "Failed to register partner" };
  }
}
