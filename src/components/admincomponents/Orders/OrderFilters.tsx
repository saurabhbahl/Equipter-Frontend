import  { ChangeEvent } from 'react'
import { useSearchParams } from 'react-router-dom';

const OrderFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  
  const order_status = searchParams.get("order_status") || "";
  const duration = searchParams.get("duration") || "";
  const order_id = searchParams.get("order_id") || "";
  
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
    const filterKeys = ["order_status", "duration", "order_id"];
    filterKeys.map((key) => delete params[key]);
    params["page"] = "1";
    setSearchParams(params);
  };

  const orderStagesDropdownValues = [
    { label: "All", value: "" },
    { label: "Pending", value: "Pending" },
    { label: "Approved", value: "Approved" },
    { label: "Delivered", value: "Delivered" },
    { label: "Shipped", value: "Shipped" },
    { label: "Cancelled", value: "Cancelled" },
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
        <label className="font-semibold text-sm " htmlFor="order_id">
          Search:
        </label>
        <input type="search" placeholder="Order Id" name="order_id" className="outline-none py-1 px-2 text-sm border-none rounded" value={order_id} onChange={handleFilterChange}/>
      </div>
      
        {/* order_status Filter */}
        <div className="flex items-center gap-2">
        <label className="font-semibold text-sm " htmlFor="order_status">
        Order Status:
        </label>
        <select
          id="order_status"
          className="border px-2 py-1 rounded outline-none border-none"
          value={order_status}
          name="order_status"
          onChange={handleFilterChange}>
          {orderStagesDropdownValues.map((val, id) => (
            <option className="text-sm outline-none border-none" key={id} value={val.value}>
              {val.label}
            </option>
          ))}
        </select>
      </div>

      {/* Date Filter */}
      <div className="flex items-center gap-2">
        <label className="font-semibold" htmlFor="duration">
          Duration:
        </label>
        <select
          id="duration"
          className="border px-2 py-1 rounded outline-none border-none"
          name="duration"
          value={duration}
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
}

export default OrderFilters