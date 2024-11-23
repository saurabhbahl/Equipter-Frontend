// import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { useNavigate } from "react-router-dom";

// interface ITopbarProps {
//   buttonLink: string;
//   heading: string;
//   subHeading?: string;
// }

// const HeadingBar = ({
//   buttonLink,
//   heading,
//   subHeading = "Back To List",
// }: ITopbarProps) => {
//   const nav = useNavigate();
//   return (
//     <section className="bg-custom-cream w-full p-4 shadow-md">
//       <div className="flex gap-3">
//         <div className="py-1">
//           <button
//             onClick={() => nav(buttonLink)}
//             className="flex border border-black text-black items-center hover:bg-gray-200"
//           >
//             <FontAwesomeIcon
//               icon={faArrowLeft}
//               className="m-3 font-bold text-xl"
//             />
//           </button>
//         </div>
//         <div>
//           <p className="text-sm font-sans">{subHeading}</p>
//           <p className="font-bold text-xl mt-0.5">{heading}</p>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default HeadingBar;

// import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { useNavigate } from "react-router-dom";

// interface ITopbarProps {
//   buttonLink: string;
//   heading: string;
//   subHeading?: string;
// }

// const HeadingBar = ({
//   buttonLink,
//   heading,
//   subHeading = "Back To List",
// }: ITopbarProps) => {
//   const nav = useNavigate();
//   return (
//     <section className="   w-full p-6 shadow-xl">
//       <div className="flex items-center gap-4">
//         <button
//           onClick={() => nav(buttonLink)}
//           className="flex items-center text-gray-600 hover:text-custom-orange transition-colors"
//         >
//           <FontAwesomeIcon icon={faArrowLeft} className="text-2xl" />
//         </button>
//         <div>
//           <p className="text-sm text-gray-500">{subHeading}</p>
//           <h1 className="text-2xl font-semibold text-gray-800">{heading}</h1>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default HeadingBar;

import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";

interface ITopbarProps {
  buttonLink: string;
  heading: string;
  subHeading?: string;
}

const HeadingBar = ({
  buttonLink,
  heading,
  subHeading = "Back To List",
}: ITopbarProps) => {
  const nav = useNavigate();
  return (
    <section className="w-full p-1 bg-gradient-to-b outline-none  from-gray-800 to-black/90 text-white border-2  shadow-xl  ">
      <div className="flex items-center gap-4   w-fit p-3 ">
        <button
          onClick={() => nav(buttonLink)}
          className="text-slate-200 border border-custom-orange px-3 py-2 hover:text-custom-orange 
            transition-colors">
          <FontAwesomeIcon icon={faArrowLeft} className="text-xl" />
        </button>
        <div className="">
          <p className="text-xs text-custom-orange">{subHeading}</p>
          <h1 className="text-lg font-semibold text-gray-800 text-white">
            {heading}
          </h1>
        </div>
      </div>
    </section>
  );
};

export default HeadingBar;
