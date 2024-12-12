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

//  Accessory Image type
export interface AccessoryImage {
  attributes: {
    type: string; // Example: "Accessory_Image__c"
    url: string; // API URL for the specific image
  };
  Id: string; // Unique ID for the accessory image
  Name: string; // Name of the accessory image
  Image_URL__c: string; // URL of the image
  Is_Featured__c: boolean; // Whether the image is featured
  Accessory_Id__c: string; // ID of the related accessory
}

//  Accesory Images collection typeA
export interface AccessoryImages {
  totalSize: number; // Total number of images
  done: boolean; // Indicates if all records have been fetched
  records: AccessoryImage[]; // List of accessory image records
}

//  main Accessory type
export interface Accessory {
  attributes?: {
    type: string; // Example: "Accessory__c"
    url: string; // API URL for the specific accessory
  };
  Accessory_URL__c:string;
  Meta_Title__c:string;
  Id: string; // Unique ID for the accessory
  Name: string; // Name of the accessory
  Description__c: string; // Description of the accessory
  Price__c: number; // Price of the accessory
  Quantity__c: number; // Quantity available
  Accesory_Images__r: AccessoryImages; 
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
