import { useNavigate } from "react-router-dom";
import OrdersTable from "./OrdersTable";

const Orders = () => {
  const nav = useNavigate();

  return (
    <div className="mx-auto p-8 bg-white my-5">
      <div className="flex items-center justify-between pb-4 !sticky !top-0 z-100 bg-white p-4 rounded-sm shadow-md">
        <h1 className="text-2xl font-semibold text-custom-gray">
          Order List
        </h1>
        <button
          className="btn-yellow text-sm !p-2"
          onClick={() => {
            nav("/admin/orders/new");
          }}>
          Button
        </button>
      </div>
      <OrdersTable />
    </div>
  );
};

export default Orders;
