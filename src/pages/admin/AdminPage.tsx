"use server";
import { useEffect, useState } from "react";
import Loader from "../../components/Loader";
import InputField from "../../components/InputFeild";
import { productSchema } from "../../types/schemas/ProductSchema";
import { apiClient } from "../../utils/axios";

interface ProductRecord {
  Id: string;
  Name: string;
  Product_Price__c: string;
}

interface DataState {
  data: {
    records: ProductRecord[];
  };
  loading: boolean;
}

interface InputState {
  name: string;
  Product_Price__c: number | null;
}

const AdminPage = () => {
  const [dataState, setDataState] = useState<DataState>({
    data: { records: [] },
    loading: true,
  });

  const [inputData, setInputData] = useState<InputState>({
    name: "",
    Product_Price__c: null,
  });

  const [error, setError] = useState({
    name: "",
    Product_Price__c: "",
  });

  const [newRes, setNewRes] = useState<{
    feedbackMessage: string | null;
    loading: boolean;
    color: "red" | "green" | null;
  }>({ feedbackMessage: null, loading: false, color: "green" });

  // initial call
  useEffect(() => {
    const fetchProducts = async () => {
      const query = {
        query: "SELECT Id, Name, Product_Price__c FROM Product__c",
      };

      try {
        const response = await apiClient.post(`/sf/query`, query, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.data.success) {
          throw new Error("Failed to fetch products");
        }

        const resData = response.data;
        setDataState({ loading: false, data: resData.data });
      } catch {
        setDataState({ loading: false, data: { records: [] } });
      }
    };

    fetchProducts();
  }, [newRes.loading]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    const parsedValue =
      name === "Product_Price__c" ? (value ? Number(value) : null) : value;
    setInputData({ ...inputData, [name]: parsedValue });
    if (inputData.name.length >= 2) {
      setError({ ...error, name: "" });
    }
    if ((inputData.Product_Price__c as number) > 0) {
      setError({ ...error, Product_Price__c: "" });
    }
  }

  async function handleAddNew() {
    const data = { objectName: "Product__c", ...inputData };
    setError({ name: "", Product_Price__c: "" });
    const parsedData = productSchema.safeParse(data);
    if (!parsedData.success) {
      const newErrors: { name: string; Product_Price__c: string } = {
        name: "",
        Product_Price__c: "",
      };
      parsedData.error.issues.forEach((issue) => {
        const fieldName = issue.path[0] as keyof InputState;
        newErrors[fieldName] = issue.message;
      });
      setError(newErrors);
      return;
    }

    setNewRes({ feedbackMessage: null, loading: true, color: null });

    try {
      const res = await apiClient.post(`/sf/object/new`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.data.success) {
        setNewRes({
          feedbackMessage: "Product Added Successfully",
          loading: false,
          color: "green",
        });
        setInputData({ name: "", Product_Price__c: null });
        setTimeout(() => {
          setNewRes({ feedbackMessage: null, loading: false, color: null });
        }, 2000);
      } else {
        setNewRes({
          feedbackMessage: "Failed to add product",
          loading: false,
          color: "red",
        });
      }
    } catch {
      setNewRes({
        feedbackMessage: "An error occurred. Please try again.",
        loading: false,
        color: "red",
      });
    }
  }

  return (
    <>
      {dataState.loading ? (
        <Loader />
      ) : (
        <div className="flex flex-col justify-center items-center p-6">
          <h1 className="text-2xl font-bold mb-4">Add New Product</h1>
          {newRes.feedbackMessage && (
            <div
              className={`mb-4 ${
                newRes.color === "red" ? "text-red-600" : "text-green-600"
              } font-semibold transition-all ease-in duration-1000`}
            >
              {newRes.feedbackMessage}
            </div>
          )}
          <div className="flex justify-center gap-4 items-center my-auto">
            <InputField
              id="productName"
              type="text"
              value={inputData.name}
              onChange={handleChange}
              name="name"
              placeholder="Enter new product name"
              error={error.name}
            />
            <InputField
              id="productPrice"
              type="number"
              value={
                inputData.Product_Price__c !== null
                  ? inputData.Product_Price__c.toString()
                  : ""
              }
              onChange={handleChange}
              name="Product_Price__c"
              placeholder="Enter new product Price"
              error={error.Product_Price__c}
            />
            <button
              onClick={handleAddNew}
              className="border border-orange-300 bg-custom-orange text-white rounded-md p-1 mt-[4px] transition-transform transform hover:scale-105"
            >
              {newRes.loading ? <Loader /> : "Add Product"}
            </button>
          </div>
          {dataState?.data?.records?.length > 0 ? (
            <table className="max-w-3xl mx-auto shadow-md my-10 bg-white border border-gray-300 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Sr No.</th>
                  <th className="py-3 px-6 text-left">Id</th>
                  <th className="py-3 px-6 text-left">Name</th>
                  <th className="py-3 px-6 text-left">Product Price</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {dataState.data.records.map(
                  ({ Id, Name, Product_Price__c }, idx) => (
                    <tr
                      key={Id}
                      className="border-b border-gray-300 hover:bg-gray-100 transition-colors duration-300"
                    >
                      <td className="py-3 px-6">{idx + 1}</td>
                      <td className="py-3 px-6">{Id}</td>
                      <td className="py-3 px-6">{Name}</td>
                      <td className="py-3 px-6">${Product_Price__c}</td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          ) : (
            <div className="flex flex-col justify-center items-center p-6 font-bold">
              No Products Found
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default AdminPage;
