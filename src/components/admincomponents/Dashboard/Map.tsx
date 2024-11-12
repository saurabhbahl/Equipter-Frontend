import * as echarts from "echarts/core";
import ReactEChartsCore from "echarts-for-react/lib/core";

const Map = () => {
  const stateOrderData = [
    { name: "California", value: 1000 },
    { name: "Texas", value: 750 },
    { name: "New York", value: 500 },
    { name: "Florida", value: 450 },
    { name: "Illinois", value: 300 },
    { name: "Ohio", value: 250 },
    { name: "Michigan", value: 200 },
    { name: "Pennsylvania", value: 150 },
    { name: "Georgia", value: 100 },
    { name: "North Carolina", value: 90 },
  ];

  const highestOrderState = stateOrderData.reduce((prev, current) => {
    return current.value > prev.value ? current : prev;
  });
  const usaMapOptions = {
    title: {
      text: "Orders by State",
      left: "left",
    },
    tooltip: {
      trigger: "item",
      formatter: (params: any) => {
        const { name, value } = params.data;
        const density = value > 0 ? `Orders: ${value}` : "No Orders";

        return `${name}: ${density}<br/>${highestOrderState.name} has the highest orders: ${highestOrderState.value}`;
      },
    },
    visualMap: {
      min: 0,
      max: Math.max(...stateOrderData.map((item) => item.value)),
      left: "left",
      top: "bottom",
      text: ["High", "Low"],
      inRange: {
        color: ["#e0f7fa", "#00796b"],
      },
      calculable: true,
    },
    series: [
      {
        name: "Orders",
        type: "map",
        map: "USA",
        roam: true,
        emphasis: {
          label: {
            show: true,
          },
        },
        data: stateOrderData,
      },
    ],
  };
  return (
    <ReactEChartsCore
      echarts={echarts}
      option={usaMapOptions}
      style={{ height: "400px", width: "100%" }}
    />
  );
};

export default Map;
