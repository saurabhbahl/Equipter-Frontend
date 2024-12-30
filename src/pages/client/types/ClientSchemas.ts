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
  contact_phone_number: number;
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

