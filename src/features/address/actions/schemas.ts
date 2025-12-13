import z from "zod";

export const addDeliveryAddressSchema = z.object({
  addressLine: z.string(),
  pincode: z.string(),
});
