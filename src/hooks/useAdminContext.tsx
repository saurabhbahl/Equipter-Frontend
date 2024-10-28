import { useContext } from "react";
import { AdminContext } from "../contexts/AdminContext";

export const useAdminContext = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
