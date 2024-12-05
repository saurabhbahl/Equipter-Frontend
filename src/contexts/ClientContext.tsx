import React, { createContext, useState } from "react";
import { Accessory } from "../components/admincomponents/Accessories/AccessoriesSchema";
import { Product } from "../components/admincomponents/Products/ProductSchema";
export interface GlobalLoadingState {
  products: boolean;
  accessories: boolean;
}

export interface IClientContext {
  accessories: Accessory[];
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  setAccessories: React.Dispatch<React.SetStateAction<Accessory[]>>;

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
  const [accessories, setAccessories] = useState<Accessory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [loading, setLoading] = useState<GlobalLoadingState>({
    accessories: false,
    products: false,
  });
  const [error, setError] = useState<{ [key: string]: string }>({
    accessories: "",
    products: "",
  });

  return (
    <ClientContext.Provider
      value={{
        products,
        setProducts,

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
