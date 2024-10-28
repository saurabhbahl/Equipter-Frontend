import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext.tsx";
// import { Toaster } from "react-hot-toast";
import { AdminContextProvider } from "./contexts/AdminContext.tsx";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <AuthProvider>
      <AdminContextProvider>
        <App />
      </AdminContextProvider>
    </AuthProvider>
  </BrowserRouter>
);
