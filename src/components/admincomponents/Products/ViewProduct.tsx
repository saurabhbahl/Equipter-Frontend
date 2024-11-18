import { useEffect, useState } from "react";
import HeadingBar from "../rootComponents/HeadingBar";
import { SfAccessToken } from "../../../utils/useEnv";
import { useParams } from "react-router-dom";
import LoaderSpinner from "../../utils/LoaderSpinner";

const ViewProduct = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { id } = useParams();
  const [isAnimating, setIsAnimating] = useState(false);
  const fetchProductDetails = async (productId:string) => {
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

  const fetchAccessoryProducts = async (productId:string) => {
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

  const getProductWithDetails = async (productId:string) => {
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
    return <div className="w-full h-full flex justify-center my-20"><LoaderSpinner /></div> ;
  }

  return (
    <>
      <HeadingBar buttonLink="/admin/products" heading="Product Details" />
      <div className="p-6 ">
        <div className="space-y-8">
          {/* Product Images Section */}
          <div className="bg-white p-2 rounded-xl shadow-lg">
            <h3 className="text-2xl font-semibold text-gray-800 mb-3">
              Product Images
            </h3>
            <div className="relative w-full h-full overflow-hidden">
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
                      className="rounded-lg w-full h-[800px] object-cover shadow-md"
                    />
                    {product.images[currentImageIndex].Is_Featured__c && (
                      <span className="absolute top-4 left-4 bg-orange-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                        Featured
                      </span>
                    )}
                  </div>
                  {/* Navigation Buttons */}
                  <button
                    onClick={handlePrevImage}
                    className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white bg-opacity-75 hover:bg-opacity-100 text-gray-700 rounded-full p-2 shadow-md focus:outline-none"
                  >
                    {/* Left Arrow Icon */}
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white bg-opacity-75 hover:bg-opacity-100 text-gray-700 rounded-full p-2 shadow-md focus:outline-none"
                  >
                    {/* Right Arrow Icon */}
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </>
              ) : (
                <p className="text-gray-500">
                  No images available for this product.
                </p>
              )}
            </div>
            {/* Thumbnail Indicators */}
            {product.images && product.images.length > 1 && (
              <div className="flex justify-center mt-4 space-x-2">
                {product.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-3 h-3 rounded-full obj ${
                      currentImageIndex === index
                        ? "bg-gray-800"
                        : "bg-gray-400 hover:bg-gray-600"
                    } focus:outline-none`}
                  ></button>
                ))}
              </div>
            )}
          </div>

          {/* Product Information and Accessories */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Product Information Section */}
            <div className="w-full lg:w-2/3 bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6">
                General Information
              </h3>
              <div className="space-y-6 text-gray-700">
                <div>
                  <h4 className="font-medium text-gray-600">Product Name</h4>
                  <p className="text-xl font-semibold capitalize">{product.Name}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-600">Description</h4>
                  <p className="text-lg leading-relaxed">
                    {product.Description__c}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-4">
                      {/* Icon */}
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c1.657 0 3-1.567 3-3.5S13.657 1 12 1 9 2.567 9 4.5s1.343 3.5 3 3.5zM5.4 9.8c.078-1.205 1.076-2.137 2.3-2.3a6 6 0 0111.6 0c1.224.163 2.222 1.095 2.3 2.3a6 6 0 010 4.4c-.078 1.205-1.076 2.137-2.3 2.3a6 6 0 01-11.6 0c-1.224-.163-2.222-1.095-2.3-2.3a6 6 0 010-4.4z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-600">Price</h4>
                      <p className="text-lg font-semibold">
                        ${product.Product_Price__c.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-4">
                      {/* Icon */}
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 10h1l1.2 4h13.6l1.2-4H21"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 6h14l1 4H4l1-4z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 18a2 2 0 100-4 2 2 0 000 4zM15 18a2 2 0 100-4 2 2 0 000 4z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-600">Down Payment</h4>
                      <p className="text-lg font-semibold">
                        ${product.Down_Payment_Cost__c.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  {/* Add more items with icons for GVWR, Lift Capacity, etc. */}
                  
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mr-4">
                      {/* Icon */}
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 3v18h18"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-600">GVWR</h4>
                      <p className="text-lg font-semibold">
                        {product.GVWR__c} lbs
                      </p>
                    </div>
                  </div>
                  {/* Repeat for other specifications */}
                </div>
              </div>
            </div>

            {/* Accessories Section */}
            <div className="w-full lg:w-1/3 bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6">
                Accessories
              </h3>
              {product.accessories && product.accessories.length > 0 ? (
                <ul className="space-y-4">
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
                      <div>
                        <h4 className="text-lg font-semibold capitalize text-gray-800">
                          {accessory.Name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {accessory.Description__c}
                        </p>
                        <p className="text-md font-medium text-gray-900 mt-1">
                          ${accessory.Price__c.toFixed(2)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">
                  No accessories available for this product.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewProduct;