import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TableRow from "../../Table/TableRow";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import AddAndEditState from "./AddAndEditState";
import { useState } from "react";
import ReactDOM from "react-dom";
import { apiClient } from "../../../utils/axios";
import { useNotification } from "../../../contexts/NotificationContext";
import { useAdminContext } from "../../../hooks/useAdminContext";
const StatesTableRow = ({ stateRow, no }: any) => {
  const [showPortal, setShowPortal] = useState(false);
  const { addNotification } = useNotification();
  const {fetchStates}=useAdminContext()
  const { state_name, state_id, zone_name, shipping_rate, is_delivery_paused } =
    stateRow;
  const columns = [
    no,
    ` ${state_id?.slice(0, 6)}`,
    state_name,
    zone_name,
    shipping_rate,
    is_delivery_paused==true ? "Yes":"No",
  ];
  function handleEdit() {
    setShowPortal((prev) => !prev);
  }

  async function handleDelete() {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the state "${state_name}"?.`
    );
    if (!confirmDelete) return;
    const deleteRes = await apiClient.delete(`/state/states/${state_id}`);
    if (deleteRes.status == 200) {
      addNotification("success", "State Deleted Successfully!");  
      fetchStates()    
    }else{
      addNotification("error", "Error Deleting State!");      
    }
  }

  const actions = [
    {
      icon: <FontAwesomeIcon icon={faEdit} />,
      title: "Edit State",
      className: "hover:text-blue-500",
      onClick: () => handleEdit(),
    },
    {
      icon: <FontAwesomeIcon icon={faTrashAlt} />,
      title: "Delete State",
      className: "hover:text-red-500",
      onClick: () => handleDelete(),
    },
  ];

  return (
    <>
      {showPortal &&
        ReactDOM.createPortal(
          <AddAndEditState
            status="Edit"
            key={"edit"}
            state_id={state_id}
            onClose={() => setShowPortal((prev) => !prev)}
          />,
          document.body
        )}
      <TableRow columns={columns} actions={actions} />
    </>
  );
};

export default StatesTableRow;
