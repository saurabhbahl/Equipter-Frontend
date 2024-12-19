import { useNavigate } from "react-router-dom";
import CustomLogo from "../../../components/utils/CustomLogo";
import { IProduct } from "../types/ClientSchemas";
import { truncateText } from "../../../utils/helpers";
import LoaderSpinner from "../../../components/utils/LoaderSpinner";
import { useEffect, useState } from "react";
interface SingleProductProps {
  productDetail: IProduct;
}
const SingleProductComponent: React.FC<SingleProductProps> = ({
  productDetail,
}) => {
  const [isImageLoading,setIsImageLoading]=useState(true)
  const[featuredImageUrl,setFeaturedImageUrl]=useState("")
  useEffect(()=>{
     const imgUrl = productDetail?.images?.filter(
    (data) => data.is_featured === true
  );
  if(imgUrl){
    setFeaturedImageUrl(imgUrl[0]?.image_url)
    setIsImageLoading(false)
  }
  },[])
 
  const nav = useNavigate();

  const { name, description, product_title, product_url } = productDetail || {};

  return (
    <div className="flex flex-col xl:flex-row justify-between items-center px-4 py-8 sm:px-6 sm:py-4 md:px-12 md:py-10 lg:gap-10 md:gap-6 gap-3 my-10">
      {/* Image Section */}
      <div className="w-full xl:w-1/2 flex justify-center items-center">
        {!isImageLoading ? (
          <img
            src={featuredImageUrl}
            alt={name || "Product Image"}
            className="w-[80%] sm:w-[70%] md:w-[70%] lg:w-[85%] object-contain"
          />
        ) : (
          <LoaderSpinner />
        )}
      </div>

      {/* Text Section */}
      <div className="w-full xl:w-1/2 flex flex-col justify-center gap-3 px-4 md:px-6 lg:px-8">
        {/* Logo */}
        <CustomLogo numberText={name} />

        {/* Heading */}
        <h3 className="font-work-sans font-bold text-gray-800 uppercase text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-snug">
          {product_title || "Product Title"}
        </h3>

        {/* Description */}
        <p className="font-work-sans text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 tracking-wide max-w-[90%] md:max-w-[85%] lg:max-w-[80%] leading-relaxed">
          {description.length > 70
            ? `${truncateText(description, 60)}`
            : description}
        </p>

        {/* Button */}
        <button
          onClick={() => {
            nav(`/products/${product_url}`);
          }}
          className="bg-[#ec7a25] text-white font-semibold text-sm sm:text-base md:text-lg px-4 py-2 sm:px-6 sm:py-2 hover:bg-orange-600 transition duration-300 w-fit"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default SingleProductComponent;
