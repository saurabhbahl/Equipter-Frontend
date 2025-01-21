export interface IWebQuote {
  id: string;
  stage: string;
  financing: string;
  product_id: string;
  product_name: string;
  product_price: string;
  product_qty: number;
  shipping_method_used: string;
  zone_id: string;
  contact_first_name: string;
  contact_last_name: string;
  contact_company_name?: string;
  contact_phone_number: string;
  contact_email: string;
  contact_industry?: string;
  contact_job_title?: string;
  billing_same_as_delivery?: boolean;
  billing_address_street?: string;
  billing_address_city?: string;
  billing_address_state?: string;
  billing_address_zip_code?: string;
  billing_address_country?: string;
  delivery_cost?: string;
  delivery_address_street?: string;
  delivery_address_city?: string;
  delivery_address_state_id?: string;
  delivery_address_zip_code?: string;
  delivery_address_country?: string;
  payment_type?: string;
  product_total_cost?: string;
  non_refundable_deposit?: string;
  i_understand_deposit_is_non_refundable?: boolean;
  created_at: string;
  updated_at: string;
}

