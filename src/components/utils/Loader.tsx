import { useEffect, useState } from "react";
import { ThreeDots } from "react-loader-spinner";

const Loader = ({ message }: { message?: string }) => {
  const [displayMessage, setDisplayMessage] = useState(message);
  const [fadeClass, setFadeClass] = useState("opacity-100");
  console.log(message);
  useEffect(() => {
    if (message) {
      setFadeClass("opacity-0");
      setTimeout(() => {
        setDisplayMessage(message);
        setFadeClass("opacity-100");
      }, 300);
    }
  }, [message]);
  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-black ${
        message
          ? "bg-opacity-40 backdrop-blur-sm "
          : "bg-opacity-35 backdrop-blur-sm"
      }`}
    >
      <div className="flex flex-col items-center">
        <svg
          width="55"
          height="55"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
          className="m-auto"
        >
          {/* Black Triangle */}
          <polygon
            points="50,0 100,50 0,50"
            fill="black"
            style={{
              transformOrigin: "50px 50px",
              animation: "rotateBlack 1.5s infinite",
            }}
          />

          {/* Orange Triangle */}
          <polygon
            points="0,50 50,100 100,50"
            fill="#ea7600"
            style={{
              transformOrigin: "50px 50px",
              animation: "rotateOrange 1.5s infinite",
            }}
          />

          {/* SVG Animations */}
          <style>
            {`
            @keyframes rotateBlack {
              0% {
                transform: rotate(0deg);
              }
              50% {
                transform: rotate(180deg);
              }
              100% {
                transform: rotate(360deg);
              }
            }
            @keyframes rotateOrange {
              0% {
                transform: rotate(0deg);
              }
              50% {
                transform: rotate(-180deg);
              }
              100% {
                transform: rotate(-360deg);
              }
            }
          `}
          </style>
        </svg>
        {message && (
          <div
            className={` mt-5 flex gap-3  justify-center items-center transition-opacity duration-300 ${fadeClass}`}
          >
            <span className="text-black capitalize font-sans text-[15px] ">
              {displayMessage}.....
            </span>
            <LoaderSmall />
          </div>
        )}
      </div>
    </div>
  );
};

function LoaderSmall() {
  return (
    <ThreeDots
      visible={true}
      height="30"
      width="30"
      color="#ea7600"
      radius="5"
      ariaLabel="three-dots-loading"
      wrapperStyle={{}}
      wrapperClass=""
    />
  );
}

export default Loader;
