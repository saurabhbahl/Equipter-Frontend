import TableRow from "../../Table/TableRow";

const CustomersTableRow = ({ customer }:any) => {
  const columns = [
    <div className="flex items-center justify-center mx-auto space-x-3">
      <img
        src={customer.image}
        alt={customer.name}
        className="w-10 h-10 rounded-full object-cover"
      />
      <span className="font-semibold text-gray-700">{customer.name}</span>
    </div>,
    <span className="text-gray-500">{customer.email}</span>,
    <span className="text-green-500 font-semibold">{customer.spent}</span>,
    <span className="text-gray-500">{customer.country}</span>,
  ];

  return <TableRow columns={columns} />;
};

export default CustomersTableRow;
