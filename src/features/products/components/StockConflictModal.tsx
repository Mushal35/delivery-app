"use client";

import { useStore } from "@/providers/StoreProvider";
import { AlertTriangleIcon, ArrowRightIcon } from "lucide-react";

type StockErrorItem = {
  productId: string;
  requestedQuantity: number;
  availableStock: number;
};

interface StockConflictModalProps {
  onClose: () => void;
  unavailableItems: StockErrorItem[];
}

export function StockConflictModal({ onClose, unavailableItems }: StockConflictModalProps) {
  const { products } = useStore();

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
      <div className="w-full md:w-xl py-10 px-6 md:px-10 rounded-t-xl md:rounded-xl flex flex-col gap-8 bg-white max-h-[90vh] overflow-y-auto">
        <div>
          <div className="bg-amber-100 w-fit p-3 rounded-full mb-4">
            <AlertTriangleIcon className="text-amber-600 size-8" />
          </div>
          <h2 className="mb-2 text-[2.5rem] text-rose-900 font-bold leading-tight">
            Stock Adjusted
          </h2>
          <p className="text-rose-500">
            Some items are no longer available in the quantity requested. We've updated your cart to the maximum available stock.
          </p>
        </div>

        <div className="bg-rose-50 rounded-lg p-6">
          <ul className="flex flex-col gap-4">
            {unavailableItems.map((item) => {
              const product = products[item.productId];
              if (!product) return null;

              return (
                <li
                  key={item.productId}
                  className="flex justify-between items-center border-b border-rose-100 last:border-0 pb-4 last:pb-0"
                >
                  <div className="flex gap-4 items-center">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="rounded-md w-14 h-14 object-cover border border-rose-200"
                    />

                    <div className="flex flex-col gap-1">
                      <p className="text-sm text-rose-900 font-bold leading-none">
                        {product.name}
                      </p>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-rose-400 line-through">
                          Requested: {item.requestedQuantity}
                        </span>
                        <ArrowRightIcon className="size-3 text-rose-400" />
                        <span className="text-red-600 font-bold">
                          Available: {item.availableStock}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-rose-900 font-bold">
                      ₹{(item.availableStock * product.price).toFixed(2)}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <button
          onClick={onClose}
          className="cursor-pointer bg-rose-900 text-white font-semibold w-full rounded-[62rem] py-4 px-6 hover:bg-rose-800 transition-all active:scale-[0.98]"
        >
          Got it, Review Cart
        </button>
      </div>
    </div>
  );
}