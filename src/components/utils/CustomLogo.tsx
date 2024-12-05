import Logo from "../../assets/images/logo.png";

interface ICustomLogoProps {
  mainText?: string;
  numberText: string;
  classes?: string;
}

const CustomLogo = ({ mainText="equipter", numberText, classes }: ICustomLogoProps) => {
  return (
    <div className={`flex relative items-center h-auto w-fit -mb-10  ${classes || ""}`}>
      {/* Logo Section */}
      <div className="h-[110px] absolute top-5 left-0 ">
        <img src={Logo} alt="logo" className="w-full h-full object-contain" />
      </div>

      {/* Text Section */}
      <div className="flex p-14  flex-col font-vesper justify-center">
        {/* Main Text */}
        <p className="ml-9 text-4xl font-extrabold uppercase text-black  tracking-wide">
          {mainText}
        </p>

        {/* Number Text */}
        <div className="relative w-fit ml-auto flex -mt-2 justify-end">
          {/* Orange Background with Skew */}
          <div className="absolute inset-0 bg-[#ec7a25] -skew-x-[40deg] ml-5 -z-10 h-[80%] mt-[6px] w-[80%]"></div>
          {/* Number Text */}
          <p className="text-4xl font-extrabold text-black uppercase   px-6 mr-2 pl-8">
            {numberText}
          </p>

        </div>
      </div>
    </div>
  );
};

export default CustomLogo;