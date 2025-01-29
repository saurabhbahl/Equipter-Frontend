import * as echarts from "echarts/core";
import ReactEChartsCore from "echarts-for-react/lib/core";
import { apiClient } from "../../../utils/axios";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { IOrder } from "../Orders/OrdersSchema";
import { IState } from "../States/StateSchema";

interface IMapProps {
  orders: IOrder[];
}

const Map = ({ orders }: IMapProps) => {
  const [searchParams] = useSearchParams();
  const [states, setStates] = useState<IState[]>([]);

  const fetchStatesData = async () => {
    try {
      const response = await apiClient.get("/state/states?page=1&limit=-1");
      const { data } = response.data;
      setStates(data);
    } catch (error) {
      console.log("fetchStatesData error:", error);
    }
  };

  useEffect(() => {
    fetchStatesData();
  }, [searchParams]);

  // 1)  map from state_id -> state_name
  const stateIdToName: Record<string, string> = {};
 
  states.forEach((st) => {
    stateIdToName[st.state_id] = st.state_name;
  });

  // 2)  how many orders per state name
  const stateOrderCounts: Record<string, number> = {};
  orders.forEach((order) => {
    const sId = order.webquote?.state_id;
    if (!sId) return;
    const stateName = stateIdToName[sId];
    if (!stateName) return;

    if (!stateOrderCounts[stateName]) {
      stateOrderCounts[stateName] = 0;
    }
    stateOrderCounts[stateName]++;
  });

  // 3) Converting counts to array for ECharts
  const mapData = Object.entries(stateOrderCounts).map(([name, value]) => ({
    name,
    value,
  }));
  

  //  max for visualMap
  const maxOrderCount = mapData.length ? Math.max(...mapData.map((d) => d.value)) : 0;

  // 4)  the single state with the highest orders
  const highest = mapData.reduce(
    (prev, curr) => (curr.value > prev.value ? curr : prev),
    { name: "", value: 0 }
  );

  // 5) ECharts option
  const usaMapOptions = {
    title: {
      text: "Orders by State",
      left: "left",
    },
    tooltip: {
      trigger: "item",
      formatter: (params: any) => {
        const { name, value = 0 } = params?.data || {};
        const lineForCurrent =
          value > 0 ? `${name} orders: ${value}` : ` No Orders`;
   
        return `
    ${lineForCurrent}<br/>
    ${highest.name ? `${highest.name} has highest orders: ${highest.value}` : ''}
  `;
      },
    },
    visualMap: {
      min: 0,
      max: maxOrderCount,
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
        emphasis: { label: { show: true } },
        data: mapData,
      },
    ],
  };

  return (
    <ReactEChartsCore
      echarts={echarts}
      option={usaMapOptions}
      style={{ height: "400px", width: "100%" }}
      notMerge
      lazyUpdate
    />
  );
};

export default Map;
