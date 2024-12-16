import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faEdit, faEye } from "@fortawesome/free-solid-svg-icons";
import TableRow from "../../Table/TableRow";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../../../contexts/NotificationContext";
import { DeleteObjectsCommand, S3Client } from "@aws-sdk/client-s3";
import { useState } from "react";
import Loader from "../../utils/Loader";
import { IProduct,  TImage } from "./ProductSchema"; 
import { useAdminContext } from "../../../hooks/useAdminContext";
import { apiClient } from "../../../utils/axios";
import axios from "axios"; 

const s3 = new S3Client({
  region: import.meta.env.VITE_AWS_REGION,
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  },
});

const ProductTableRow = ({ product, no }: { product: IProduct; no: number }) => {
  const navigate = useNavigate();
  const { addNotification } = useNotification();
  const [isResSaving, setIsResSaving] = useState(false);
  const [currentStatus, setCurrentStatus] = useState("");
  const { setLoading, setProducts } = useAdminContext();

  /**
   * Function to delete images from S3
   * @param imageUrls Array of image URLs to delete
   */
  const deleteImagesFromS3 = async (imageUrls: string[]): Promise<void> => {
    const bucketName = import.meta.env.VITE_AWS_BUCKET_NAME;
    const region = import.meta.env.VITE_AWS_REGION;

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
  };

  /**
   * Function to delete a product along with its associated images from S3
   * @param productId The ID of the product to delete
   */
  const deleteProduct = async (productId: string) => {
    // Confirmation prompt
    if (!window.confirm("Are you sure you want to delete this product? Deleting this product will delete all its related data.")) {
      return;
    }

    setIsResSaving(true);
    setCurrentStatus("Deleting Product...");

    try {
      // Step 1: Extract image URLs from the product data
      const imagesData = product.images as Array<{ image_url: string; id: string }>;
      const imageUrls = imagesData.map((record) => record.image_url);

      // Step 2: Delete images from S3
      if (imageUrls.length > 0) {
        setCurrentStatus("Deleting Images from S3...");
        await deleteImagesFromS3(imageUrls);
      }

      // Step 3: Delete the product from the database
      setCurrentStatus("Deleting Product from Database...");
      await apiClient.delete(`/product/${productId}`);

      // Step 4: Refresh the product list
      setLoading((prev) => ({ ...prev, products: true }));
      const newProd = await apiClient.get("/product");
      setProducts(newProd.data.data);
      setLoading((prev) => ({ ...prev, products: false }));

      // Step 5: Notify the user
      addNotification("success", "Product deleted successfully.");
    } catch (error) {
      console.error("Error deleting product:", error);

      // Extract error message if available
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

  const { images, id, name, downpayment_cost, price, gvwr,stock_quantity,product_url } = product;

  // Find the featured image
  const featuredImageUrl = images?.find((img:TImage) => img.is_featured)?.image_url;

  const columns = [
    no,
    ` ${id?.slice(-10)}`, 
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
    gvwr,
    stock_quantity,
    `$${Number(downpayment_cost)?.toFixed(2)}`,
  ];

  const actions = [
    {
      icon: <FontAwesomeIcon icon={faEye} />,
      title: "View Product",
      onClick: () => navigate(`/products/${product_url}`),
      className: "text-sky-500 hover:text-blue-700",
    },
    {
      icon: <FontAwesomeIcon icon={faEdit} />,
      title: "Edit Product",
      onClick: () => navigate(`/admin/products/edit/${id}`),
      className: "text-green-500 hover:text-green-700",
    },
    {
      icon: <FontAwesomeIcon icon={faTrashAlt} />,
      title: "Delete Product",
      onClick: () => deleteProduct(id),
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
