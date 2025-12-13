"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { produce } from "immer";

// Define the product type
interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

// The StoreContext type now uses an object with keys as product IDs
interface StoreContextType {
  products: { [key: string]: Product };
  addProduct: (product: Product) => void;
  updateProductQuantity: (id: string, quantity: number) => void;
  deleteFromCart: (id: string) => void; // Function to set the quantity to zero
  resetCart: () => void; // Function to set the quantity to zero
}

const StoreContext = createContext<StoreContextType>({
  products: {}, // Default to an empty object
  addProduct: () => {},
  updateProductQuantity: () => {},
  deleteFromCart: () => {}, // Default implementation
  resetCart: () => {},
});

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<{ [key: string]: Product }>({});

  const addProduct = (product: Product) => {
    setProducts((prevProducts) =>
      produce(prevProducts, (draft) => {
        draft[product.id] = product; // Mutate draft directly using Immer
      })
    );
  };

  const updateProductQuantity = (id: string, quantity: number) => {
    setProducts((prevProducts) =>
      produce(prevProducts, (draft) => {
        if (draft[id]) {
          draft[id].quantity = quantity; // Mutate quantity directly
        }
      })
    );
  };

  const deleteFromCart = (id: string) => {
    setProducts((prevProducts) =>
      produce(prevProducts, (draft) => {
        if (draft[id]) {
          draft[id].quantity = 0; // Set the quantity to zero
        }
      })
    );
  };

  const resetCart = () => {
    setProducts((prevProducts) =>
      produce(prevProducts, (draft) => {
        for (const key in draft) {
          draft[key].quantity = 0;
        }
      })
    );
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        addProduct,
        updateProductQuantity,
        deleteFromCart,
        resetCart,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
