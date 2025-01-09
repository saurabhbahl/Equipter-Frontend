import { Navigate, Route, Routes } from "react-router-dom";
import { Suspense, lazy } from "react";

import { PrivateRoute } from "./PrivateRoute";
import { PublicRoute } from "./PublicRoute";
import Loader from "./Loader";
import Dashboard from "../admincomponents/Dashboard/Dashboard";
import AddNewAccessory from "../admincomponents/Accessories/AddNewAccessory";
import EditProduct from "../admincomponents/Products/EditProduct";
import ViewAccessory from "../admincomponents/Accessories/ViewAccessory";
import EditAccessory from "../admincomponents/Accessories/EditAccessory";
import Products from "../../pages/client/products/Products";
import AllProducts from "../admincomponents/Products/AllProducts";
import ViewSingleProduct from "../../pages/client/products/ViewSingleProduct";
const LoginPage = lazy(() => import("../../pages/auth/LoginPage"));
const ForgetPassword = lazy(() => import("../../pages/auth/ForgetPassword"));
const ResetPassword = lazy(() => import("../../pages/auth/ResetPassword"));

const NotFound = lazy(() => import("../../pages/NotFound"));
const AdminPage = lazy(() => import("../../pages/admin/AdminPage"));

const Customers = lazy(() => import("../admincomponents/Customers/Customers"));
const AddNewProduct = lazy(() =>
  import("../admincomponents/Products/AddNewProduct")
);
const Accessories = lazy(() =>
  import("../admincomponents/Accessories/Accessories")
);
const Orders = lazy(() => import("../admincomponents/Orders/Orders"));

export default function Router() {
  return (
    <>
      <Suspense fallback={<Loader />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Products />} />
          <Route path="/products" element={<Navigate to="/" replace />} />
          <Route path="/products/:productUrl" element={<ViewSingleProduct />} />
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forget-password" element={<ForgetPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<PrivateRoute role="admin" />}>
            <Route path="/admin" element={<AdminPage />}>
              <Route
                index
                element={<Navigate to="/admin/dashboard" replace />}
              />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="customers" element={<Customers />} />

              {/* products */}
              <Route path="products" element={<AllProducts />} />
              <Route path="products/new" element={<AddNewProduct />} />
              <Route path="products/edit/:id" element={<EditProduct />} />

              {/* accessories */}
              <Route path="accessories" element={<Accessories />} />
              <Route path="accessories/new" element={<AddNewAccessory />} />
              <Route path="accessories/view/:id" element={<ViewAccessory />} />
              <Route path="accessories/edit/:id" element={<EditAccessory />} />

              <Route path="orders" element={<Orders />} />
            </Route>
          </Route>

          {/* Authenticated User Routes */}
          {/* <Route element={<PrivateRoute />}> */}
          {/* <Route path="/sample" element={<SamplePage />} /> */}

          {/* </Route> */}

          {/* Fallback for Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
}

// import { Navigate, Route, Routes } from "react-router-dom";
// import { Suspense, lazy } from "react";

// import { PrivateRoute } from "./PrivateRoute";
// import { PublicRoute } from "./PublicRoute";
// import Loader from "./Loader";
// import Dashboard from "../admincomponents/Dashboard/Dashboard";
// import AddNewAccessory from "../admincomponents/Accessories/AddNewAccessory";
// import EditProduct from "../admincomponents/Products/EditProduct";
// import ViewAccessory from "../admincomponents/Accessories/ViewAccessory";
// import EditAccessory from "../admincomponents/Accessories/EditAccessory";
// import Products from "../../pages/client/products/Products";
// import AllProducts from "../admincomponents/Products/AllProducts";
// import ViewSingleProduct from "../../pages/client/products/ViewSingleProduct";

// const LoginPage = lazy(() => import("../../pages/auth/LoginPage"));
// const ForgetPassword = lazy(() => import("../../pages/auth/ForgetPassword"));
// const ResetPassword = lazy(() => import("../../pages/auth/ResetPassword"));

// const NotFound = lazy(() => import("../../pages/NotFound"));
// const AdminPage = lazy(() => import("../../pages/admin/AdminPage"));
// const ViewProduct = lazy(() =>
//   import("../admincomponents/Products/ViewProduct")
// );
// const Customers = lazy(() => import("../admincomponents/Customers/Customers"));
// const AddNewProduct = lazy(() =>
//   import("../admincomponents/Products/AddNewProduct")
// );
// const Accessories = lazy(() =>
//   import("../admincomponents/Accessories/Accessories")
// );
// const Orders = lazy(() => import("../admincomponents/Orders/Orders"));

// export default function Router() {
//   return (
//     <Suspense fallback={<Loader />}>
//       <Routes>
//         {/* Public Routes */}
//         <Route path="/" element={<Products />} />
//         <Route path="/products/:productUrl" element={<ViewSingleProduct />} />

//         {/* <Route element={<PublicRoute />}> */}
//           <Route path="/login" element={<LoginPage />} />
//           <Route path="/forget-password" element={<ForgetPassword />} />
//           <Route path="/reset-password/:token" element={<ResetPassword />} />
//         {/* </Route> */}

//         {/* Admin Routes */}
//         {/* <Route element={<PrivateRoute role="admin" />}> */}
//           <Route path="/admin" element={<AdminPage />}>
//             <Route index element={<Navigate to="/admin/dashboard" replace />} />
//             <Route path="dashboard" element={<Dashboard />} />
//             <Route path="customers" element={<Customers />} />

//             {/* Products */}
//             <Route path="products" element={<AllProducts />} />
//             <Route path="products/new" element={<AddNewProduct />} />
//             <Route path="products/view/:id" element={<ViewProduct />} />
//             <Route path="products/edit/:id" element={<EditProduct />} />

//             {/* Accessories */}
//             <Route path="accessories" element={<Accessories />} />
//             <Route path="accessories/new" element={<AddNewAccessory />} />
//             <Route path="accessories/view/:id" element={<ViewAccessory />} />
//             <Route path="accessories/edit/:id" element={<EditAccessory />} />

//             <Route path="orders" element={<Orders />} />
//           </Route>
//         {/* </Route> */}

//         {/* Fallback for Not Found */}
//         <Route path="*" element={<NotFound />} />
//       </Routes>
//     </Suspense>
//   );
// }
