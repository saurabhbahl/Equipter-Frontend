import { SfAccessToken } from "../../../utils/useEnv";
import { Accessory, IAccessoriesRes } from "./AccessoriesSchema";

class AccessoriesService {
  // accesories without images
  static async fetchAccessories(): Promise<IAccessoriesRes[]> {
    try {
      const response = await fetch(
        "/api/services/data/v52.0/query/?q=SELECT+Id,+Name,+CreatedById,+Description__c,+LastModifiedById,+OwnerId,+Price__c,+Quantity__c+FROM+Accessory__c",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${SfAccessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error fetching products: ${response.statusText}`);
      }
      const data = await response.json();
      console.log(data);
      return data.records || [];
    } catch (error) {
      console.error("Error fetching accessories:", error);
      throw error;
    }
  }
  // fetch all accessories with images
  static async fetchAccessoriesWithImages():Promise<Accessory[]> {
    try {
      const response = await fetch(
        "/api/services/data/v52.0/query/?q=SELECT+Id,+Name,+Description__c,+Price__c,+Quantity__c,+%28SELECT+Id,+Name,+Image_URL__c,+Is_Featured__c,+Accessory_Id__c+FROM+Accesory_Images__r%29+FROM+Accessory__c",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${SfAccessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error fetching products: ${response.statusText}`);
      }
      const data = await response.json();
      console.log(data);
      return data.records || [];
    } catch (error) {
      console.error("Error fetching accessories:", error);
      throw error;
    }
  }
  // single accessory without images
  static async fetchSingleAccessory(accessoryID: string) {
    try {
      const response = await fetch(
        `/api/services/data/v52.0/query/?q=SELECT+Id,+Name,+CreatedById,+Description__c,+LastModifiedById,+OwnerId,+Price__c,+Quantity__c+FROM+Accessory__c+WHERE+Id+%3D+%27${accessoryID}%27`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${SfAccessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error fetching products: ${response.statusText}`);
      }
      const data = await response.json();
      console.log(data);
      return data.records || [];
    } catch (error) {
      console.error("Error fetching accessories:", error);
      throw error;
    }
  }

  static async fetchSingleAccessoryWithImages(accessoryID: string):Promise<Accessory> {
    try {
      const q = `/api/services/data/v52.0/query/?q=SELECT+Id,Name,Accessory_URL__c,Meta_Title__c,Description__c,Price__c,Quantity__c,(SELECT+Id,Image_URL__c,Is_Featured__c+FROM+Accesory_Images__r)+FROM+Accessory__c+WHERE+Id='${accessoryID}'`;

      const response = await fetch(q, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${SfAccessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching products: ${response.statusText}`);
      }
      const data = await response.json();
      console.log(data);
      return data.records[0] || [];
    } catch (error) {
      console.error("Error fetching accessories:", error);
      throw error;
    }
  }

  static async isSlugUnique(slug: string,accessoryId?: string): Promise<boolean> {
    try {
      const encodedSlug = encodeURIComponent(slug);
      const encodedAccessoryId = accessoryId
        ? encodeURIComponent(accessoryId)
        : "";

      const query = accessoryId
        ? `/api/services/data/v52.0/query/?q=SELECT+Id+FROM+Accessory__c+WHERE+Accessory_URL__c='${encodedSlug}'+AND+Id!='${encodedAccessoryId}'`
        : `/api/services/data/v52.0/query/?q=SELECT+Id+FROM+Accessory__c+WHERE+Accessory_URL__c='${encodedSlug}'`;

      console.log("Generated Query:", query);

      const response = await fetch(query, {
        headers: {
          Authorization: `Bearer ${SfAccessToken}`,
        },
      });

      const data = await response.json();
      console.log("Response Data:", data);

      // Check if records are returned
      return data.records?.length === 0;
    } catch (error) {
      console.error("Error checking slug uniqueness:", error);
      return false;
    }
  }
}

export default AccessoriesService;
