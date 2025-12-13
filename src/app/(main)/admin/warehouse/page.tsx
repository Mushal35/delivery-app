import { db } from "@/drizzle/db";
import { ProductCategoryTable } from "@/drizzle/schema";
import { searchWarehouseSchema } from "@/features/warehouse/actions/schema";
import WarehouseProductList from "@/features/warehouse/components/WarehouseProductList";
import { and, eq } from "drizzle-orm/sql";
import React, { Suspense } from "react";

const page = ({ searchParams }: PageProps<"/admin/warehouse">) => {
  return (
    <div className="flex-1 flex gap-2 p-2">
      <Suspense>
        <SuspendedPage searchParams={searchParams} />
      </Suspense>
    </div>
  );
};

export default page;

const SuspendedPage = async ({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) => {
  const params = await searchParams;
  const { success, data } = searchWarehouseSchema.safeParse(params);
  const search = success ? data : {};
  const products = await getProducts(search);
  return <WarehouseProductList products={products} />;
};

async function getProducts(search: Record<string, string | undefined>) {
  const { category } = search;
  const filters = [];
  if (category) filters.push(eq(ProductCategoryTable.title, category));
  return await db.query.ProductCategoryTable.findMany({
    where: and(...filters),
    columns: {
      title: true,
    },
    with: {
      products: {
        columns: {
          id: true,
          name: true,
          price: true,
          imageUrl: true,
          totalStock: true,
          totalSales: true,
        },
      },
    },
  });
}
