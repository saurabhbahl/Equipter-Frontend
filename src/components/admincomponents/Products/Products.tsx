import ProductTable from "./ProductTable";
import SubTitle from "../rootComponents/SubTitle";

import BreadCrump from "../rootComponents/BreadCrump";
import { useAdminContext } from "../../../hooks/useAdminContext";
import { ProductsService } from "./ProductsService";
import { useEffect } from "react";
import MetaComponent from "../../../utils/MetaComponent";

const Products = () => {
  const breadcrumbs = [
    { label: "Dashboard", link: "/" },
    { label: "Products", link: "/products" },
  ];
  const {
    products,
    setProducts,
    setError,
    loading,
    setLoading,
  } = useAdminContext();

  const fetchProductsData = async () => {
    try {
      setLoading((prev) => ({ ...prev, products: true }));
      setError((prev) => ({ ...prev, products: "" }));
      const data = await ProductsService.fetchProductsWithImages();
      console.log(data);
      setProducts(data);
    } catch (error) {
      console.log(error);
      setError((prev) => ({
        ...prev,
        products: error.message || "Unexpected error occured",
      }));
    } finally {
      setLoading((prev) => ({ ...prev, products: false }));
    }
  };

  useEffect(() => {
    if (products.length > 0) {   
      return;
    } else {
      fetchProductsData();
    }
  }, []);

  return (
    <>
      <MetaComponent title="Products" />
      <div className="mx-auto  font-sans  bg-gray-200 h-full ">
        <div className="flex justify-between bg-gradient-to-b p-5 border shadow-sm outline-none  from-gray-800 to-black/90">
          <p className="text-white ">Products</p>
          <BreadCrump breadcrumbs={breadcrumbs} />
        </div>
        <div className="p-5">
          <SubTitle
            title="Products"
            buttonLink="/admin/products/new"
            buttonText={`Add New Product `}
            reloadBtnFn={fetchProductsData}
            loading={loading.products}
          />
          <ProductTable />
        </div>
      </div>{" "}
    </>
  );
};

export default Products;
