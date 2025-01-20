import { faAdd, faRemove } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import  { ChangeEvent } from 'react'
import { useSearchParams } from 'react-router-dom';

const ZonesFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const zone_name = searchParams.get("zone_name") || "";


  const updateQueryParam = (key: string, value: string) => {
    const params = Object.fromEntries(searchParams.entries());
    params[key] = value;
    params["page"] = "1";
    setSearchParams(params);
  };

  const handleFilterChange = (e: ChangeEvent<HTMLSelectElement|HTMLInputElement>) => {
    const { name, value } = e.target;
    updateQueryParam(name, value);
  };

  const handleClearFilters = () => {
    const params = Object.fromEntries(searchParams.entries());  
    const filterKeys = ["zone_name", "is_delivery_paused", "state_name"];
    filterKeys.map((key) => delete params[key]);  
    params["page"] = "1";
    setSearchParams(params);
  };
  
  const zonesDropdownValues = [
    { label: "All", value: "" },
    { label: "Zone A", value: "zone a" },
    { label: "Zone B", value: "zone b" },
  ];

  return (
    <div className=" flex text-sm gap-4 items-end justify-end self-end">
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
          onChange={handleFilterChange}>
            {zonesDropdownValues.map((val, id) => (
            <option className="text-sm outline-none border-none" key={id} value={val.value}>
              {val.label}
            </option>
          ))}
        </select>
      </div>    
      {/* Add State */}
      <button
        onClick={handleClearFilters}
        className="btn-yellow px-3 py-1 text-sm font-sans hover:scale-105 capitalize rounded">
        <FontAwesomeIcon icon={faAdd}/> New Zone
      </button>
      {/* Clear Filters Button */}
      <button
        onClick={handleClearFilters}
        className="btn-yellow px-3 py-1 text-sm font-sans hover:scale-105 capitalize rounded">
      <FontAwesomeIcon icon={faRemove}/>   Clear Filters
      </button>
    </div>
  )
}

export default ZonesFilters