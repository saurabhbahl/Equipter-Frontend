import { z } from "zod";

export interface IAccessoriesInput {
  Name: string;
  Description__c: string;
  Price__c: string;
  Quantity__c: string;
  Accessory_URL__c: string;
  accessory_title: string;
  Meta_Title__c: string;
}
export interface IAccessoriesRes extends IAccessoriesInput {
  CreatedById: string;
  Id: string;
  LastModifiedById: string;
}
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



// zod schema
export const AccessoriesSchema = z.object({
  Name: z.string().min(1, { message: "This field is required" }),

  Description__c: z.string().min(1, { message: "This field is required" }),
  accessory_title: z.string().min(1, { message: "This field is required" }),

  Price__c: z.number().min(1, { message: "This field is required" }),

  Quantity__c: z.number().min(1, { message: "This field is required" }),
  Meta_Title__c: z
    .string()
    .min(1, { message: "This field is required" })
    .max(255, { message: "Maximum 250 characters Allowed" }),
});
