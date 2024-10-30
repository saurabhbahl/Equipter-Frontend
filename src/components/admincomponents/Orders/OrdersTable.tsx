import OrdersTableRow from "./OrdersTableRow";

const OrdersTable = () => {
  const orders = [
    {
      orderId: "12345",
      customerName: "John Wick",
      date: "2023-10-25",
      total: "$299.99",
      status: "Shipped",
      image:
        "https://images.pexels.com/photos/1653327/pexels-photo-1653327.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
    {
      orderId: "12346",
      customerName: "B",
      date: "2023-10-24",
      total: "$499.99",
      status: "Pending",
      image:
        "https://images.pexels.com/photos/1653327/pexels-photo-1653327.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
    {
      orderId: "12347",
      customerName: "C",
      date: "2023-10-23",
      total: "$199.99",
      status: "Delivered",
      image:
        "https://images.pexels.com/photos/1653327/pexels-photo-1653327.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
    {
      orderId: "12348",
      customerName: "D",
      date: "2023-10-22",
      total: "$299.99",
      status: "Processing",
      image:
        "https://images.pexels.com/photos/1653327/pexels-photo-1653327.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
    {
      orderId: "12349",
      customerName: "E",
      date: "2023-10-21",
      total: "$399.99",
      status: "Cancelled",
    },
  ];

  return (
    <div className="overflow-auto shadow-lg">
      <table className="w-full ">
        <thead>
          <tr className="border-b text-center    border-gray-300">
            <th className="px-6 py-4 text-center font-semibold text-custom-gray">
              Product Image
            </th>
            <th className="px-6 py-4 text-centerfont-semibold text-custom-gray">
              Order ID
            </th>
            <th className="px-6 py-4 text-center font-semibold text-custom-gray">
              Customer Name
            </th>
            <th className="px-6 py-4 text-center font-semibold text-custom-gray">
              Date
            </th>
            <th className="px-6 py-4 text-center font-semibold text-custom-gray">
              Total Amount
            </th>
            <th className="px-6 py-4 text-center font-semibold text-custom-gray">
              Status
            </th>
            <th className="px-6 py-4 text-center font-semibold text-custom-gray">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <OrdersTableRow key={index} order={order} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersTable;
