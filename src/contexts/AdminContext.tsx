// import { createContext, useState } from "react";
// import { IAccessoriesRes } from "../components/admincomponents/Accessories/AccessoriesSchema";
// interface IAdminContext {
//   toggleSidebar: () => void;
//   isSidebarCollapsed: boolean;
// }

// export const AdminContext = createContext<IAdminContext | null>(null);

// export const AdminContextProvider = ({children}: {children: React.ReactNode;}) => {
//   const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
//   const [accessories,setAccessories]=useState<IAccessoriesRes[]|[]>([])
//   function toggleSidebar() {
//     setIsSidebarCollapsed(!isSidebarCollapsed);
//   }
//   class Accessories{
//     static function getAllAccessories() {

//     }
//   }

//   return (
//     <AdminContext.Provider value={{ toggleSidebar, isSidebarCollapsed }}>
//       {children}
//     </AdminContext.Provider>
//   );
// };

import React, { createContext, useState } from "react";
import { IAccessoriesRes } from "../components/admincomponents/Accessories/AccessoriesSchema";

export interface IAdminContext {
  toggleSidebar: () => void;
  isSidebarCollapsed: boolean;
  accessories: IAccessoriesRes[];
  products:any;
  setProducts:any;
  setAccessories: React.Dispatch<React.SetStateAction<IAccessoriesRes[]>>;
  // fetchAccessoriesData: () => Promise<void>;
  loading: { [key: string]: boolean };
  setLoading: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;
  error: { [key: string]: string };
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
