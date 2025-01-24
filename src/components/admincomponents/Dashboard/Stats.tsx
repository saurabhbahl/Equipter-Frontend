import { useEffect, useState } from "react";
import StatCard from "./StatCard";
import {
  faBox,
  faFileInvoice,
  faShoppingCart,
  faTools
} from "@fortawesome/free-solid-svg-icons";
import { apiClient } from "../../../utils/axios";
import { useSearchParams } from "react-router-dom";

const Stats = () => {

  const [statsData, setStatsData] = useState({
    orders: 0,
    webQuotes: 0,
    products: 0,
    accessories: 0,
  });

  const [statsLoading, setStatsLoading] = useState({
    orders: false,
    webQuotes: false,
    products: false,
    accessories: false,
  });

  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 99999;
  const duration = searchParams.get("duration") || "";

  // --- Fetchers ---
  const fetchWebQuoteData = async () => {
    setStatsLoading((prev) => ({ ...prev, webQuotes: true }));
    try {
      const url = `/webquote?page=${page}&limit=${limit}&dateFilter=${duration}`;
      const response = await apiClient.get(url);
      const { data } = response.data;
      setStatsData((prev) => ({ ...prev, webQuotes: data.length }));
    } catch (error) {
      console.log("fetchWebQuoteData error:", error);
    } finally {
      setStatsLoading((prev) => ({ ...prev, webQuotes: false }));
    }
  };

  const fetchProductsData = async () => {
    setStatsLoading((prev) => ({ ...prev, products: true }));
    try {
      const response = await apiClient.get("/product");
      const productData = response.data;
      setStatsData((prev) => ({ ...prev, products: productData.data.length }));
    } catch (error) {
      console.log("fetchProductsData error:", error);
    } finally {
      setStatsLoading((prev) => ({ ...prev, products: false }));
    }
  };

  const fetchOrdersData = async () => {
    setStatsLoading((prev) => ({ ...prev, orders: true }));
    try {
      const response = await apiClient.get(
        `/order/?page=${page}&limit=${limit}&duration=${duration}`
      );
      const { data } = response.data;
      setStatsData((prev) => ({ ...prev, orders: data.length }));
    } catch (error) {
      console.log("fetchOrdersData error:", error);
    } finally {
      setStatsLoading((prev) => ({ ...prev, orders: false }));
    }
  };

  const fetchAccessoriesData = async () => {
    setStatsLoading((prev) => ({ ...prev, accessories: true }));
    try {
      const response = await apiClient.get("/accessory");
    
      setStatsData((prev) => ({
        ...prev,
        accessories: response.data.data.length,
      }));
    } catch (error) {
      console.log("fetchAccessoriesData error:", error);
    } finally {
      setStatsLoading((prev) => ({ ...prev, accessories: false }));
    }
  };

  useEffect(() => {
    fetchOrdersData();
    fetchWebQuoteData();
    fetchProductsData();
    fetchAccessoriesData();

  }, [searchParams,duration]);

  return (
    <div className="flex justify-between gap-6">
      <StatCard
        loading={statsLoading.orders}
        title="Total Orders"
        value={`${statsData.orders}`}
        icon={faShoppingCart}
      />
      <StatCard
        loading={statsLoading.webQuotes}
        title="Total Quotes"
        value={`${statsData.webQuotes}`}
        icon={faFileInvoice}
      />
      <StatCard
        loading={statsLoading.products}
        title="Total Products"
        value={`${statsData.products}`}
        icon={faBox}
      />
      <StatCard
        loading={statsLoading.accessories}
        title="Total Accessories"
        value={`${statsData.accessories}`}
        icon={faTools}
      />
    </div>
  );
};

export default Stats;
