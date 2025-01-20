import { faAdd, faRemove } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChangeEvent, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ReactDOM from "react-dom";
import AddAndEditState from "./AddAndEditState";
export const StateFilters: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showPortal, setShowPortal] = useState(false);
  const is_delivery_paused = searchParams.get("is_delivery_paused") || "";
  const zone_name = searchParams.get("zone_name") || "";
  const state_name = searchParams.get("state_name") || "";

  const updateQueryParam = (key: string, value: string) => {
    const params = Object.fromEntries(searchParams.entries());
    params[key] = value;
    params["page"] = "1";
    setSearchParams(params);
  };

  const handleFilterChange = (
    e: ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    updateQueryParam(name, value);
  };
  const addNewState = () => {
    console.log("call")
    setShowPortal(true)
  };

  const handleClearFilters = () => {
    const params = Object.fromEntries(searchParams.entries());
    const filterKeys = ["zone_name", "is_delivery_paused", "state_name"];
    filterKeys.map((key) => delete params[key]);
    params["page"] = "1";
    setSearchParams(params);
  };

  const deliveryPausedDropDown = [
    { label: "All", value: "" },
    { label: "True", value: "true" },
    { label: "False", value: "false" },
  ];
  const zonesDropdownValues = [
    { label: "All", value: "" },
    { label: "Zone A", value: "zone a" },
    { label: "Zone B", value: "zone b" },
  ];

  return (
    <div className=" flex text-sm gap-4 items-end justify-end self-end">
      {showPortal && ReactDOM.createPortal(
         <AddAndEditState key={"add"} onClose={()=>setShowPortal((prev)=>!prev)}/>
         ,
          document.body
        )}

      {/* Search  */}
      <div className="flex items-center gap-2 ">
        <label className="font-semibold text-sm " htmlFor="state_name">
          Search:
        </label>
        <input
          type="search"
          placeholder="State Name"
          name="state_name"
          className="outline-none py-1 px-2 text-sm border-none rounded"
          value={state_name}
          onChange={handleFilterChange}
        />
      </div>
      {/* zone name */}
      <div className="flex items-center gap-2">
        <label className="font-semibold" htmlFor="zone_name">
          Zone:
        </label>
        <select
          id="zone_name"
          name="zone_name"
          className="border px-2 py-1 rounded outline-none border-none"
          value={zone_name}
          onChange={handleFilterChange}
        >
          {zonesDropdownValues.map((val, id) => (
            <option
              className="text-sm outline-none border-none"
              key={id}
              value={val.value}
            >
              {val.label}
            </option>
          ))}
        </select>
      </div>
      {/* Delivery Paused Filter */}
      <div className="flex items-center gap-2">
        <label className="font-semibold text-sm " htmlFor="stage">
          Delivery Paused:
        </label>
        <select
          id="is_delivery_paused"
          className="border px-2 py-1 rounded outline-none border-none"
          value={is_delivery_paused}
          name="is_delivery_paused"
          onChange={handleFilterChange}
        >
          {deliveryPausedDropDown.map((val, id) => (
            <option
              className="text-sm outline-none border-none"
              key={id}
              value={val.value}
            >
              {val.label}
            </option>
          ))}
        </select>
      </div>

      {/* Add State */}
      <button
        onClick={addNewState}
        className="btn-yellow px-3 py-1 text-sm font-sans hover:scale-105 capitalize rounded"
      >
        <FontAwesomeIcon icon={faAdd} /> New State
      </button>
      {/* Clear Filters Button */}
      <button
        onClick={handleClearFilters}
        className="btn-yellow px-3 py-1 text-sm font-sans hover:scale-105 capitalize rounded"
      >
        <FontAwesomeIcon icon={faRemove} /> Clear Filters
      </button>
    </div>
  );
};
