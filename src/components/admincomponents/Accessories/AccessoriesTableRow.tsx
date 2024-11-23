// import TableRow from "../../Table/TableRow";

// const AccessoriesTableRow = ({ accessory ,id}: any) => {
//   const columns = [
//     <span className="font-semibold text-gray-700">{id}</span>,
//     // accessory.image ? (
//     //   <img
//     //     src={accessory.image}
//     //     alt={accessory.name}
//     //     className="w-12 h-12 rounded-full object-cover mx-auto"
//     //   />
//     // ) : (
//     //   <div className="w-12 h-12 mx-auto bg-gray-200 flex items-center justify-center">
//     //     No Image
//     //   </div>
//     // ),
//     <span className="font-semibold text-gray-700">{accessory.Name}</span>,
//      <span className="text-blue-500 font-semibold">${accessory.Price__c}</span>,
//     <span
//       className={`font-semibold text-sm px-3 py-1 rounded-full ${
//         accessory.Quantity__c === "In Stock"
//           ? "bg-green-100 text-green-500"
//           : accessory.stockStatus === "Low Stock"
//           ? "bg-yellow-100 text-yellow-500"
//           : "bg-red-100 text-red-500"
//       }`}
//     >
//       {accessory.Quantity__c}
//     </span>,
//     <span className="text-gray-500">{accessory.country}</span>,
//   ];

//   return <TableRow columns={columns} />;
// };

// export default AccessoriesTableRow;

// AccessoriesTableRow.tsx
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faEdit, faEye } from "@fortawesome/free-solid-svg-icons";
import TableRow from "../../Table/TableRow";
import { useNavigate } from "react-router-dom";
import { SfAccessToken } from "../../../utils/useEnv";
import { useNotification } from "../../../contexts/NotificationContext";
import {
  DeleteObjectsCommand,
  S3Client,
} from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: import.meta.env.VITE_AWS_REGION,
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  },
});

const AccessoriesTableRow = ({ accessory, id }: any) => {
  const nav = useNavigate();
  const { addNotification } = useNotification();

  const deleteImagesFromS3 = async (imageUrls: string[]): Promise<void> => {
    const bucketName = import.meta.env.VITE_AWS_BUCKET_NAME;
    const region = import.meta.env.VITE_AWS_REGION;

    // Extract S3 keys from URLs
    const objectsToDelete = imageUrls.map((url) => {
      const key = url.split(
        `https://${bucketName}.s3.${region}.amazonaws.com/`
      )[1];
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
    const response = await s3.send(command);

    console.log("Deleted images:", response.Deleted);
  };

  const deleteAccessory = async (accessoryId: string) => {
    if (!window.confirm("Are you sure you want to delete this accessory?")) {
      return;
    }

    try {
      // Fetch associated images for the accessory
      const imagesResponse = await fetch(
        `/api/services/data/v52.0/query/?q=SELECT+Id,+Image_URL__c+FROM+Accessory_Image__c+WHERE+Accessory_Id__c='${accessoryId}'`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${SfAccessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!imagesResponse.ok) {
        throw new Error("Failed to fetch accessory images");
      }

      const imageRecords = (await imagesResponse.json()).records;
      const imageUrls = imageRecords.map((record) => record.Image_URL__c);

      // Delete all images from S3
      await deleteImagesFromS3(imageUrls);

      // Prepare the batch delete requests
      const batchRequests = [];

      // Add requests for deleting images from Salesforce
      imageRecords.forEach((image) => {
        batchRequests.push({
          method: "DELETE",
          url: `/services/data/v52.0/sobjects/Accessory_Image__c/${image.Id}`,
        });
      });

      // Add request for deleting the accessory itself
      batchRequests.push({
        method: "DELETE",
        url: `/services/data/v52.0/sobjects/Accessory__c/${accessoryId}`,
      });

      // Send the batch request
      const batchResponse = await fetch(
        `/api/services/data/v52.0/composite/batch`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${SfAccessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            batchRequests,
          }),
        }
      );

      if (!batchResponse.ok) {
        throw new Error("Failed to execute batch deletion");
      }

      const batchResult = await batchResponse.json();

      // Handle individual errors from batch response
      const errors = batchResult.results.filter(
        (result) => result.statusCode >= 400
      );
      if (errors.length > 0) {
        console.error("Batch delete errors:", errors);
        throw new Error("Some items could not be deleted. Check logs for details.");
      }

      addNotification(
        "success",
        "Accessory and related records deleted successfully."
      );
      window.location.reload();
    } catch (error: any) {
      console.error("Error deleting accessory:", error);
      addNotification("error", error.message || "Error deleting accessory.");
    }
  };

  const columns = [
    <span className="font-semibold text-gray-700">{id}</span>,
    <span className="font-semibold text-gray-700">{accessory.Name}</span>,
    <span className="text-blue-500 font-semibold">${accessory.Price__c}</span>,
    <span className="text-gray-500">{accessory.Quantity__c}</span>,
  ];

  const actions = [
    {
      icon: <FontAwesomeIcon icon={faEye} />,
      title: "View Accessory",
      onClick: () => nav(`/admin/accessories/view/${accessory.Id}`),
      className: "hover:text-blue-500",
    },
    {
      icon: <FontAwesomeIcon icon={faEdit} />,
      title: "Edit Accessory",
      onClick: () => nav(`/admin/accessories/edit/${accessory.Id}`),
      className: "hover:text-blue-500",
    },
    {
      icon: <FontAwesomeIcon icon={faTrashAlt} />,
      title: "Delete Accessory",
      onClick: () => deleteAccessory(accessory.Id),
      className: "hover:text-red-500",
    },
  ];

  return <TableRow columns={columns} actions={actions} />;
};

export default AccessoriesTableRow;
