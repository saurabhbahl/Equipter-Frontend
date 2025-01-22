import { useEffect, useState } from "react";
import BreadCrump from "../rootComponents/BreadCrump";
import { useAdminContext } from "../../../hooks/useAdminContext";
import MetaComponent from "../../../utils/MetaComponent";
import { ErrorWithMessage } from "../../../types/componentsTypes";
import { GlobalLoadingState } from "../../../contexts/AdminContext";
import { apiClient } from "../../../utils/axios";
import OrdersTable from "./OrdersTable";
import { useSearchParams } from "react-router-dom";
import { PerPageSelector } from "../rootComponents/PerPageSelector";
import SubTitle from "../rootComponents/SubTitle";
import Pagination from "../rootComponents/Pagination";
import OrderFilters from "./OrderFilters";

const Orders = () => {
  const breadcrumbs = [
    { label: "Dashboard", link: "/" },
    { label: "Orders", link: "/orders" },
  ];
  const { orders, setOrders, setError, loading, setLoading } =
    useAdminContext();
  const [searchParams] = useSearchParams();
  const [totalPages, setTotalPages] = useState(1);
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const order_status = searchParams.get("order_status") || "";
  const duration = searchParams.get("duration") || "";
  const order_id = searchParams.get("order_id") || "";

  const fetchOrdersData = async () => {
    try {
      setLoading((prev) => ({ ...prev, orders: true }));
      setError((prev) => ({ ...prev, orders: "" }));
      const response = await apiClient.get(`/order/?page=${page}&limit=${limit}&order_status=${order_status}&duration=${duration}&order_id=${order_id}`);
      const { data } = response.data;
      const { totalPages = 1 } = response.data;
      setOrders(data);
      setTotalPages(totalPages);
    } catch (error) {
      setError((prev) => ({
        ...prev,
        accessories:
          (error as ErrorWithMessage).message || "Unexpected error occurred",
      }));
    } finally {
      setLoading((prev: GlobalLoadingState) => ({ ...prev, orders: false }));
    }
  };

  useEffect(() => {
      fetchOrdersData();
  }, [searchParams]);

  return (
    <>
      <MetaComponent title="Orders" />
      <div className="mx-auto font-sans bg-gray-200 h-full">
        <div className="flex justify-between bg-gradient-to-b p-5 border shadow from-gray-800 to-black/90">
          <p className="text-white">Orders</p>
          <BreadCrump breadcrumbs={breadcrumbs} />
        </div>

        {/* Main Content */}
        <div className="p-5">
          <SubTitle
            title="Orders"
            reloadBtnFn={fetchOrdersData}
            loading={loading.orders}
            subComp={<OrderFilters />}
          />
          <OrdersTable />
          <div className="flex flex-col md:flex-row gap-5 justify-start items-center my-auto mt-4">
            <Pagination
              key={"orders"}
              currentPage={page}
              totalPages={totalPages}
            />
            {orders.length > 0 && (
              <PerPageSelector
                key={"ordersPerPageFilter"}
                currentLimit={limit}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Orders;
