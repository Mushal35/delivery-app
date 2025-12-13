import React from "react";
import { WarehouseProductCard } from "./WarehouseProductCard";

interface WarehouseProductListProps {
  products: {
    title: string;
    products: {
      id: string;
      name: string;
      imageUrl: string;
      price: string;
      totalStock: number;
      totalSales: number;
    }[];
  }[];
}

const WarehouseProductList = ({ products }: WarehouseProductListProps) => {
  return (
    <div className="space-y-12 overflow-y-auto flex-1">
      {products.map((category) => {
        if (category.products.length === 0) return null;
        return (
          <section key={category.title} className="space-y-6">
            {/* Category Header */}
            <div className="flex items-center justify-between border-b pb-4">
              <h2 className="text-2xl font-bold text-rose-950">
                {category.title}
              </h2>
              <span className="text-sm font-medium text-rose-500 bg-rose-50 px-3 py-1 rounded-full">
                {category.products.length} Items
              </span>
            </div>

            {/* Grid Layout */}
            <ul className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-10">
              {category.products.map((product) => (
                <li key={product.id}>
                  <WarehouseProductCard product={product} />
                </li>
              ))}
            </ul>
          </section>
        );
      })}

      {products.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          No products found in warehouse.
        </div>
      )}
    </div>
  );
};

export default WarehouseProductList;
