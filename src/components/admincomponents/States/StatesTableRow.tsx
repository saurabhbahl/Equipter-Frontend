import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TableRow from "../../Table/TableRow";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

const StatesTableRow = ({ stateRow, no }: any) => {

  const { state_name, state_id,  zone_name,  shipping_rate ,is_delivery_paused} = stateRow;
  const columns = [
    no,
    ` ${state_id?.slice(0, 6)}`,
    state_name,
    zone_name,
    shipping_rate,
    String(is_delivery_paused),
  ];

  const actions = [

    {
      icon: <FontAwesomeIcon icon={faEdit} />,
      title: "Edit State",
      className: "hover:text-blue-500",
      onClick: () => {},
    },
    {
      icon: <FontAwesomeIcon icon={faTrashAlt} />,
      title: "Delete State",
      className: "hover:text-red-500",
      onClick: () => {},
    },
  ];

  return <TableRow columns={columns} actions={actions} />;
};

export default StatesTableRow;
