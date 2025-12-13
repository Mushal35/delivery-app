"use client";
import { useStore } from "@/providers/StoreProvider";
import { MapPin, Plus, ShoppingBagIcon, TreePalmIcon } from "lucide-react";
import { placeOrder } from "../actions/actions";
import { useEffect, useState } from "react";
import { AddressModal } from "@/features/address/components/AddressModal";
import { useAddress } from "@/features/address/components/AddressProvider";
import { ConfirmOrderModal } from "./ConfirmOrderModal";
import { StockConflictModal } from "./StockConflictModal";

type StockErrorItem = {
  productId: string;
  requestedQuantity: number;
  availableStock: number;
};

export function StoreCart() {
  const { products, deleteFromCart, updateProductQuantity } = useStore(); // Access cart-related data from context
  const cart = Object.values(products).filter(
    (product) => product.quantity > 0
  ); // Assuming cart items are in products
  const totalPrice = cart.reduce(
    (total, item) => total + item.quantity * item.price,
    0
  ); // Calculate the total price
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0); // Calculate the total number of items
  const { addresses, addAddress } = useAddress(); // Get addresses from your hook

  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [stockErrorItems, setStockErrorItems] = useState<StockErrorItem[]>([]);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);

  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
      setSelectedAddressId(addresses[0].id);
    }
  }, [addresses, selectedAddressId]);

  // Delete product from cart by ID
  const handleDeleteFromCart = (id: string) => {
    deleteFromCart(id); // Assuming deleteFromCart accepts an id
  };

  // Confirm the order
  const handleConfirmOrder = async () => {
    const response = await placeOrder({
      paymentType: "online",
      addressId: selectedAddressId,
      cart: cart.map((product) => ({
        productId: product.id,
        quantity: product.quantity,
      })),
    });

    if (response.error === false) setIsConfirmationModalOpen(true);
    if (response.error === true) {
      if (response.unavailableItems) {
        const unavailableItems = response.unavailableItems;
        for (const item of unavailableItems) {
          updateProductQuantity(item.productId, item.availableStock);
        }
        setStockErrorItems(unavailableItems);
        setIsStockModalOpen(true);
      }
    }
  };

  return (
    <>
      <div className="p-6 bg-white rounded-xl flex flex-col gap-6">
        <h2 className="text-2xl text-red font-bold">
          Your Cart ({totalItems})
        </h2>

        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-4 gap-4">
            <ShoppingBagIcon />
            <p className="text-sm text-rose-500 font-semibold">
              Your added items will appear here
            </p>
          </div>
        ) : (
          <div>
            <ul>
              {cart.map((item) => (
                <li
                  key={item.id}
                  className="pb-4 border-b border-rose-100 mb-4 flex justify-between items-center"
                >
                  <div className="flex flex-col gap-2">
                    <h3 className="text-sm font-semibold text-rose-900">
                      {item.name}
                    </h3>
                    <div className="flex gap-2 items-center text-sm">
                      <span className="font-semibold text-red">
                        {item.quantity}x
                      </span>
                      <span className="text-rose-500">@ ₹{item.price}</span>
                      <span className="font-semibold text-rose-500">
                        ₹{item.quantity * item.price}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteFromCart(item.id)}
                    className="border rounded-full p-1 border-rose-400 text-rose-400 hover:border-rose-900 hover:text-rose-900 transition-colors ease-in"
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
                        d="M8.375 9.375 5 6 1.625 9.375l-1-1L4 5 .625 1.625l1-1L5 4 8.375.625l1 1L6 5l3.375 3.375-1 1Z"
                      />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
            {/* --- ADDRESS SELECTION SECTION --- */}
            <div className="pt-2">
              <div className="flex justify-between items-center mb-3">
                <p className="text-sm font-semibold text-rose-900 flex items-center gap-2">
                  <MapPin size={16} /> Delivery Address
                </p>
                <button
                  onClick={() => setIsAddressModalOpen(true)}
                  className="text-xs text-red-500 font-semibold hover:underline"
                >
                  + Add New
                </button>
              </div>

              {addresses.length > 0 ? (
                <select
                  value={selectedAddressId}
                  onChange={(e) => setSelectedAddressId(e.target.value)}
                  className="w-full p-3 bg-rose-50 border border-rose-200 rounded-lg text-sm text-rose-900 focus:outline-none focus:border-red-500"
                >
                  {addresses.map((addr) => (
                    <option key={addr.id} value={addr.id}>
                      {addr.addressLine} - {addr.pincode}
                    </option>
                  ))}
                </select>
              ) : (
                <div
                  onClick={() => setIsAddressModalOpen(true)}
                  className="w-full p-4 border-2 border-dashed border-rose-200 rounded-lg bg-rose-50 flex items-center justify-center gap-2 cursor-pointer hover:bg-rose-100 transition"
                >
                  <Plus size={16} className="text-rose-400" />
                  <span className="text-sm text-rose-500 font-medium">
                    Add Delivery Address
                  </span>
                </div>
              )}
            </div>
            {/* --- ADDRESS SELECTION SECTION --- */}
            <div className="mt-6 flex justify-between items-center">
              <p className="text-sm text-rose-900">Order Total</p>
              <span className="text-2xl font-bold">
                ₹{totalPrice.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-center items-center gap-2 bg-rose-50 rounded-lg p-4 my-6">
              <TreePalmIcon className="text-green-500" />
              <p>
                This is a{" "}
                <span className="text-rose-900 font-semibold">
                  carbon-neutral
                </span>{" "}
                delivery
              </p>
            </div>
            <button
              onClick={handleConfirmOrder}
              className="cursor-pointer bg-red-500 text-white font-semibold w-full rounded-[62rem] py-4 px-6 hover:bg-[#952C0B] transition-colors ease-in"
            >
              Confirm Order
            </button>
          </div>
        )}
      </div>
      {/* --- ADD ADDRESS POPUP MODAL --- */}
      {isAddressModalOpen && (
        <AddressModal
          onClose={() => setIsAddressModalOpen(false)}
          onAdd={addAddress}
        />
      )}
      {isConfirmationModalOpen && (
        <ConfirmOrderModal onClose={() => setIsConfirmationModalOpen(false)} />
      )}
      {isStockModalOpen && (
        <StockConflictModal
          unavailableItems={stockErrorItems}
          onClose={() => setIsStockModalOpen(false)}
        />
      )}
    </>
  );
}
