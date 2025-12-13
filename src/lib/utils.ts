import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import z from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getZodKeys<K extends z.ZodObject>(schema: K): (keyof z.infer<K>)[] {
  return Object.keys(schema.shape) as (keyof z.infer<K>)[];
}
