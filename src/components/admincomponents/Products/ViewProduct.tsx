import { useEffect, useState } from "react";
import HeadingBar from "../rootComponents/HeadingBar";
import { SfAccessToken } from "../../../utils/useEnv";
import { useNavigate, useParams } from "react-router-dom";
import LoaderSpinner from "../../utils/LoaderSpinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp, faChevronLeft, faChevronRight, faCube, faMoneyBillWave, faTag, faWeightHanging } from "@fortawesome/free-solid-svg-icons";

const ViewProduct = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { id } = useParams();
  const [isAnimating, setIsAnimating] = useState(false);
  const fetchProductDetails = async (productId: string) => {
    const productUrl = `/api/services/data/v52.0/query/?q=SELECT+Id%2C+Name%2C+Product_Price__c%2C+Down_Payment_Cost__c%2C+GVWR__c%2C+Lift_Capacity__c%2C+Lift_Height__c%2C+Container__c%2C+%28SELECT+Id%2C+Image_URL__c%2C+Is_Featured__c%2C+Product_Id__c%2C+Name%2C+Image_Description__c+FROM+Product_Images__r%29+FROM+Product__c+WHERE+Id+%3D+%27${productId}%27`;

    try {
      const response = await fetch(productUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${SfAccessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching product: ${response.statusText}`);
      }
      const data = await response.json();
      return data.records[0];
    } catch (error) {
      console.error("Error fetching product details:", error);
      throw error;
    }
  };
  const nav = useNavigate();

  const fetchAccessoryProducts = async (productId: string) => {
    const accessoryProductUrl = `/api/services/data/v52.0/query/?q=SELECT+Id%2C+Accessory_Id__c%2C+Product_Id__c%2C+Name+FROM+Accessory_Product__c+WHERE+Product_Id__c+%3D+%27${productId}%27`;

    try {
      const response = await fetch(accessoryProductUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${SfAccessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Error fetching accessory products: ${response.statusText}`
        );
      }
      const data = await response.json();
      return data.records;
    } catch (error) {
      console.error("Error fetching accessory products:", error);
      throw error;
    }
  };

  const fetchAccessories = async () => {
    const accessoriesUrl =
      "/api/services/data/v52.0/query/?q=SELECT+Id%2C+Name%2C+CreatedById%2C+Description__c%2C+LastModifiedById%2C+OwnerId%2C+Price__c%2C+Quantity__c+FROM+Accessory__c";

    try {
      const response = await fetch(accessoriesUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${SfAccessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching accessories: ${response.statusText}`);
      }
      const data = await response.json();
      return data.records;
    } catch (error) {
      console.error("Error fetching accessories:", error);
      throw error;
    }
  };

  const getProductWithDetails = async (productId: string) => {
    const productDetails = await fetchProductDetails(productId);
    const accessoryProducts = await fetchAccessoryProducts(productId);
    const allAccessories = await fetchAccessories();

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
        const productId = id;
        const result = await getProductWithDetails(productId);
        setProduct(result);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product details:", error);
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
      <div className="w-full h-full flex justify-center my-20">
        <LoaderSpinner />
      </div>
    );
  }

  return (
    <>
      <HeadingBar buttonLink="/admin/products" heading="Product Details" />
      <div className="p-6 lg:p-10 bg-custom-sky min-h-screen capitalize">
        <div className="space-y-8">
          {/* Product Images Section */}
          <div className="bg-white p-4 rounded-xl shadow-lg">
            <h3 className="text-3xl font-semibold text-custom-black-200 mb-4">
              Product Images
            </h3>
            <div className="relative w-full overflow-hidden rounded-lg border border-gray-200 shadow-md">
              {product.images && product.images.length > 0 ? (
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
                      className="rounded-lg w-full h-[650px] object-cover shadow-md"
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
                        <FontAwesomeIcon icon={faChevronLeft  } />
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
              <ul className="space-y-6">
                {product.accessories.map((accessory, index) => (
                  <li
                    key={index}
                    className="flex items-start hover:bg-gray-50 p-3 rounded-lg transition"
                  >
                    {accessory.Image_URL__c && (
                      <img
                        src={accessory.Image_URL__c}
                        alt={accessory.Name}
                        className="w-16 h-16 object-cover rounded-md shadow-sm mr-4"
                      />
                    )}
                    <div
                      className="bg-custom-gray-300 w-full cursor-pointer p-4 rounded-lg"
                      title="See Details"
                      onClick={() =>
                        nav(`/admin/accessories/view/${accessory.Id}`)
                      }
                    >
                      <h4 className="text-lg font-semibold capitalize text-gray-800">
                        {accessory.Name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {accessory.Description__c}
                      </p>
                      <p className="text-md font-medium text-custom-black-200 mt-4">
                        ${accessory.Price__c.toFixed(2)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default ViewProduct;


