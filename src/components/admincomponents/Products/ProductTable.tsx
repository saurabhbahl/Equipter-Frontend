// import ProductTableRow from "./ProductTableRow";

// const ProductTable = ({ products }) => {
//   return (
//     <div className="overflow-auto">
//       <table className="min-w-full table-auto">
//         <thead>
//           <tr className="border-b border-gray-200">
//             <th className="px-6 py-4 text-left font-semibold text-custom-gray">
//               Product Name
//             </th>
//             <th className="px-6 py-4 text-left font-semibold text-custom-gray">
//               Category
//             </th>
//             <th className="px-6 py-4 text-left font-semibold text-custom-gray">
//               Price
//             </th>
//             <th className="px-6 py-4 text-left font-semibold text-custom-gray">
//               Stock Status
//             </th>
//             <th className="px-6 py-4 text-center font-semibold text-custom-gray">
//               Actions
//             </th>
//           </tr>
//         </thead>
//         <tbody>
//           {products.map((product:any, index:any) => (
//             <ProductTableRow key={index} product={product} />
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default ProductTable;

import ProductTableRow from "./ProductTableRow";

const ProductTable = () => {
  const products = [
    {
      name: "Apple iPhone 14",
      category: "Electronics",
      price: "$999",
      stock: true,
      image:
        "https://images.pexels.com/photos/1653327/pexels-photo-1653327.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
    {
      name: "Samsung Galaxy S21",
      category: "Electronics",
      price: "$899",
      stock: false,
      image: null,
    },
    {
      name: "Sony Headphones",
      category: "Accessories",
      price: "$199",
      stock: true,
      image:
        "https://images.pexels.com/photos/1653327/pexels-photo-1653327.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
    {
      name: "Sony Headphones",
      category: "Accessories",
      price: "$199",
      stock: true,
      image:
        "https://images.pexels.com/photos/1653327/pexels-photo-1653327.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
    {
      name: "Sony Headphones",
      category: "Accessories",
      price: "$199",
      stock: true,
      image:
        "https://images.pexels.com/photos/1653327/pexels-photo-1653327.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
    {
      name: "Sony Headphones",
      category: "Accessories",
      price: "$199",
      stock: true,
      image:
        "https://images.pexels.com/photos/1653327/pexels-photo-1653327.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
    {
      name: "Sony Headphones",
      category: "Accessories",
      price: "$199",
      stock: true,
      image:
        "https://images.pexels.com/photos/1653327/pexels-photo-1653327.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
  ];
  return (
    <div className="overflow-auto">
      <table className="min-w-full table-auto">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="px-6 py-4 text-left font-semibold text-custom-gray">
              Image
            </th>
            <th className="px-6 py-4 text-left font-semibold text-custom-gray">
              Product Name
            </th>
            <th className="px-6 py-4 text-left font-semibold text-custom-gray">
              Category
            </th>
            <th className="px-6 py-4 text-left font-semibold text-custom-gray">
              Price
            </th>
            <th className="px-6 py-4 text-left font-semibold text-custom-gray">
              Stock Status
            </th>
            <th className="px-6 py-4 text-center font-semibold text-custom-gray">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <ProductTableRow key={index} product={product} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
