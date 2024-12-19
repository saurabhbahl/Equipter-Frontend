import { Suspense, lazy } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import { PrivateRoute } from "./PrivateRoute";
import { PublicRoute } from "./PublicRoute";
import Loader from "./Loader";

const Home = lazy(() => import("../../pages/client/FirstPageForm"));
const LoginPage = lazy(() => import("../../pages/auth/LoginPage"));
const ForgetPassword = lazy(() => import("../../pages/auth/ForgetPassword"));
const ResetPassword = lazy(() => import("../../pages/auth/ResetPassword"));

const NotFound = lazy(() => import("../../pages/NotFound"));
const AdminPage = lazy(() => import("../../pages/admin/AdminPage"));
const Dashboard = lazy(() => import("../admincomponents/Dashboard/Dashboard"));
const Customers = lazy(() => import("../admincomponents/Customers/Customers"));
const Products = lazy(() => import("../admincomponents/Products/AllProducts"));
const AddNewProduct = lazy(() =>
  import("../admincomponents/Products/AddNewProduct")
);
const Accessories = lazy(() => import("../admincomponents/Accessories/Accessories"));
const Orders = lazy(() => import("../admincomponents/Orders/Orders"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    element: <PublicRoute />, // Public routes wrapper
    children: [
      { path: "login", element: <LoginPage /> },
      { path: "forget-password", element: <ForgetPassword /> },
      { path: "reset-password/:token", element: <ResetPassword /> },
    ],
  },
  {
    element: <PrivateRoute role="admin" />,
    children: [
      {
        path: "admin",
        element: <AdminPage />,
        children: [
          { index: true, element: <Navigate to="dashboard" replace /> },
          { path: "dashboard", element: <Dashboard /> },
          { path: "customers", element: <Customers /> },
          {
            path: "products",
            element: <Products />,
            children: [{ path: "new", element: <AddNewProduct /> }],
          },
          //   { path: "products/new", element: <AddNewProduct /> },
          { path: "accessories", element: <Accessories /> },
          { path: "orders", element: <Orders /> },
        ],
      },
    ],
  },
 
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default function CustomBrowserRouter() {
  return (
    <>
      <Suspense fallback={<Loader />}>
        <RouterProvider router={router} />
      </Suspense>
    </>
  );
}
