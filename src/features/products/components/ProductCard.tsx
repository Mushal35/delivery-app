"use client";
import { useStore } from "@/providers/StoreProvider";
import { ShoppingBasketIcon } from "lucide-react";
import { useEffect } from "react";

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  imageUrl: string;
};

export function ProductCard({ product }: { product: Product }) {
  const { products, updateProductQuantity, addProduct } = useStore();
  const cartQuantity = products[product.id]?.quantity || 0;
  useEffect(() => {
    if (!products[product.id]) addProduct({ ...product, quantity: 0 });
  }, []);
  const handleAddToCart = () => {
    updateProductQuantity(product.id, cartQuantity + 1); // If it's in the cart, increment the quantity
  };
  const handleRemoveFromCart = () => {
    updateProductQuantity(product.id, cartQuantity - 1); // If quantity is more than 1, just decrement the quantity
  };
  return (
    <article>
      <div className="relative mb-8">
        <div
          className={
            cartQuantity === 0
              ? "rounded-lg border-2 border-transparent overflow-hidden"
              : "rounded-lg border-2 border-red overflow-hidden"
          }
        >
          <picture>
            <source srcSet={product.imageUrl} />
            <img src={product.imageUrl} alt={product.name} className="w-full" />
          </picture>
        </div>
        <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2">
          {cartQuantity === 0 ? (
            <button
              onClick={handleAddToCart}
              className="border-rose-400 border-[1.5px] rounded-[62rem] px-7 md:px-5 py-3 md:w-40 flex items-center gap-2 bg-white text-rose-900 font-semibold cursor-pointer hover:border-red hover:text-red transition-colors ease-in whitespace-nowrap"
            >
              <ShoppingBasketIcon />
              <span>Add to Cart</span>
            </button>
          ) : (
            <div className="flex justify-between items-center w-40 p-3 gap-2 border-red border-[1.5px] rounded-[62rem] text-white bg-red-500">
              <button
                onClick={handleRemoveFromCart}
                className="w-5 h-5 border border-white rounded-full flex items-center justify-center hover:bg-white hover:text-red transition-colors ease-in"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="10"
                  height="2"
                  fill="none"
                  viewBox="0 0 10 2"
                >
                  <path fill="currentColor" d="M0 .375h10v1.25H0V.375Z" />
                </svg>
              </button>
              <span>{cartQuantity}</span>
              <button
                onClick={handleAddToCart}
                className="w-5 h-5 border border-white rounded-full flex items-center justify-center hover:bg-white hover:text-red transition-colors ease-in"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="10"
                  height="10"
                  fill="none"
                  viewBox="0 0 10 10"
                >
                  <path
                    fill="currentColor"
                    d="M10 4.375H5.625V0h-1.25v4.375H0v1.25h4.375V10h1.25V5.625H10v-1.25Z"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      <div>
        <span className="text-sm text-rose-500">{product.category}</span>
        <p className="text-base text-rose-900 font-semibold">{product.name}</p>
        <span className="text-base text-red font-semibold">
          ₹{product.price}
        </span>
      </div>
    </article>
  );
}
