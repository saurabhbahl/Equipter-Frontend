import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faEdit } from "@fortawesome/free-solid-svg-icons";
import TableRow from "../../Table/TableRow";

const ProductTableRow = ({ product }: { product: any }) => {
  const columns = [
    product.image ? (
      <img
        src={product.image}
        alt={product.name}
        className="w-16 h-16 object-cover"
      />
    ) : (
      <div className="w-16 h-16 bg-gray-200 flex items-center justify-center">
        No Image
      </div>
    ),
    product.name,
    product.category,
    product.price,
    <span
      className={`px-3 py-1 text-sm font-semibold rounded-full ${
        product.stock ? "bg-green-500 text-white" : "bg-red-500 text-white"
      }`}
    >
      {product.stock ? "In Stock" : "Out of Stock"}
    </span>,
  ];

  const actions = [
    {
      icon: <FontAwesomeIcon icon={faEdit} />,
      className: "hover:text-blue-500",
    },
    {
      icon: <FontAwesomeIcon icon={faTrashAlt} />,
      className: "hover:text-red-500",
    },
  ];

  return <TableRow columns={columns} actions={actions} />;
};

export default ProductTableRow;
