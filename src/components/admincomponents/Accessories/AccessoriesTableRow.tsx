// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faTrashAlt, faEdit, faEye } from "@fortawesome/free-solid-svg-icons";
// import TableRow from "../../Table/TableRow";
// import { useNavigate } from "react-router-dom";
// import { SfAccessToken } from "../../../utils/useEnv";
// import { useNotification } from "../../../contexts/NotificationContext";
// import { DeleteObjectsCommand, S3Client } from "@aws-sdk/client-s3";
// import Loader from "../../utils/Loader";
// import { useState } from "react";
// import { ErrorWithMessage } from "../../../types/componentsTypes";
// import { Accessory } from "./AccessoriesSchema";

// const s3 = new S3Client({
//   region: import.meta.env.VITE_AWS_REGION,
//   credentials: {
//     accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
//     secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
//   },
// });
// export interface AccessoryImage {
//   Is_Featured__c: boolean;
// } 
// export interface Image {
//   Image_URL__c: string;
// }
// interface Props {
//   accessory: Accessory;
//   id: number;
// }
// const AccessoriesTableRow = ({ accessory, id }: Props) => {
//   const nav = useNavigate();
//   const { addNotification } = useNotification();
//   const [isResSaving, setIsResSaving] = useState(false);
//   const [currentStatus, setCurrentStatus] = useState("");

//   const { images } = accessory;
//   console.log(images)
//   const featuredImageUrl =
//     images?.filter((data) => data.is_featured == true) || [];
// console.log(featuredImageUrl)
//   const deleteImagesFromS3 = async (imageUrls: string[]): Promise<void> => {
//     const bucketName = import.meta.env.VITE_AWS_BUCKET_NAME;
//     const region = import.meta.env.VITE_AWS_REGION;
//     setCurrentStatus("Deleting Images...");
//     // Extract S3 keys from URLs
//     const objectsToDelete = imageUrls.map((url) => {
//       const key = url.split(
//         `https://${bucketName}.s3.${region}.amazonaws.com/`
//       )[1];
//       if (!key) throw new Error(`Invalid image URL: ${url}`);
//       return { Key: key };
//     });

//     // Construct delete request
//     const deleteParams = {
//       Bucket: bucketName,
//       Delete: {
//         Objects: objectsToDelete,
//       },
//     };

//     // Send the delete request
//     const command = new DeleteObjectsCommand(deleteParams);
//     const response = await s3.send(command);

//     console.log("Deleted images:", response.Deleted);
//   };

//   const deleteAccessory = async (accessoryId: string) => {
//     if (!window.confirm("Are you sure you want to delete this accessory?")) {
//       return;
//     }
//     setIsResSaving(true);
//     setCurrentStatus("Deleting Product...");
//     try {
//       // Fetch associated images for the accessory
//       const imagesResponse = await fetch(
//         `/api/services/data/v52.0/query/?q=SELECT+Id,+Image_URL__c+FROM+Accessory_Image__c+WHERE+Accessory_Id__c='${accessoryId}'`,
//         {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${SfAccessToken}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (!imagesResponse.ok) {
//         throw new Error("Failed to fetch accessory images");
//       }

//       const imageRecords = (await imagesResponse.json()).records;
//       const imageUrls = imageRecords.map(
//         (record: Record<string, unknown>) => record.Image_URL__c
//       );

//       // Delete all images from S3
//       await deleteImagesFromS3(imageUrls);

//       // Prepare the batch delete requests
//       const batchRequests = [];

//       // Add requests for deleting images from Salesforce
//       imageRecords.forEach((image: { Id: string }) => {
//         batchRequests.push({
//           method: "DELETE",
//           url: `/services/data/v52.0/sobjects/Accessory_Image__c/${image.Id}`,
//         });
//       });

//       // Add request for deleting the accessory itself
//       batchRequests.push({
//         method: "DELETE",
//         url: `/services/data/v52.0/sobjects/Accessory__c/${accessoryId}`,
//       });

//       // Send the batch request
//       const batchResponse = await fetch(
//         `/api/services/data/v52.0/composite/batch`,
//         {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${SfAccessToken}`,
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             batchRequests,
//           }),
//         }
//       );

//       if (!batchResponse.ok) {
//         throw new Error("Failed to execute batch deletion");
//       }

//       const batchResult = await batchResponse.json();

