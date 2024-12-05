import { ApiService } from "../../../utils/ApiService";

export class ClientProductService {
  private apiService: ApiService;

  constructor() {
    this.apiService = new ApiService();
  }

  async getAllProductsWithImages() {
    try {
      const data = await this.apiService.get(
        "/api/services/data/v52.0/query/?q=SELECT+Id,+Name, Product_Price__c, Product_Title__c,Product_Description__c,+Product_URL__c,+Meta_Title__c,+Down_Payment_Cost__c,+GVWR__c,+Lift_Capacity__c,+Lift_Height__c,+Container__c,+%28SELECT+Id,+Image_URL__c,+Is_Featured__c,+Product_Id__c,+Name,+Image_Description__c+FROM+Product_Images__r%29+FROM+Product__c");
      return data;
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }
}
