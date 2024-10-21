import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Toaster
      toastOptions={{
        duration: 1500,
        style: {
          // background: "#ea7600",
          // color: "#fff",
          width:"200px"
        },
        error:{
          // icon:"",
          duration:2000
        }
      }}
      reverseOrder={true}
      position="bottom-right"
    />
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
);
