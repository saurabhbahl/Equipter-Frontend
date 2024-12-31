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
  slides?: string[];
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

export interface IFirstPageForm {
  fName: string;
  lName: string;
  company: string;
  phNo: string;
  email: string;
  jobTitle: string;
  state: string;
  industry: string;
  isFormFilled: boolean;
}

export interface ICheckoutForm {
  financing: string;
  product_id: string;
  product_name: string;
  product_price: string;
  product_qty: string;
  shipping_method_id: string;
  zone_id: string;
  contact_first_name: string;
  contact_last_name: string;
  contact_company_name: string;
  contact_phone_number: number|string;
  contact_email: string;
  contact_industry: string;
  contact_job_title: string;
  payment_name_on_card: string;
  payment_card_number: string;
  payment_expiry: string;
  payment_cvc: string;
  billing_same_as_delivery: boolean;
  billing_address_street: string;
  billing_address_city: string;
  billing_address_state: string;
  billing_address_zip_code: string;
  billing_address_country: string;
  delivery_cost: string;
  delivery_address_street: string;
  delivery_address_city: string;
  delivery_address_state_id: string;
  delivery_address_zip_code: string;
  delivery_address_country: string;
  estimated_delivery_date: string;
  pickup_location_name: string;
  pickup_location_address: string;
  pickup_scheduled_date: string;
  payment_type: string;
  product_total_cost: string;
  non_refundable_deposit: string;
  i_understand_deposit_is_non_refundable: boolean;
}

export const CheckoutFormDefaultValues = {
  financing: "",
  product_id: "",
  product_name: "",
  product_price: "",
  product_qty: "",
  shipping_method_id: "",
  zone_id: "",
  contact_first_name: "",
  contact_last_name: "",
  contact_company_name: "",
  payment_name_on_card: "",     
  payment_card_number: "",      
  payment_expiry: "",           
  payment_cvc: "", 
  contact_phone_number: "",
  contact_email: "",
  contact_industry: "",
  contact_job_title: "",
  billing_same_as_delivery: false,
  billing_address_street: "",
  billing_address_city: "",
  billing_address_state: "",
  billing_address_zip_code: "",
  billing_address_country: "",
  delivery_cost: "",
  delivery_address_street: "",
  delivery_address_city: "",
  delivery_address_state_id: "",
  delivery_address_zip_code: "",
  delivery_address_country: "",
  estimated_delivery_date: "",
  pickup_location_name: "",
  pickup_location_address: "",
  pickup_scheduled_date: "",
  payment_type: "",
  product_total_cost: "",
  non_refundable_deposit: "",
  i_understand_deposit_is_non_refundable: false,
};
