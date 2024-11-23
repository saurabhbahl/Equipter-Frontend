// import { useEffect, useState } from "react";
// import HeadingBar from "../rootComponents/HeadingBar";
// import { SfAccessToken } from "../../../utils/useEnv";
// import { useParams } from "react-router-dom";
// import LoaderSpinner from "../../utils/LoaderSpinner";

// const ViewAccessory = () => {
//   const [accessory, setAccessory] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const { id } = useParams();
//   const [isAnimating, setIsAnimating] = useState(false);

//   // Fetched accessory details along with images using the provided query
//   const fetchAccessoryData = async (accessoryId) => {
//     const accessoryUrl = `/api/services/data/v52.0/query/?q=SELECT+Id%2C+Name%2C+Description__c%2C+Price__c%2C+Quantity__c%2C+%28SELECT+Id%2C+Name%2C+Image_URL__c%2C+Is_Featured__c%2C+Accessory_Id__c+FROM+Accesory_Images__r%29+FROM+Accessory__c+WHERE+Id+%3D+%27${accessoryId}%27`;

//     try {
//       const response = await fetch(accessoryUrl, {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${SfAccessToken}`,
//           "Content-Type": "application/json",
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`Error fetching accessory: ${response.statusText}`);
//       }

//       const data = await response.json();
//       const accessoryData = data.records[0];

//       // Extract images from the subquery
//       const images = accessoryData.Accesory_Images__r?.records || [];

//       // Construct the accessory object
//       const accessory = {
//         Id: accessoryData.Id,
//         Name: accessoryData.Name,
//         Description__c: accessoryData.Description__c,
//         Price__c: accessoryData.Price__c,
//         Quantity__c: accessoryData.Quantity__c,
//         images: images,
//       };

//       return accessory;
//     } catch (error) {
//       console.error("Error fetching accessory data:", error);
//       throw error;
//     }
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const accessoryId = id;
//         const result = await fetchAccessoryData(accessoryId);
//         setAccessory(result);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching accessory details:", error);
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [id]);

//   const handlePrevImage = () => {
//     setIsAnimating(true);
//     setTimeout(() => {
//       setCurrentImageIndex((prevIndex) =>
//         prevIndex === 0 ? accessory.images.length - 1 : prevIndex - 1
//       );
//       setIsAnimating(false);
//     }, 500);
//   };

//   const handleNextImage = () => {
//     setIsAnimating(true);
//     setTimeout(() => {
//       setCurrentImageIndex((prevIndex) =>
//         prevIndex === accessory.images.length - 1 ? 0 : prevIndex + 1
//       );
//       setIsAnimating(false);
//     }, 500);
//   };

//   if (loading) {
//     return (
//       <div className="w-full h-full flex justify-center my-20">
//         <LoaderSpinner />
//       </div>
//     );
//   }

//   return (
//     <>
//       <HeadingBar buttonLink="/admin/accessories" heading="Accessory Details" />
//       <div className="p-6">
//         <div className="space-y-8">
//           {/* Accessory Images Section */}
//           <div className="bg-white p-2 rounded-xl shadow-lg">
//             <h3 className="text-2xl font-semibold text-gray-800 mb-3">
//               Accessory Images
//             </h3>
//             <div className="relative w-full h-full overflow-hidden">
//               {accessory.images && accessory.images.length > 0 ? (
//                 <>
//                   <div
//                     className={`w-full h-full transition-opacity duration-500 ${
//                       isAnimating ? "opacity-0" : "opacity-100"
//                     }`}
//                     key={currentImageIndex}
//                   >
//                     <img
//                       src={accessory.images[currentImageIndex].Image_URL__c}
//                       alt={`Accessory image ${currentImageIndex + 1}`}
//                       className="rounded-lg w-full h-[800px] object-cover shadow-md"
//                     />
//                     {accessory.images[currentImageIndex].Is_Featured__c && (
//                       <span className="absolute top-4 left-4 bg-orange-500 text-white text-sm font-bold px-3 py-1 rounded-full">
//                         Featured
//                       </span>
//                     )}
//                   </div>
//                   {/* Navigation Buttons */}
//                   <button
//                     onClick={handlePrevImage}
//                     className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white bg-opacity-75 hover:bg-opacity-100 text-gray-700 rounded-full p-2 shadow-md focus:outline-none"
//                   >
//                     {/* Left Arrow Icon */}
//                     <svg
//                       className="w-6 h-6"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M15 19l-7-7 7-7"
//                       />
//                     </svg>
//                   </button>
//                   <button
//                     onClick={handleNextImage}
//                     className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white bg-opacity-75 hover:bg-opacity-100 text-gray-700 rounded-full p-2 shadow-md focus:outline-none"
//                   >
//                     {/* Right Arrow Icon */}
//                     <svg
//                       className="w-6 h-6"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M9 5l7 7-7 7"
//                       />
//                     </svg>
//                   </button>
//                 </>
//               ) : (
//                 <p className="text-gray-500">
//                   No images available for this accessory.
//                 </p>
//               )}
//             </div>
//             {/* Thumbnail Indicators */}
//             {accessory.images && accessory.images.length > 1 && (
//               <div className="flex justify-center mt-4 space-x-2">
//                 {accessory.images.map((_, index) => (
//                   <button
//                     key={index}
//                     onClick={() => setCurrentImageIndex(index)}
//                     className={`w-3 h-3 rounded-full ${
//                       currentImageIndex === index
//                         ? "bg-gray-800"
//                         : "bg-gray-400 hover:bg-gray-600"
//                     } focus:outline-none`}
//                   ></button>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Accessory Information Section */}
//           <div className="w-full bg-white p-6 rounded-xl shadow-lg">
//             <h3 className="text-2xl font-semibold text-gray-800 mb-6">
//               General Information
//             </h3>
//             <div className="space-y-6 text-gray-700">
//               <div>
//                 <h4 className="font-medium text-gray-600">Accessory Name</h4>
//                 <p className="text-xl font-semibold capitalize">
//                   {accessory.Name}
//                 </p>
//               </div>
//               <div>
//                 <h4 className="font-medium text-gray-600">Description</h4>
//                 <p className="text-lg leading-relaxed">
//                   {accessory.Description__c}
//                 </p>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
//                 <div className="flex items-center">
//                   <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-4">
//                     {/* Price Icon */}
//                     <svg
//                       className="w-6 h-6"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M12 8c1.657 0 3-1.567 3-3.5S13.657 1 12 1 9 2.567 9 4.5s1.343 3.5 3 3.5zM5.4 9.8c.078-1.205 1.076-2.137 2.3-2.3a6 6 0 0111.6 0c1.224.163 2.222 1.095 2.3 2.3a6 6 0 010 4.4c-.078 1.205-1.076 2.137-2.3 2.3a6 6 0 01-11.6 0c-1.224-.163-2.222-1.095-2.3-2.3a6 6 0 010-4.4z"
//                       />
//                     </svg>
//                   </div>
//                   <div>
//                     <h4 className="font-medium text-gray-600">Price</h4>
//                     <p className="text-lg font-semibold">
//                       ${accessory.Price__c.toFixed(2)}
//                     </p>
//                   </div>
//                 </div>
//                 <div className="flex items-center">
//                   <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-4">
//                     {/* Quantity Icon */}
//                     <svg
//                       className="w-6 h-6"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M5 12h14M12 5v14"
//                       />
//                     </svg>
//                   </div>
//                   <div>
//                     <h4 className="font-medium text-gray-600">Quantity</h4>
//                     <p className="text-lg font-semibold">
//                       {accessory.Quantity__c}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
     
