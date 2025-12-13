import { db } from "@/drizzle/db";
import { ProductTable, UserToRoleTable } from "@/drizzle/schema";
import EditProductPage from "@/features/warehouse/components/EditProductForm";
import { getCurrentUser } from "@/services/next-auth/lib/getCurrentAuth";
import { hasRole } from "@/utils/rbac";
import { eq } from "drizzle-orm/sql";
import { Suspense } from "react";

export default function ProductPage({
  params,
}: PageProps<"/admin/warehouse/[productId]">) {
  return (
    <Suspense>
      <SuspendedPage params={params} />
    </Suspense>
  );
}

async function SuspendedPage({
  params,
}: {
  params: Promise<{
    productId: string;
  }>;
}) {
  const { productId } = await params;
  const { userId } = await getCurrentUser();
  if (!userId) return null;
  const roles = await getRoles(userId);
  if (
    !hasRole(
      roles.map((role) => role.role.name),
      ["admin"]
    )
  )
    return null;
  const product = await getProduct(productId);
  const categories = await getCategories();
  return <EditProductPage product={product} categories={categories} />;
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

async function getProduct(productId: string) {
  return await db.query.ProductTable.findFirst({
    where: eq(ProductTable.id, productId),
    columns: {
      createdAt: false,
      updatedAt: false,
    },
  });
}

async function getCategories() {
  return await db.query.ProductCategoryTable.findMany({
    columns: { id: true, title: true },
  });
}
