import { useNavigate } from "react-router-dom";
import CustomLogo from "../../../components/utils/CustomLogo";
import { IProduct } from "../types/ClientSchemas";
interface SingleProductProps{
  productDetail:IProduct
}
const SingleProductComponent: React.FC<SingleProductProps> = ({ productDetail }) => {
  const featuredImageUrl = productDetail?.images?.filter((data) => data.is_featured === true);
  const nav = useNavigate();

  const {
    name,
    description,
    product_title,
    product_url,
  } = productDetail || {};

  return (
    <div className="flex flex-col xl:flex-row justify-between items-center px-4 py-8 sm:px-6 sm:py-10 md:px-12 md:py-16 gap-10 my-10">
      {/* Image Section */}
      <div className="w-full xl:w-1/2 flex justify-center items-center">
        <img
          src={featuredImageUrl?.[0]?.image_url}
          alt={name || "Product Image"}
          className="w-[80%] sm:w-[70%] md:w-[70%] lg:w-[60%] object-contain"
        />
      </div>

      {/* Text Section */}
      <div className="w-full xl:w-1/2 flex flex-col justify-center gap-6 px-4 md:px-6 lg:px-8">
        {/* Logo */}
        <CustomLogo numberText={name} />

        {/* Heading */}
        <h3 className="font-work-sans font-bold text-gray-800 uppercase text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-snug">
          {product_title || "Product Title"}
        </h3>

        {/* Description */}
        <p className="font-work-sans text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 tracking-wide max-w-[90%] md:max-w-[85%] lg:max-w-[80%] leading-relaxed">
          {description}
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
