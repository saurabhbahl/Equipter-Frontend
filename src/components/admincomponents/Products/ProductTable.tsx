// import { useEffect, useState } from "react";
// import ProductTableRow from "./ProductTableRow";
// import LoaderSpinner from "../../utils/LoaderSpinner";
// import { SfAccessToken } from "../../../utils/useEnv";
// import TableHeading from "../../Table/TableHeading";
// const ProductTable = () => {
//   const [products, setProducts] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const headers = ["Sr.No.", "Name", "Price", "GVWR", "Downpayment", "Actions"];

//   const fetchProducts = async () => {
//     try {
//       const response = await fetch(
//         "/api/services/data/v52.0/query/?q=SELECT+Id,+Name,+Product_Price__c,+Down_Payment_Cost__c,+GVWR__c,+Lift_Capacity__c,+Lift_Height__c,+Container__c+FROM+Product__c",
//         {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${SfAccessToken}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`Error fetching products: ${response.statusText}`);
//       }

//       const data = await response.json();

//       setProducts(data.records);
//     } catch (error:any) {
//       setError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   if (loading) return <div className="w-full h-96 my-10 text-center mx-auto flex justify-center items-center "><LoaderSpinner classes="w-[2rem] h-[2rem]"/></div>;
//   if (error) return <div>Error: {error}</div>;

//   return (
//     <div className="overflow-auto shadow-lg">
//       <table className="w-full">
//       <TableHeading headers={headers} />
//         <tbody>
//           {products.map((product, index) => (
//             <ProductTableRow key={index} product={product} no={index} />
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default ProductTable;

// import { useEffect, useState } from "react";
// import ProductTableRow from "./ProductTableRow";
// import LoaderSpinner from "../../utils/LoaderSpinner";
// import { SfAccessToken } from "../../../utils/useEnv";
// import TableHeading from "../../Table/TableHeading";

// const ProductTable = () => {
//   const [products, setProducts] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const headers = ["Sr.No.", "Name", "Price", "GVWR", "Downpayment", "Actions"];

//   const fetchProducts = async () => {
//     try {
//       const response = await fetch(
//         "/api/services/data/v52.0/query/?q=SELECT+Id,+Name,+Product_Price__c,+Down_Payment_Cost__c,+GVWR__c,+Lift_Capacity__c,+Lift_Height__c,+Container__c+FROM+Product__c",
//         {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${SfAccessToken}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`Error fetching products: ${response.statusText}`);
//       }

//       const data = await response.json();

//       setProducts(data.records);
//     } catch (error: any) {
//       setError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   if (loading)
//     return (
//       <div className="w-full h-96 my-10 flex justify-center items-center">
//         <LoaderSpinner classes="w-8 h-8" />
//       </div>
//     );
//   if (error) return <div>Error: {error}</div>;

//   return (
//     <div className="overflow-auto shadow-lg rounded-md">
//       <table className="w-full table-auto">
//         <TableHeading headers={headers} />
//         <tbody className="bg-white divide-y divide-gray-200">
//           {products.map((product, index) => (
//             <ProductTableRow key={index} product={product} no={index} />
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default ProductTable;

import React, { useEffect, useState } from "react";
import ProductTableRow from "./ProductTableRow";
import LoaderSpinner from "../../utils/LoaderSpinner";
import { SfAccessToken } from "../../../utils/useEnv";
import TableHeading from "../../Table/TableHeading";
import { useAdminContext } from "../../../hooks/useAdminContext";

const ProductTable = () => {
  // const [products, setProducts] = useState([]);
  const { products, setProducts } = useAdminContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "/api/services/data/v52.0/query/?q=SELECT Id, Name, Product_Price__c, Down_Payment_Cost__c, GVWR__c FROM Product__c",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${SfAccessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error fetching products: ${response.statusText}`);
        }

        const data = await response.json();
        setProducts(data.records);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    console.log(products)
    if (products.length > 1) {
      setLoading(false)
      return;
      
    } else {
      fetchProducts();
    }
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full h-96">
        <LoaderSpinner />
      </div>
    );
  }

  if (error) {
    return <p className="text-red-600 text-center">{error}</p>;
  }

  return (
    <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left text-gray-500">
        <TableHeading
          headers={[
            "Sr.No.",
            "ID",
            "Name",
            "Price",
            "GVWR",
            "Downpayment",
            "Actions",
          ]}
        />
        <tbody className="bg-white">
          {products.map((product, index) => (
            <ProductTableRow
              key={product.Id}
              product={product}
              no={index + 1}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
