// import ProductTable from "./ProductTable";

// const Products = () => {
//   const products = [
//     {
//       name: "Apple iPhone 14",
//       category: "Electronics",
//       price: "$999",
//       stock: true,
//       iamge
//     },
//     {
//       name: "Samsung Galaxy S21",
//       category: "Electronics",
//       price: "$899",
//       stock: false,
//       image:
//     },
//     {
//       name: "Sony Headphones",
//       category: "Accessories",
//       price: "$199",
//       stock: true,
//       image:
//     },
//   ];

//   return (
//     <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg">
//       <div className="flex items-center justify-between pb-4">
//         <h1 className="text-2xl font-semibold text-custom-gray">
//           Product List
//         </h1>
//         <button className="btn-yellow text-sm !p-2">
//           Add New Product
//         </button>
//       </div>

//       <ProductTable products={products} />
//     </div>
//   );
// };

// export default Products;

import {  useNavigate } from "react-router-dom";
import ProductTable from "./ProductTable";

const Products = () => {
  const nav = useNavigate();

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between pb-4">
        <h1 className="text-2xl font-semibold text-custom-gray">
          Product List
        </h1>
        <button
          className="btn-yellow text-sm !p-2"
          onClick={() => {
            nav("/admin/products/new");
          }}
        >
          Add New Product
        </button>
      </div>
      <ProductTable />
      {/* <Outlet/> */}
    </div>
  );
};

export default Products;
