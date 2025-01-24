import ReactEChartsCore from "echarts-for-react/lib/core";
import * as echarts from "echarts/core";
import { BarChart, LineChart, PieChart, MapChart } from "echarts/charts";
import usaJson from "./mapData.json";
import {
  GridComponent,
  TooltipComponent,
  TitleComponent,
  VisualMapComponent,
  LegendComponent,
  DatasetComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import Stats from "./Stats";
import Map from "./Map";
import { Helmet } from "react-helmet-async";
import SubTitle from "../rootComponents/SubTitle";
import DashboardFilters from "./DashboardFilters";
import { apiClient } from "../../../utils/axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { formatDate } from "../../../utils/helpers";
import { IOrder } from "../Orders/OrdersSchema";
import { IProduct } from "../Products/ProductSchema";

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  BarChart,
  LineChart,
  PieChart,
  MapChart,
  VisualMapComponent,
  DatasetComponent,
  LegendComponent,
  CanvasRenderer,
]);
echarts.registerMap("USA", usaJson as any);

const Dashboard = () => {
  const [ordersData, setOrdersData] = useState<IOrder[]>([]);
  const [salesChartData, setSalesChartData] = useState<{ date: string; totalCost: number }[]>([]);
  const [productsData, setProductsData] = useState<IProduct[]>([]);
  const [orderStatusData, setOrderStatusData] = useState<{ name: string; value: number }[]>([]);
  const [salesByProductOptions, setSalesByProductOptions] = useState({});
  const [searchParams] = useSearchParams();
  const duration = searchParams.get("duration");
  const reload = searchParams.get("reload");

  // Fetchers
  // 1. Fetch orders
  const fetchOrdersData = async () => {
    try {
      const response = await apiClient.get(`/order/?limit=-1&duration=${duration}`);
      const { data } = response.data;
      setOrdersData(data);
    } catch (error) {
      console.log("fetchOrdersData error:", error);
    }
  };
  // 2. Fetch Products
  const fetchProductsData = async () => {
    try {
      const response = await apiClient.get(`/product?limit=-1&duration=${duration}`);
      setProductsData(response.data.data || []);
    } catch (error) {
      console.log("fetchProductsData error:", error);
    }
  };

  const dynamicSalesRevenueOptions = {
    title: { text: "Sales (USD)" },
    tooltip: {
      trigger: "axis",
      formatter: (params:any) => {
        const data = params[0];
        return `${data.axisValue}<br />Sales: $${data.data.toLocaleString()}`;
      },
    },
    legend: { data: ["Sales"] },
    xAxis: {
      type: "category",
      data: salesChartData.map((item) => item.date),
    },
    yAxis: {
      type: "value",
      axisLabel: {
        formatter: '${value}', 
      },
    },
    series: [
      {
        name: "Sales",
        type: "line",
        data: salesChartData.map((item) => item.totalCost),
        smooth: true,
        lineStyle: { color: "#5470C6" },
      },
    ],
  };
  
  
  
  
  
  const OrdersStatusOptions = {
    title: { text: "Orders by Status" },
    tooltip: { trigger: "item" },
    legend: {
      orient: "vertical",
      left: "right",
    },
    series: [
      {
        name: "Orders",
        type: "pie",
        radius: "50%",
        data: orderStatusData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  };
  
  // Grouping data
  // 1. Group orders by day (or week/month) to get totalCost
  const groupOrdersByDay = (orders: IOrder[]) => {
    const dailyMap: Record<string, number> = {};
    orders.forEach((order) => {
      const createdAt = formatDate(order.created_at);
      const dayStr = createdAt.split(",")[0];
      const price = parseFloat(order?.product?.product_price || "0");
      const qty = parseFloat(order?.product?.product_qty || "0");
      const orderTotal = price * qty;
      dailyMap[dayStr] = (dailyMap[dayStr] || 0) + orderTotal;
    });

    const sortedDays = Object.keys(dailyMap).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );
    return sortedDays.map((day) => ({ date: day, totalCost: dailyMap[day] }));
  };
  // 2. Grouping sales by product
  function getSalesByProductByYear(orders: IOrder[]) {
    const yearMap: Record<string, Record<string, number>> = {};

    orders.forEach((order) => {
      const orderYear = new Date(order.created_at).getFullYear().toString();
      const prodId = order.product?.product_id;
      // const price = parseFloat(order.product?.product_price || "0");
      const qty = parseFloat(order.product?.product_qty || "0");
      const total = qty;

      if (!yearMap[orderYear]) {
        yearMap[orderYear] = {};
      }
      if (!yearMap[orderYear][prodId]) {
        yearMap[orderYear][prodId] = 0;
      }
      yearMap[orderYear][prodId] += total;
    });

    const years = Object.keys(yearMap).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );

    const allProdIds = productsData.map((p) => p.id);

    return { yearMap, years, allProdIds };
  }

  // sales per product chart option once have orders & products
  useEffect(() => {
    if (!ordersData.length || !productsData.length) {
      return;
    }
    const { yearMap, years, allProdIds } = getSalesByProductByYear(ordersData);
    const seriesArray = allProdIds.map((prodId) => {
      const foundProduct = productsData.find((p) => p.id === prodId);
      const productName = foundProduct ? foundProduct.name : prodId;

      // for each year,  total or 0
      const yearlyTotals = years.map((y) => {
        return yearMap[y]?.[prodId] || 0;
      });

      return {
        name: productName,
        type: "bar",
        data: yearlyTotals,
        emphasis: { focus: "series" },
      };
    });

    setSalesByProductOptions({
      title: { text: "Sales by Product (per Year)" },
      tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
      legend: { data: seriesArray.map((s) => s.name) },
      xAxis: {
        type: "category",
        data: years,
        axisTick: { show: false },
      },
      yAxis: { type: "value" },
      series: seriesArray,
    });
  }, [ordersData, productsData]);

  useEffect(() => {
    if (!ordersData.length) {
      setOrderStatusData([]);
      return;
    }
    const statusCounts: Record<string, number> = {};
    ordersData.forEach((order) => {
      const status = order.order_status;
      if (!statusCounts[status]) {
        statusCounts[status] = 0;
      }
      statusCounts[status]++;
    });

    const chartData = Object.entries(statusCounts).map(([status, count]) => ({
      name: status,
      value: count,
    }));
    setOrderStatusData(chartData);
  }, [ordersData]);

  useEffect(() => {
    fetchOrdersData();
    fetchProductsData();
  }, [duration,reload]);

  useEffect(() => {
    const result = groupOrdersByDay(ordersData);
    setSalesChartData(result);
  }, [ordersData]);

  return (
    <>
      <Helmet>
        <title>Dashboard | Equipter</title>
        <link rel="canonical" href={window.location.href} />
      </Helmet>
      <div className="flex justify-between bg-gradient-to-b p-5 border shadow from-gray-800 to-black/90">
        <p className="text-white">Dashboard</p>
      </div>
      <div className="p-4 bg-gray-100 h-full flex flex-col gap-5">
        <SubTitle
          title="Dashboard"
          subComp={<DashboardFilters key={"dashfilters"} />}
          // reloadBtnFn={() => console.log()}
        />
        <Stats />

        {/* Charts Section */}
        <div className="flex w-full gap-6">
          {/* Sales Line Chart */}
          <div className="bg-white p-6 w-[65%] shadow-lg">
            <ReactEChartsCore
              echarts={echarts}
              option={dynamicSalesRevenueOptions}
              style={{ height: "350px", width: "100%" }}
              notMerge={true}
              lazyUpdate={true}
            />
          </div>
             {/* Orders Status Pie Chart */}
             <div className="bg-white p-6 shadow-lg w-[35%]">
            <ReactEChartsCore
              echarts={echarts}
              option={OrdersStatusOptions}
              style={{ height: "350px", width: "100%" }}
              notMerge={true}
              lazyUpdate={true}
            />
          </div>
        </div>
        <div className="flex w-full gap-6">
          {/* USA Map Sorted */}
          <div className="bg-white p-6 shadow-lg w-[100%]">
            <Map orders={ordersData} />
          </div>
        </div>

        {/*  Sales by Product  */}
        <div className="bg-white p-6 w-full shadow-lg">
          <ReactEChartsCore
            echarts={echarts}
            option={salesByProductOptions}
            style={{ height: "400px" }}
          />
        </div>
      </div>
    </>
  );
};

export default Dashboard;

