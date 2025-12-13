import { z } from "zod";

export const searchWarehouseSchema = z.object({
  category: z.string().trim().optional(),
});

export const createCategorySchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
});

export const productFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string(),
  price: z
    .string()
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "Price must be a positive number",
    }),
  totalStock: z.number(),
  imageUrl: z.string(),
  categoryId: z.string("Please select a valid category"), // Added category validation
});
