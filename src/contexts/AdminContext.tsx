import React, { createContext, useState } from "react";
import { IAccessoriesRes } from "../components/admincomponents/Accessories/AccessoriesSchema";
interface IError {
  accessories: string;
  products: string;
}
export interface IAdminContext {
  toggleSidebar: () => void;
  isSidebarCollapsed: boolean;
  accessories: IAccessoriesRes[] | any;
  products: any;
  setProducts: any;
  setAccessories: React.Dispatch<React.SetStateAction<IAccessoriesRes[]>>;
  // fetchAccessoriesData: () => Promise<void>;
  loading: { [key: string]: boolean };
  setLoading: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;
  error: IError;
  setError: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
}

export const AdminContext = createContext<IAdminContext | null>(null);

export const AdminContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [accessories, setAccessories] = useState<IAccessoriesRes[]>([]);
  const [products, setProducts] = useState([]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({
    accessories: false,
    products: false,
  });
  const [error, setError] = useState<IError>({
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
