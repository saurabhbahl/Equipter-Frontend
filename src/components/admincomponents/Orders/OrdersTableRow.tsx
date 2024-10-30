import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faEdit, faEye } from "@fortawesome/free-solid-svg-icons";
import TableRow from "../../Table/TableRow";

const OrdersTableRow = ({ order }: any) => {
  const getStatusStyle = (status: string): string => {
    switch (status) {
      case "Pending":
        return "bg-yellow-500 text-white";
      case "Processing":
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
    order.image ? (
      <img
        src={order.image}
        alt={order.name}
        className="w-12 h-12 text-center mx-auto object-cover"
      />
    ) : (
      <div className="w-12 h-12 text-sm mx-auto bg-gray-200 flex items-center justify-center">
        No Image
      </div>
    ),
    order.orderId,
    order.customerName,
    order.date,
    order.total,
    <span
      className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusStyle(
        order.status
      )}`}
    >
      {order.status}
    </span>,
  ];

  const actions = [
    {
      icon: <FontAwesomeIcon icon={faEye} />,
      title: "Order Details",
      className: "hover:text-blue-500",
      onClick: () => {},
    },
    {
      icon: <FontAwesomeIcon icon={faEdit} />,
      title: "Edit Order",
      className: "hover:text-blue-500",
      onClick: () => {},
    },
    {
      icon: <FontAwesomeIcon icon={faTrashAlt} />,
      title: "Delete Order",
      className: "hover:text-red-500",
      onClick: () => {},
    },
  ];

  return <TableRow columns={columns} actions={actions} />;
};

export default OrdersTableRow;