//         </div>
//       </div>
//     </>
//   );
// };

// export default ViewAccessory;

import { useEffect, useState } from "react";
import HeadingBar from "../rootComponents/HeadingBar";
import { SfAccessToken } from "../../../utils/useEnv";
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

const ViewAccessory = () => {
  const [accessory, setAccessory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const { id } = useParams();

  // Fetch accessory data with related images
  const fetchAccessoryData = async (accessoryId) => {
    const accessoryUrl = `/api/services/data/v52.0/query/?q=SELECT+Id%2C+Name%2C+Description__c%2C+Price__c%2C+Quantity__c%2C+%28SELECT+Id%2C+Name%2C+Image_URL__c%2C+Is_Featured__c%2C+Accessory_Id__c+FROM+Accesory_Images__r%29+FROM+Accessory__c+WHERE+Id+%3D+%27${accessoryId}%27`;

    try {
      const response = await fetch(accessoryUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${SfAccessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching accessory: ${response.statusText}`);
      }

      const data = await response.json();
      const accessoryData = data.records[0];

      // Extract images from the subquery
      const images = accessoryData.Accesory_Images__r?.records || [];

      // Construct the accessory object
      return {
        Id: accessoryData.Id,
        Name: accessoryData.Name,
        Description__c: accessoryData.Description__c,
        Price__c: accessoryData.Price__c,
        Quantity__c: accessoryData.Quantity__c,
        images: images,
      };
    } catch (error) {
      console.error("Error fetching accessory data:", error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchAccessoryData(id);
        setAccessory(result);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching accessory details:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handlePrevImage = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === 0 ? accessory.images.length - 1 : prevIndex - 1
      );
      setIsAnimating(false);
    }, 500);
  };

  const handleNextImage = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === accessory.images.length - 1 ? 0 : prevIndex + 1
      );
      setIsAnimating(false);
    }, 500);
  };

  if (loading) {
    return (
      <div className="w-full h-full flex justify-center items-center my-20">
        <LoaderSpinner />
      </div>
    );
  }

  return (
    <>
      <HeadingBar buttonLink="/admin/accessories" heading="Accessory Details" />
      <div className="p-6 lg:p-12 bg-custom-sky capitalize min-h-screen">
        <div className="space-y-8">
          {/* Accessory Images Section */}
          <div className="bg-white p-4 rounded-xl shadow-lg">
            <h3 className="text-3xl font-semibold text-custom-black-200 mb-4">
              Accessory Images
            </h3>
            <div className="relative w-full overflow-hidden rounded-lg border border-gray-200 shadow-md">
              {accessory.images && accessory.images.length > 0 ? (
                <>
                  <div
                    className={`w-full h-full transition-opacity duration-500 ${
                      isAnimating ? "opacity-0" : "opacity-100"
                    }`}
                    key={currentImageIndex}
                  >
                    <img
                      src={accessory.images[currentImageIndex].Image_URL__c}
                      alt={`Accessory image ${currentImageIndex + 1}`}
                      className="rounded-md w-full h-[650px] object-cover"
                    />
                    {accessory.images[currentImageIndex].Is_Featured__c && (
                      <span className="absolute top-4 left-4 bg-custom-orange text-white text-sm font-bold px-3 py-1 rounded-full shadow-md">
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
            {accessory.images && accessory.images.length > 1 && (
              <div className="flex justify-center mt-4 space-x-2">
                {accessory.images.map((_, index) => (
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

          {/* Accessory Information Section */}
          <div className="w-full bg-white p-6 rounded-xl shadow-lg">
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
                  <p className="text-custom-black-200">{accessory.Name}</p>
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
                    {accessory.Description__c}
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
                    ${accessory.Price__c.toFixed(2)}
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
                  <p className="text-custom-black-200">{accessory.Quantity__c}</p>
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
