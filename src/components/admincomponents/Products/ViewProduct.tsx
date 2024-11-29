import { useEffect, useState } from "react";
import HeadingBar from "../rootComponents/HeadingBar";
import { useNavigate, useParams } from "react-router-dom";
import LoaderSpinner from "../../utils/LoaderSpinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUp,
  faChevronLeft,
  faChevronRight,
  faCube,
  faMoneyBillWave,
  faTag,
  faWeightHanging,
} from "@fortawesome/free-solid-svg-icons";
import { ProductsService } from "./ProductsService";
import AccessoriesService from "../Accessories/AccessoriesService";

import MetaComponent from "../../../utils/MetaComponent";

const ViewProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const nav = useNavigate();

  const getProductWithDetails = async (productId: string) => {
    const productDetails = await ProductsService.fetchProductsDetailsWithImages(
      productId
    );
    console.log(productDetails)

    const accessoryProducts = await ProductsService.fetchProductsWithAccessories(
      productDetails.Id
    );

    const allAccessories = await AccessoriesService.fetchAccessoriesWithImages();

    const accessoryProductMap = accessoryProducts.reduce((map, ap) => {
      map[ap.Accessory_Id__c] = ap;
      return map;
    }, {});

    const accessories = allAccessories.filter(
      (acc) => accessoryProductMap[acc.Id]
    );

    return {
      ...productDetails,
      accessories,
      images: productDetails.Product_Images__r.records,
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productId = id as string;
        const result = await getProductWithDetails(productId);
        setProduct(result);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product details:", error);
        setError(error.message || "Error Fetching Product Details");
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handlePrevImage = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
      );
      setIsAnimating(false);
    }, 500);
  };

  const handleNextImage = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
      );
      setIsAnimating(false);
    }, 500);
  };

  if (loading) {
    return (
      <>
        <HeadingBar buttonLink="/admin/products" heading="Product Details" />
        <div className="w-full h-full flex justify-center my-20">
          <LoaderSpinner />
        </div>
      </>
    );
  }
  if (error) {
    <>
      <HeadingBar buttonLink="/admin/products" heading="Edit Product" />
      return <p className="text-red-600 text-center my-60">{error}</p>;
    </>;
  }
  return (
    <>
      <MetaComponent
        title={product?.Meta_Title__c}
        description={product?.Product_Price__c}
      />
      <HeadingBar buttonLink="/admin/products" heading="Product Details" />
      <div className="p-6 lg:p-8 bg-custom-sky min-h-screen capitalize">
        <div className="space-y-6">
          {/* Product Images Section */}
          <div className="bg-white p-4 rounded shadow-lg">
            <h3 className="text-3xl font-semibold text-custom-black-200 mb-4">
              Product Images
            </h3>
            <div className="relative w-full overflow-hidden rounded-lg border border-gray-200 shadow-md">
              {product?.images && product?.images.length > 0 ? (
                <>
                  <div
                    className={`w-full h-full transition-opacity duration-500 ${
                      isAnimating ? "opacity-0" : "opacity-100"
                    }`}
                    key={currentImageIndex}
                  >
                    <img
                      src={product.images[currentImageIndex].Image_URL__c}
                      alt={`Product image ${currentImageIndex + 1}`}
                      className="rounded w-full h-[650px] object-cover shadow-md"
                      // className="rounded-md w-full h-[500px] object-cover"
                    />
                    {product.images[currentImageIndex].Is_Featured__c && (
                      <span className="absolute top-4 left-4 bg-custom-orange text-white text-sm font-bold px-3 py-1 rounded-full shadow-md">
                        Featured
                      </span>
                    )}
                  </div>
                  {product.images.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevImage}
                        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-custom-orange bg-opacity-75 hover:bg-opacity-100 text-white rounded-full p-3 shadow-md focus:outline-none"
                      >
                        <FontAwesomeIcon icon={faChevronLeft} />
                      </button>
                      <button
                        onClick={handleNextImage}
                        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-custom-orange bg-opacity-75 hover:bg-opacity-100 text-white rounded-full p-3 shadow-md focus:outline-none"
                      >
                        <FontAwesomeIcon icon={faChevronRight} />
                      </button>
                    </>
                  )}
                </>
              ) : (
                <p className="text-gray-500 text-center p-6">
                  No images available for this product.
                </p>
              )}
            </div>
            {product.images && product.images.length > 1 && (
              <div className="flex justify-center mt-4 space-x-2">
                {product.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-3 h-3 rounded-full ${
                      currentImageIndex === index
                        ? "bg-custom-orange"
                        : "bg-gray-400 hover:bg-custom-orange-100"
                    } focus:outline-none`}
                  ></button>
                ))}
              </div>
            )}
          </div>

          {/* Product Information Section */}
          <div className="w-full bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-3xl font-semibold text-custom-black-200 mb-6">
              Product Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-center space-x-4">
                <FontAwesomeIcon
                  icon={faTag}
                  className="text-custom-orange text-2xl"
                />
                <div>
                  <h4 className="font-bold text-lg text-gray-800">Name</h4>
                  <p className="text-custom-black-200">{product.Name}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <FontAwesomeIcon
                  icon={faMoneyBillWave}
                  className="text-custom-orange text-2xl"
                />
                <div>
                  <h4 className="font-bold text-lg text-gray-800">Price</h4>
                  <p className="text-custom-orange font-semibold">
                    ${product.Product_Price__c.toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <FontAwesomeIcon
                  icon={faMoneyBillWave}
                  className="text-custom-orange text-2xl"
                />
                <div>
                  <h4 className="font-bold text-lg text-gray-800">
                    Down Payment Cost
                  </h4>
                  <p className="text-custom-black-200">
                    ${product.Down_Payment_Cost__c.toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <FontAwesomeIcon
                  icon={faWeightHanging}
                  className="text-custom-orange text-2xl"
                />
                <div>
                  <h4 className="font-bold text-lg text-gray-800">GVWR</h4>
                  <p className="text-custom-black-200">{product.GVWR__c} lbs</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <FontAwesomeIcon
                  icon={faArrowUp}
                  className="text-custom-orange text-2xl"
                />
                <div>
                  <h4 className="font-bold text-lg text-gray-800">
                    Lift Capacity
                  </h4>
                  <p className="text-custom-black-200">
                    {product.Lift_Capacity__c} lbs
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <FontAwesomeIcon
                  icon={faArrowUp}
                  className="text-custom-orange text-2xl"
                />
                <div>
                  <h4 className="font-bold text-lg text-gray-800">
                    Lift Height
                  </h4>
                  <p className="text-custom-black-200">
                    {product.Lift_Height__c} feet
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <FontAwesomeIcon
                  icon={faCube}
                  className="text-custom-orange text-2xl"
                />
                <div>
                  <h4 className="font-bold text-lg text-gray-800">Container</h4>
                  <p className="text-custom-black-200">
                    {product.Container__c}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Accessories Section */}
          {product.accessories && product.accessories.length > 0 && (
            <div className="w-full bg-white p-6 rounded shadow-lg">
              <h3 className="text-3xl font-semibold text-custom-black-200 mb-6">
                Accessories
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product?.accessories?.map((accessory, index) => {
                  const featuredImageUrl = accessory?.Accesory_Images__r?.records?.filter(
                    (data) => data.Is_Featured__c == true
                  );
                  return (
                    <>
                      {" "}
                      <label
                        key={index+1}
                        onClick={() =>
                          nav(`/admin/accessories/view/${accessory.Id}`)
                        }
                        className="flex items-center space-x-2 bg-gray-50 p-3 rounded-md hover:bg-gray-100 cursor-pointer"
                      >
                        <span className="capitalize flex gap-2 items-center text-gray-700">
                          <img
                            className="shadow-sm w-[30px] h-[30px] object-cover rounded border border-gray-300"
                            src={featuredImageUrl[0]?.Image_URL__c}
                            alt="Img"
                          />
                          {accessory?.Name} -{" "}
                          <span className="text-gray-600 font-bold">
                            ${accessory?.Price__c}
                          </span>
                        </span>
                      </label>
                    </>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ViewProduct;
