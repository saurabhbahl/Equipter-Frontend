import AccessoriesTable from "./AccessoriesTable";
import SubTitle from "../rootComponents/SubTitle";
import BreadCrump from "../rootComponents/BreadCrump";
import { useAdminContext } from "../../../hooks/useAdminContext";

import { useEffect } from "react";
import MetaComponent from "../../../utils/MetaComponent";
import { ErrorWithMessage } from "../../../types/componentsTypes";
import { GlobalLoadingState } from "../../../contexts/AdminContext";
import { apiClient } from "../../../utils/axios";

const Accessories = () => {
  const breadcrumbs = [
    { label: "Dashboard", link: "/" },
    { label: "Accessories", link: "/accessories" },
  ];
  const {
    accessories,
    setAccessories,
    setError,
    loading,
    setLoading,
  } = useAdminContext();

  const fetchAccessoriesData = async () => {
    try {
      setLoading((prev) => ({ ...prev, accessories: true }));
      setError((prev) => ({ ...prev, accessories: "" }));
      const data = await apiClient.get("/accessory")
    
      setAccessories(data.data.data);
    } catch (error) {
      console.log(error);
      setError((prev) => ({
        ...prev,
        accessories:
          (error as ErrorWithMessage).message || "Unexpected error occurred",
      }));
    } finally {
      setLoading((prev:GlobalLoadingState)=>({...prev, accessories: false }));
    }
  };

  useEffect(() => {
    if (accessories.length > 0) {
      return;
    } else {
      fetchAccessoriesData();
    }
  }, []);

  return (
    <>
      <MetaComponent title="Accessories" />
      <div className="mx-auto  font-sans  bg-gray-200 h-full ">
        {/* header */}
        <div className="flex justify-between bg-gradient-to-b p-5 border shadow- outline-none  from-gray-800 to-black/90">
          <p className="text-white ">Accessories</p>
          <BreadCrump breadcrumbs={breadcrumbs} />
        </div>
        {/* Table and Searchbar,Add New Button */}
        <div className="p-5">
          <SubTitle
            title="Accessories"
            reloadBtnFn={fetchAccessoriesData}
            buttonLink="/admin/accessories/new"
            loading={loading.accessories}
            buttonText={`Add New Accessory `}
          />
          <AccessoriesTable />
        </div>
      </div>
    </>
  );
};

export default Accessories;
