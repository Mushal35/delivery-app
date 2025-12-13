import { paymentType } from "@/drizzle/schema";
import z from "zod";

const productSchema = z.object({
  productId: z.string(), // assuming productId is a string
  quantity: z.number().int().positive(), // quantity must be a positive integer
});

export const productsSchema = z.object({
  cart: z.array(productSchema),
  addressId: z.string(),
  paymentType: z.enum(paymentType),
});
