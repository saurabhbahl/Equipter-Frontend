import { ChangeEvent } from "react";
import { useSearchParams } from "react-router-dom";
export const WebQuoteFilters: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const stage = searchParams.get("stage") || "";
  const financing = searchParams.get("financing") || "";
  const dateFilter = searchParams.get("dateFilter") || "";
  const id = searchParams.get("id") || "";

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
    delete params.stage;
    delete params.financing;
    delete params.dateFilter;

    params["page"] = "1";
    setSearchParams(params);
  };
  const financingDropdownValues = [
    { label: "All", value: "" },
    { label: "Quote", value: "Quote" },
    { label: "Saved", value: "Saved" },
    { label: "Ordered", value: "Ordered" },
  ];
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
    
      {/* Search  */}
      <div className="flex items-center gap-2 ">
        <label className="font-semibold text-sm " htmlFor="id">
          Search:
        </label>
        <input type="search" placeholder="Webquote Id" name="id" className="outline-none py-1 px-2 text-sm border-none rounded" value={id} onChange={handleFilterChange}/>
      </div>
      
        {/* Stage Filter */}
        <div className="flex items-center gap-2">
        <label className="font-semibold text-sm " htmlFor="stage">
          Stage:
        </label>
        <select
          id="stage"
          className="border px-2 py-1 rounded outline-none border-none"
          value={stage}
          name="stage"
          onChange={handleFilterChange}>
          {financingDropdownValues.map((val, id) => (
            <option className="text-sm outline-none border-none" key={id} value={val.value}>
              {val.label}
            </option>
          ))}
        </select>
      </div>

      {/* Financing */}
      <div className="flex items-center gap-2">
        <label className="font-semibold" htmlFor="financing">
          Financing:
        </label>
        <select
          id="financing"
          name="financing"
          className="border px-2 py-1 rounded outline-none border-none"
          value={financing}
          onChange={handleFilterChange}>
          <option value="">All</option>
          <option value="cash">Cash</option>
          <option value="financing">Financing</option>
        </select>
      </div>

      {/* Date Filter */}
      <div className="flex items-center gap-2">
        <label className="font-semibold" htmlFor="dateFilter">
          Duration:
        </label>
        <select
          id="dateFilter"
          className="border px-2 py-1 rounded outline-none border-none"
          name="dateFilter"
          value={dateFilter}
          onChange={handleFilterChange}>
          {durationDropdownValues.map((val,idx)=>(
            <option className="outline-none border-none" key={idx} value={val.value}>{val.label}</option>
          ))}
        </select>
      </div>

      {/* Clear Filters Button */}
      <button
        onClick={handleClearFilters}
        className="btn-yellow px-3 py-1 text-sm font-sans hover:scale-105 capitalize rounded"
      >
        Clear
      </button>
    </div>
  );
};