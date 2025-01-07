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
  qty:number;
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
  product_price: number;
  product_qty: number;
  shipping_method_used: string;
  zone_id?: string|null;
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
  delivery_cost?: string|null;
  delivery_address_street: string;
  delivery_address_city: string;
  delivery_address_state_id: string|null;
  delivery_address_zip_code: string;
  delivery_address_country: string;
  payment_type?: string;
  product_total_cost: number;
  non_refundable_deposit?: number;
  i_understand_deposit_is_non_refundable: boolean;
  accessories?:IAccessory[];
}

export const CheckoutFormDefaultValues:ICheckoutForm = {
  financing: "",
  product_id: "",
  product_name: "",
  product_price: 0,accessories:[],
  product_qty: 1,
  shipping_method_used: "",
  zone_id: null,
  contact_first_name: "",
  contact_last_name: "",
  contact_company_name: "",
  payment_name_on_card: "66565",     
  payment_card_number: "4569857456",      
  payment_expiry: "1228",           
  payment_cvc: "2564", 
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
  delivery_cost: null,
  delivery_address_street: "",
  delivery_address_city: "",
  delivery_address_state_id: null,
  delivery_address_zip_code: "",
  delivery_address_country: "",
  payment_type: "",
  product_total_cost: 0,
  non_refundable_deposit: 0,
  i_understand_deposit_is_non_refundable: true,
};
