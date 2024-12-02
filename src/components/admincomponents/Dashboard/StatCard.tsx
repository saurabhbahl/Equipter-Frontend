import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
interface StatProps {
  title: string;
  value: string | number;
  icon: IconProp;
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
    <div className="bg-white p-3 font-roboto shadow-md hover:shadow-xl text-center w-full cursor-pointer hover:scale-105 duration-200 ease-in-out flex flex-col items-center rounded border border-gray-200">
      {/* Icon Container */}
      <div className="text-xl text-[rgb(60,80,224)] p-4 rounded-full bg-[rgb(239_242_247)] mb-2 flex items-center justify-center">
        <FontAwesomeIcon icon={icon} />
      </div>

      {/* Value */}
      <p className="text-2xl font-extrabold text-[#1e293b] flex items-center">
        {suffix[0]}
        {Number.isInteger(displayValue)
          ? displayValue.toLocaleString()
          : displayValue.toFixed(2)}
        {suffix.slice(1)}
      </p>

      {/* Title */}
      <p className="text-sm font-medium text-slate-600 uppercase tracking-wide mt-2">
        {title}
      </p>
    </div>
  );
};

export default StatCard;

