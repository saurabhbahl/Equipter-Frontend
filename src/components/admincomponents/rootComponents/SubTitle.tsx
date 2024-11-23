// import { faRefresh } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { useNavigate } from "react-router-dom";
// import InputField from "../../utils/InputFeild";

// interface Props {
//   title: string;
//   buttonLink: string;
//   buttonText:string;
//   reloadBtnFn?: () => void;
// }

// const SubTitle = ({ title, buttonLink, reloadBtnFn ,buttonText}: Props) => {
//   const nav = useNavigate();
//   return (
//     <div className="flex my-auto  bg-gradient-to-b  rounded  from-gray-800 to-black/90 outline-none  text-white border-2  shadow-xl   p-2 mb-1 items-center justify-between ">
//       {/* <h1 className="text-2xl font-semibold text-g">{title}</h1> */}
//       <div>
//     <InputField id="srch" name="srch" type="search" placeholder="Search Products" classes="rounded !m-0 text-black"/>
//       </div>
//       <div className="flex gap-3">
//         <button onClick={reloadBtnFn}>
//           {" "}
//           <FontAwesomeIcon icon={faRefresh} />
//         </button>
//         <button
//           className="px-4 py-2 text-sm btn-yellow"
//           onClick={() => {
//             nav(buttonLink);
//           }}
//         >
//         {buttonText}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default SubTitle;
import { faRefresh } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import InputField from "../../utils/InputFeild";


interface Props {
  title: string;
  buttonLink: string;
  buttonText: string;
  reloadBtnFn?: () => void;
}

const SubTitle = ({ title, buttonLink, reloadBtnFn, buttonText }: Props) => {
  const navigate = useNavigate();
  return (
    <div className="mb-6  bg-slate-00 w-full">
      {/* <h1 className="text-3xl font-bold mb-4 text-gray-800">{title}</h1> */}
      <div className="flex items-center justify-between">
        <InputField
          id="srch"
          name="srch"
          type="search"
          placeholder={`Search ${title}`}
          classes="rounded m-0 text-black border-none shadow-sm"
        />
        <div className="flex items-center gap-3">
          {reloadBtnFn && (
            <button
              onClick={reloadBtnFn}
              className="text-gray-500 hover:text-gray-700"
            >
              <FontAwesomeIcon icon={faRefresh} />
            </button>
          )}
          <button
            className="px-4 py-2.5 text-sm bg-custom-orange/85  hover:bg-custom-orange text-white rounded"
            onClick={() => navigate(buttonLink)}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubTitle;
