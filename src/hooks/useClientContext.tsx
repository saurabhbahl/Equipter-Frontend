import { useContext } from "react";
import { ClientContext, IClientContext } from "../contexts/ClientContext";

export const useClientContext = (): IClientContext => {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error("useClientContext must be used within an ClientProvider");
  }
  return context;
};
