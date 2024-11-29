import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faEdit, faEye } from "@fortawesome/free-solid-svg-icons";
import TableRow from "../../Table/TableRow";
import { useNavigate } from "react-router-dom";
import { SfAccessToken } from "../../../utils/useEnv";
import { useNotification } from "../../../contexts/NotificationContext";
import { DeleteObjectsCommand, S3Client } from "@aws-sdk/client-s3";
import { useState } from "react";
import Loader from "../../utils/Loader";

const s3 = new S3Client({
  region: import.meta.env.VITE_AWS_REGION,
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  },
});

const ProductTableRow = ({ product, no }: { product: any; no: number }) => {
  const nav = useNavigate();
  const { addNotification } = useNotification();
  const [isResSaving, setIsResSaving] = useState(false);
  const [currentStatus, setCurrentStatus] = useState("");

  const deleteImagesFromS3 = async (imageUrls: string[]): Promise<void> => {
    const bucketName = import.meta.env.VITE_AWS_BUCKET_NAME;
    const region = import.meta.env.VITE_AWS_REGION;
    setCurrentStatus("Deleting Images...");
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
  };

  const deleteProduct = async (productId: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }
    setIsResSaving(true);
    setCurrentStatus("Deleting Product...");
    try {
      // Fetch associated images for the product
      const imagesResponse = await fetch(
        `/api/services/data/v52.0/query/?q=SELECT+Id,+Image_URL__c+FROM+Product_Images__c+WHERE+Product_Id__c='${productId}'`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${SfAccessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!imagesResponse.ok) {
        throw new Error("Failed to fetch product images");
      }

      const imageRecords = (await imagesResponse.json()).records;
      const imageUrls = imageRecords.map((record) => record.Image_URL__c);

      // Delete all images from S3
      await deleteImagesFromS3(imageUrls);

      // Fetch all accessory products related to this product
      const accessoryResponse = await fetch(
        `/api/services/data/v52.0/query/?q=SELECT+Id+FROM+Accessory_Product__c+WHERE+Product_Id__c='${productId}'`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${SfAccessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!accessoryResponse.ok) {
        throw new Error("Failed to fetch accessory products");
      }

      const accessoryRecords = (await accessoryResponse.json()).records;

      // Prepare the batch delete requests
      const batchRequests = [];

      // Add requests for deleting images from Salesforce
      imageRecords.forEach((image) => {
        batchRequests.push({
          method: "DELETE",
          url: `/services/data/v52.0/sobjects/Product_Images__c/${image.Id}`,
        });
      });

      // Add requests for deleting accessory products from Salesforce
      accessoryRecords.forEach((accessory) => {
        batchRequests.push({
          method: "DELETE",
          url: `/services/data/v52.0/sobjects/Accessory_Product__c/${accessory.Id}`,
        });
      });

      // Add request for deleting the product itself
      batchRequests.push({
        method: "DELETE",
        url: `/services/data/v52.0/sobjects/Product__c/${productId}`,
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
        throw new Error(
          "Some items could not be deleted. Check logs for details."
        );
      }

      addNotification(
        "success",
        "Product and related records deleted successfully."
      );
      setIsResSaving(false);
      window.location.reload();
    } catch (error) {
      console.error("Error deleting product:", error);
      addNotification("error", error.message || "Error deleting product.");
    }
  };
  const { Product_Images__r } = product;

  const featuredImageUrl = Product_Images__r.records.filter((data) => data.Is_Featured__c == true);
  const columns = [
    no,
    product.Id,
    <span className=" flex justify-start items-center gap-4">
      <img
        className="shadow-sm w-[40px] h-[40px] object-cover rounded border border-gray-300"
        src={featuredImageUrl[0].Image_URL__c}
        alt="Img"
      />{" "}
      {product.Name}
    </span>,
    `$${product.Product_Price__c}`,
    product.GVWR__c,
    `$${product.Down_Payment_Cost__c}`,
  ];

  const actions = [
    {
      icon: <FontAwesomeIcon icon={faEye} />,
      title: "View Product",
      onClick: () => nav(`/admin/products/view/${product.Id}`),
      className: "text-sky-500 hover:text-blue-700",
    },
    {
      icon: <FontAwesomeIcon icon={faEdit} />,
      title: "Edit Product",
      onClick: () => nav(`/admin/products/edit/${product.Id}`),
      className: "text-green-500 hover:text-green-700",
    },
    {
      icon: <FontAwesomeIcon icon={faTrashAlt} />,
      title: "Delete Product",
      onClick: () => deleteProduct(product.Id),
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

export default ProductTableRow;
