import  { useEffect, useState } from 'react'
import SubTitle from '../rootComponents/SubTitle';
import { PerPageSelector } from '../rootComponents/PerPageSelector';
import ZonesFilters from './ZonesFilters';
import ZonesTable from './ZonesTable';
import Pagination from '../rootComponents/Pagination';
import MetaComponent from '../../../utils/MetaComponent';
import BreadCrump from '../rootComponents/BreadCrump';
import { apiClient } from '../../../utils/axios';
import { useAdminContext } from '../../../hooks/useAdminContext';
import { useSearchParams } from 'react-router-dom';

const Zones = () => {
  const breadcrumbs = [
    { label: "Dashboard", link: "/" },
    { label: "Zones", link: "/states" },
  ];
  const [totalPages, setTotalPages] = useState(1);
  const { setError, loading, setLoading ,zones,setZones} =   useAdminContext();
  const [searchParams] = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const zone_name = searchParams.get("zone_name") || "";

  const fetchZonesData = async () => {
    try {
      setLoading((prev) => ({ ...prev, zones: true }));
      setError((prev) => ({ ...prev, zones: "" }));
      const url = `/state/zones?page=${page}&limit=${limit}&zone_name=${zone_name}`;
      const response = await apiClient.get(url);
      const { data } = response.data;
      const { totalPages = 1 } = response.data;
      setZones(data);
      setTotalPages(totalPages);
    } catch (error: any) {
      console.log(error);
      setError((prev) => ({
        ...prev,
        zones: error.message || "Unexpected error occurred",
      }));
    } finally {
      setLoading((prev) => ({ ...prev, zones: false }));
    }
  };


  useEffect(() => {
    fetchZonesData();
  }, [searchParams]);

  return (
    <>
      <MetaComponent title="Zones" />
      <div className="mx-auto font-sans bg-gray-200 h-full">
        <div className="flex justify-between bg-gradient-to-b p-5 border shadow from-gray-800 to-black/90">
          <p className="text-white">Zones</p>
          <BreadCrump breadcrumbs={breadcrumbs} />
        </div>

        {/* Main Content */}
        <div className="p-5">       
          <SubTitle
            title="Zones"
            reloadBtnFn={fetchZonesData}
            loading={loading.states}
            subComp={<ZonesFilters/>} />       
          <ZonesTable />  
          <div className="flex flex-col md:flex-row gap-5 justify-start items-center my-auto mt-4">
            <Pagination key={"zones"} currentPage={page} totalPages={totalPages} />
            {zones?.length > 0 &&  <PerPageSelector key={"zonesperpage"} currentLimit={limit} />}
           </div>
        </div>
      </div>
    </>
  );
};

export default Zones