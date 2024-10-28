import { faRefresh } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

const Topbar = () => {
  const [timeFrame, setTimeFrame] = useState("month");

  const handleTimeFrameChange = (event: any) => {
    setTimeFrame(event.target.value);

    console.log("Selected Time Frame:", event.target.value);
  };

  const handleRefresh = () => {
    console.log("Data refreshed");
  };
  return (
    <div className="!sticky !top-0  z-100 flex items-center justify-between bg-white p-4 rounded-lg shadow-lg">
      <h1 className="text-xl font-bold">Dashboard</h1>
      <div className="flex items-center gap-4">
        <select
          value={timeFrame}
          onChange={handleTimeFrameChange}
          className="border rounded p-2"
        >
          <option value="week">Last Week</option>
          <option value="month">Last Month</option>
          <option value="6months">Last 6 Months</option>
          <option value="year">Last Year</option>
          <option value="allTime">All Time</option>
        </select>
        <button
          title="Refresh Data"
          onClick={handleRefresh}
          className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          <FontAwesomeIcon icon={faRefresh} />
        </button>
      </div>
    </div>
  );
};

export default Topbar;
