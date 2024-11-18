import { z } from "zod";

export interface IAccessories {
  Name: string;
  Description__c: string;
  Price__c: string|number;
  Quantity__c: string|number;
}
export interface IAccessoriesRes extends IAccessories {
  CreatedById: string;
  Id: string;
  LastModifiedById:string,

}
export const AccessoriesSchema = z.object({
  name: z.string().min(1, { message: "This field is required" }),

  description: z.string().min(1, { message: "This field is required" }),

  price: z.number().min(1, { message: "This field is required" }),

  quantity: z.number().min(1, { message: "This field is required" }),
});
