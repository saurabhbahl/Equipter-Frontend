// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faEdit, faEye } from "@fortawesome/free-solid-svg-icons";
import TableRow from "../../Table/TableRow";
import { IOrder } from "./OrdersSchema";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../../utils/helpers";

interface OrdersTableRowProps{
  order: IOrder,
  no: number,
}

const OrdersTableRow = ({ order, no }: OrdersTableRowProps) => {
  const navigate = useNavigate();
  const getStatusStyle = (status: string): string => {
    switch (status) {
      case "Pending":
        return "bg-yellow-500 text-white";
      case "Approved":
        return "bg-orange-500 text-white";
      case "Shipped":
        return "bg-blue-500 text-white";
      case "Delivered":
        return "bg-green-500 text-white";
      case "Cancelled":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const columns = [
    no,
    order.id,
    <span onClick={() => navigate(`/products/${order.product.product_url}`)} className="cursor-pointer underline hover:text-blue-500">{order.product.name}</span>,
    <span
      className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusStyle(order.order_status)}`}
    >
      {order.order_status}
    </span>,
    formatDate(order.estimated_completion_date),
    formatDate(order.actual_completion_date)
  ];

  // const actions = [
  //   {
  //     icon: <FontAwesomeIcon icon={faEye} />,
  //     title: "Order Details",
  //     className: "hover:text-blue-500",
  //     onClick: () => {},
  //   },
  //   {
  //     icon: <FontAwesomeIcon icon={faEdit} />,
  //     title: "Edit Order",
  //     className: "hover:text-blue-500",
  //     onClick: () => {},
  //   },
  // ];

  return <TableRow columns={columns}  />;
};

export default OrdersTableRow;
