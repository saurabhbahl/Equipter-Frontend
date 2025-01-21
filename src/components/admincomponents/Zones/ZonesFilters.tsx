import React, { useState} from "react";
import { faAdd, faRemove } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSearchParams } from "react-router-dom";
import ReactDOM from "react-dom";
import AddAndEditZone from "./AddEditZone";

const ZonesFilters: React.FC = () => {  
  const [searchParams, setSearchParams] = useSearchParams();
  const [showAddZone, setShowAddZone] = useState(false);
  
  const handleClearFilters = () => {
    const params = Object.fromEntries(searchParams.entries());
    const filterKeys = ["zone_name", "is_delivery_paused", "state_name"];
    filterKeys.forEach((key) => delete params[key]);
    params["page"] = "1";
    setSearchParams(params);
  };
  
  const handleAddZone = () => {
    setShowAddZone(true);
  };
  
  return (
    <div className="flex text-sm gap-4 items-end justify-end self-end">
      {/* Add Zone Button */}
      <button
        onClick={handleAddZone}
        className="btn-yellow px-3 py-1 text-sm font-sans hover:scale-105 capitalize rounded">
        <FontAwesomeIcon icon={faAdd} /> New Zone
      </button>

      {/* Clear Filters Button */}
      <button
        onClick={handleClearFilters}
        className="btn-yellow px-3 py-1 text-sm font-sans hover:scale-105 capitalize rounded hidden" >
        <FontAwesomeIcon icon={faRemove} /> Clear Filters
      </button>

      {/* AddAndEditZone Modal */}
      {showAddZone &&
        ReactDOM.createPortal(
          <AddAndEditZone
            key="add-zone"
            status="Add"
            onClose={() => setShowAddZone(false)}
          />,
          document.body
        )}
    </div>
  );
};

export default ZonesFilters;
