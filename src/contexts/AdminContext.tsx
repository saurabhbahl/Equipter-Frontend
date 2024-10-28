import { createContext, useState } from "react";
interface IAdminContext {
  toggleSidebar: () => void;
  isSidebarCollapsed: boolean;
}

export const AdminContext = createContext<IAdminContext | null>(null);

export const AdminContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  function toggleSidebar() {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  }

  return (
    <AdminContext.Provider value={{ toggleSidebar, isSidebarCollapsed }}>
      {children}
    </AdminContext.Provider>
  );
};
