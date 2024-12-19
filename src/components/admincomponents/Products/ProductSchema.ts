import { z } from "zod";


export const ProductSchema = z.object({
  productName: z.string().min(1, { message: "This field is required" }),
  qty: z.string().min(1, { message: "This field is required" }),
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
  Product_Title__c: z.string().min(1, { message: "This field is required" }),
  Product_Description__c: z
    .string()
    .min(1, { message: "This field is required" }).max(600,{message: "Max words is 600"}),
});


export type TImage = {
  id: string;
  product_id: string;
  image_url: string;
  image_description: string | null;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
};

export interface IAccessoryImage {
  id: string;
  accessory_id: string;
  image_url: string;
  image_description: string | null;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface IAccessory {
  id: string;
  name: string;
  description: string;
  meta_title: string;
  accessory_title: string;
  accessory_url: string;
  price: string;
  stock_quantity: string;
  created_at: string;
  updated_at: string;
  product_id: string;
  images: IAccessoryImage[];
}

export interface IProduct {
  id: string;
  name: string;
  description: string;
  gvwr: string;
  lift_capacity: string;
  lift_height: string;
  product_title: string;
  product_url: string;
  container_capacity: string;
  price: string;
  downpayment_cost: string;
  meta_title: string;
  stock_quantity: string;
  created_at: string;
  updated_at: string;
  images: TImage[];
  accessories: IAccessory[];
}
