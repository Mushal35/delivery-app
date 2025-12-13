import { db } from "@/drizzle/db";
import { AddressProvider } from "@/features/address/components/AddressProvider";
import ProductList from "@/features/products/components/ProductList";
import { StoreCart } from "@/features/products/components/StoreCart";
import { StoreProvider } from "@/providers/StoreProvider";
import { Suspense } from "react";

const page = () => {
  return (
    <div className="font-redhat relative h-screen w-full overflow-scroll bg-rose-50/50">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 py-8 px-6 max-w-7xl mx-auto">
        <AddressProvider>
          <StoreProvider>
            <main className="lg:col-span-2 flex flex-col gap-8">
              <h1 className="text-[2.5rem] font-bold leading-12">Products</h1>
              <Suspense>
                <SuspendedPage />
              </Suspense>
            </main>
            <aside>
              <StoreCart />
            </aside>
          </StoreProvider>
        </AddressProvider>
      </div>
    </div>
  );
};

export default page;

const SuspendedPage = async () => {
  const products = await getProducts();
  return <ProductList data={products} />;
};

async function getProducts() {
  const data = await db.query.ProductCategoryTable.findMany({
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
        },
      },
    },
  });
  const products = data.flatMap((el) =>
    el.products.map((p) => ({
      ...p,
      category: el.title,
      price: +p.price,
    }))
  );

  return products;
}
