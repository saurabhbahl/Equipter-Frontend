import { formatDate } from "../../../utils/helpers";
import TableRow from "../../Table/TableRow";

const WebQuoteTableRow = ({ webquote, no }: any) => {

  const { product_name, id, created_at, zone_id, stage, financing ,shipping_method_used,product_price} = webquote;
  const columns = [
    no,
    ` ${id?.slice(0, 6)}`,
    ` ${product_name?.slice(0, 10)}..`,
    Math.ceil(product_price),
    ` ${zone_id?.slice(0, 13)}`,
    stage,
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
