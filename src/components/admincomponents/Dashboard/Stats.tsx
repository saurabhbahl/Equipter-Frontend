// import { useEffect, useState } from "react";
// import StatCard from "./StatCard";
// import {
//   faBox,

//   faFileInvoice,
//   faShoppingCart,
//   faTools,
//   faUsers,
// } from "@fortawesome/free-solid-svg-icons";
// import { apiClient } from "../../../utils/axios";
// import { useSearchParams } from "react-router-dom";
// import { ErrorWithMessage } from "../../../types/componentsTypes";

// const Stats = () => {
//   const [statsData,setStatsData]=useState({
//     orders:0,
//     webQuotes:0,
//     products:0,
//     accessories:0
//   })
//   const [statsLoading,setStatsLoading]=useState({
//     orders:false,
//     webQuotes:false,
//     products:false,
//     accessories:false
//   })
//   const [searchParams] = useSearchParams();
//   const page = Number(searchParams.get("page")) || 1;
//   const limit = Number(searchParams.get("limit")) || 99999;
//   const duration = searchParams.get("duration") || "";
  
//   const fetchWebQuoteData = async () => {
//     try {
//       // setLoading((prev) => ({ ...prev, webquotes: true }));
//       // setError((prev) => ({ ...prev, webquotes: "" }));

//       const url = `/webquote?page=${page}&limit=${limit}&dateFilter=${duration}`;
//       const response = await apiClient.get(url);
//       const { data } = response.data;
//       setStatsData((prev)=>({...prev,webQuotes:data.length}))
  
//     } catch (error) {
//       console.log(error);
      
//     //   setError((prev) => ({
//     //     ...prev,
//     //     webquotes: (error as ErrorWithMessage).message || "Unexpected error occurred",
//     //   }));
//     // } finally {
//     //   setLoading((prev) => ({ ...prev, webquotes: false }));
//     }
//   };
//   const fetchProductsData = async () => {
//     try {
//       // setLoading((prev) => ({ ...prev, products: true }));
//       // setError((prev) => ({ ...prev, products: "" }));
//       // const data = await ProductsService.fetchProductsWithImages();
//       const data=await apiClient.get("/product")
//       console.log(data);
//       setStatsData((prev)=>({...prev,products:data.data.length}))
//     } catch (error) {
//       console.log(error);
//       // setError((prev) => ({
//       //   ...prev,
//       //   products: (error as ErrorWithMessage).message || "Unexpected error occured",
//       // }));
//     // } finally {
//     //   setLoading((prev) => ({ ...prev, products: false }));
//     // }
//   };
  
// }
  
//   const fetchOrdersData = async () => {
//     try {
//       // setLoading((prev) => ({ ...prev, orders: true }));
//       // setError((prev) => ({ ...prev, orders: "" }));
//       const response = await apiClient.get(`/order/?page=${page}&limit=${limit}&duration=${duration}`);
//       const { data } = response.data;
//       const { totalPages = 1 } = response.data;
//       setStatsData((prev)=>({...prev,orders:data.length}))
//       // setOrders(data);
//       // setTotalPages(totalPages);
//     } catch (error) {
//       console.log(error)
//       // setError((prev) => ({
//       //   ...prev,
//       //   accessories:
//       //     (error as ErrorWithMessage).message || "Unexpected error occurred",
//       // }));
//     } finally {
//       // setLoading((prev: GlobalLoadingState) => ({ ...prev, orders: false }));
//     }
//   };
//   const fetchAccessoriesData = async () => {
//     try {
//       // setLoading((prev) => ({ ...prev, accessories: true }));
//       // setError((prev) => ({ ...prev, accessories: "" }));
//       const data = await apiClient.get("/accessory")    
//       console.log(data.data)
//       setStatsData((prev)=>({...prev,accessories:data.data.data.length}))
      
//     } catch (error) {
//       console.log(error);
//     //   setError((prev) => ({
//     //     ...prev,
//     //     accessories:
//     //       (error as ErrorWithMessage).message || "Unexpected error occurred",
//     //   }));
//     // } finally {
//     //   setLoading((prev:GlobalLoadingState)=>({...prev, accessories: false }));
//     }
//   };
  
  
  
//   useEffect(()=>{
//     fetchOrdersData()
//     fetchWebQuoteData()
//     fetchProductsData()
//     fetchAccessoriesData()
//   },[searchParams])
  
  
//   return (
//     <div className="flex justify-between gap-6 ">
//       <StatCard loading={statsLoading.orders} title="Total Orders" value={`${statsData.orders}`} icon={faShoppingCart} />
//       <StatCard loading={statsLoading.webQuotes} title="Total Quotes" value={`${statsData.webQuotes}`} icon={faFileInvoice} />
//       <StatCard loading={statsLoading.products} title="Total Products" value={`${statsData.products}`} icon={faBox} />
//       <StatCard loading={statsLoading.accessories} title="Total Accessories" value={`${statsData.accessories}`} icon={faTools} />
//     </div>
//   );
// };

// export default Stats;



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
  // Keep track of data
  const [statsData, setStatsData] = useState({
    orders: 0,
    webQuotes: 0,
    products: 0,
    accessories: 0,
  });

  // Keep track of loading
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
      // We assume response.data is an array or has data array
      const productData = response.data;
      // If the actual array is at productData.data, adjust accordingly:
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
      // If the actual array is at response.data.data, adjust accordingly:
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

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
