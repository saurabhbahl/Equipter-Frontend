// import CustomLogo from "../../../components/utils/CustomLogo";

// const SingleProductComponent = ({ productDetail }) => {
//   console.log(productDetail);
//   const featuredImageUrl = productDetail?.Product_Images__r?.records.filter(
//     (data) => data.Is_Featured__c == true
//   );

//   const {
//     Name,
//     Product_Description__c,
//     Product_Title__c,
//     Product_URL__c,

//   } = productDetail;

//   return (
//     <div className="flex flex-col md:flex-row justify-between items-center p-6 md:p-12 bg rounded-lg gap-8 my-10">
//       {/* <MetaComponent title={Meta_Title__c} /> */}
//       {/* Image Section */}
//       <div className="w-full md:w-1/2 flex justify-end items-center">
//         <img
//           src={featuredImageUrl[0]?.Image_URL__c}
//           alt={Name}
//           className="w-[80%] md:w-[70%] lg:w-[60%] object-contain rounded-lg"
//         />
//       </div>

//       {/* Text Section */}
//       <div className="w-full md:w-1/2 flex flex-col justify-center gap-4 px-4">
//         {/* Logo */}
//         <CustomLogo numberText={Name} />

//         {/* Heading */}
//         <h3 className="font-work-sans font-bold text-custom-gray uppercase text-2xl md:text-3xl lg:text-3xl leading-snug ">
//           {Product_Title__c}
//         </h3>
//         <p className="font-work-sans text-lg tracking-wide max-w-[90%]">
//           {Product_Description__c}
//         </p>

//         {/* Button */}
//         <button className="bg-[#ec7a25] text-white font-semibold text-lg px-6 py-2 font-work-sans  hover:bg-orange-600 transition duration-300 w-fit">
//           Buy Now
//         </button>
//       </div>
//     </div>
//   );
// };

// export default SingleProductComponent;
import CustomLogo from "../../../components/utils/CustomLogo";

const SingleProductComponent = ({ productDetail }) => {
  const featuredImageUrl = productDetail?.Product_Images__r?.records?.filter(
    (data) => data.Is_Featured__c === true
  );

  const { Name, Product_Description__c, Product_Title__c } = productDetail;

  return (
    <div className="flex flex-col md:flex-row justify-between items-center p-6 md:p-12  gap-10 my-10">
      {/* Image Section */}
      <div className="w-full md:w-1/2 flex justify-center items-center">
        <img
          src={featuredImageUrl?.[0]?.Image_URL__c}
          alt={Name || "Product Image"}
          className="w-[80%] md:w-[70%] lg:w-[60%] object-contain "
        />
      </div>

      {/* Text Section */}
      <div className="w-full md:w-1/2 flex flex-col justify-center gap-6 px-4">
        {/* Logo */}
        {/* <div className="!w-[10%] !h-[10%]"> */}
          <CustomLogo numberText={Name} />
        {/* </div> */}

        {/* Heading */}
        <h3 className="font-work-sans font-bold text-gray-800 uppercase text-2xl md:text-3xl lg:text-3xl leading-snug">
          {Product_Title__c || "Product Title"}
        </h3>

        {/* Description */}
        <p className="font-work-sans text-base md:text-lg text-gray-600 tracking-wide max-w-[85%] leading-relaxed">
          {Product_Description__c}
        </p>

        {/* Button */}
        <button className="bg-[#ec7a25] text-white font-semibold text-lg px-6 py-2 font-work-sans  hover:bg-orange-600 transition duration-300 w-fit">
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default SingleProductComponent;
