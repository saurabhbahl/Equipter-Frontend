import { z } from "zod";

export interface IAccessories {
  Name: string;
  Description__c: string;
  Price__c: string;
  Quantity__c: string;
}
export interface IAccessoriesRes extends IAccessories {
  CreatedById: string;
  Id: string;
  LastModifiedById:string,

}
export const AccessoriesSchema = z.object({
  Name: z.string().min(1, { message: "This field is required" }),

  Description__c: z.string().min(1, { message: "This field is required" }),

  Price__c: z.number().min(1, { message: "This field is required" }),

  Quantity__c: z.number().min(1, { message: "This field is required" }),
});
