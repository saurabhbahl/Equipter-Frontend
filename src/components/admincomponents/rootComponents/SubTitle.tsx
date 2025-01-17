import { faRefresh } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import InputField from "../../utils/InputFeild";
import React from "react";

interface Props {
  title: string;
  buttonLink: string;
  buttonText?: string;
  loading?: boolean;
  reloadBtnFn?: () => void;
  subComp?:React.ReactNode
}

const SubTitle = ({
  title,
  buttonLink,
  reloadBtnFn,
  loading,
  buttonText,
  subComp
}: Props) => {
  const navigate = useNavigate();
  return (
    <div className="my-2 w-full">
      {/* <h1 className="text-3xl font-bold mb-4 text-gray-800">{title}</h1> */}
      <div className="flex items-center justify-end gap-6">
        <InputField
          id="srch"
          name="srch"
          type="search"
          placeholder={`Search ${title}`}
          classes="rounded m-0 text-black border-none shadow-sm hidden"
        />
        {subComp && subComp}
        {/* button and reload btn */}
        <div className="flex items-center gap-5">
          {reloadBtnFn && (
            <button
              onClick={reloadBtnFn}
              className="text-gray-500 hover:text-gray-700"
              disabled={loading}
              title={`Reload ${title}`} >
              <FontAwesomeIcon
                icon={faRefresh}
                className={`transition-transform duration-300 ${
                  loading ? "animate-spin" : ""
                }`}
              />
            </button>
          )}
          {buttonText && (
            <button
              className="px-4 py-2.5 text-sm bg-custom-orange/85  hover:bg-custom-orange text-white rounded"
              onClick={() => navigate(buttonLink)}>
              {buttonText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubTitle;


