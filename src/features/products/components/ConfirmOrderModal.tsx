"use client";

import { useStore } from "@/providers/StoreProvider";
import { CheckCircle2Icon } from "lucide-react";

export function ConfirmOrderModal({ onClose }: { onClose: () => void }) {
  const { products, resetCart } = useStore();
  const cart = Object.values(products).filter(
    (product) => product.quantity > 0
  );
  const totalPrice = cart.reduce(
    (total, item) => total + item.quantity * item.price,
    0
  );
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center">
      <div className="w-full md:w-xl py-10 px-6 md:px-10 rounded-t-xl md:rounded-xl flex flex-col gap-8 bg-white">
        <div>
          <CheckCircle2Icon className="mb-4 text-green-500 size-8"/>
          <h2 className="mb-2 text-[2.5rem] text-rose-900 font-bold leading-12">
            Order Confirmed
          </h2>
          <p className="text-rose-500">We hope that you like our products!</p>
        </div>

        <div className="bg-rose-50 rounded-lg p-6">
          <ul className="flex flex-col gap-4 mb-6">
            {cart.map((item) => {
              return (
                <li
                  key={item.id}
                  className="flex justify-between items-center border-b border-rose-100 pb-4"
                >
                  <div className="flex gap-4 items-center">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="rounded-sm w-12 h-12"
                    />

                    <div className="flex flex-col gap-4">
                      <p className="text-sm text-rose-900 font-semibold">
                        {item.name}
                      </p>

                      <div className="flex gap-4 text-sm">
                        <span className="text-red font-semibold">
                          x{item.quantity}
                        </span>
                        <span className="text-rose-500">@ ₹{item.price}</span>
                      </div>
                    </div>
                  </div>

                  <span className="text-rose-900 font-semibold">
                    ₹{item.quantity * item.price}
                  </span>
                </li>
              );
            })}
          </ul>

          <div className="flex justify-between text-rose-900">
            <p className="text-sm">Order Total</p>
            <span className="text-2xl font-bold">₹{totalPrice.toFixed(2)}</span>
          </div>
        </div>

        <button
          onClick={() => {
            resetCart();
            onClose();
          }}
          className="cursor-pointer bg-red-500 text-white font-semibold w-full rounded-[62rem] py-4 px-6 hover:bg-[#952C0B] transition-colors ease-in"
        >
          Start New Order
        </button>
      </div>
    </div>
  );
}
