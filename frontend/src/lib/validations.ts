import { z } from "zod";
export const checkoutSchema = z.object({
  name: z.string().min(2, "Enter your name"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian phone number"),
  address: z.string().min(8, "Enter a complete address"),
  landmark: z.string().optional(),
  delivery: z.enum(["home", "pickup"]),
  payment: z.enum(["cod", "placeholder"])
});
export type CheckoutValues = z.infer<typeof checkoutSchema>;
