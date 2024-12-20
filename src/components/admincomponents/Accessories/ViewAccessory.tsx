import { useEffect, useState } from "react";
import HeadingBar from "../rootComponents/HeadingBar";
import { useParams } from "react-router-dom";
import LoaderSpinner from "../../utils/LoaderSpinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTag,
  faDollarSign,
  faBoxOpen,
  faInfoCircle,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import MetaComponent from "../../../utils/MetaComponent";
import AccessoriesService from "./AccessoriesService";
import { ErrorWithMessage } from "../../../types/componentsTypes";
import { IAccessoryImage } from "./AccessoriesSchema";

export interface IAccessory {
  Id: string;
  Name: string;
  Accessory_URL__c: string;
  Meta_Title__c: string;
  Description__c: string;
  Price__c: string;
  Quantity__c: string;
  images: IAccessoryImage[];
}
const ViewAccessory = () => {
  const [accessory, setAccessory] = useState<IAccessory | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [error, setError] = useState("");
  const { id } = useParams();

  // Fetch accessory data with related images
  const fetchAccessoryData = async (accessoryId: string) => {
    try {
      const accessoryData = await AccessoriesService.fetchSingleAccessoryWithImages(
        accessoryId
      );
      // Extract images from the subquery
      const images = accessoryData.Accesory_Images__r?.records || [];
      return {
        Id: accessoryData.Id,
        Name: accessoryData.Name,
        Accessory_URL__c: accessoryData.Accessory_URL__c,
        Meta_Title__c: accessoryData.Meta_Title__c,
        Description__c: accessoryData.Description__c,
        Price__c: Number(accessoryData.Price__c),
        Quantity__c: accessoryData.Quantity__c,
        images: images,
      };
    } catch (error) {
      console.error("Error fetching accessory data:", error);
      setError(
        (error as ErrorWithMessage).message || "Error in Viewing Accessory"
      );
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchAccessoryData(id as string);
        setAccessory((result as unknown) as IAccessory);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching accessory details:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handlePrevImage = () => {
    if (!accessory || !accessory.images) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === 0 ? accessory?.images.length - 1 : prevIndex - 1
      );
      setIsAnimating(false);
    }, 500);
  };

  const handleNextImage = () => {
    if (!accessory || !accessory.images) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === accessory?.images.length - 1 ? 0 : prevIndex + 1
      );
      setIsAnimating(false);
    }, 500);
  };

  if (loading) {
    return (
      <>
        <HeadingBar
          buttonLink="/admin/accessories"
          heading="Accessory Details"
        />
        <div className=" flex justify-center items-center my-96">
          <LoaderSpinner />
        </div>
      </>
    );
  }
  if (error) {
    return (
      <>
        <HeadingBar
          buttonLink="/admin/accessories"
          heading="Accessory Details"
        />
        <p className="flex justify-center items-center my-64 text-red-600 text-center">
          {error}
        </p>
        ;
      </>
    );
  }
  console.log(accessory);

  return (
    <>
      <MetaComponent title={accessory?.Meta_Title__c as string} />
      <HeadingBar buttonLink="/admin/accessories" heading="Accessory Details" />
      <div className="p-6 lg:p-8 bg-custom-sky capitalize min-h-screen">
        <div className="space-y-6">
          {/* Accessory Images Section */}
          <div className="bg-white p-4 rounded shadow-lg">
            <h3 className="text-3xl font-semibold text-custom-black-200 mb-4">
              Accessory Images
            </h3>
            <div className="relative w-full overflow-hidden rounded border border-gray-200 shadow-md">
              {accessory?.images && accessory.images.length > 0 ? (
                <>
                  <div
                    className={`w-full h-full transition-opacity duration-500 ${
                      isAnimating ? "opacity-0" : "opacity-100"
                    }`}
                    key={currentImageIndex}
                  >
                    <img
                      src={accessory.images[currentImageIndex].image_url}
                      alt={`Accessory image ${currentImageIndex + 1}`}
                      className="rounded w-full h-[650px] object-cover"
                    />
                    {accessory.images[currentImageIndex].is_featured && (
                      <span className="absolute top-4 left-4 bg-custom-orange text-white text-sm font-bold px-3 py-1 rounded shadow-md">
                        Featured
                      </span>
                    )}
                  </div>
                  {accessory.images.length > 1 && (
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
                  No images available for this accessory.
                </p>
              )}
            </div>
            {accessory?.images && accessory.images.length > 1 && (
              <div className="flex justify-center mt-4 space-x-2">
                {accessory?.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-3 h-3 rounded ${
                      currentImageIndex === index
                        ? "bg-custom-orange"
                        : "bg-gray-400 hover:bg-custom-orange"
                    } focus:outline-none`}
                  ></button>
                ))}
              </div>
            )}
          </div>

          {/* Accessory Information Section */}
          <div className="w-full bg-white p-6 rounded shadow-lg">
            <h3 className="text-3xl font-semibold text-custom-black-200 mb-6">
              Accessory Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-center space-x-4">
                <FontAwesomeIcon
                  icon={faTag}
                  className="text-custom-orange text-2xl"
                />
                <div>
                  <h4 className="font-bold text-lg text-gray-800">Name</h4>
                  <p className="text-custom-black-200">{accessory?.Name}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <FontAwesomeIcon
                  icon={faInfoCircle}
                  className="text-custom-orange text-2xl"
                />
                <div>
                  <h4 className="font-bold text-lg text-gray-800">
                    Description
                  </h4>
                  <p className="text-custom-black-200 leading-relaxed">
                    {accessory?.Description__c}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <FontAwesomeIcon
                  icon={faDollarSign}
                  className="text-custom-orange text-2xl"
                />
                <div>
                  <h4 className="font-bold text-lg text-gray-800">Price</h4>
                  <p className="text-custom-orange font-semibold">
                    ${Number(accessory?.Price__c)}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <FontAwesomeIcon
                  icon={faBoxOpen}
                  className="text-custom-orange text-2xl"
                />
                <div>
                  <h4 className="font-bold text-lg text-gray-800">Quantity</h4>
                  <p className="text-custom-black-200">
                    {accessory?.Quantity__c}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewAccessory;
