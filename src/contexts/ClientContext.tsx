import React, { createContext, useEffect, useState } from "react";
import {
  IAccessory,
  IFirstPageForm,
  ICheckoutForm,
  IProduct,
  CheckoutFormDefaultValues,
} from "../pages/client/types/ClientSchemas";
import { publicApiClient } from "../utils/axios";

export interface IState {
  id: string;
  state_name: string;
  is_delivery_paused: boolean;
  shipping_rate: string;
  zone_name: string;
  state_id: string;
  zone_id: string;
  created_at: string;
  updated_at: string;
}

export interface GlobalLoadingState {
  products: boolean;
  accessories: boolean;
}
export interface ShippingOption {
  id: string;
  name: string;
  price: number;
  uuid?: string;
  zone_name?: string;
  zone_id?: string;
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
  shippingOptions: ShippingOption[];
  setShippingOptions: React.Dispatch<React.SetStateAction<ShippingOption[]>>;
  statesData: IState[];
  setStatesFn: () => void;
  selections: any;
  setSelections: any;
}

export const ClientContext = createContext<IClientContext | null>(null);

export const ClientContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [accessories, setAccessories] = useState<IAccessory[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [statesData, setStatesData] = useState<IState[]>([]);
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
  const [checkoutForm, setCheckoutForm] = useState<ICheckoutForm>(
    CheckoutFormDefaultValues
  );
  const [selections, setSelections] = useState({
    baseUnitQty: 1,
    accessories: {},
    shippingOption: "",
  });

  const filterState = (selectedId: string) => {
    if (statesData.length > 0) {
      const data = statesData.find((st) => st.state_id == selectedId);
      return data;
    }
  };

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
  async function setStatesFn() {
    const res = await publicApiClient.get("/state/states");
    setStatesData(res.data.data);
  }
  useEffect(() => {
    if (statesData.length == 0) {
      setStatesFn();
    }
    if (firstPageForm.state != "") {
      const data = filterState(firstPageForm.state);
      setSelections((prev: any) => ({ ...prev, selectedState: data }));
    }
  }, [firstPageForm.state]);

  return (
    <ClientContext.Provider
      value={{
        products,
        checkoutForm,
        setCheckoutForm,
        shippingOptions,
        setStatesFn,
        selections,
        setSelections,
        setShippingOptions,
        setProducts,
        loadFromLocalStorage,
        firstPageForm,
        saveToLocalStorage,
        setFirstPageForm,
        accessories,
        statesData,
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
