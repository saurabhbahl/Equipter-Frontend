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

interface AccessorySelection {
  selected: boolean;
  qty: number;
}

interface SelectionsType {
  baseUnitQty: number;
  accessories: {
    [accId: string]: AccessorySelection;
  };
  shippingOption: string | null;
  selectedState: IState | null;
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
export interface ISidebarSteps {
  cashStep: number;
  financingStep: number;
  showCheckOutForm: boolean;
  showThankYouTab: boolean;
  showSendEmailTab: boolean;
  sendBuildForm: boolean;
}
export interface IProductSelectionProps {
  selectedAccessories: IAccessory[];
  selectedDeliveryOption: "delivery" | "pickup";
  productDetails: IProduct | null;
  deliveryState: IState | null;
  productBaseUnitPrice: number;
  productBaseUnitQty: number;
}
export interface ITotalPrices{
  basePrice: number,
  addOns: number,
  netPrice: number,
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
  selections: SelectionsType;
  setSelections: React.Dispatch<React.SetStateAction<SelectionsType>>;
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  totalPrices: ITotalPrices;
  setTotalPrices: React.Dispatch<React.SetStateAction<ITotalPrices>>;
  filterState: (id: string) => any;
  handleAccessoryChange: (accId: string, isChecked: boolean) => void;
  handleAccessoryQtyChange: (accId: string, qty: number) => void;
  handleShippingChange: (optionId: string) => void;
  sidebarSteps: ISidebarSteps;
  setSidebarSteps: React.Dispatch<React.SetStateAction<ISidebarSteps>>;
  productSelection: IProductSelectionProps;
  setProductSelections: React.Dispatch<
    React.SetStateAction<IProductSelectionProps>
  >;
  webQuote: string,
  setWebQuote: React.Dispatch<React.SetStateAction<string>>
}

export const ClientContext = createContext<IClientContext | null>(null);

export const ClientContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [activeTab, setActiveTab] = useState<string>("cash");
  const [accessories, setAccessories] = useState<IAccessory[]>([]);
  const [sidebarSteps, setSidebarSteps] = useState<ISidebarSteps>({
    cashStep: 1,
    financingStep: 1,
    showCheckOutForm: false,
    showThankYouTab: false,
    showSendEmailTab: false,
    sendBuildForm: false,
  });
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
  const [selections, setSelections] = useState<SelectionsType>({
    baseUnitQty: 1,
    accessories: {},
    shippingOption: "delivery",
    selectedState: null,
  });
  const [totalPrices, setTotalPrices] = useState<ITotalPrices>({
    basePrice: 0,
    addOns: 0,
    netPrice: 0,
  });
  const [productSelection, setProductSelections] = useState<
    IProductSelectionProps
  >({
    selectedAccessories: [],
    selectedDeliveryOption: "pickup",
    productDetails: null,
    deliveryState: null,
    productBaseUnitPrice: 0,
    productBaseUnitQty: 1,
  });
  const [webQuote, setWebQuote] = useState<string>('');

  const filterState = (selectedId: string) => {
    if (statesData.length > 0) {
      const data = statesData.find((st) => st.state_id == selectedId);
      return data;
    }
  };

  const handleAccessoryChange = (accId: string, isChecked: boolean) => {
    setSelections((prevState) => ({
      ...prevState,
      accessories: {
        ...prevState.accessories,

        [accId]: {
          ...prevState.accessories[accId],
          // qty:isChecked==false?1:...prevState.accessories.qty,
          qty: isChecked ? prevState.accessories[accId]?.qty || 1 : 1,
          selected: isChecked,
        },
      },
    }));
  };

  const handleAccessoryQtyChange = (accId: string, qty: number) => {
    setSelections((prevState) => ({
      ...prevState,
      accessories: {
        ...prevState.accessories,
        [accId]: {
          ...prevState.accessories[accId],
          qty: qty < 1 ? 1 : qty,
        },
      },
    }));
  };

  const handleShippingChange = (optionId: string) => {
    setSelections((prevState) => ({
      ...prevState,
      shippingOption: optionId,
    }));
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
        filterState,
        setCheckoutForm,
        shippingOptions,
        activeTab,
        productSelection,
        setProductSelections,
        setActiveTab,
        setStatesFn,
        totalPrices,
        setTotalPrices,
        selections,
        setSelections,
        setShippingOptions,
        setProducts,
        loadFromLocalStorage,
        firstPageForm,
        handleAccessoryChange,
        handleAccessoryQtyChange,
        handleShippingChange,
        sidebarSteps,
        setSidebarSteps,
        saveToLocalStorage,
        setFirstPageForm,
        accessories,
        statesData,
        setAccessories,
        loading,
        setLoading,
        error,
        setError,
        webQuote,
        setWebQuote
      }}
    >
      {children}
    </ClientContext.Provider>
  );
};
