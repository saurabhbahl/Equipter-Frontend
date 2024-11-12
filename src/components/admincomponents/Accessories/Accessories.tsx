import { useNavigate } from "react-router-dom";
import AccessoriesTable from "./AccessoriesTable";

const Accessories = () => {
  const nav=useNavigate()
  return (
    <div className="mx-auto p-8 bg-white my-5">
      <div className="flex items-center my-4 justify-between pb-4 bg-white p-4 rounded-sm shadow-md">
        <h1 className="text-2xl font-semibold text-gray-700">Accessories</h1>
        <button
          className="btn-yellow text-sm !p-2"
          onClick={() => {
            nav("/admin/accessories/new");}}
        >
          Add New Accessory
        </button>
      </div>
      <AccessoriesTable />
    </div>
  );
};

export default Accessories;
