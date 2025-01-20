import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TableRow from "../../Table/TableRow";

const ZonesTableRow = ({zoneRow,no}:any) => {
  const {  id,  zone_name,  shipping_rate,states_count} = zoneRow;
  const columns = [
    no,
    ` ${id?.slice(0, 6)}`,
    zone_name,
    ` $${shipping_rate}`,
    String(states_count),
  ];

  const actions = [

    {
      icon: <FontAwesomeIcon icon={faEdit} />,
      title: "Edit Zone",
      className: "hover:text-blue-500",
      onClick: () => {},
    },
    {
      icon: <FontAwesomeIcon icon={faTrashAlt} />,
      title: "Delete Zone",
      className: "hover:text-red-500",
      onClick: () => {},
    },
  ];

  return <TableRow columns={columns} actions={actions} />;
};


export default ZonesTableRow