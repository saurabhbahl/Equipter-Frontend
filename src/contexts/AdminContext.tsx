import React, { createContext, useState } from "react";
import {
  IAccessory,
  IProduct,
} from "../components/admincomponents/Accessories/AccessoriesSchema";
import { apiClient } from "../utils/axios";
import { Zone } from "../components/admincomponents/Zones/ZoneSchemas";
import { IQuotes } from "../components/admincomponents/WebQuotes/WebQuoteSchema";
import { IState } from "./ClientContext";
import { IOrder } from "../components/admincomponents/Orders/OrdersSchema";

export interface GlobalLoadingState {
  products: boolean;
  accessories: boolean;
  webquotes: boolean;
  states: boolean;
  zones: boolean;
  orders: boolean;
}

export interface IAdminContext {
  toggleSidebar: () => void;
  fetchStates: () => void;
  fetchZones: () => void;
  isSidebarCollapsed: boolean;
  accessories: IAccessory[];
  products: IProduct[];
  orders: IOrder[];
  webquotes: IQuotes[];
  setWebquotes: React.Dispatch<React.SetStateAction<IQuotes[]>>;
  states: IState[];
  setStates:  React.Dispatch<React.SetStateAction<IState[]>>;
  zones: Zone[];
  setZones: React.Dispatch<React.SetStateAction<Zone[]>>;
  setProducts: React.Dispatch<React.SetStateAction<IProduct[]>>;
  setAccessories: React.Dispatch<React.SetStateAction<IAccessory[]>>;
  setOrders: React.Dispatch<React.SetStateAction<IOrder[]>>;
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
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [webquotes, setWebquotes] = useState<IQuotes[]>([]);
  const [states, setStates] = useState<IState[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState<GlobalLoadingState>({
    accessories: false,
    products: false,
    orders: false,
    webquotes: false,
    states: false,
    zones: false,
  });
  async function fetchStates() {
    try {
      setLoading((prev) => ({ ...prev, states: true }));
      setError((prev) => ({ ...prev, states: "" }));
  
      const url = `/state/states?page=${1}&limit=${10}`;
      const response = await apiClient.get(url);
      const { data } = response.data;
      setStates(data);
    } catch (error: any) {
      console.log(error);
      setError((prev) => ({
        ...prev,
        states: error.message || "Unexpected error occurred",
      }));
    } finally {
      setLoading((prev) => ({ ...prev, states: false }));
    }
  }
  const fetchZones = async () => {
    try {
      setLoading((prev) => ({ ...prev, zones: true }));
      setError((prev) => ({ ...prev, zones: "" }));

      const url = `/state/zones?page=${1}&limit=${10}`;
      const response = await apiClient.get(url);
      const { data } = response.data;
      setZones(data);
    } catch (error: any) {
      console.log(error);
      setError((prev) => ({
        ...prev,
        zones: error.message || "Unexpected error occurred",
      }));
    } finally {
      setLoading((prev) => ({ ...prev, zones: false }));
    }
  };

  
  const [error, setError] = useState<{ [key: string]: string }>({
    accessories: "",
    products: "",
    webquotes: "",
    states: "",
    zones: "",
    orders: "",
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
        fetchZones,
        accessories,
        setAccessories,
        orders,
        setOrders,
        loading,
        states,
        fetchStates,
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
