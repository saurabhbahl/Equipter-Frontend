import React, { createContext, useState } from "react";
import {
  IAccessory,
  IProduct,
} from "../components/admincomponents/Accessories/AccessoriesSchema";

export interface GlobalLoadingState {
  products: boolean;
  accessories: boolean;
  webquotes: boolean;
  states: boolean;
  zones: boolean;
}

export interface IAdminContext {
  toggleSidebar: () => void;
  isSidebarCollapsed: boolean;
  accessories: IAccessory[];
  products: IProduct[];
  webquotes: any;
  setWebquotes: any;
  states: any;
  setStates: any;
  zones: any;
  setZones: any;
  setProducts: React.Dispatch<React.SetStateAction<IProduct[]>>;
  setAccessories: React.Dispatch<React.SetStateAction<IAccessory[]>>;
  loading: GlobalLoadingState;
  setLoading: React.Dispatch<React.SetStateAction<GlobalLoadingState>>;
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
  const [webquotes, setWebquotes] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [zones, setZones] = useState<any[]>([]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState<GlobalLoadingState>({
    accessories: false,
    products: false,
    webquotes: false,
    states: false,
    zones: false,
  });
  const [error, setError] = useState<{ [key: string]: string }>({
    accessories: "",
    products: "",
    webquotes: "",
    states: "",
    zones: "",
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
        states,
        setStates,
        setLoading,
        error,
        setError,
        zones, setZones,
        webquotes,
        setWebquotes,
      }}
    >
      {" "}
      {children}{" "}
    </AdminContext.Provider>
  );
};
