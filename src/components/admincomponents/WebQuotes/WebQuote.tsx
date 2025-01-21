import {  useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import BreadCrump from "../rootComponents/BreadCrump";
import SubTitle from "../rootComponents/SubTitle";
import Pagination from "../rootComponents/Pagination";
import MetaComponent from "../../../utils/MetaComponent";
import { apiClient } from "../../../utils/axios";
import { useAdminContext } from "../../../hooks/useAdminContext";

import WebQuoteTable from "./WebQuoteTable";
import { WebQuoteFilters } from "./WebQuoteFilters";
import { PerPageSelector } from "../rootComponents/PerPageSelector";


const WebQuote = () => {
  const breadcrumbs = [
    { label: "Dashboard", link: "/" },
    { label: "WebQuotes", link: "/webquotes" },
  ];
  const [totalPages, setTotalPages] = useState(1);
  const { setWebquotes, setError, loading, setLoading ,webquotes} =   useAdminContext();
  const [searchParams] = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const stage = searchParams.get("stage") || "";
  const financing = searchParams.get("financing") || "";
  const dateFilter = searchParams.get("dateFilter") || "";
  const id = searchParams.get("id") || "";

  const fetchWebQuoteData = async () => {
    try {
      setLoading((prev) => ({ ...prev, webquotes: true }));
      setError((prev) => ({ ...prev, webquotes: "" }));

      const url = `/webquote?page=${page}&limit=${limit}&stage=${stage}&financing=${financing}&dateFilter=${dateFilter}&id=${id}`;
      const response = await apiClient.get(url);
      const { data } = response.data;
      const { totalPages = 1 } = response.data;
      setWebquotes(data);
      setTotalPages(totalPages);
    } catch (error: any) {
      console.log(error);
      setError((prev) => ({
        ...prev,
        webquotes: error.message || "Unexpected error occurred",
      }));
    } finally {
      setLoading((prev) => ({ ...prev, webquotes: false }));
    }
  };


  useEffect(() => {
    fetchWebQuoteData();
  }, [searchParams,financing ]);

  return (
    <>
      <MetaComponent title="WebQuote" />
      <div className="mx-auto font-sans bg-gray-200 h-full">
        <div className="flex justify-between bg-gradient-to-b p-5 border shadow from-gray-800 to-black/90">
          <p className="text-white">WebQuote</p>
          <BreadCrump breadcrumbs={breadcrumbs} />
        </div>

        {/* Main Content */}
        <div className="p-5">       
          <SubTitle
            title="WebQuote"
            reloadBtnFn={fetchWebQuoteData}
            buttonLink="/admin/webquote/new"
            loading={loading.webquotes}
            subComp={<WebQuoteFilters />} />       
          <WebQuoteTable />  
          <div className="flex flex-col md:flex-row gap-5 justify-start items-center my-auto mt-4">
            <Pagination key={"webquote"} currentPage={page} totalPages={totalPages} />
            {webquotes.length > 0 &&  <PerPageSelector key={"webquotePerPageFilter"} currentLimit={limit} />}
           </div>
        </div>
      </div>
    </>
  );
};

export default WebQuote;

