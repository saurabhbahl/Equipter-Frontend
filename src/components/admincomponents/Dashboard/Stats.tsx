import StatCard from "./StatCard";
import {
  faBox,
  faEye,
  faShoppingCart,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";

const Stats = () => {
  return (
    <div className="flex justify-between gap-6 ">
      <StatCard title="Total Views" value="$3.456K" icon={faEye} />
      <StatCard title="Total Profit" value="$45.2K" icon={faShoppingCart} />
      <StatCard title="Total Products" value="2,450" icon={faBox} />
      <StatCard title="Total Users" value="3,456" icon={faUsers} />
    </div>
  );
};

export default Stats;
