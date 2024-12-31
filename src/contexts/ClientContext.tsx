import React, { createContext, useState } from "react";
import {
  IAccessory,
  IFirstPageForm,
  ICheckoutForm,
  IProduct,
  CheckoutFormDefaultValues,
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
  const [checkoutForm, setCheckoutForm] = useState<ICheckoutForm>(CheckoutFormDefaultValues);

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
