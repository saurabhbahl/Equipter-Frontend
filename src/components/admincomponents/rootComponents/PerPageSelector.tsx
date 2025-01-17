import { ChangeEvent } from "react";
import { useSearchParams } from "react-router-dom";

export const PerPageSelector: React.FC<{ currentLimit: number }> = ({ currentLimit }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const perPageOptions = [1,5,10, 20, 50, 100];

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newLimit = Number(e.target.value);
    const paramsObj = Object.fromEntries(searchParams.entries());
    paramsObj.limit = String(newLimit);
    paramsObj.page = "1"; 
    setSearchParams(paramsObj);
  };

  return (
    <div className="flex items-center justify-center my-auto ">
      <label htmlFor="perPage" className="mr-2 text-custom-orange text-sm font-semibold">
        Per Page:
      </label>
      <select
        id="perPage"
        value={currentLimit}
        onChange={handleChange}
        className="border-none outline-none px-2  py-0.5 rounded-md shadow-xl cursor-pointer"
      >
        {perPageOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};