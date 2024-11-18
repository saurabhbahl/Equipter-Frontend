import { useContext } from "react";
import { AdminContext, IAdminContext } from "../contexts/AdminContext";

export const useAdminContext = ():IAdminContext => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
