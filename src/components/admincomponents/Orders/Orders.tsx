import { useEffect } from "react";
import BreadCrump from "../rootComponents/BreadCrump";
import { useAdminContext } from "../../../hooks/useAdminContext";
import MetaComponent from "../../../utils/MetaComponent";
import { ErrorWithMessage } from "../../../types/componentsTypes";
import { GlobalLoadingState } from "../../../contexts/AdminContext";
import { apiClient } from "../../../utils/axios";
import OrdersTable from "./OrdersTable";

const Orders = () => {
  const breadcrumbs = [
    { label: "Dashboard", link: "/" },
    { label: "Orders", link: "/orders" },
  ];
  const {
    orders,
    setOrders,
    setError,
    setLoading,
  } = useAdminContext();

  const fetchOrderssData = async () => {
    try {
      setLoading((prev) => ({ ...prev, accessories: true }));
      setError((prev) => ({ ...prev, accessories: "" }));
      const orders = await apiClient.get("/order")
      setOrders(orders.data.data);
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
    if (orders.length > 0) {
      return;
    } else {
      fetchOrderssData();
    }
  }, []);

  return (
    <>
      <MetaComponent title="Orders" />
      <div className="mx-auto  font-sans  bg-gray-200 h-full ">
        {/* header */}
        <div className="flex justify-between bg-gradient-to-b p-5 border shadow- outline-none  from-gray-800 to-black/90">
          <p className="text-white ">Orders</p>
          <BreadCrump breadcrumbs={breadcrumbs} />
        </div>
        {/* Table and Searchbar,Add New Button */}
        <div className="p-5">
          <OrdersTable />
        </div>
      </div>
    </>
  );
};

export default Orders;
