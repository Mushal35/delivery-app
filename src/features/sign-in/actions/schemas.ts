import { getZodKeys } from "@/lib/utils";
import { Path } from "react-hook-form";
import z from "zod";

const loginSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export const combinedSchema = loginSchema;
const schemas = [loginSchema];
type CombinedSchemaType = z.infer<typeof combinedSchema>;
export const stepFields = schemas.map((schema) =>
  getZodKeys(schema)
) as Path<CombinedSchemaType>[][];
