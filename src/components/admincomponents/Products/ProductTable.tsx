
import { useEffect, useState } from "react";
import ProductTableRow from "./ProductTableRow";
import LoaderSpinner from "../../utils/LoaderSpinner";
import { SfAccessToken } from "../../../utils/useEnv";
const ProductTable = () => {
  const [products, setProducts] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); 

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        "/api/services/data/v52.0/query/?q=SELECT+Id,+Name,+Product_Price__c,+Down_Payment_Cost__c,+GVWR__c,+Lift_Capacity__c,+Lift_Height__c,+Container__c+FROM+Product__c",
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
    } catch (error:any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) return <div className="w-full h-96 my-10 text-center mx-auto flex justify-center items-center "><LoaderSpinner classes="w-[2rem] h-[2rem]"/></div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="overflow-auto shadow-lg">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="px-6 py-4 text-center font-semibold text-custom-gray">Sr.No.</th>
            {/* <th className="px-6 py-4 text-center font-semibold text-custom-gray">Image</th> */}
            <th className="px-6 py-4 text-center font-semibold text-custom-gray">Product Name</th>
            <th className="px-6 py-4 text-center font-semibold text-custom-gray">Price</th>
            <th className="px-6 py-4 text-center font-semibold text-custom-gray">GVWR</th>
            {/* <th className="px-6 py-4 text-center font-semibold text-custom-gray">Stock Status</th> */}
            <th className="px-6 py-4 text-center font-semibold text-custom-gray">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <ProductTableRow key={index} product={product} no={index} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
