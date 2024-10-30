import TableRow from "../../Table/TableRow";

const AccessoriesTableRow = ({ accessory }: any) => {
  const columns = [
    accessory.image ? (
      <img
        src={accessory.image}
        alt={accessory.name}
        className="w-12 h-12 rounded-full object-cover mx-auto"
      />
    ) : (
      <div className="w-12 h-12 mx-auto bg-gray-200 flex items-center justify-center">
        No Image
      </div>
    ),
    <span className="font-semibold text-gray-700">{accessory.name}</span>,
    <span className="text-gray-500">{accessory.category}</span>,
    <span className="text-blue-500 font-semibold">{accessory.price}</span>,
    <span
      className={`font-semibold text-sm px-3 py-1 rounded-full ${
        accessory.stockStatus === "In Stock"
          ? "bg-green-100 text-green-500"
          : accessory.stockStatus === "Low Stock"
          ? "bg-yellow-100 text-yellow-500"
          : "bg-red-100 text-red-500"
      }`}
    >
      {accessory.stockStatus}
    </span>,
    <span className="text-gray-500">{accessory.country}</span>,
  ];

  return <TableRow columns={columns} />;
};

export default AccessoriesTableRow;
