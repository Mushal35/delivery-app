"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useTransition,
} from "react";
import { addDeliveryAddress, getDeliveryAddresses } from "../actions/actions";
import { AddressTable } from "@/drizzle/schema";
import { addDeliveryAddressSchema } from "../actions/schemas";
import z from "zod";

type Address = Pick<
  typeof AddressTable.$inferSelect,
  "id" | "addressLine" | "pincode"
>;

interface AddressContextType {
  addresses: Address[];
  addAddress: (newAddr: any) => Promise<void>; // Updated to accept payload from Modal
  loading: boolean;
  isSaving: boolean; // Useful for showing spinner during save
}

const AddressContext = createContext<AddressContextType | undefined>(undefined);

export function AddressProvider({ children }: { children: ReactNode }) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition(); // For managing Server Action state

  // 1. Fetch addresses on mount
  useEffect(() => {
    const init = async () => {
      try {
        const response = await getDeliveryAddresses();
        if (!response.data) return;
        const data = response.data;
        setAddresses(data);
      } catch (error) {
        console.error("Failed to load addresses:", error);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  // 2. Add Address function (Calls Server Action)
  const addAddress = async (
    addressData: z.infer<typeof addDeliveryAddressSchema>
  ) => {
    startTransition(async () => {
      try {
        // Call Server Action
        const savedAddress = await addDeliveryAddress(addressData);
        if(savedAddress.data) setAddresses((prev) => [...prev, savedAddress.data]);
      } catch (error) {
        console.error("Failed to save address:", error);
        alert("Failed to save address. Please try again.");
      }
    });
  };

  return (
    <AddressContext.Provider
      value={{ addresses, addAddress, loading, isSaving: isPending }}
    >
      {children}
    </AddressContext.Provider>
  );
}

export const useAddress = () => {
  const context = useContext(AddressContext);
  if (!context) {
    throw new Error("useAddress must be used within an AddressProvider");
  }
  return context;
};
