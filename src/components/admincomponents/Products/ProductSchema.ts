import { z } from "zod";

export const ProductSchema = z.object({
  productName: z.string().min(1, { message: "This field is required" }),
  price: z.string().min(1, { message: "This field is required" }),
  gvwr: z.string().min(1, { message: "This field is required" }),
  liftCapacity: z.string().min(1, { message: "This field is required" }),
  liftHeight: z.string().min(1, { message: "This field is required" }),
  container: z.string().min(1, { message: "This field is required" }),
  Down_Payment_Cost__c: z
    .string()
    .min(1, { message: "This field is required" }),
  Meta_Title__c: z
    .string()
    .min(1, { message: "This field is required" })
    .max(255, { message: "Maximum 250 characters Allowed" }),
  // Product_URL__c: z
  //   .string()
  //   .min(1, { message: "This field is required" })
  //   .max(255, { message: "Maximum 250 characters Allowed" }),
});
