"use server";
import z from "zod";
import { createCategorySchema, productFormSchema } from "./schema";
import { getCurrentUser } from "@/services/next-auth/lib/getCurrentAuth";
import { db } from "@/drizzle/db";
import {
  ProductCategoryTable,
  ProductTable,
  UserToRoleTable,
} from "@/drizzle/schema";
import { eq, sql } from "drizzle-orm/sql";
import { hasRole } from "@/utils/rbac";
import fs from "node:fs/promises";
import path from "node:path";
import { v4 as uuidv4 } from "uuid";

export async function createCategoryAction(
  unsafeData: z.infer<typeof createCategorySchema>
) {
  const { userId } = await getCurrentUser();
  if (!userId)
    return {
      error: true,
      message: "Not Authenticated",
    };
  const roles = await getRoles(userId);
  if (
    !hasRole(
      roles.map((role) => role.role.name),
      ["admin"]
    )
  )
    return {
      error: true,
      message: "Not Authorized",
    };
  const { success, data } = createCategorySchema.safeParse(unsafeData);
  if (!success)
    return {
      error: true,
      message: "Invalid Data",
    };
  await db
    .insert(ProductCategoryTable)
    .values({
      ...data,
    })
    .onConflictDoNothing();
  return { error: false, message: "Product category created successfully" };
}

async function getRoles(userId: string) {
  return await db.query.UserToRoleTable.findMany({
    where: eq(UserToRoleTable.userId, userId),
    columns: {},
    with: {
      role: {
        columns: {
          name: true,
        },
      },
    },
  });
}

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

const ALLOWED_EXTENSIONS = ALLOWED_MIME_TYPES.map((mimeType) =>
  mimeType.split("/").pop()
);

export async function uploadProductImage(formData: FormData): Promise<
  | {
      error: true;
      message: string;
    }
  | {
      error: false;
      message: string;
      filePath: string;
    }
> {
  const { userId } = await getCurrentUser();
  if (!userId)
    return {
      error: true,
      message: "Not Authenticated",
    };
  const roles = await getRoles(userId);
  if (
    !hasRole(
      roles.map((role) => role.role.name),
      ["admin"]
    )
  )
    return {
      error: true,
      message: "Not Authorized",
    };

  const file = formData.get("file") as File | null;

  if (!file) {
    throw new Error("No file uploaded");
  }

  // 1️⃣ Validate MIME type
  if (!ALLOWED_MIME_TYPES.includes(file.type))
    return {
      error: true,
      message: "Invalid file type",
    };

  // 2️⃣ Validate extension
  const originalName = file.name;
  const ext = originalName.split(".").pop()?.toLowerCase();

  if (!ext || !ALLOWED_EXTENSIONS.includes(ext))
    return {
      error: true,
      message: "Invalid file extension",
    };

  // 3️⃣ Generate safe filename using UUID
  const filename = `${uuidv4()}.${ext}`;

  const uploadDir = path.join(process.cwd(), "public", "uploads");

  // Ensure directory exists
  await fs.mkdir(uploadDir, { recursive: true });

  const filePath = path.join(uploadDir, filename);

  // Convert File → Buffer
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Write file
  await fs.writeFile(filePath, buffer);

  // Publicly accessible path
  return {
    error: false,
    message: "Image Uploaded Successfully",
    filePath: `/uploads/${filename}`,
  };
}

export async function updateProduct(
  id: string,
  unsafeData: z.infer<typeof productFormSchema>
) {
  const { userId } = await getCurrentUser();
  if (!userId) return { error: true, message: "Not Authenticated" };

  const roles = await getRoles(userId);
  if (
    !hasRole(
      roles.map((r) => r.role.name),
      ["admin"]
    )
  ) {
    return { error: true, message: "Not Authorized" };
  }

  const { success, data } = productFormSchema.safeParse(unsafeData);
  if (!success) return { error: true, message: "Invalid Data" };

  try {
    return await db.transaction(async (tx) => {
      // 1. Fetch current record to check sales vs new stock
      const [dbProduct] = await tx
        .select()
        .from(ProductTable)
        .where(eq(ProductTable.id, id))
        .for("update");

      if (!dbProduct) return { error: true, message: "Product not found" };

      // 2. Logic: Total Stock cannot be less than what has already been sold
      if (data.totalStock < dbProduct.totalSales) {
        return {
          error: true,
          message: `Cannot reduce total stock below total sales (${dbProduct.totalSales}).`,
        };
      }

      // 3. Update all fields
      await tx
        .update(ProductTable)
        .set({
          name: data.name,
          description: data.description,
          price: data.price, // Ensure your schema handles string/decimal conversion
          totalStock: data.totalStock,
          categoryId: data.categoryId,
          imageUrl: data.imageUrl,
        })
        .where(eq(ProductTable.id, id));

      return { error: false, message: "Product updated successfully" };
    });
  } catch (error) {
    console.error(error);
    return { error: true, message: "Database update failed" };
  }
}

export async function createProduct(
  unsafeData: z.infer<typeof productFormSchema>
) {
  const { userId } = await getCurrentUser();
  if (!userId)
    return {
      error: true,
      message: "Not Authenticated",
    };
  const roles = await getRoles(userId);
  if (
    !hasRole(
      roles.map((role) => role.role.name),
      ["admin"]
    )
  )
    return {
      error: true,
      message: "Not Authorized",
    };
  const { success, data } = productFormSchema.safeParse(unsafeData);
  if (!success)
    return {
      error: true,
      message: "Invalid Data received",
    };

  try {
    // 4️⃣ DB Insertion
    await db.insert(ProductTable).values({
      ...data,
    });
    return { error: false, message: "Product created successfully" };
  } catch (error) {
    return { error: true, message: "Failed to create product in database" };
  }
}
