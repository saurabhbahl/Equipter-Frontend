import {  useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import BreadCrump from "../rootComponents/BreadCrump";
import SubTitle from "../rootComponents/SubTitle";
import Pagination from "../rootComponents/Pagination";
import MetaComponent from "../../../utils/MetaComponent";
import { apiClient } from "../../../utils/axios";
import { useAdminContext } from "../../../hooks/useAdminContext";
import { StateFilters } from "./StatesFilters";
import { PerPageSelector } from "../rootComponents/PerPageSelector";
import StatesTable from "./StatesTable";


const States = () => {
  const breadcrumbs = [
    { label: "Dashboard", link: "/" },
    { label: "States", link: "/states" },
  ];
  const [totalPages, setTotalPages] = useState(1);
  const {   setError, loading, setLoading ,states,setStates} =   useAdminContext();
  const [searchParams] = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const state_name = searchParams.get("state_name") || "";
  const is_delivery_paused = searchParams.get("is_delivery_paused") || "";
  const zone_name = searchParams.get("zone_name") || "";

  const fetchStatesData = async () => {
    try {
      setLoading((prev) => ({ ...prev, states: true }));
      setError((prev) => ({ ...prev, states: "" }));

      const url = `/state/states?page=${page}&limit=${limit}&state_name=${state_name}&is_delivery_paused=${is_delivery_paused}&zone_name=${zone_name}`;
      const response = await apiClient.get(url);
      const { data } = response.data;
      const { totalPages = 1 } = response.data;
      setStates(data);
      setTotalPages(totalPages);
    } catch (error: any) {
      console.log(error);
      setError((prev) => ({
        ...prev,
        states: error.message || "Unexpected error occurred",
      }));
    } finally {
      setLoading((prev) => ({ ...prev, states: false }));
    }
  };


  useEffect(() => {
    fetchStatesData();
  }, [searchParams]);

  return (
    <>
      <MetaComponent title="States" />
      <div className="mx-auto font-sans bg-gray-200 h-full">
        <div className="flex justify-between bg-gradient-to-b p-5 border shadow from-gray-800 to-black/90">
          <p className="text-white">States</p>
          <BreadCrump breadcrumbs={breadcrumbs} />
        </div>

        {/* Main Content */}
        <div className="p-5">       
          <SubTitle
            title="States"
            reloadBtnFn={fetchStatesData}
            loading={loading.states}
            subComp={<StateFilters/>} />       
          <StatesTable />  
          <div className="flex flex-col md:flex-row gap-5 justify-start items-center my-auto mt-4">
            <Pagination key={"states"} currentPage={page} totalPages={totalPages} />
            {states.length > 0 &&  <PerPageSelector key={"statesperpage"} currentLimit={limit} />}
           </div>
        </div>
      </div>
    </>
  );
};

export default States;

