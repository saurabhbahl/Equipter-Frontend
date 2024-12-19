// import Logo from "../../assets/images/logo.png";

// interface ICustomLogoProps {
//   mainText?: string;
//   numberText: string;
//   classes?: string;
// }

// const CustomLogo = ({ mainText="equipter", numberText, classes }: ICustomLogoProps) => {
//   return (
//     <div className={`flex relative items-center h-auto w-fit -mb-10  ${classes || ""}`}>
//       {/* Logo Section */}
//       <div className="h-[110px] absolute top-5 left-0 ">
//         <img src={Logo} alt="logo" className="w-full h-full object-contain" />
//       </div>

//       {/* Text Section */}
//       <div className="flex p-14  flex-col font-vesper justify-center">
//         {/* Main Text */}
//         <p className="ml-9 text-4xl font-extrabold uppercase text-black  tracking-wide">
//           {mainText}
//         </p>

//         {/* Number Text */}
//         <div className="relative w-fit ml-auto flex -mt-2 justify-end">
//           {/* Orange Background with Skew */}
//           <div className="absolute inset-0 bg-[#ec7a25] -skew-x-[40deg] ml-5 -z-10 h-[80%] mt-[6px] w-[80%]"></div>
//           {/* Number Text */}
//           <p className="text-4xl font-extrabold text-black uppercase   px-6 mr-2 pl-8">
//             {numberText}
//           </p>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default CustomLogo;

import Logo from "../../assets/images/logo.png";

interface ICustomLogoProps {
  mainText?: string;
  numberText: string;
  classes?: string;
}

const CustomLogo = ({ mainText = "equipter", numberText, classes }: ICustomLogoProps) => {
  return (
    <div className={`flex relative items-center h-auto w-fit -mb-6 md:-mb-10 ${classes || ""}`}>
      {/* Logo Section */}
      <div className="h-[80px] sm:h-[90px] md:h-[110px] absolute top-5 left-0">
        <img src={Logo} alt="logo" className="w-full h-full object-contain" />
      </div>

      {/* Text Section */}
      <div className="flex flex-col font-vesper justify-center p-11 md:p-14">
        {/* Main Text */}
        <p className="ml-4 sm:ml-6 md:ml-9 text-2xl sm:text-3xl md:text-4xl font-extrabold uppercase text-black tracking-wide">
          {mainText}
        </p>

        {/* Number Text Section */}
        <div className="relative w-fit ml-auto flex -mt-2 justify-end">
          {/* Orange Background with Skew */}
          <div className="absolute inset-0 bg-[#ec7a25] -skew-x-[40deg] ml-3 sm:ml-4 md:ml-3 -z-10 h-[80%] mt-[6px] w-[80%] sm:w-[75%] md:w-[90%]"></div>
          {/* Number Text */}
          <p className="text-xl  md:text-3xl font-extrabold text-black uppercase px-4 sm:px-5 md:px-6 mr-3 md:mr-1 lg:mr-0 pl-6 sm:pl-7 md:pl-8">
            {numberText}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomLogo;
