// import { useNavigate } from "react-router-dom";
// import ProductTable from "./ProductTable";

// const Products = () => {
//   const nav = useNavigate();

//   return (
//     <div className=" mx-auto p-8 bg-white my-2">
//       <div className="flex items-center justify-between pb-4 !sticky !top-0  z-100  bg-white p-4 rounded-sm shadow-md">
//         <h1 className="text-2xl font-semibold text-custom-gray">
//           Product List
//         </h1>
//         <button
//           className="btn-yellow text-sm !p-2"
//           onClick={() => {
//             nav("/admin/products/new");}}
//         >
//           Add New Product
//         </button>
//       </div>
//       <ProductTable />
//     </div>
//   );
// };

// export default Products;

// import { useNavigate } from "react-router-dom";
// import ProductTable from "./ProductTable";

// const Products = () => {
//   const nav = useNavigate();

//   return (
//     <div className=" mx-auto p-8 bg-white my-2">
//         <div className="flex items-center my-4 justify-between pb-4 bg-white p-4 rounded-sm shadow-md">
//         <h1 className="text-2xl font-semibold text-gray-700">Products</h1>
//         <button
//           className="btn-yellow text-sm !p-2"
//           onClick={() => {
//             nav("/admin/products/new");}}
//         >
//           Add New Product
//         </button>
//       </div>

//       <ProductTable />
//     </div>
//   );
// };

// export default Products;

import ProductTable from "./ProductTable";
import SubTitle from "../rootComponents/SubTitle";

import BreadCrump from "../rootComponents/BreadCrump";

const Products = () => {
  const breadcrumbs = [
    { label: "Dashboard", link: "/" },
    { label: "Products", link: "/products" },
  ];
  return (
    <div className="mx-auto  font-sans  bg-gray-200 h-full ">
      <div className="flex justify-between bg-gradient-to-b p-5 border shadow- outline-none  from-gray-800 to-black/90">
        <p className="text-white ">Products</p>
        <BreadCrump breadcrumbs={breadcrumbs} />
      </div>
      <div className="p-5">
        <SubTitle
          title="Products"
          buttonLink="/admin/products/new"
          buttonText={`Add New Product `}
        />
        <ProductTable />{" "}
      </div>
    </div>
  );
};

export default Products;
