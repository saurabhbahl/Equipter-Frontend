import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
interface StatProps {
  title: string;
  value: string | number;
  icon: any;
}

const StatCard = ({ title, value, icon }: StatProps) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [suffix, setSuffix] = useState("");

  useEffect(() => {
    const numericValue =
      typeof value === "string"
        ? parseFloat(value.replace(/[^0-9.-]+/g, ""))
        : value;
    const suffixValue =
      typeof value === "string" ? value.replace(/[0-9.,]/g, "") : "";

    setSuffix(suffixValue);

    const duration = 1000;
    const frameRate = 60;
    const totalFrames = (duration / 1000) * frameRate;
    const increment = numericValue / totalFrames;
    let currentFrame = 0;

    const animate = () => {
      if (currentFrame < totalFrames) {
        setDisplayValue((prev) => Math.min(prev + increment, numericValue));
        currentFrame++;
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(numericValue);
      }
    };

    animate();

    return () => {
      setDisplayValue(numericValue);
    };
  }, [value]);

  return (
    <div className="bg-white p-6 font-roboto gap-1 shadow-lg hover:shadow-xl text-center w-full cursor-pointer hover:scale-105 duration-150 ease-in  flex flex-col items-start">
      <div className="text-lg text-[rgb(60,80,224)] px-3 py-2 rounded-3xl bg-[rgb(239_242_247)]">
        <FontAwesomeIcon icon={icon} />
      </div>
      <p className={`text-2xl font-bold  !text-[#1e293b] mt-1 flex items-center`}>
        {suffix[0]}
        {Number.isInteger(displayValue)
          ? displayValue.toLocaleString()
          : displayValue.toFixed(3)}
        {suffix[1]}
      </p>
      <p className="text-sm font-semibold text-slate-500 uppercase mt-1">{title}</p>
    </div>
  );
};

export default StatCard;
