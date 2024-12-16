import React, { createContext, useState } from "react";
import {  IAccessory, IProduct } from "../components/admincomponents/Accessories/AccessoriesSchema";

export interface GlobalLoadingState {
  products: boolean;
  accessories: boolean;
}

export interface IAdminContext {
  toggleSidebar: () => void;
  isSidebarCollapsed: boolean;
  accessories: IAccessory[] ;
  products: IProduct[];
  setProducts:  React.Dispatch<React.SetStateAction<IProduct[]>>;
  setAccessories: React.Dispatch<React.SetStateAction<IAccessory[]>>;
  loading: GlobalLoadingState;
  setLoading:React.Dispatch<React.SetStateAction<GlobalLoadingState>>;
  error: { [key: string]: string };
  setError: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
}

export const AdminContext = createContext<IAdminContext | null>(null);

export const AdminContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [accessories, setAccessories] = useState<IAccessory[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState<GlobalLoadingState>({
    accessories: false,
    products: false,
  });
  const [error, setError] = useState<{ [key: string]: string }>({
    accessories: "",
    products: "",
  });

  function toggleSidebar() {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  }

  return (
    <AdminContext.Provider
      value={{
        toggleSidebar,
        products,
        setProducts,
        isSidebarCollapsed,
        accessories,
        setAccessories,
        loading,
        setLoading,
        error,
        setError,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};
