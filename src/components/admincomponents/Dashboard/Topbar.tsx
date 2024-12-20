import { faRefresh } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

const Topbar = () => {
  const [timeFrame, setTimeFrame] = useState("month");

  const handleTimeFrameChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTimeFrame(event.target.value);


  };

  const handleRefresh = () => {
    console.log("Data refreshed");
  };
  return (
    <div className=" flex font-sans p-4 px-5 justify-between items-center bg-gradient-to-b text-white border shadow- outline-none  from-gray-800 to-black/90">
      <h1 className=" ">Dashboard</h1>
      <div className="flex items-center gap-4">
        <button
          title="Refresh Data"
          onClick={handleRefresh}
          className="flex items-center bg-blue-500 outline-none text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          <FontAwesomeIcon icon={faRefresh} />
        </button>
        <select
          value={timeFrame}
          onChange={handleTimeFrameChange}
          className="border rounded p-1 cursor-pointer bg-gradient-to-b  text-white    outline-none  from-gray-800 to-black/90"
        >
          <option className="bg-black  outline-none" value="week">Last Week</option>
          <option className="bg-black  outline-none" value="month">Last Month</option>
          <option className="bg-black  outline-none" value="6months">Last 6 Months</option>
          <option className="bg-black  outline-none" value="year">Last Year</option>
          <option className="bg-black  outline-none" value="allTime">All Time</option>
        </select>
      </div>
    </div>
  );
};

export default Topbar;
