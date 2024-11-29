import { faRefresh } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import InputField from "../../utils/InputFeild";

interface Props {
  title: string;
  buttonLink: string;
  buttonText: string;
  loading?: boolean;
  reloadBtnFn?: () => void;
}

const SubTitle = ({
  title,
  buttonLink,
  reloadBtnFn,
  loading,
  buttonText,
}: Props) => {
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
        <div className="flex items-center gap-5">
          {reloadBtnFn && (
            <button
              onClick={reloadBtnFn}
              className="text-gray-500 hover:text-gray-700"
              disabled={loading}
              title={`Reload ${title}`}
            >
              <FontAwesomeIcon
                icon={faRefresh}
                className={`transition-transform duration-300 ${
                  loading ? "animate-spin" : ""
                }`}
              />
            </button>
          )}
          <button
            className="px-4 py-2.5 text-sm bg-custom-orange/85  hover:bg-custom-orange text-white rounded"
            onClick={() => navigate(buttonLink)}>
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubTitle;
