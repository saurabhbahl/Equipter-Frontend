import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import LoginPage from "./pages/auth/LoginPage";
import { PrivateRoute } from "./components/PrivateRoute";
import { PublicRoute } from "./components/PublicRoute";
import SamplePage from "./pages/SamplePage";
import AdminPage from "./pages/admin/AdminPage";
import ForgetPassword from "./pages/auth/ForgetPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
               
        {/* Public routes (logined users can't access these routes)*/}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Route>

        {/*  admin route */}
        <Route element={<PrivateRoute role="admin" />}>
          <Route path="/admin" element={<AdminPage />} />
        </Route>

        {/* routes for authenticated users  */}
        <Route element={<PrivateRoute />}>
          <Route path="/sample" element={<SamplePage />} />
        <Route path="*" element={<NotFound />} />
        </Route>
        {/* not found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
