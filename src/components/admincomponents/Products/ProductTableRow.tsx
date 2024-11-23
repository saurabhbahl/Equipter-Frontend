// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faTrashAlt, faEdit, faEye } from "@fortawesome/free-solid-svg-icons";
// import TableRow from "../../Table/TableRow";
// import { useNavigate } from "react-router-dom";
// import { SfAccessToken } from "../../../utils/useEnv";
// import { useNotification } from "../../../contexts/NotificationContext";
// import {
//   DeleteObjectCommand,
//   DeleteObjectsCommand,
//   S3Client,
// } from "@aws-sdk/client-s3";
// const s3 = new S3Client({
//   region: import.meta.env.VITE_AWS_REGION,
//   credentials: {
//     accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
//     secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
//   },
// });
// const ProductTableRow = ({ product, no }: { product: any; no: number }) => {
//   const nav = useNavigate();
//   const { addNotification } = useNotification();

 
//   const deleteImagesFromS3 = async (imageUrls: string[]): Promise<void> => {
//     const bucketName = import.meta.env.VITE_AWS_BUCKET_NAME;
//     const region = import.meta.env.VITE_AWS_REGION;

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
//     console.log(deleteParams);
//     // Send the delete request
//     const command = new DeleteObjectsCommand(deleteParams);
//     console.log(command)
//     const response = await s3.send(command);

//     console.log("Deleted images:", response.Deleted);
//   };
//   const deleteProduct = async (productId: string) => {
//     if (!window.confirm("Are you sure you want to delete this product?")) {
//       return;
//     }
  
//     try {
//       // Fetch associated images for the product
//       const imagesResponse = await fetch(
//         `/api/services/data/v52.0/query/?q=SELECT+Id,+Image_URL__c+FROM+Product_Images__c+WHERE+Product_Id__c='${productId}'`,
//         {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${SfAccessToken}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       console.log(imagesResponse)
//       if (!imagesResponse.ok) {
//         throw new Error("Failed to fetch product images");
//       }
  
//       const imageRecords = (await imagesResponse.json()).records;
//       const imageUrls = imageRecords.map((record) => record.Image_URL__c);
  
//       // Delete all images from S3
//       await deleteImagesFromS3(imageUrls);
  
//       // Fetch all accessory products related to this product
//       const accessoryResponse = await fetch(
//         `/api/services/data/v52.0/query/?q=SELECT+Id+FROM+Accessory_Product__c+WHERE+Product_Id__c='${productId}'`,
//         {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${SfAccessToken}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       console.log(accessoryResponse)
//       if (!accessoryResponse.ok) {
//         throw new Error("Failed to fetch accessory products");
//       }
  
//       const accessoryRecords = (await accessoryResponse.json()).records;
  
//       // Prepare the batch delete requests
//       const batchRequests = [];
  
//       // Add requests for deleting images from Salesforce
//       imageRecords.forEach((image) => {
//         batchRequests.push({
//           method: "DELETE",
//           url: `/services/data/v52.0/sobjects/Product_Images__c/${image.Id}`,
//         });
//       });
  
//       // Add requests for deleting accessory products from Salesforce
//       accessoryRecords.forEach((accessory) => {
//         batchRequests.push({
//           method: "DELETE",
//           url: `/services/data/v52.0/sobjects/Accessory_Product__c/${accessory.Id}`,
//         });
//       });
  
//       // Add request for deleting the product itself
//       batchRequests.push({
//         method: "DELETE",
//         url: `/services/data/v52.0/sobjects/Product__c/${productId}`,
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
//       console.log(batchResponse)
//       if (!batchResponse.ok) {
//         throw new Error("Failed to execute batch deletion");
//       }
  
//       const batchResult = await batchResponse.json();
  
//       // Handle individual errors from batch response
//       const errors = batchResult.results.filter((result) => result.statusCode >= 400);
//       if (errors.length > 0) {
//         console.error("Batch delete errors:", errors);
//         throw new Error("Some items could not be deleted. Check logs for details.");
//       }
  
//       addNotification("success", "Product and related records deleted successfully.");
//       window.location.reload();
//     } catch (error: any) {
//       console.error("Error deleting product:", error);
//       addNotification("error", error.message || "Error deleting product.");
//     }
//   };
  
  
 
