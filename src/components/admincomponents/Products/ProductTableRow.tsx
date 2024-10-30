import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faEdit, faEye } from "@fortawesome/free-solid-svg-icons";
import TableRow from "../../Table/TableRow";

const ProductTableRow = ({ product }: { product: any }) => {
  const columns = [
    product.image ? (
      <img
        src={product.image}
        alt={product.name}
        className="w-12 h-12 mx-auto object-cover"/>
    ) : (
      <div className="w-12 h-12 mx-auto bg-gray-200 flex items-center justify-center">
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
      icon: <FontAwesomeIcon icon={faEye} />,
      title: "View Product",
      className: "hover:text-blue-500",
    },
    {
      icon: <FontAwesomeIcon icon={faEdit} />,
      title: "Edit Product",
      className: "hover:text-blue-500",
    },
    {
      icon: <FontAwesomeIcon icon={faTrashAlt} />,
      title: "Delete Product",
      className: "hover:text-red-500",
    },
  ];

  return <TableRow columns={columns} actions={actions} />;
};

export default ProductTableRow;