//       // Handle individual errors from batch response
//       const errors = batchResult.results.filter(
//         (result: { statusCode: number }) => result.statusCode >= 400
//       );
//       if (errors.length > 0) {
//         console.error("Batch delete errors:", errors);
//         throw new Error(
//           "Some items could not be deleted. Check logs for details."
//         );
//       }

//       addNotification(
//         "success",
//         "Accessory and related records deleted successfully."
//       );
//       setIsResSaving(false);
//       window.location.reload();
//     } catch (error) {
//       console.error("Error deleting accessory:", error);
//       addNotification(
//         "error",
//         ((error as ErrorWithMessage).message as string) ||
//           "Error deleting accessory."
//       );
//     }
//   };

//   const columns = [
//     id,
//     `${accessory?.id?.slice(-10)}`,
//     <span className=" flex justify-start items-center gap-4">
//       <img
//         key={id}
//         className="shadow-sm w-[40px] h-[40px] object-cover rounded border border-gray-300"
//         src={featuredImageUrl[0]?.image_url}
//         alt="Img"
//       />{" "}
//       {accessory.name}
//     </span>,
//     `$${accessory.price}`,
//     accessory.stock_quantity,
//   ];

//   const actions = [
//     {
//       icon: <FontAwesomeIcon icon={faEye} />,
//       title: "View Accessory",
//       onClick: () => nav(`/admin/accessories/view/${accessory.id}`),
//       className: "text-sky-500 hover:text-blue-700",
//     },
//     {
//       icon: <FontAwesomeIcon icon={faEdit} />,
//       title: "Edit Accessory",
//       onClick: () => nav(`/admin/accessories/edit/${accessory.id}`),
//       className: "text-green-500 hover:text-green-700",
//     },
//     {
//       icon: <FontAwesomeIcon icon={faTrashAlt} />,
//       title: "Delete Accessory",
//       onClick: () => deleteAccessory(accessory.id),
//       className: "text-red-500 hover:text-red-700",
//     },
//   ];

//   return (
//     <>
//       {isResSaving && <Loader message={currentStatus} />}
//       <TableRow columns={columns} actions={actions} />
//     </>
//   );
// };

// export default AccessoriesTableRow;



// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faTrashAlt, faEdit, faEye } from "@fortawesome/free-solid-svg-icons";
// import TableRow from "../../Table/TableRow";
// import { useNavigate } from "react-router-dom";
// import { useNotification } from "../../../contexts/NotificationContext";
// import { DeleteObjectsCommand, S3Client } from "@aws-sdk/client-s3";
// import { useState } from "react";
// import Loader from "../../utils/Loader";
// import { Accessory } from "./AccessoriesSchema"; 
// import { useAdminContext } from "../../../hooks/useAdminContext";
// import { apiClient } from "../../../utils/axios";

// const s3 = new S3Client({
//   region: import.meta.env.VITE_AWS_REGION,
//   credentials: {
//     accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
//     secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
//   },
// });

// export interface AccessoryImage {
//   id: string;
//   image_url: string;
//   is_featured: boolean;
// }

// interface Props {
//   accessory: Accessory;
//   no: number;
// }

// const AccessoriesTableRow = ({ accessory, no }: Props) => {
//   const navigate = useNavigate();
//   const { addNotification } = useNotification();
//   const [isResSaving, setIsResSaving] = useState(false);
//   const [currentStatus, setCurrentStatus] = useState("");
//   const { setLoading, setAccessories } = useAdminContext();

//   /**
//    * Function to delete images from S3
//    * @param imageUrls Array of image URLs to delete
//    */
//   const deleteImagesFromS3 = async (imageUrls: string[]): Promise<void> => {
//     const bucketName = import.meta.env.VITE_AWS_BUCKET_NAME;
//     const region = import.meta.env.VITE_AWS_REGION;
//     setCurrentStatus("Deleting Images from S3...");
    
//     // Extract S3 keys from URLs
//     const objectsToDelete = imageUrls.map((url) => {
//       const key = url.split(`https://${bucketName}.s3.${region}.amazonaws.com/`)[1];
//       if (!key) throw new Error(`Invalid image URL: ${url}`);
//       return { Key: key };
//     });

//     // Construct delete request
//     const deleteParams = {
//       Bucket: bucketName,
//       Delete: {
//         Objects: objectsToDelete,
//       },
//     };

//     // Send the delete request
//     const command = new DeleteObjectsCommand(deleteParams);
//     await s3.send(command);
//     console.log("Deleted images from S3:", objectsToDelete);
//   };

