"use server";

import z from "zod";
import { combinedSchema } from "./schemas";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { db } from "@/drizzle/db";
import { RoleTable, UserTable, UserToRoleTable } from "@/drizzle/schema";

export async function signupHandler(
  unsafeData: z.infer<typeof combinedSchema>
) {
  // 1. Validation
  const { success, data } = combinedSchema.safeParse(unsafeData);
  if (!success) return { error: true, message: "Invalid data" };

  const { name, email, password } = data;

  // 2. Parallel Reads (Optimization: Fetch Role & Check User simultaneously)
  const [existingUser, userRole] = await Promise.all([
    db.query.UserTable.findFirst({
      where: eq(UserTable.email, email),
      columns: { id: true }, // Optimization: Only fetch ID
    }),
    db.query.RoleTable.findFirst({
      where: eq(RoleTable.name, "user"),
      columns: { id: true }, // Optimization: Only fetch ID
    }),
  ]);

  // 3. Fail Fast
  if (existingUser) {
    return { error: true, message: "User email already exists" };
  }

  // 4. Hashing (Only run this after checks pass to save CPU)
  const passwordHash = await bcrypt.hash(password, 10);

  // 5. Transaction (Optimization: Only contains writes, no reads)
  await db.transaction(async (tx) => {
    // Insert User
    const [newUser] = await tx
      .insert(UserTable)
      .values({
        name,
        email,
        passwordHash,
        imageUrl: "",
      })
      .returning({ id: UserTable.id }); // Optimization: Only return needed ID

    // Insert Role Link (if role exists)
    if (userRole) {
      await tx.insert(UserToRoleTable).values({
        userId: newUser.id,
        roleId: userRole.id,
      });
    }
  });

  return { error: false, message: "User registered successfully" };
}
