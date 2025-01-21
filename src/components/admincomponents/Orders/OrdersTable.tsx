import LoaderSpinner from "../../utils/LoaderSpinner";
import { useAdminContext } from "../../../hooks/useAdminContext";
import TableHeading from "../../Table/TableHeading";
import { Iorder } from "./OrdersSchema";
import OrdersTableRow from "./OrdersTableRow";

const OrdersTable = () => {
  const headers = ["Sr.No.", "ID", "Webquote", "Order Status", "Estimated Completion Date", "Actual Completion Date", "Actions"];
  const { orders, error, loading } = useAdminContext();

  if (loading.orders)
    return ( 
      <div className="w-full h-96 my-10 text-center mx-auto flex justify-center items-center ">
        <LoaderSpinner classes="w-[2rem] h-[2rem]" />
      </div>
    );

  if (error?.orders) {
    return <p className="text-red-600 text-center">{error.orders}</p>;
  }

  return (
    <>
      {orders?.length > 0 ? (
        <div className="overflow-x-auto relative shadow-md rounded-lg">
          <table className="w-full text-sm !text-center text-gray-500 ">
            <TableHeading headers={headers} />
            <tbody className="bg-white">
              {orders?.map((order:Iorder, index:number) => (
                <OrdersTableRow
                  key={index}
                  order={order as Iorder}
                  no={index + 1}
                />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div>
          <p className="text-custom-orange text-center">No Orders Found</p>
        </div>
      )}
    </>
  );
};

export default OrdersTable;