//   const columns = [
//     no + 1,
//     // product.Product_Images__c ? (
//     //   <img
//     //     src="http://example.com/images/super_widget.jpg"
//     //     alt={product.Name}
//     //     className="w-12 h-12 mx-auto object-cover"
//     //   />
//     // ) : (
//     //   <div className="w-12 h-12 mx-auto bg-gray-200 flex items-center justify-center">
//     //     No Image
//     //   </div>
//     // ),
//     product.Name,

//     `$${product.Product_Price__c}`,
//     product.GVWR__c,
//     `$${product.Down_Payment_Cost__c}`
//   ];

//   const actions = [
//     {
//       icon: <FontAwesomeIcon icon={faEye} />,
//       title: "View Product",
//       onClick: () => nav(`/admin/products/view/${product.Id}`),
//       className: "hover:text-blue-500",
//     },
//     {
//       icon: <FontAwesomeIcon icon={faEdit} />,
//       title: "Edit Product",
//       onClick: () => nav(`/admin/products/edit/${product.Id}`),
//       className: "hover:text-blue-500",
//     },
//     {
//       icon: <FontAwesomeIcon icon={faTrashAlt} />,
//       title: "Delete Product",
//       onClick: () => deleteProduct(product.Id),
//       className: "hover:text-red-500",
//     },
//   ];

//   return <TableRow columns={columns} actions={actions} />;
// };

// export default ProductTableRow;


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

const ProductTableRow = ({ product, no }: { product: any; no: number }) => {
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
  };

  const deleteProduct = async (productId: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

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
        throw new Error("Some items could not be deleted. Check logs for details.");
      }

      addNotification(
        "success",
        "Product and related records deleted successfully."
      );
      window.location.reload();
    } catch (error: any) {
      console.error("Error deleting product:", error);
      addNotification("error", error.message || "Error deleting product.");
    }
  };

  const columns = [
    no ,
    product.Id,
    product.Name,
    `$${product.Product_Price__c}`,
    product.GVWR__c,
    `$${product.Down_Payment_Cost__c}`,
  ];

  const actions = [
    {
      icon: <FontAwesomeIcon icon={faEye} />,
      title: "View Product",
      onClick: () => nav(`/admin/products/view/${product.Id}`),
      className: "text-blue-500 hover:text-blue-700",
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

  return <TableRow columns={columns} actions={actions} />;
};

export default ProductTableRow;


// import React from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faEye, faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
// import { useNavigate } from 'react-router-dom';
// import { useNotification } from '../../../contexts/NotificationContext';

// const ProductTableRow = ({ product, no }) => {
//   const navigate = useNavigate();
//   const { addNotification } = useNotification();

//   const handleView = () => {
//     navigate(`/admin/products/view/${product.Id}`);
//   };

//   const handleEdit = () => {
//     navigate(`/admin/products/edit/${product.Id}`);
//   };

//   const handleDelete = async () => {
//     if (!window.confirm("Are you sure you want to delete this product?")) return;

//     try {
//       // API call to delete product
//       addNotification("success", "Product deleted successfully.");
//       // Refresh or update state
//     } catch (error) {
//       console.error("Error deleting product:", error);
//       addNotification("error", "Failed to delete product.");
//     }
//   };

//   return (
//     <tr className="border-b">
//       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{no}</td>
//       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.Name}</td>
//       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.Product_Price__c}</td>
//       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.GVWR__c}</td>
//       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.Down_Payment_Cost__c}</td>
//       <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//         <button onClick={handleView} className="text-indigo-600 hover:text-indigo-900 mr-2">
//           <FontAwesomeIcon icon={faEye} />
//         </button>
//         <button onClick={handleEdit} className="text-green-600 hover:text-green-900 mr-2">
//           <FontAwesomeIcon icon={faEdit} />
//         </button>
//         <button onClick={handleDelete} className="text-red-600 hover:text-red-900">
//           <FontAwesomeIcon icon={faTrashAlt} />
//         </button>
//       </td>
//     </tr>
//   );
// };

// export default ProductTableRow;
