import { Button } from "@/components/ui/button";
import { db } from "@/drizzle/db";
import { ProductCategoryTable, ProductTable } from "@/drizzle/schema";
import CategoryList from "@/features/category/components/CategoryList";
import CreateCategoryDialog from "@/features/warehouse/components/CreateCategoryDialog";
import { sql,eq } from "drizzle-orm";
import { PlusIcon } from "lucide-react";
import { Suspense } from "react";

const SidePage = () => {
  return (
    <div className="w-2xs p-4 border-r space-y-4">
      <CreateCategoryDialog/>
      {/* <Button className="bg-blue-500 flex justify-center items-center w-full">
        <PlusIcon className="align-middle" />
        Create category
      </Button> */}
      <Suspense>
        <SuspendedSidepage />
      </Suspense>
    </div>
  );
};

export default SidePage;

async function SuspendedSidepage() {
  const categories = await getCategories();
  return <CategoryList categories={categories} />;
}

async function getCategories() {
  return await db
    .select({
      id: ProductCategoryTable.id,
      name: ProductCategoryTable.title,
      productCount: sql<number>`COUNT(${ProductTable.id})`,
    })
    .from(ProductCategoryTable)
    .leftJoin(
      ProductTable,
      eq(ProductTable.categoryId, ProductCategoryTable.id)
    )
    .groupBy(ProductCategoryTable.id);
}
