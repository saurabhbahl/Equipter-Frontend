import React, { useState } from "react";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TableRow from "../../Table/TableRow";
import ReactDOM from "react-dom";
import AddAndEditZone from "./AddEditZone";
import { Zone } from "./ZoneSchemas";


interface ZonesTableRowProps {
  zoneRow: Zone;
  no: number;
}

const ZonesTableRow: React.FC<ZonesTableRowProps> = ({ zoneRow, no }) => {
  const { id, zone_name, shipping_rate, states_count } = zoneRow;
  const [showPortal, setShowPortal] = useState(false);
  // const { fetchZones } = useAdminContext();
  // const { addNotification } = useNotification();

  const columns = [
    no,
    ` ${id?.slice(0, 6)}`,
    zone_name,
    ` $${shipping_rate}`,
    String(states_count),
  ];

  const handleEdit = () => {
    setShowPortal(true);
  };

  // const handleDelete = async () => {
  //   const confirmDelete = window.confirm(
  //     `Are you sure you want to delete the zone "${zone_name}"? This will also remove all associated states.`
  //   );
  //   if (!confirmDelete) return;

  //   try {
  //     const deleteRes = await apiClient.delete(`/state/zones/${id}`);
  //     if (deleteRes.status === 200) {
  //       addNotification("success", "Zone deleted successfully!");
  //       fetchZones()
  //     } else {
  //       addNotification("error", "Failed to delete the zone.");
  //     }
  //   } catch (error: any) {
  //     console.error(error);
  //     addNotification("error", "An error occurred while deleting the zone.");
  //   }
  // };

  const actions = [
    {
      icon: <FontAwesomeIcon icon={faEdit} />,
      title: "Edit Zone",
      className: "hover:text-blue-500",
      onClick: handleEdit,
    },
    // {
    //   icon: <FontAwesomeIcon icon={faTrashAlt} />,
    //   title: "Delete Zone",
    //   className: "hover:text-red-500",
    //   onClick: handleDelete,
    // },
  ];

  return (
    <>
      {showPortal &&
        ReactDOM.createPortal(
          <AddAndEditZone
            key="edit-zone"
            status="Edit"
            zone_id={id}
            onClose={() => setShowPortal(false)}
          />,
          document.body
        )}
      <TableRow columns={columns} actions={actions} />
    </>
  );
};

export default ZonesTableRow;
