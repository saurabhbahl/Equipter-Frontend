import { useEffect } from "react";
import SingleProductComponent from "../components/SingleProductComponent";
import MetaComponent from "../../../utils/MetaComponent";
import { useClientContext } from "../../../hooks/useClientContext";
import LoaderSpinner from "../../../components/utils/LoaderSpinner";
import { publicApiClient } from "../../../utils/axios";
import FirstPageForm from "../FirstPageForm";

const Products = () => {
  const {
    products,
    setProducts,
    loading,
    setLoading,
    firstPageForm,
  } = useClientContext();

  // Fetch Products Data
  const fetchData = async () => {
    try {
      const data = await publicApiClient.get("/product");
      setProducts(data?.data.data || []);
      setLoading((prev) => ({ ...prev, products: false }));
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading((prev) => ({ ...prev, products: false }));
    }
  };

  // Fetch Data on Component Mount
  useEffect(() => {
    if (products.length < 1) {
      setLoading((prev) => ({ ...prev, products: true }));
      fetchData();
    }
  }, []);

  if (!firstPageForm.isFormFilled) {
    return <FirstPageForm />;
  }

  if (loading.products) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <LoaderSpinner />
      </div>
    );
  }

  // Render Products
  return (
    <div className=" ">
      <MetaComponent title="Products" />
      {products.length > 0 ? (
        <div>
          <MetaComponent title="Products" />
          {products.map((prod, index: number) => (
            <SingleProductComponent productDetail={prod} key={index} />
          ))}
        </div>
      ) : (
        <div className="w-full flex justify-center items-center py-20">
          <p className="text-gray-600 font-medium text-lg">
            No products found.
          </p>
        </div>
      )}
    </div>
  );
};

export default Products;
