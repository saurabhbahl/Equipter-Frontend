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
import Topbar from "./Topbar";
import Stats from "./Stats";
import Map from "./Map";

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
  //  data for the charts
  const salesData = [
    { month: "Jan", sales: 4000, revenue: 2400 },
    { month: "Feb", sales: 3000, revenue: 1398 },
    { month: "Mar", sales: 2000, revenue: 9800 },
    { month: "Apr", sales: 2780, revenue: 3908 },
    { month: "May", sales: 1890, revenue: 4800 },
    { month: "Jun", sales: 2390, revenue: 3800 },
    { month: "Jul", sales: 3490, revenue: 4300 },
  ];

  const productData = [
    { name: "Product A", quantity: 4000 },
    { name: "Product B", quantity: 3000 },
    { name: "Product C", quantity: 2000 },
    { name: "Product D", quantity: 2780 },
  ];

  const customerData = [
    { value: 300, name: "New" },
    { value: 200, name: "Returning" },
    { value: 100, name: "XYZ" },
  ];

  // Line Chart Options for Sales & Revenue
  const salesRevenueOptions = {
    title: { text: "Sales & Revenue" },
    tooltip: { trigger: "axis" },
    legend: { data: ["Sales", "Revenue"] },
    xAxis: {
      type: "category",
      data: salesData.map((item) => item.month),
    },
    yAxis: { type: "value" },
    series: [
      {
        name: "Sales",
        type: "line",
        data: salesData.map((item) => item.sales),
        smooth: true,
        lineStyle: { color: "#5470C6" },
      },
      {
        name: "Revenue",
        type: "line",
        data: salesData.map((item) => item.revenue),
        smooth: true,
        lineStyle: { color: "#91CC75" },
      },
    ],
  };

  // Bar Chart for Product Quantities
  const productOptions = {
    title: { text: "Product Quantities" },
    tooltip: { trigger: "axis" },
    xAxis: {
      type: "category",
      data: productData.map((item) => item.name),
    },
    yAxis: { type: "value" },
    series: [
      {
        name: "Quantity",
        type: "bar",
        data: productData.map((item) => item.quantity),
        itemStyle: { color: "#3BA272" },
      },
    ],
  };

  // Pie Chart Options for Customer Segmentation
  const customerOptions = {
    title: { text: "Customer Segmentation" },
    tooltip: { trigger: "item" },
    legend: {
      orient: "vertical",
      left: "right",
    },
    series: [
      {
        name: "Customers",
        type: "pie",
        radius: "50%",
        data: customerData,
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

  const labelOption = {
    show: true,
    position: "insideTop",
    distance: 10,
    align: "left",
    verticalAlign: "middle",
    rotate: 45,
    formatter: "{c}  {name|{a}}",
    fontSize: 8,
    rich: {
      name: {},
    },
  };

  // Sales by Product Over Years Bar Chart
  const salesByProductOptions = {
    title: { text: "Sales by Product " },
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
    },
    legend: {
      data: ["Product A", "Product B", "Product C", "Product D"],
    },
    xAxis: [
      {
        type: "category",
        axisTick: { show: false },
        data: ["2018", "2019", "2020", "2021", "2022"],
      },
    ],
    yAxis: [{ type: "value" }],
    series: [
      {
        name: "Product A",
        type: "bar",
        barGap: 0,
        label: labelOption,
        emphasis: { focus: "series" },
        data: [500, 600, 750, 820, 900],
      },
      {
        name: "Product B",
        type: "bar",
        label: labelOption,
        emphasis: { focus: "series" },
        data: [400, 420, 550, 610, 670],
      },
      {
        name: "Product C",
        type: "bar",
        label: labelOption,
        emphasis: { focus: "series" },
        data: [300, 310, 430, 480, 530],
      },
      {
        name: "Product D",
        type: "bar",
        label: labelOption,
        emphasis: { focus: "series" },
        data: [200, 210, 320, 350, 370],
      },
    ],
  };

  return (
    <div className="p-6 bg-gray-100 h-full flex flex-col gap-5">
      <Topbar />
      <Stats />
      {/* Charts Section */}
      <div className="flex w-full gap-6">
        {/* Sales & Revenue Line Chart */}
        <div className="bg-white p-6 w-[50%] shadow-lg">
          <ReactEChartsCore
            echarts={echarts}
            option={salesRevenueOptions}
            style={{ height: "300px", width: "100%" }}
            notMerge={true}
            lazyUpdate={true}
          />
        </div>

        {/* Product Quantities Bar Chart */}
        <div className="bg-white p-6 w-[50%] shadow-lg">
          <ReactEChartsCore
            echarts={echarts}
            option={productOptions}
            style={{ height: "300px", width: "100%" }}
            notMerge={true}
            lazyUpdate={true}
          />
        </div>
      </div>
      <div className="flex w-full gap-6">
        {/* Customer Segmentation Pie Chart */}
        <div className="bg-white p-6 shadow-lg w-[35%]">
          <ReactEChartsCore
            echarts={echarts}
            option={customerOptions}
            style={{ height: "300px", width: "100%" }}
            notMerge={true}
            lazyUpdate={true}
          />
        </div>

        {/* USA Map Sorted */}
        <div className="bg-white p-6 shadow-lg w-[65%]">
          <Map />
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
  );
};

export default Dashboard;
