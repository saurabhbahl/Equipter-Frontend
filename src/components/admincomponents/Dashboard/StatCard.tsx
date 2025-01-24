import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LoaderSpinner from "../../utils/LoaderSpinner";

interface StatProps {
  title: string;
  value: string | number;
  icon: IconProp;
  loading: boolean;
}

const StatCard = ({ title, value, icon, loading }: StatProps) => {
  const [displayValue, setDisplayValue] = useState<number>(0);
  const [suffix, setSuffix] = useState<string>("");
  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    if (loading) {
      setDisplayValue(0);
      return;
    }

    const numericValue =
      typeof value === "string" ? parseFloat(value.replace(/[^0-9.-]+/g, "")) : value;
    const suffixValue =
      typeof value === "string" ? value.replace(/[0-9.,]/g, "") : "";
    setSuffix(suffixValue);

    const duration = 500; 
    const startTimestamp = performance.now();

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const animate = (timestamp: number) => {
      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);
      setDisplayValue(numericValue * easedProgress);

      if (elapsed < duration) {
        requestRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(numericValue); 
      }
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      setDisplayValue(numericValue); 
    };
  }, [value, loading]);


  const formattedValue = Number.isInteger(displayValue)  ? displayValue.toLocaleString()  : displayValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="bg-white p-3 font-roboto shadow-md hover:shadow-xl text-center w-full cursor-pointer hover:scale-105 duration-300 ease-in-out flex flex-col items-center rounded border border-gray-200 transition-transform">
      {/* Icon Container */}
      <div className="text-xl text-[rgb(60,80,224)] p-4 rounded-full bg-[rgb(239_242_247)] mb-2 flex items-center justify-center">
        <FontAwesomeIcon icon={icon} />
      </div>

      {/* Content */}
      {loading ? (
        <LoaderSpinner />
      ) : (
        <>
          {/* Value */}
          <p className="text-2xl font-extrabold text-[#1e293b] flex items-center">
            {suffix[0] && <span>{suffix[0]}</span>}
            <span>{Math.ceil(Number(formattedValue))}</span>
            {suffix.slice(1) && <span>{suffix.slice(1)}</span>}
          </p>
        </>
      )}

      {/* Title */}
      <p className="text-sm font-medium text-slate-600 uppercase tracking-wide mt-2">
        {title}
      </p>
    </div>
  );
};

export default StatCard;
