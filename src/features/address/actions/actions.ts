"use server";

import { db } from "@/drizzle/db";
import { AddressTable } from "@/drizzle/schema";
import { getCurrentUser } from "@/services/next-auth/lib/getCurrentAuth";
import { and, eq } from "drizzle-orm";
import { addDeliveryAddressSchema } from "./schemas";
import z from "zod";

export async function getDeliveryAddresses() {
  const { userId } = await getCurrentUser();

  if (!userId) {
    return {
      success: false,
      message: "Not Authenticated",
    };
  }

  const addresses = await db.query.AddressTable.findMany({
    where: and(
      eq(AddressTable.userId, userId),
      eq(AddressTable.type, "delivery"),
      eq(AddressTable.active, true)
    ),
    columns: {
      id: true,
      addressLine: true,
      pincode: true,
    },
  });

  return {
    success: true,
    data: addresses,
  };
}

export async function addDeliveryAddress(
  unsafeData: z.infer<typeof addDeliveryAddressSchema>
) {
  const { userId } = await getCurrentUser();
  if (!userId)
    return {
      success: false,
      message: "Not Authenticated",
    };
  const { success, data } = addDeliveryAddressSchema.safeParse(unsafeData);
  if (!success)
    return {
      success: false,
      message: "Invalid Data",
    };
  const result = await db
    .insert(AddressTable)
    .values({ ...data, userId, type: "delivery", active: true })
    .returning({
      id: AddressTable.id,
      addressLine: AddressTable.addressLine,
      pincode: AddressTable.pincode,
    });
  return { success: true, data: result[0] };
}
