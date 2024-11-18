import { SfAccessToken } from "../../../utils/useEnv";
import { IAccessoriesRes } from "./AccessoriesSchema";

class AccessoriesService {
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
      console.log(response)

      if (!response.ok) {
        throw new Error(`Error fetching products: ${response.statusText}`);
      }
      const data = await response.json();
    return data.records || [];
    } catch (error) {
      console.error("Error fetching accessories:", error);
      throw error;
    }
  }
}

export default AccessoriesService;
