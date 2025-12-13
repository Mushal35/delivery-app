import { getZodKeys } from "@/lib/utils";
import { Path } from "react-hook-form";
import z from "zod";

const enrollmentSchema = z.object({
  addressLine: z.string().min(1),
  pincode: z
    .string()
    .length(6, "Pin code must be exactly 6 characters long")
    .regex(/^\d{6}$/, "Pin code must consist of only numbers"),
});

export const combinedSchema = enrollmentSchema;
type CombinedSchemaType = z.infer<typeof combinedSchema>;
const schemas = [enrollmentSchema]

export const stepFields = schemas.map((schema) =>
    getZodKeys(schema)
  ) as Path<CombinedSchemaType>[][];