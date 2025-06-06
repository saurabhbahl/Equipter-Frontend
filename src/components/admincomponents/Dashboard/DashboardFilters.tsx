import  { ChangeEvent } from 'react'
import { useSearchParams } from 'react-router-dom';

const DashboardFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const duration = searchParams.get("duration") || "";

  const updateQueryParam = (key: string, value: string) => {
    const params = Object.fromEntries(searchParams.entries());
    params[key] = value; 
    setSearchParams(params);
  };

  const handleFilterChange = (e: ChangeEvent<HTMLSelectElement|HTMLInputElement>) => {
    const { name, value } = e.target;
    updateQueryParam(name, value);
  };

  const handleClearFilters = () => {
    const params = Object.fromEntries(searchParams.entries());
    const filterKeys = ["duration","page"];
    filterKeys.map((key) => delete params[key]);
    setSearchParams(params);
  };

  const durationDropdownValues = [
    { label: "All", value: "" },
    { label: "Last 24 Hours", value: "1" },
    { label: "Last Week", value: "7" },
    { label: "Last Month", value: "30" },
    { label: "Last 3 Months", value: "90" },
    { label: "Last 6 Months", value: "185" },
    { label: "Last Year", value: "365" },
  ];

  return (
    <div className=" flex text-sm gap-4 items-end justify-end self-end">
      {/* Date Filter */}
      <div className="flex items-center gap-2">
        <label className="font-semibold" htmlFor="duration">
          Duration:
        </label>
        <select
          id="duration"
          className="border px-2 py-1 rounded outline-none border-none"
          name="duration"
          value={duration||""}
 
          onChange={handleFilterChange}>
          {durationDropdownValues.map((val,idx)=>(
            <option className="outline-none border-none" key={idx} value={val.value}>{val.label}</option>
          ))}
        </select>
      </div>

      {/* Clear Filters Button */}
      <button
        onClick={handleClearFilters}
        className="btn-yellow px-3 py-1 text-sm font-sans hover:scale-105 capitalize rounded"      >
        Reset
      </button>
    </div>
  );
}

export default DashboardFilters