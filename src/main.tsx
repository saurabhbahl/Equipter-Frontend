import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext.tsx";
// import { Toaster } from "react-hot-toast";
import { AdminContextProvider } from "./contexts/AdminContext.tsx";
import NotificationProvider from "./contexts/NotificationContext.tsx";
import { ClientContextProvider } from "./contexts/ClientContext.tsx";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <AuthProvider>
      <NotificationProvider>
        <AdminContextProvider>
        <ClientContextProvider>
          <App />
        </ClientContextProvider>
        </AdminContextProvider>
      </NotificationProvider>
    </AuthProvider>
  </BrowserRouter>
);
