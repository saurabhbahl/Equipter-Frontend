import React, { createContext, useState } from "react";
import { IAccessory, IFirstPageForm, IProduct } from "../pages/client/types/ClientSchemas";
export interface GlobalLoadingState {
  products: boolean;
  accessories: boolean;
}


export interface IClientContext {
  accessories: IAccessory[];
  products: IProduct[];
  setProducts: React.Dispatch<React.SetStateAction<IProduct[]>>;
  setAccessories: React.Dispatch<React.SetStateAction<IAccessory[]>>;
  firstPageForm:IFirstPageForm;
  setFirstPageForm:React.Dispatch<React.SetStateAction<IFirstPageForm>>;
  loading: GlobalLoadingState;
  setLoading: React.Dispatch<React.SetStateAction<GlobalLoadingState>>;
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
  return (
    <ClientContext.Provider
      value={{
        products,
        setProducts,
        firstPageForm,
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
