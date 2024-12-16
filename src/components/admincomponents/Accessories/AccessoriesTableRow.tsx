import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faEdit, faEye } from "@fortawesome/free-solid-svg-icons";
import TableRow from "../../Table/TableRow";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../../../contexts/NotificationContext";
import { DeleteObjectsCommand, S3Client } from "@aws-sdk/client-s3";
import { useState } from "react";
import Loader from "../../utils/Loader";
import { IAccessory, IAccessoryImage } from "./AccessoriesSchema"; 
import { useAdminContext } from "../../../hooks/useAdminContext";
import { apiClient } from "../../../utils/axios";
import axios from "axios";


interface Props {
  accessory: IAccessory;
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


      let errorMessage = "Error deleting product.";
      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response.data.message || errorMessage;
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
  const featuredImageUrl = images?.find((img:IAccessoryImage) => img.is_featured)?.image_url;

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
      className: "hidden text-sky-500 hover:text-blue-700",
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
