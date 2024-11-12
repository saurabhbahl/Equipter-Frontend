import { z } from "zod";

export interface IAccessories {
  name: string;
  description: string;
  price: string;
  quantity: string;
}
export const AccessoriesSchema = z.object({
  name: z.string({message:"This field is required"}).min(3, "Minimum 3 characters required"),
  description: z.string().min(3, "This field is required"),
  price: z.number().min(1, "This field is required"),
  quantity: z.number().min(1, "This field is required"),
});
