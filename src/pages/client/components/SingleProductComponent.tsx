import { useNavigate } from "react-router-dom";
import CustomLogo from "../../../components/utils/CustomLogo";

const SingleProductComponent = ({ productDetail }) => {
  const featuredImageUrl = productDetail?.images?.filter((data) => data.is_featured === true);
  console.log(featuredImageUrl[0])
  const nav = useNavigate();
console.log(productDetail)
  const {
    name,
    description,
    product_title,
    product_url,
  } = productDetail;

  return (
    <div className="flex flex-col md:flex-row justify-between items-center p-6 md:p-12  gap-10 my-10">
      {/* Image Section */}
      <div className="w-full md:w-1/2 flex justify-center items-center">
        <img
          src={featuredImageUrl?.[0].image_url}
          alt={name || "Product Image"}
          className="w-[80%] md:w-[70%] lg:w-[60%] object-contain "
        />
      </div>

      {/* Text Section */}
      <div className="w-full md:w-1/2 flex flex-col justify-center gap-6 px-4">
        {/* Logo */}
        {/* <div className="!w-[10%] !h-[10%]"> */}
        <CustomLogo numberText={name} />
        {/* </div> */}

        {/* Heading */}
        <h3 className="font-work-sans font-bold text-gray-800 uppercase text-2xl md:text-3xl lg:text-3xl leading-snug">
          {product_title || "Product Title"}
        </h3>

        {/* Description */}
        <p className="font-work-sans text-base md:text-lg text-gray-600 tracking-wide max-w-[85%] leading-relaxed">
          {description}
        </p>

        {/* Button */}
        <button
          onClick={() => {
            nav(`/products/${product_url}`);
          }}
          className="bg-[#ec7a25] text-white font-semibold text-lg px-6 py-2 font-work-sans  hover:bg-orange-600 transition duration-300 w-fit"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default SingleProductComponent;
