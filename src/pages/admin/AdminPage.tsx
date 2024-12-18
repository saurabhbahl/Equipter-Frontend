import Sidebar from "../../components/admincomponents/rootComponents/Sidebar";
import { Outlet } from "react-router-dom";


const AdminPage = () => {
  return (
    <div className=" flex ">
      <Sidebar />
      <div className=" flex-1 overflow-auto">
        <Outlet /> 
      </div>
    </div>
  );
};

export default AdminPage;
