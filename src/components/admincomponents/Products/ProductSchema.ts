import { z } from "zod";
import { Accessory } from "../Accessories/AccessoriesSchema";

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



// ProductSchema.ts
export interface ProductImageAttributes {
  type: string;
  url: string;
}

export interface ProductImage {
  attributes: ProductImageAttributes;
  Id: string;
  Image_URL__c: string;
  Is_Featured__c: boolean;
  Product_Id__c: string;
  Name: string;
  Image_Description__c: string | null;
}

export interface ProductImages {
  totalSize: number;
  done: boolean;
  records: ProductImage[];
}

export interface ProductAttributes {
  type: string;
  url: string;
}

export interface Product {
  attributes?: ProductAttributes;
  Id: string;
  Name: string;
  Product_Price__c: number;
  Product_URL__c: string;
  Meta_Title__c: string;
  Down_Payment_Cost__c: number;
  GVWR__c: number;
  Lift_Capacity__c: number;
  Lift_Height__c: number;
  Container__c: string;
  Product_Images__r?: ProductImages;
}

export interface AccessoryProduct {
  Id: string;
  Accessory_Id__c: string;
  Product_Id__c: string;
}

export interface ProductDetails extends Product {
  accessories: Accessory[];
  images: ProductImage[];
}
