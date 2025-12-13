import { PackageIcon } from "lucide-react";
import Link from "next/link";

type WarehouseProduct = {
  id: string;
  name: string;
  imageUrl: string;
  price: string;
  totalStock: number;
  totalSales: number;
};

export function WarehouseProductCard({ product }: { product: WarehouseProduct }) {
  // logic to determine low stock styling (optional)
  const stockCount = product.totalStock-product.totalSales;
  const isLowStock = stockCount < 10; 

  return (
    <Link href={`/admin/warehouse/${product.id}`} className="group">
      <div className="relative mb-8 transition-transform duration-300 group-hover:-translate-y-1">
        <div className="rounded-lg border-2 border-transparent overflow-hidden group-hover:border-rose-200 transition-colors">
          <picture>
            <source srcSet={product.imageUrl} />
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              className="w-full aspect-square object-cover" 
            />
          </picture>
        </div>

        {/* Floating Pill - Adapted for Stock Display */}
        <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2">
          <div
            className={`
              border-[1.5px] rounded-[62rem] px-6 py-3 min-w-[140px] 
              flex items-center justify-center gap-2 bg-white font-semibold 
              whitespace-nowrap shadow-sm transition-colors
              ${isLowStock ? 'border-red-500 text-red-600' : 'border-rose-400 text-rose-900 group-hover:bg-rose-50'}
            `}
          >
            <PackageIcon className="w-4 h-4" />
            <span>Stock: {stockCount}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center md:text-left">
        {/* We don't need category here as it is grouped in the list, 
            so we display ID or SKU instead */}
        <span className="text-sm text-muted-foreground">ID: {product.id.slice(0, 8)}</span>
        
        <p className="text-base text-rose-900 font-semibold truncate group-hover:text-rose-600 transition-colors">
          {product.name}
        </p>
        
        <span className="text-base text-rose-500 font-semibold">
          ₹{product.price}
        </span>
      </div>
    </Link>
  );
}