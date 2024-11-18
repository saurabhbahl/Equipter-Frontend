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
    <section className="bg-custom-cream w-full p-4">
      <div className="flex gap-3">
        <div className="py-1">
          <button
            onClick={() => nav(buttonLink)}
            className="flex border border-black text-black items-center hover:bg-gray-200"
          >
            <FontAwesomeIcon
              icon={faArrowLeft}
              className="m-3 font-bold text-xl"
            />
          </button>
        </div>
        <div>
          <p className="text-sm font-sans">{subHeading}</p>
          <p className="font-bold text-xl mt-0.5">{heading}</p>
        </div>
      </div>
    </section>
  );
};

export default HeadingBar;
