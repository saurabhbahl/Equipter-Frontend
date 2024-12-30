import React, { createContext, useState } from "react";
import {
  IAccessory,
  IFirstPageForm,
  ICheckoutForm,
  IProduct,
} from "../pages/client/types/ClientSchemas";
export interface GlobalLoadingState {
  products: boolean;
  accessories: boolean;
}

export interface IClientContext {
  accessories: IAccessory[];
  saveToLocalStorage: (
    data: any,
    STORAGE_KEY: string,
    EXPIRATION_TIME: number
  ) => void;
  loadFromLocalStorage: (STORAGE_KEY: string) => any;
  products: IProduct[];
  setProducts: React.Dispatch<React.SetStateAction<IProduct[]>>;
  setAccessories: React.Dispatch<React.SetStateAction<IAccessory[]>>;
  firstPageForm: IFirstPageForm;
  setFirstPageForm: React.Dispatch<React.SetStateAction<IFirstPageForm>>;
  loading: GlobalLoadingState;
  setLoading: React.Dispatch<React.SetStateAction<GlobalLoadingState>>;
  checkoutForm: ICheckoutForm;
  setCheckoutForm: React.Dispatch<React.SetStateAction<ICheckoutForm>>;
  error: { [key: string]: string };
  setError: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
}

export const ClientContext = createContext<IClientContext | null>(null);

export const ClientContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [accessories, setAccessories] = useState<IAccessory[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);

  const [loading, setLoading] = useState<GlobalLoadingState>({
    accessories: false,
    products: false,
  });
  const [error, setError] = useState<{ [key: string]: string }>({
    accessories: "",
    products: "",
  });
  const [firstPageForm, setFirstPageForm] = useState({
    fName: "",
    lName: "",
    company: "",
    phNo: "",
    email: "",
    jobTitle: "",
    state: "",
    industry: "",
    isFormFilled: false,
  });
  const [checkoutForm, setCheckoutForm] = useState<ICheckoutForm>({
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
    contact_phone_number: "",
    contact_email: "",
    contact_industry: "",
    contact_job_title: "",
    billing_same_as_delivery: "",
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
    i_understand_deposit_is_non_refundable: "",
  });

  // Save data to localStorage
  const saveToLocalStorage = (
    data: any,
    STORAGE_KEY: string,
    EXPIRATION_TIME: number
  ) => {
    const now = new Date();
    const payload = {
      data,
      createdAt: data.createdAt || now.toISOString(),
      updatedAt: now.toISOString(),
      expiresAt: new Date(now.getTime() + EXPIRATION_TIME).toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  };

  // Load data from localStorage and check expiration
  const loadFromLocalStorage = (STORAGE_KEY: string) => {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      const now = new Date();
      const expiresAt = new Date(parsedData.expiresAt);

      if (now > expiresAt) {
        // Data has expired, remove it
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }
      return parsedData.data;
    }
    return null;
  };

  return (
    <ClientContext.Provider
      value={{
        products,
        checkoutForm,
        setCheckoutForm,
        setProducts,
        loadFromLocalStorage,
        firstPageForm,
        saveToLocalStorage,
        setFirstPageForm,
        accessories,
        setAccessories,
        loading,
        setLoading,
        error,
        setError,
      }}
    >
      {children}
    </ClientContext.Provider>
  );
};
