import { SfAccessToken } from "../../../utils/useEnv";

export class ProductsService {
  // get all products with images 
  static async fetchProductsWithImages() {
    try {
      const response = await fetch(
        `/api/services/data/v52.0/query/?q=SELECT+Id,+Name,+Product_Price__c,+Product_URL__c,+Meta_Title__c,+Product_Title__c,+Product_Description__c,+Down_Payment_Cost__c,+GVWR__c,+Lift_Capacity__c,+Lift_Height__c,+Container__c,+%28SELECT+Id,+Image_URL__c,+Is_Featured__c,+Product_Id__c,+Name,+Image_Description__c+FROM+Product_Images__r%29+FROM+Product__c`,
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

      return data.records || [];
    } catch (error) {
      console.error("Error fetching accessories:", error);
      throw error;
    }
  }
// get single product details with images
  static async fetchProductsDetailsWithImages(pID: string) {
    try {
      const productUrl = `/api/services/data/v52.0/query/?q=SELECT+Id%2C+Name%2C+Product_URL__c%2C+Meta_Title__c%2C+Product_Title__c%2C+Product_Description__c%2C+Product_Price__c%2C+Down_Payment_Cost__c%2C+GVWR__c%2C+Lift_Capacity__c%2C+Lift_Height__c%2C+Container__c%2C+%28SELECT+Id%2C+Image_URL__c%2C+Is_Featured__c%2C+Product_Id__c%2C+Name%2C+Image_Description__c+FROM+Product_Images__r%29+FROM+Product__c+WHERE+Id+%3D+%27${pID}%27`;
      const response = await fetch(productUrl, {
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
 
      return data.records[0] || [];
    } catch (error) {
      console.error("Error fetching accessories:", error);
      throw error;
    }
  }
// get accessories related to product( by product Id)
  static async fetchProductsWithAccessories(productId: string) {
    try {
      const accessoryProductUrl = `/api/services/data/v52.0/query/?q=SELECT+Id%2C+Accessory_Id__c%2C+Product_Id__c%2C+Name+FROM+Accessory_Product__c+WHERE+Product_Id__c+%3D+%27${productId}%27`;

      const response = await fetch(accessoryProductUrl, {
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

      return data.records || [];
    } catch (error) {
      console.error("Error fetching accessories:", error);
      throw error;
    }
  }


  static async isSlugUnique(slug: string,productId?: string): Promise<boolean> {
    try {
      const encodedSlug = encodeURIComponent(slug);
      const encodedProductId = productId ? encodeURIComponent(productId) : "";

      const query = productId
        ? `/api/services/data/v52.0/query/?q=SELECT+Id+FROM+Product__c+WHERE+Product_URL__c='${encodedSlug}'+AND+Id!='${encodedProductId}'`
        : `/api/services/data/v52.0/query/?q=SELECT+Id+FROM+Product__c+WHERE+Product_URL__c='${encodedSlug}'`;

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
