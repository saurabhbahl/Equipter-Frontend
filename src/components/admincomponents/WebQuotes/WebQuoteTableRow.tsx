import { Link } from "react-router-dom";
import { formatDate } from "../../../utils/helpers";
import TableRow from "../../Table/TableRow";

interface WebQuoteTableRowProps {
  webquote: any;
  no: number;
}

const WebQuoteTableRow = ({ webquote, no }: WebQuoteTableRowProps) => {
  const { product_name, id, created_at,  stage, financing ,shipping_method_used,product_price,product_url,zone_name} = webquote;
  const columns = [
    no,
    ` ${id?.slice(0, 6)}`,
    <Link to={`/products/${product_url}?webQuote=${id}`} className="cursor-pointer underline hover:text-blue-500">{product_name}</Link>,
    Math.ceil(Number(product_price)),
    ` ${zone_name||"--"}`,
    stage||"--",
    shipping_method_used,
    financing,
    formatDate(created_at),

    // <span
    //   className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusStyle(
    //     webquote.status
    //   )}`}
    // >
    //   {webquote.status}
    // </span>,
  ];

  // const actions = [
  //   {
  //     icon: <FontAwesomeIcon icon={faEye} />,
  //     title: "webquote Details",
  //     className: "hover:text-blue-500",
  //     onClick: () => {},
  //   },
  //   {
  //     icon: <FontAwesomeIcon icon={faEdit} />,
  //     title: "Edit webquote",
  //     className: "hover:text-blue-500",
  //     onClick: () => {},
  //   },
  //   {
  //     icon: <FontAwesomeIcon icon={faTrashAlt} />,
  //     title: "Delete webquote",
  //     className: "hover:text-red-500",
  //     onClick: () => {},
  //   },
  // ];

  return <TableRow columns={columns} />;
};

export default WebQuoteTableRow;