//   /**
//    * Function to delete an accessory along with its associated images from S3 and the backend
//    * @param accessoryId The ID of the accessory to delete
//    */
//   const deleteAccessory = async (accessoryId: string) => {
//     // Confirmation prompt
//     if (!window.confirm("Are you sure you want to delete this accessory?")) {
//       return;
//     }

//     setIsResSaving(true);
//     setCurrentStatus("Deleting Accessory...");

//     try {
//       // Step 1: Extract image URLs from the accessory data
//       const imageUrls = accessory.images?.map((img: AccessoryImage) => img.image_url) || [];

//       // Step 2: Delete images from S3
//       if (imageUrls.length > 0) {
//         setCurrentStatus("Deleting Images from S3...");
//         await deleteImagesFromS3(imageUrls);
//       }


      
//       for (const img of accessory.images) {
//         await apiClient.delete(`/accessory/accessory-images/${img.id}`);
//       }

//       // Step 4: Delete the accessory itself
//       setCurrentStatus("Deleting Accessory from Database...");
//       await apiClient.delete(`/accessory/${accessoryId}`);

//       // Step 5: Refresh the accessory list
//       setLoading((prev) => ({ ...prev, accessories: true }));
//       const updatedAccessoriesResponse = await apiClient.get(`/accessory`);
//       setAccessories(updatedAccessoriesResponse.data.data);
//       setLoading((prev) => ({ ...prev, accessories: false }));

//       // Step 6: Notify the user
//       addNotification("success", "Accessory deleted successfully.");
//     } catch (error) {
//       console.error("Error deleting accessory:", error);

//       // Extract error message if available
//       let errorMessage = "Error deleting accessory.";
//       if (axios.isAxiosError(error) && error.response) {
//         errorMessage = error.response.data.message || errorMessage;
//       } else if (error instanceof Error) {
//         errorMessage = error.message;
//       }

//       addNotification("error", errorMessage);
//     } finally {
//       setIsResSaving(false);
//       setCurrentStatus("");
//     }
//   };

//   const { id, name, price, stock_quantity, images } = accessory;

//   // Find the featured image
//   const featuredImageUrl = images?.find((img) => img.is_featured)?.image_url;

//   const columns = [
//     no,
//     ` ${id?.slice(-10)}`, 
//     <span className="flex justify-start items-center gap-4" key={`name-${id}`}>
//       {featuredImageUrl && (
//         <img
//           className="shadow-sm w-[40px] h-[40px] object-cover rounded border border-gray-300"
//           src={featuredImageUrl}
//           alt={`${name} Image`}
//         />
//       )}
//       {name}
//     </span>,
//     `$${Number(price)?.toFixed(2)}`,
//     stock_quantity,

//   ];

//   const actions = [
//     {
//       icon: <FontAwesomeIcon icon={faEye} />,
//       title: "View Accessory",
//       onClick: () => navigate(`/admin/accessories/view/${id}`),
//       className: "text-sky-500 hover:text-blue-700",
//     },
//     {
//       icon: <FontAwesomeIcon icon={faEdit} />,
//       title: "Edit Accessory",
//       onClick: () => navigate(`/admin/accessories/edit/${id}`),
//       className: "text-green-500 hover:text-green-700",
//     },
//     {
//       icon: <FontAwesomeIcon icon={faTrashAlt} />,
//       title: "Delete Accessory",
//       onClick: () => deleteAccessory(id),
//       className: "text-red-500 hover:text-red-700",
//     },
//   ];

//   return (
//     <>
//       {isResSaving && <Loader message={currentStatus} />}
//       <TableRow columns={columns} actions={actions} />
//     </>
//   );
// };

// export default AccessoriesTableRow;


import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faEdit, faEye } from "@fortawesome/free-solid-svg-icons";
import TableRow from "../../Table/TableRow";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../../../contexts/NotificationContext";
import { DeleteObjectsCommand, S3Client } from "@aws-sdk/client-s3";
import { useState } from "react";
import Loader from "../../utils/Loader";
import { Accessory } from "./AccessoriesSchema"; 
import { useAdminContext } from "../../../hooks/useAdminContext";
import { apiClient } from "../../../utils/axios";

interface Props {
  accessory: Accessory;
  no: number;
}

const s3 = new S3Client({
  region: import.meta.env.VITE_AWS_REGION,
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  },
});

export interface AccessoryImage {
  id: string;
  image_url: string;
  is_featured: boolean;
}

const AccessoriesTableRow = ({ accessory, no }: Props) => {
  const navigate = useNavigate();
  const { addNotification } = useNotification();
  const [isResSaving, setIsResSaving] = useState(false);
  const [currentStatus, setCurrentStatus] = useState("");
  const { setLoading, setAccessories } = useAdminContext();

  /**
   * Function to delete images from S3
   * @param imageUrls Array of image URLs to delete
   */
  const deleteImagesFromS3 = async (imageUrls: string[]): Promise<void> => {
    const bucketName = import.meta.env.VITE_AWS_BUCKET_NAME;
    const region = import.meta.env.VITE_AWS_REGION;
    setCurrentStatus("Deleting Images from S3...");

    try {
      // Extract S3 keys from URLs
      const objectsToDelete = imageUrls.map((url) => {
        const key = url.split(`https://${bucketName}.s3.${region}.amazonaws.com/`)[1];
        if (!key) throw new Error(`Invalid image URL: ${url}`);
        return { Key: key };
      });

      // Construct delete request
      const deleteParams = {
        Bucket: bucketName,
        Delete: {
          Objects: objectsToDelete,
        },
      };

      // Send the delete request
      const command = new DeleteObjectsCommand(deleteParams);
      await s3.send(command);
      console.log("Deleted images from S3:", objectsToDelete);
    } catch (error) {
      console.error("Error deleting images from S3:", error);
      throw new Error("Failed to delete images from S3.");
    }
  };

  /**
   * Function to delete an accessory along with its associated images from S3 and the backend
   * @param accessoryId The ID of the accessory to delete
   */
  const deleteAccessory = async (accessoryId: string) => {
    // Confirmation prompt
    if (!window.confirm("Are you sure you want to delete this accessory?")) {
      return;
    }

    setIsResSaving(true);
    setCurrentStatus("Deleting Accessory...");

    try {
      // Step 1: Extract image URLs from the accessory data
      const imageUrls = accessory.images?.map((img: AccessoryImage) => img.image_url) || [];

      // Step 2: Delete images from S3
      if (imageUrls.length > 0) {
        await deleteImagesFromS3(imageUrls);
      }

      // Step 3: Delete the accessory itself via the custom API
      setCurrentStatus("Deleting Accessory from Database...");
      await apiClient.delete(`/accessory/${accessoryId}`);

      // Step 4: Refresh the accessory list
      setLoading((prev) => ({ ...prev, accessories: true }));
      const updatedAccessoriesResponse = await apiClient.get(`/accessory`);
      setAccessories(updatedAccessoriesResponse.data.data);
      setLoading((prev) => ({ ...prev, accessories: false }));

      // Step 5: Notify the user
      addNotification("success", "Accessory deleted successfully.");
    } catch (error) {
      console.error("Error deleting accessory:", error);

      // Extract error message if available
      let errorMessage = "Error deleting accessory.";
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      addNotification("error", errorMessage);
    } finally {
      setIsResSaving(false);
      setCurrentStatus("");
    }
  };

  const { id, name, price, stock_quantity, images } = accessory;

  // Find the featured image
  const featuredImageUrl = images?.find((img) => img.is_featured)?.image_url;

  const columns = [
    no,
    ` ${id?.slice(0,13)}`, 
    <span className="flex justify-start items-center gap-4" key={`name-${id}`}>
      {featuredImageUrl && (
        <img
          className="shadow-sm w-[40px] h-[40px] object-cover rounded border border-gray-300"
          src={featuredImageUrl}
          alt={`${name} Image`}
        />
      )}
      {name}
    </span>,
    `$${Number(price)?.toFixed(2)}`,
    stock_quantity,
    // Add other fields as necessary
  ];

  const actions = [
    {
      icon: <FontAwesomeIcon icon={faEye} />,
      title: "View Accessory",
      onClick: () => navigate(`/admin/accessories/view/${id}`),
      className: "text-sky-500 hover:text-blue-700",
    },
    {
      icon: <FontAwesomeIcon icon={faEdit} />,
      title: "Edit Accessory",
      onClick: () => navigate(`/admin/accessories/edit/${id}`),
      className: "text-green-500 hover:text-green-700",
    },
    {
      icon: <FontAwesomeIcon icon={faTrashAlt} />,
      title: "Delete Accessory",
      onClick: () => deleteAccessory(id),
      className: "text-red-500 hover:text-red-700",
    },
  ];

  return (
    <>
      {isResSaving && <Loader message={currentStatus} />}
      <TableRow columns={columns} actions={actions} />
    </>
  );
};

export default AccessoriesTableRow;
