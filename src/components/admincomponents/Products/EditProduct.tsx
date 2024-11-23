// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import ReactDOM from "react-dom";
// import {
//   faExpand,
//   faStar,
//   faTimes,
//   faTrash,
// } from "@fortawesome/free-solid-svg-icons";
// import { useNavigate, useParams } from "react-router-dom";
// import { useState, useEffect, ChangeEvent, useRef } from "react";
// import InputField from "../../utils/InputFeild";

// import {
//   S3Client,
//   PutObjectCommand,
//   DeleteObjectsCommand,
// } from "@aws-sdk/client-s3";
// import HeadingBar from "../rootComponents/HeadingBar";
// import AccessoriesService from "../Accessories/AccessoriesService";
// import { useAdminContext } from "../../../hooks/useAdminContext";
// import { SfAccessToken } from "../../../utils/useEnv";
// import { ProductSchema } from "./ProductSchema";
// import { useNotification } from "../../../contexts/NotificationContext";
// import LoaderSpinner from "../../utils/LoaderSpinner";
// import Loader from "../../utils/Loader";

// const s3 = new S3Client({
//   region: import.meta.env.VITE_AWS_REGION,
//   credentials: {
//     accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
//     secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
//   },
// });

// interface InputValues {
//   productName: string;
//   price: string;
//   gvwr: string;
//   liftCapacity: string;
//   liftHeight: string;
//   container: string;
//   Down_Payment_Cost__c: string;
// }

// const EditProduct = () => {
//   const { id } = useParams<{ id: string }>();
//   const nav = useNavigate();
//   const { addNotification } = useNotification();
//   const { accessories, setAccessories } = useAdminContext();

//   const [formValues, setFormValues] = useState<InputValues>({
//     productName: "",
//     price: "",
//     gvwr: "",
//     liftCapacity: "",
//     liftHeight: "",
//     container: "",
//     Down_Payment_Cost__c: "",
//   });
//   const [errors, setErrors] = useState<InputValues>({
//     productName: "",
//     price: "",
//     gvwr: "",
//     liftCapacity: "",
//     liftHeight: "",
//     container: "",
//     Down_Payment_Cost__c: "",
//   });
//   const [isResSaving, setIsResSaving] = useState(false);
//   const [currentStatus, setCurrentStatus] = useState("");
//   const [images, setImages] = useState<File[]>([]);
//   const [existingImages, setExistingImages] = useState<any[]>([]);
//   const [featuredImage, setFeaturedImage] = useState<File | any | null>(null);
//   const [previewImage, setPreviewImage] = useState<{
//     url: string;
//     index: number;
//     type: "new" | "existing";
//   } | null>(null);
//   const [showPreview, setShowPreview] = useState(false);
//   const [isUploading, setIsUploading] = useState(false);
//   const timeoutRef = useRef<NodeJS.Timeout | null>(null);
//   const [imageUploadError, setImageUploadError] = useState(false);
//   const [loading, setLoading] = useState(true);

//   const [existingAccessoryIds, setExistingAccessoryIds] = useState<string[]>(
//     []
//   );
//   const [selectedAccessoryIds, setSelectedAccessoryIds] = useState<string[]>(
//     []
//   );
//   const [existingAccessoryProducts, setExistingAccessoryProducts] = useState<
//     any[]
//   >([]);

//   useEffect(() => {
//     const fetchProductDetails = async () => {
//       try {
//         // Fetch product details including images
//         const productResponse = await fetch(
//           `/api/services/data/v52.0/query/?q=SELECT+Id,Name,Product_Price__c,Down_Payment_Cost__c,GVWR__c,Lift_Capacity__c,Lift_Height__c,Container__c,(SELECT+Id,Image_URL__c,Is_Featured__c+FROM+Product_Images__r)+FROM+Product__c+WHERE+Id='${id}'`,
//           {
//             headers: {
//               Authorization: `Bearer ${SfAccessToken}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );
//         if (!productResponse.ok) {
//           throw new Error("Failed to fetch product details");
//         }
//         const productData = await productResponse.json();
//         const product = productData.records[0];
//         // Set form values
//         setFormValues({
//           productName: product.Name,
//           price: product.Product_Price__c.toString(),
//           Down_Payment_Cost__c: product.Down_Payment_Cost__c?.toString() || "",
//           gvwr: product.GVWR__c?.toString() || "",
//           liftCapacity: product.Lift_Capacity__c?.toString() || "",
//           liftHeight: product.Lift_Height__c?.toString() || "",
//           container: product.Container__c || "",
//         });
//         // Set existing images
//         const images = product.Product_Images__r?.records || [];
//         setExistingImages(images);

//         // Set the featured image
//         const featuredImg = images.find((img) => img.Is_Featured__c);
//         setFeaturedImage(featuredImg || null);

//         // Fetch accessory products associated with the product
//         const accessoryProductsResponse = await fetch(
//           `/api/services/data/v52.0/query/?q=SELECT+Id,Accessory_Id__c+FROM+Accessory_Product__c+WHERE+Product_Id__c='${id}'`,
//           {
//             headers: {
//               Authorization: `Bearer ${SfAccessToken}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );
//         if (!accessoryProductsResponse.ok) {
//           throw new Error("Failed to fetch accessory products");
//         }
//         const accessoryProductsData = await accessoryProductsResponse.json();
//         const accessoryProducts = accessoryProductsData.records;
//         const existingAccessoryIds = accessoryProducts.map(
//           (ap) => ap.Accessory_Id__c
//         );
//         setExistingAccessoryIds(existingAccessoryIds);
//         setSelectedAccessoryIds(existingAccessoryIds);
//         setExistingAccessoryProducts(accessoryProducts);

//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching product details:", error);
//         setLoading(false);
//       }
//     };
//     const fetchAccessoriesData = async () => {
//       try {
//         const accessoriesData = await AccessoriesService.fetchAccessories();
//         setAccessories(accessoriesData);
//       } catch (error) {
//         console.error("Error fetching accessories:", error);
//       }
//     };
//     fetchProductDetails();
//     if (accessories.length === 0) {
//       fetchAccessoriesData();
//     }
//   }, [id, setAccessories, accessories.length]);

//   const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormValues({ ...formValues, [name]: value });
//     setErrors({ ...errors, [name]: "" });
//   };

//   const handleAccessoryChange = (accessoryId: string) => {
//     setSelectedAccessoryIds((prev) =>
//       prev.includes(accessoryId)
//         ? prev.filter((id) => id !== accessoryId)
//         : [...prev, accessoryId]
//     );
//   };

//   const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
//     setImageUploadError(false);
//     const files = Array.from(e.target.files || []).filter((file) =>
//       file.type.startsWith("image/")
//     );
//     if (files.length > 0) {
//       setIsUploading(true);
//       if (timeoutRef.current) clearTimeout(timeoutRef.current);
//       timeoutRef.current = setTimeout(() => {
//         setImages((prevImages) => {
//           const updatedImages = [...prevImages, ...files];
//           if (!featuredImage && updatedImages.length > 0) {
//             setFeaturedImage(updatedImages[0]);
//           }
//           return updatedImages;
//         });
//         setIsUploading(false);
//       }, 400);
//     }
//   };

//   const setAsFeaturedImage = (index: number, type: "new" | "existing") => {
//     if (type === "new") {
//       if (images[index]) {
//         setFeaturedImage(images[index]);
//       }
//     } else {
//       if (existingImages[index]) {
//         setFeaturedImage(existingImages[index]);
//       }
//     }
//     closeImagePreview();
//   };

//   const removeImage = (index: number) => {
//     setImages((prevImages) => {
//       const updatedImages = prevImages.filter((_, i) => i !== index);
//       if (featuredImage === prevImages[index]) {
//         const nextFeatured =
//           updatedImages[0] ||
//           existingImages.find((img) => !img.markedForDeletion) ||
//           null;
//         setFeaturedImage(nextFeatured);
//       }
//       return updatedImages;
//     });
//     setPreviewImage(null);

//     // Check if there are no images left
//     const totalImages =
//       images.length -
//       1 +
//       existingImages.filter((img) => !img.markedForDeletion).length;
//     if (totalImages === 0) {
//       setImageUploadError(true);
//     }
//   };

//   const removeExistingImage = (imageId: string) => {
//     setPreviewImage(null);
//     setExistingImages((prevImages) =>
//       prevImages.map((img) =>
//         img.Id === imageId ? { ...img, markedForDeletion: true } : img
//       )
//     );
//     if (featuredImage?.Id === imageId) {
//       const nextFeatured =
//         images[0] ||
//         existingImages.find(
//           (img) => img.Id !== imageId && !img.markedForDeletion
//         ) ||
//         null;
//       setFeaturedImage(nextFeatured);
//     }

//     // Check if there are no images left
//     const totalImages =
//       images.length +
//       existingImages.filter((img) => !img.markedForDeletion).length -
//       1;
//     if (totalImages === 0) {
//       setImageUploadError(true);
//     }
//   };

//   const openImagePreview = (
//     image: string,
//     index: number,
//     type: "new" | "existing"
//   ) => {
//     setPreviewImage({ url: image, index, type });
//     setShowPreview(true);
//   };

//   const closeImagePreview = () => {
//     setShowPreview(false);
//     setTimeout(() => setPreviewImage(null), 350);
//   };

//   const uploadImageToS3 = async (image: File): Promise<string> => {
//     const uploadParams = {
//       Bucket: import.meta.env.VITE_AWS_BUCKET_NAME,
//       Key: `images/products/${Date.now()}-${image.name}`,
//       Body: image,
//       ContentType: image.type,
//     };
//     const command = new PutObjectCommand(uploadParams);
//     await s3.send(command);
//     return `https://${import.meta.env.VITE_AWS_BUCKET_NAME}.s3.${
//       import.meta.env.VITE_AWS_REGION
//     }.amazonaws.com/${uploadParams.Key}`;
//   };

//   const saveImageToSalesforce = async (
//     productId: string,
//     imageUrl: string,
//     isFeatured: boolean
//   ) => {
//     const imagePayload = {
//       Name: formValues.productName,
//       Product_Id__c: productId,
//       Is_Featured__c: isFeatured,
//       Image_URL__c: imageUrl,
//     };
//     await fetch("/api/services/data/v52.0/sobjects/Product_Images__c", {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${SfAccessToken}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(imagePayload),
//     });
//   };

//   const updateImageInSalesforce = async (
//     imageId: string,
//     isFeatured: boolean
//   ) => {
//     const imagePayload = {
//       Is_Featured__c: isFeatured,
//     };
//     await fetch(
//       `/api/services/data/v52.0/sobjects/Product_Images__c/${imageId}`,
//       {
//         method: "PATCH",
//         headers: {
//           Authorization: `Bearer ${SfAccessToken}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(imagePayload),
//       }
//     );
//   };

//   const deleteImageFromSalesforce = async (imageId: string) => {
//     await fetch(
//       `/api/services/data/v52.0/sobjects/Product_Images__c/${imageId}`,
//       {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${SfAccessToken}`,
//         },
//       }
//     );
//   };

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

//     // Send the delete request
//     const command = new DeleteObjectsCommand(deleteParams);
//     const response = await s3.send(command);

//     console.log("Deleted images:", response.Deleted);
//   };

//   const handleSave = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const validation = ProductSchema.safeParse(formValues);
// console.log(validation)
//     // if there is at least one image (existing or new)
//     const totalImages =
//       images.length +
//       existingImages.filter((img) => !img.markedForDeletion).length;
//     console.log(totalImages)
//     if (totalImages === 0) {
//       setImageUploadError(true);
//       return;
//     }

//     if (!validation.success) {
//       const newErrors: InputValues = {
//         productName: "",
//         price: "",
//         gvwr: "",
//         liftCapacity: "",
//         liftHeight: "",
//         container: "",
//         Down_Payment_Cost__c: "",
//       };
//       validation.error.issues.forEach((issue) => {
//         const fieldName = issue.path[0] as keyof InputValues;
//         newErrors[fieldName] = issue.message;
//       });
//       setErrors(newErrors);
//       return;
//     }
//     setIsResSaving(true);
//     setCurrentStatus("Updating product...");
//     try {
//       // Update product details
//       const productData = {
//         Name: formValues.productName,
//         Product_Price__c: parseFloat(formValues.price),
//         Down_Payment_Cost__c: parseFloat(formValues.Down_Payment_Cost__c),
//         GVWR__c: parseFloat(formValues.gvwr),
//         Lift_Capacity__c: parseFloat(formValues.liftCapacity),
//         Lift_Height__c: parseFloat(formValues.liftHeight),
//         Container__c: formValues.container,
//       };
//       const response = await fetch(
//         `/api/services/data/v52.0/sobjects/Product__c/${id}`,
//         {
//           method: "PATCH",
//           headers: {
//             Authorization: `Bearer ${SfAccessToken}`,
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(productData),
//         }
//       );
//       if (!response.ok) {
//         throw new Error("Failed to update product");
//       }

//       // Handle accessory updates
//       setCurrentStatus("Updating accessories...");

//       // Accessories to add
//       const accessoriesToAdd = selectedAccessoryIds.filter(
//         (id) => !existingAccessoryIds.includes(id)
//       );
//       // Accessories to delete
//       const accessoriesToDelete = existingAccessoryIds.filter(
//         (id) => !selectedAccessoryIds.includes(id)
//       );

//       // Delete accessory products
//       if (accessoriesToDelete.length > 0) {
//         const accessoriesToDeleteIds = existingAccessoryProducts
//           .filter((ap) => accessoriesToDelete.includes(ap.Accessory_Id__c))
//           .map((ap) => ap.Id);

//         const deleteRequests = accessoriesToDeleteIds.map((aid) => ({
//           method: "DELETE",
//           url: `/services/data/v52.0/sobjects/Accessory_Product__c/${aid}`,
//         }));

//         const batchDeleteResponse = await fetch(
//           `/api/services/data/v52.0/composite/batch`,
//           {
//             method: "POST",
//             headers: {
//               Authorization: `Bearer ${SfAccessToken}`,
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({ batchRequests: deleteRequests }),
//           }
//         );
//         if (!batchDeleteResponse.ok) {
//           const errorText = await batchDeleteResponse.text();
//           throw new Error(`Failed to delete accessories: ${errorText}`);
//         }
//       }

//       // Add accessory products
//       if (accessoriesToAdd.length > 0) {
//         const accessoryRequests = accessoriesToAdd.map((accessoryId) => ({
//           method: "POST",
//           url: "/services/data/v52.0/sobjects/Accessory_Product__c",
//           richInput: {
//             Name: formValues.productName,
//             Accessory_Id__c: accessoryId,
//             Product_Id__c: id,
//           },
//         }));
//         const batchAddResponse = await fetch(
//           `/api/services/data/v52.0/composite/batch`,
//           {
//             method: "POST",
//             headers: {
//               Authorization: `Bearer ${SfAccessToken}`,
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({ batchRequests: accessoryRequests }),
//           }
//         );
//         if (!batchAddResponse.ok) {
//           const errorText = await batchAddResponse.text();
//           throw new Error(`Failed to add accessories: ${errorText}`);
//         }
//       }

//       // Delete images marked for deletion
//       setCurrentStatus("Deleting removed images...");
//       const imagesToDelete = existingImages.filter(
//         (img) => img.markedForDeletion
//       );
//       const imageUrlsToDelete = imagesToDelete.map((img) => img.Image_URL__c);

//       for (const image of imagesToDelete) {
//         await deleteImageFromSalesforce(image.Id);
//       }
//       if (imageUrlsToDelete.length > 0) {
//         await deleteImagesFromS3(imageUrlsToDelete);
//       }

//       // Handle featured images
//       setCurrentStatus("Updating images...");

//       // Reset Is_Featured__c for all existing images
//       const resetFeaturedPromises = existingImages
//         .filter((img) => !img.markedForDeletion)
//         .map((img) =>
//           updateImageInSalesforce(img.Id, img.Id === featuredImage?.Id)
//         );
//       await Promise.all(resetFeaturedPromises);

//       // Upload new images and save to Salesforce
//       setCurrentStatus("Uploading new images...");
//       for (const image of images) {
//         const imageUrl = await uploadImageToS3(image);
//         await saveImageToSalesforce(id!, imageUrl, featuredImage === image);
//       }
//       addNotification("success", "Product updated successfully");
//       nav("/admin/products");
//     } catch (error) {
//       console.error("Error updating product:", error);
//       addNotification("error", "Failed to update product");
//     } finally {
//       setIsResSaving(false);
//     }
//   };

//   return (
//     <div className="bg-[#F6F8FF] min-h-screen">
//       <HeadingBar buttonLink="/admin/products" heading="Edit Product" />
//       {loading ? (
//         <div className="flex justify-center items-center h-screen">
//           <LoaderSpinner />
//         </div>
//       ) : (
//         <div className="flex w-[90%] gap-6 mx-auto my-10">
//           {isResSaving && <Loader message={currentStatus} />}
//           {/*Details section */}
//           <form
//             onSubmit={handleSave}
//             className="flex-1 bg-white p-5 shadow-md rounded-sm"
//           >
//             <p className="font-roboto text-lg font-bold">General Information</p>
//             <hr className="my-3 border-1 border-gray-900" />

//             {/* Product Name and Price,Downpayment cost */}
//             <div className="grid my-1 grid-cols-1 ">
//               <InputField
//                 id="productName"
//                 type="name"
//                 label="Product Name"
//                 placeholder="Enter Product Name"
//                 name="productName"
//                 value={formValues.productName}
//                 onChange={handleInputChange}
//                 error={errors.productName}
//                 classes="!w-full"
//               />
//               <InputField
//                 id="Down_Payment_Cost__c"
//                 type="number"
//                 label="Down Payment Cost"
//                 placeholder="Down Payment Cost"
//                 name="Down_Payment_Cost__c"
//                 value={formValues.Down_Payment_Cost__c}
//                 error={errors.Down_Payment_Cost__c}
//                 onChange={handleInputChange}
//                 classes="!w-full "
//               />{" "}
//               {/* Price */}
//               <InputField
//                 id="price"
//                 label="Price"
//                 type="number"
//                 placeholder="Enter Price"
//                 name="price"
//                 value={formValues.price}
//                 error={errors.price}
//                 onChange={handleInputChange}
//                 classes="!w-full"
//               />
//             </div>

//             {/* GVWR and Lift Capacity*/}
//             <div className="grid grid-cols-2 gap-2">
//               <InputField
//                 id="gvwr"
//                 label="GVWR"
//                 type="number"
//                 placeholder="7,500 Lbs"
//                 name="gvwr"
//                 value={formValues.gvwr}
//                 onChange={handleInputChange}
//                 error={errors.gvwr}
//                 classes="!w-full"
//               />

//               <InputField
//                 label="Lift Capacity"
//                 id="liftCapacity"
//                 type="number"
//                 placeholder="4,000 Lbs"
//                 name="liftCapacity"
//                 error={errors.liftCapacity}
//                 value={formValues.liftCapacity}
//                 onChange={handleInputChange}
//                 classes="!w-full"
//               />
//             </div>
//             {/* Lift height and Container */}
//             <div className="grid grid-cols-2 gap-2">
//               <InputField
//                 id="liftHeight"
//                 label="Lift Height"
//                 type="number"
//                 placeholder="12' 0\"
//                 name="liftHeight"
//                 error={errors.liftHeight}
//                 value={formValues.liftHeight}
//                 onChange={handleInputChange}
//                 classes="!w-full"
//               />

//               <InputField
//                 label="Container"
//                 id="container"
//                 type="text"
//                 placeholder="4.1 Cu Yds"
//                 name="container"
//                 error={errors.container}
//                 value={formValues.container}
//                 onChange={handleInputChange}
//                 classes="!w-full"
//               />
//             </div>

//             {/* Accessories Section */}
//             <hr className="my-3 border-1 border-gray-900" />
//             <p className="font-medium text-xl my-3">Accessories</p>
//             <div className="grid grid-cols-2 gap-2 my-3">
//               {accessories?.map((accessory, index) => (
//                 <label key={index} className="flex items-center space-x-2">
//                   <input
//                     type="checkbox"
//                     className="h-4 w-4"
//                     checked={selectedAccessoryIds.includes(accessory.Id)}
//                     onChange={() => handleAccessoryChange(accessory.Id)}
//                   />
//                   <span className="capitalize">
//                     {accessory?.Name} -{" "}
//                     <span className="text-gray-600 font-bold">
//                       ${accessory?.Price__c}
//                     </span>
//                   </span>
//                 </label>
//               ))}
//             </div>

//             {/* Action Buttons */}
//             <div className="flex justify-end space-x-4 mt-6">
//               <button
//                 className="px-6 py-2 border border-gray-400 text-gray-500 shadow-xl hover:bg-gray-100"
//                 onClick={() => nav("/admin/products")}
//                 type="button"
//               >
//                 Cancel
//               </button>
//               <button
//                 className={`btn-yellow  ${
//                   isResSaving ? "bg-custom-orange/40" : ""
//                 }`}
//                 type="submit"
//               >
//                 {isResSaving ? <LoaderSpinner /> : "Save"}
//               </button>
//             </div>
//           </form>

//           {/* Image section */}
//           <div
//             className={`bg-white p-5 shadow-md flex-1 rounded-sm space-y-3 ${
//               images.length +
//                 existingImages.filter((img) => !img.markedForDeletion).length >=
//               3
//                 ? "h-[704px] overflow-y-scroll scrollbar-custom"
//                 : ""
//             }`}
//           >
//             <p className="font-roboto text-lg font-bold">Upload Images</p>
//             <hr className="my-3 border-1 border-gray-400" />

//             {/* Featured Image */}
//             {featuredImage && (
//               <>
//                 <p className="font-roboto text-md font-medium">
//                   Featured Image:
//                 </p>
//                 <div className="relative w-full h-[258px]">
//                   <img
//                     src={
//                       featuredImage instanceof File
//                         ? URL.createObjectURL(featuredImage)
//                         : featuredImage.Image_URL__c
//                     }
//                     className="w-full h-full object-cover rounded-md"
//                     alt="Featured"
//                   />
//                 </div>
//               </>
//             )}

//             {/* upload input */}
//             <label
//               className={`relative block w-full border border-dashed border-gray-400 p-2 rounded-md cursor-pointer ${
//                 isUploading ? "animate-pulse duration-500" : ""
//               } ${imageUploadError ? "border-red-500 border-1" : ""}`}
//             >
//               <input
//                 type="file"
//                 accept="image/*"
//                 multiple
//                 onChange={handleImageUpload}
//                 className="hidden"
//               />
//               <p className={`text-center text-gray-500 `}>
//                 {isUploading ? "Uploading images..." : "Click to upload images"}
//               </p>
//             </label>
//             {imageUploadError && (
//               <p className="text-[11px] font-semibold text-red-500">
//                 Minimum one product Image is required
//               </p>
//             )}
//             {/* Existing Images */}
//               {existingImages.filter((img) => !img.markedForDeletion).length > 0 &&  <p className="font-roboto text-md font-medium mb-[30px]">
//                   Existing Images:
//                 </p>}
            
//             <div className="flex justify-start flex-wrap gap-5 ">      
//                 {existingImages
//                   .filter((img) => !img.markedForDeletion)
//                   .map((image, index) => (
//                     <div
//                       key={index}
//                       className="relative w-[150px] h-[150px] border border-gray-300 rounded-md overflow-hidden cursor-pointer"
//                     >
//                       <img
//                         src={image.Image_URL__c}
//                         alt="Product"
//                         className="w-full h-full object-cover"
//                         onClick={() =>
//                           openImagePreview(
//                             image.Image_URL__c,
//                             index,
//                             "existing"
//                           )
//                         }
//                       />
//                       <button
//                         className="absolute top-2 right-2 bg-red-60 text-red-600 text-md hover:scale-125 duration-100 ease-linear rounded-full px1"
//                         title="Delete"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           removeExistingImage(image.Id);
//                         }}
//                       >
//                         <FontAwesomeIcon icon={faTrash} />
//                       </button>
//                       <button
//                         className="absolute top-2 right-8 bg-red-60 text-green-600 text-md hover:scale-125 duration-100 ease-linear rounded-full px1"
//                         title="Preview"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           openImagePreview(
//                             image.Image_URL__c,
//                             index,
//                             "existing"
//                           );
//                         }}
//                       >
//                         <FontAwesomeIcon icon={faExpand} />
//                       </button>
//                       {featuredImage?.Id === image.Id && (
//                         <span className="absolute bottom-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
//                           Featured
//                         </span>
//                       )}
//                     </div>
//                   ))}
        
//             </div>
//                 {images.length > 0 &&  <p className="font-roboto text-md font-medium mt-10">
//                   New Images:
//                 </p>}
//             {/* New Images */}
//             <div className="flex justify-start flex-wrap gap-5 ">
//               {images.map((image, index) => (
//                 <div
//                   key={index}
//                   className="relative w-[150px] h-[150px] border border-gray-300 rounded-md overflow-hidden cursor-pointer"
//                 >
//                   <img
//                     src={URL.createObjectURL(image)}
//                     alt="Product"
//                     className="w-full h-full object-cover"
//                     onClick={() =>
//                       openImagePreview(URL.createObjectURL(image), index, "new")
//                     }
//                   />
//                   <button
//                     className="absolute top-2 right-2 bg-red-60 text-red-600 text-md hover:scale-125 duration-100 ease-linear rounded-full px1"
//                     title="Delete"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       removeImage(index);
//                     }}
//                   >
//                     <FontAwesomeIcon icon={faTrash} />
//                   </button>
//                   <button
//                     className="absolute top-2 right-8  bg-red-60 text-green-600 text-md hover:scale-125 duration-100 ease-linear rounded-full px1"
//                     title="Preview"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       openImagePreview(
//                         URL.createObjectURL(image),
//                         index,
//                         "new"
//                       );
//                     }}
//                   >
//                     <FontAwesomeIcon icon={faExpand} />
//                   </button>
//                   {featuredImage === image && (
//                     <span className="absolute bottom-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
//                       Featured
//                     </span>
//                   )}
//                 </div>
//               ))}
//             </div>

//             {/* full screen */}
//             {previewImage &&
//               ReactDOM.createPortal(
//                 <div
//                   className={`fixed inset-0 h-full p-5 bg-black bg-opacity-40 flex items-center justify-center transition-all duration-500 ${
//                     showPreview
//                       ? "opacity-100"
//                       : "opacity-0 pointer-events-none"
//                   }`}
//                 >
//                   <div className="h-[90%]">
//                     <div className="max-w-[90%] min-h-[90%] object-cover mx-auto max-h-[90%]  h-[90%]">
//                       <img
//                         src={previewImage.url}
//                         alt="Preview"
//                         className="w-full h-full object-contain"
//                       />
//                     </div>
//                     <div className="flex justify-center gap-5 mt-4">
//                       <button
//                         className="bg-red-600 text-white px-4 py-2 rounded-md"
//                         onClick={closeImagePreview}
//                       >
//                         <FontAwesomeIcon icon={faTimes} /> Close
//                       </button>
//                       <button
//                         className="bg-yellow-600 text-white px-4 py-2 rounded-md"
//                         onClick={() =>
//                           setAsFeaturedImage(
//                             previewImage.index,
//                             previewImage.type
//                           )
//                         }
//                       >
//                         <FontAwesomeIcon icon={faStar} /> Make Featured Image
//                       </button>
//                       {previewImage.type === "existing" ? (
//                         <button
//                           className="bg-gray-600 text-white px-4 py-2 rounded-md"
//                           onClick={() =>
//                             removeExistingImage(
//                               existingImages[previewImage.index].Id
//                             )
//                           }
//                         >
//                           <FontAwesomeIcon icon={faTrash} /> Delete
//                         </button>
//                       ) : (
//                         <button
//                           className="bg-gray-600 text-white px-4 py-2 rounded-md"
//                           onClick={() => removeImage(previewImage.index)}
//                         >
//                           <FontAwesomeIcon icon={faTrash} /> Delete
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                 </div>,
//                 document.body
//               )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default EditProduct;
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactDOM from "react-dom";
import {
  faExpand,
  faStar,
  faTimes,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, ChangeEvent, useRef } from "react";
import InputField from "../../utils/InputFeild";

import {
  S3Client,
  PutObjectCommand,
  DeleteObjectsCommand,
} from "@aws-sdk/client-s3";
import HeadingBar from "../rootComponents/HeadingBar";
import AccessoriesService from "../Accessories/AccessoriesService";
import { useAdminContext } from "../../../hooks/useAdminContext";
import { SfAccessToken } from "../../../utils/useEnv";
import { ProductSchema } from "./ProductSchema";
import { useNotification } from "../../../contexts/NotificationContext";
import LoaderSpinner from "../../utils/LoaderSpinner";
import Loader from "../../utils/Loader";

const s3 = new S3Client({
  region: import.meta.env.VITE_AWS_REGION,
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  },
});

interface InputValues {
  productName: string;
  price: string;
  gvwr: string;
  liftCapacity: string;
  liftHeight: string;
  container: string;
  Down_Payment_Cost__c: string;
}

const EditProduct = () => {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();
  const { addNotification } = useNotification();
  const { accessories, setAccessories } = useAdminContext();

  const [formValues, setFormValues] = useState<InputValues>({
    productName: "",
    price: "",
    gvwr: "",
    liftCapacity: "",
    liftHeight: "",
    container: "",
    Down_Payment_Cost__c: "",
  });
  const [errors, setErrors] = useState<InputValues>({
    productName: "",
    price: "",
    gvwr: "",
    liftCapacity: "",
    liftHeight: "",
    container: "",
    Down_Payment_Cost__c: "",
  });
  const [isResSaving, setIsResSaving] = useState(false);
  const [currentStatus, setCurrentStatus] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<any[]>([]);
  const [featuredImage, setFeaturedImage] = useState<File | any | null>(null);
  const [previewImage, setPreviewImage] = useState<{
    url: string;
    index: number;
    type: "new" | "existing";
  } | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [loading, setLoading] = useState(true);

  const [existingAccessoryIds, setExistingAccessoryIds] = useState<string[]>(
    []
  );
  const [selectedAccessoryIds, setSelectedAccessoryIds] = useState<string[]>(
    []
  );
  const [existingAccessoryProducts, setExistingAccessoryProducts] = useState<
    any[]
  >([]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        // Fetch product details including images
        const productResponse = await fetch(
          `/api/services/data/v52.0/query/?q=SELECT+Id,Name,Product_Price__c,Down_Payment_Cost__c,GVWR__c,Lift_Capacity__c,Lift_Height__c,Container__c,(SELECT+Id,Image_URL__c,Is_Featured__c+FROM+Product_Images__r)+FROM+Product__c+WHERE+Id='${id}'`,
          {
            headers: {
              Authorization: `Bearer ${SfAccessToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!productResponse.ok) {
          throw new Error("Failed to fetch product details");
        }
        const productData = await productResponse.json();
        const product = productData.records[0];
        // Set form values
        setFormValues({
          productName: product.Name,
          price: product.Product_Price__c.toString(),
          Down_Payment_Cost__c: product.Down_Payment_Cost__c?.toString() || "",
          gvwr: product.GVWR__c?.toString() || "",
          liftCapacity: product.Lift_Capacity__c?.toString() || "",
          liftHeight: product.Lift_Height__c?.toString() || "",
          container: product.Container__c || "",
        });
        // Set existing images
        const images = product.Product_Images__r?.records || [];
        setExistingImages(images);

        // Set the featured image
        const featuredImg = images.find((img) => img.Is_Featured__c);
        setFeaturedImage(featuredImg || null);

        // Fetch accessory products associated with the product
        const accessoryProductsResponse = await fetch(
          `/api/services/data/v52.0/query/?q=SELECT+Id,Accessory_Id__c+FROM+Accessory_Product__c+WHERE+Product_Id__c='${id}'`,
          {
            headers: {
              Authorization: `Bearer ${SfAccessToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!accessoryProductsResponse.ok) {
          throw new Error("Failed to fetch accessory products");
        }
        const accessoryProductsData = await accessoryProductsResponse.json();
        const accessoryProducts = accessoryProductsData.records;
        const existingAccessoryIds = accessoryProducts.map(
          (ap) => ap.Accessory_Id__c
        );
        setExistingAccessoryIds(existingAccessoryIds);
        setSelectedAccessoryIds(existingAccessoryIds);
        setExistingAccessoryProducts(accessoryProducts);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching product details:", error);
        setLoading(false);
      }
    };
    const fetchAccessoriesData = async () => {
      try {
        const accessoriesData = await AccessoriesService.fetchAccessories();
        setAccessories(accessoriesData);
      } catch (error) {
        console.error("Error fetching accessories:", error);
      }
    };
    fetchProductDetails();
    if (accessories.length === 0) {
      fetchAccessoriesData();
    }
  }, [id, setAccessories, accessories.length]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleAccessoryChange = (accessoryId: string) => {
    setSelectedAccessoryIds((prev) =>
      prev.includes(accessoryId)
        ? prev.filter((id) => id !== accessoryId)
        : [...prev, accessoryId]
    );
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    setImageUploadError(false);
    const files = Array.from(e.target.files || []).filter((file) =>
      file.type.startsWith("image/")
    );
    if (files.length > 0) {
      setIsUploading(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setImages((prevImages) => {
          const updatedImages = [...prevImages, ...files];
          if (!featuredImage && updatedImages.length > 0) {
            setFeaturedImage(updatedImages[0]);
          }
          return updatedImages;
        });
        setIsUploading(false);
      }, 400);
    }
  };

  const setAsFeaturedImage = (index: number, type: "new" | "existing") => {
    if (type === "new") {
      if (images[index]) {
        setFeaturedImage(images[index]);
      }
    } else {
      if (existingImages[index]) {
        setFeaturedImage(existingImages[index]);
      }
    }
    closeImagePreview();
  };

  const removeImage = (index: number) => {
    setImages((prevImages) => {
      const updatedImages = prevImages.filter((_, i) => i !== index);
      if (featuredImage === prevImages[index]) {
        const nextFeatured =
          updatedImages[0] ||
          existingImages.find((img) => !img.markedForDeletion) ||
          null;
        setFeaturedImage(nextFeatured);
      }
      return updatedImages;
    });
    setPreviewImage(null);

    // Check if there are no images left
    const totalImages =
      images.length -
      1 +
      existingImages.filter((img) => !img.markedForDeletion).length;
    if (totalImages === 0) {
      setImageUploadError(true);
    }
  };

  const removeExistingImage = (imageId: string) => {
    setPreviewImage(null);
    setExistingImages((prevImages) =>
      prevImages.map((img) =>
        img.Id === imageId ? { ...img, markedForDeletion: true } : img
      )
    );
    if (featuredImage?.Id === imageId) {
      const nextFeatured =
        images[0] ||
        existingImages.find(
          (img) => img.Id !== imageId && !img.markedForDeletion
        ) ||
        null;
      setFeaturedImage(nextFeatured);
    }

    // Check if there are no images left
    const totalImages =
      images.length +
      existingImages.filter((img) => !img.markedForDeletion).length -
      1;
    if (totalImages === 0) {
      setImageUploadError(true);
    }
  };

  const openImagePreview = (
    image: string,
    index: number,
    type: "new" | "existing"
  ) => {
    setPreviewImage({ url: image, index, type });
    setShowPreview(true);
  };

  const closeImagePreview = () => {
    setShowPreview(false);
    setTimeout(() => setPreviewImage(null), 350);
  };

  const uploadImageToS3 = async (image: File): Promise<string> => {
    const uploadParams = {
      Bucket: import.meta.env.VITE_AWS_BUCKET_NAME,
      Key: `images/products/${Date.now()}-${image.name}`,
      Body: image,
      ContentType: image.type,
    };
    const command = new PutObjectCommand(uploadParams);
    await s3.send(command);
    return `https://${import.meta.env.VITE_AWS_BUCKET_NAME}.s3.${
      import.meta.env.VITE_AWS_REGION
    }.amazonaws.com/${uploadParams.Key}`;
  };

  const saveImageToSalesforce = async (
    productId: string,
    imageUrl: string,
    isFeatured: boolean
  ) => {
    const imagePayload = {
      Name: formValues.productName,
      Product_Id__c: productId,
      Is_Featured__c: isFeatured,
      Image_URL__c: imageUrl,
    };
    await fetch("/api/services/data/v52.0/sobjects/Product_Images__c", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SfAccessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(imagePayload),
    });
  };

  const updateImageInSalesforce = async (
    imageId: string,
    isFeatured: boolean
  ) => {
    const imagePayload = {
      Is_Featured__c: isFeatured,
    };
    await fetch(
      `/api/services/data/v52.0/sobjects/Product_Images__c/${imageId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${SfAccessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(imagePayload),
      }
    );
  };

  const deleteImageFromSalesforce = async (imageId: string) => {
    await fetch(
      `/api/services/data/v52.0/sobjects/Product_Images__c/${imageId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${SfAccessToken}`,
        },
      }
    );
  };

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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = ProductSchema.safeParse(formValues);
console.log(validation)
    // if there is at least one image (existing or new)
    const totalImages =
      images.length +
      existingImages.filter((img) => !img.markedForDeletion).length;
    console.log(totalImages)
    if (totalImages === 0) {
      setImageUploadError(true);
      return;
    }

    if (!validation.success) {
      const newErrors: InputValues = {
        productName: "",
        price: "",
        gvwr: "",
        liftCapacity: "",
        liftHeight: "",
        container: "",
        Down_Payment_Cost__c: "",
      };
      validation.error.issues.forEach((issue) => {
        const fieldName = issue.path[0] as keyof InputValues;
        newErrors[fieldName] = issue.message;
      });
      setErrors(newErrors);
      return;
    }
    setIsResSaving(true);
    setCurrentStatus("Updating product...");
    try {
      // Update product details
      const productData = {
        Name: formValues.productName,
        Product_Price__c: parseFloat(formValues.price),
        Down_Payment_Cost__c: parseFloat(formValues.Down_Payment_Cost__c),
        GVWR__c: parseFloat(formValues.gvwr),
        Lift_Capacity__c: parseFloat(formValues.liftCapacity),
        Lift_Height__c: parseFloat(formValues.liftHeight),
        Container__c: formValues.container,
      };
      const response = await fetch(
        `/api/services/data/v52.0/sobjects/Product__c/${id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${SfAccessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productData),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update product");
      }

      // Handle accessory updates
      setCurrentStatus("Updating accessories...");

      // Accessories to add
      const accessoriesToAdd = selectedAccessoryIds.filter(
        (id) => !existingAccessoryIds.includes(id)
      );
      // Accessories to delete
      const accessoriesToDelete = existingAccessoryIds.filter(
        (id) => !selectedAccessoryIds.includes(id)
      );

      // Delete accessory products
      if (accessoriesToDelete.length > 0) {
        const accessoriesToDeleteIds = existingAccessoryProducts
          .filter((ap) => accessoriesToDelete.includes(ap.Accessory_Id__c))
          .map((ap) => ap.Id);

        const deleteRequests = accessoriesToDeleteIds.map((aid) => ({
          method: "DELETE",
          url: `/services/data/v52.0/sobjects/Accessory_Product__c/${aid}`,
        }));

        const batchDeleteResponse = await fetch(
          `/api/services/data/v52.0/composite/batch`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${SfAccessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ batchRequests: deleteRequests }),
          }
        );
        if (!batchDeleteResponse.ok) {
          const errorText = await batchDeleteResponse.text();
          throw new Error(`Failed to delete accessories: ${errorText}`);
        }
      }

      // Add accessory products
      if (accessoriesToAdd.length > 0) {
        const accessoryRequests = accessoriesToAdd.map((accessoryId) => ({
          method: "POST",
          url: "/services/data/v52.0/sobjects/Accessory_Product__c",
          richInput: {
            Name: formValues.productName,
            Accessory_Id__c: accessoryId,
            Product_Id__c: id,
          },
        }));
        const batchAddResponse = await fetch(
          `/api/services/data/v52.0/composite/batch`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${SfAccessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ batchRequests: accessoryRequests }),
          }
        );
        if (!batchAddResponse.ok) {
          const errorText = await batchAddResponse.text();
          throw new Error(`Failed to add accessories: ${errorText}`);
        }
      }

      // Delete images marked for deletion
      setCurrentStatus("Deleting removed images...");
      const imagesToDelete = existingImages.filter(
        (img) => img.markedForDeletion
      );
      const imageUrlsToDelete = imagesToDelete.map((img) => img.Image_URL__c);

      for (const image of imagesToDelete) {
        await deleteImageFromSalesforce(image.Id);
      }
      if (imageUrlsToDelete.length > 0) {
        await deleteImagesFromS3(imageUrlsToDelete);
      }

      // Handle featured images
      setCurrentStatus("Updating images...");

      // Reset Is_Featured__c for all existing images
      const resetFeaturedPromises = existingImages
        .filter((img) => !img.markedForDeletion)
        .map((img) =>
          updateImageInSalesforce(img.Id, img.Id === featuredImage?.Id)
        );
      await Promise.all(resetFeaturedPromises);

      // Upload new images and save to Salesforce
      setCurrentStatus("Uploading new images...");
      for (const image of images) {
        const imageUrl = await uploadImageToS3(image);
        await saveImageToSalesforce(id!, imageUrl, featuredImage === image);
      }
      addNotification("success", "Product updated successfully");
      nav("/admin/products");
    } catch (error) {
      console.error("Error updating product:", error);
      addNotification("error", "Failed to update product");
    } finally {
      setIsResSaving(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <HeadingBar buttonLink="/admin/products" heading="Edit Product" />
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <LoaderSpinner />
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row w-[90%] gap-6 mx-auto my-10">
          {isResSaving && <Loader message={currentStatus} />}
          {/* Details Section */}
          <form
            onSubmit={handleSave}
            className="flex-1 bg-white p-6 shadow-md rounded-md"
          >
            <h2 className="text-2xl font-semibold mb-4">General Information</h2>
            <hr className="mb-6" />

            {/* Product Name and Price, Downpayment cost */}
            <div className="grid grid-cols-1 gap-4">
              <InputField
                id="productName"
                type="text"
                label="Product Name"
                placeholder="Enter Product Name"
                name="productName"
                value={formValues.productName}
                onChange={handleInputChange}
                error={errors.productName}
              />
              <InputField
                id="Down_Payment_Cost__c"
                type="number"
                label="Down Payment Cost"
                placeholder="Down Payment Cost"
                name="Down_Payment_Cost__c"
                value={formValues.Down_Payment_Cost__c}
                error={errors.Down_Payment_Cost__c}
                onChange={handleInputChange}
              />
              <InputField
                id="price"
                label="Price"
                type="number"
                placeholder="Enter Price"
                name="price"
                value={formValues.price}
                error={errors.price}
                onChange={handleInputChange}
              />
            </div>

            {/* GVWR and Lift Capacity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
              <InputField
                id="gvwr"
                label="GVWR"
                type="number"
                placeholder="7,500 Lbs"
                name="gvwr"
                value={formValues.gvwr}
                onChange={handleInputChange}
                error={errors.gvwr}
              />

              <InputField
                label="Lift Capacity"
                id="liftCapacity"
                type="number"
                placeholder="4,000 Lbs"
                name="liftCapacity"
                error={errors.liftCapacity}
                value={formValues.liftCapacity}
                onChange={handleInputChange}
              />
            </div>

            {/* Lift height and Container */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
              <InputField
                id="liftHeight"
                label="Lift Height"
                type="number"
                placeholder="12' 0\"
                name="liftHeight"
                error={errors.liftHeight}
                value={formValues.liftHeight}
                onChange={handleInputChange}
              />

              <InputField
                label="Container"
                id="container"
                type="text"
                placeholder="4.1 Cu Yds"
                name="container"
                error={errors.container}
                value={formValues.container}
                onChange={handleInputChange}
              />
            </div>

            {/* Accessories Section */}
            <hr className="my-6" />
            <h3 className="text-xl font-semibold mb-4">Accessories</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {accessories?.map((accessory, index) => (
                <label
                  key={index}
                  className="flex items-center space-x-2 bg-gray-50 p-3 rounded-md hover:bg-gray-100"
                >
                  <input
                    type="checkbox"
                    className="h-5 w-5 text-blue-600"
                    checked={selectedAccessoryIds.includes(accessory.Id)}
                    onChange={() => handleAccessoryChange(accessory.Id)}
                  />
                  <span className="capitalize text-gray-700">
                    {accessory?.Name} -{" "}
                    <span className="text-gray-600 font-bold">
                      ${accessory?.Price__c}
                    </span>
                  </span>
                </label>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 mt-8">
              <button
                className="px-6 py-2 border border-gray-300 text-gray-600 rounded-md hover:bg-gray-100"
                onClick={() => nav("/admin/products")}
                type="button"
              >
                Cancel
              </button>
              <button
                className={`px-6 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 ${
                  isResSaving ? "opacity-50 cursor-not-allowed" : ""
                }`}
                type="submit"
              >
                {isResSaving ? <LoaderSpinner /> : "Save"}
              </button>
            </div>
          </form>

          {/* Image Section */}
          <div
            className={`bg-white p-6 shadow-md flex-1 rounded-md space-y-6 ${
              images.length +
                existingImages.filter((img) => !img.markedForDeletion).length >=
              3
                ? "h-[704px] overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-300"
                : ""
            }`}
          >
            <h2 className="text-2xl font-semibold mb-4">Upload Images</h2>
            <hr className="mb-6" />

            {/* Featured Image */}
            {featuredImage && (
              <>
                <h3 className="font-semibold text-lg mb-2">Featured Image:</h3>
                <div className="relative w-full h-[258px] mb-6">
                  <img
                    src={
                      featuredImage instanceof File
                        ? URL.createObjectURL(featuredImage)
                        : featuredImage.Image_URL__c
                    }
                    className="w-full h-full object-cover rounded-md shadow-md"
                    alt="Featured"
                  />
                </div>
              </>
            )}

            {/* Upload Input */}
            <label
              className={`relative block w-full border-2 border-dashed border-gray-300 p-6 text-center rounded-md cursor-pointer hover:border-blue-400 ${
                isUploading ? "animate-pulse duration-500" : ""
              } ${imageUploadError ? "border-red-500" : ""}`}
            >
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
              <p className="text-gray-500">
                {isUploading ? "Uploading images..." : "Click to upload images"}
              </p>
            </label>
            {imageUploadError && (
              <p className="text-sm text-red-500">
                Minimum one product image is required.
              </p>
            )}

            {/* Existing Images */}
            {existingImages.filter((img) => !img.markedForDeletion).length >
              0 && (
              <>
                <h3 className="font-semibold text-lg mt-6">Existing Images:</h3>
                <div className="flex flex-wrap gap-4 mt-4">
                  {existingImages
                    .filter((img) => !img.markedForDeletion)
                    .map((image, index) => (
                      <div
                        key={index}
                        className="relative w-[150px] h-[150px] border border-gray-200 rounded-md overflow-hidden cursor-pointer shadow-sm"
                      >
                        <img
                          src={image.Image_URL__c}
                          alt="Product"
                          className="w-full h-full object-cover"
                          onClick={() =>
                            openImagePreview(
                              image.Image_URL__c,
                              index,
                              "existing"
                            )
                          }
                        />
                        <button
                          className="absolute top-2 right-2 bg-white bg-opacity-75 text-red-600 text-md hover:text-red-800 rounded-full p-1"
                          title="Delete"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeExistingImage(image.Id);
                          }}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                        <button
                          className="absolute top-2 right-10 bg-white bg-opacity-75 text-blue-600 text-md hover:text-blue-800 rounded-full p-1"
                          title="Preview"
                          onClick={(e) => {
                            e.stopPropagation();
                            openImagePreview(
                              image.Image_URL__c,
                              index,
                              "existing"
                            );
                          }}
                        >
                          <FontAwesomeIcon icon={faExpand} />
                        </button>
                        {featuredImage?.Id === image.Id && (
                          <span className="absolute bottom-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                            Featured
                          </span>
                        )}
                      </div>
                    ))}
                </div>
              </>
            )}

            {/* New Images */}
            {images.length > 0 && (
              <>
                <h3 className="font-semibold text-lg mt-6">New Images:</h3>
                <div className="flex flex-wrap gap-4 mt-4">
                  {images.map((image, index) => (
                    <div
                      key={index}
                      className="relative w-[150px] h-[150px] border border-gray-200 rounded-md overflow-hidden cursor-pointer shadow-sm"
                    >
                      <img
                        src={URL.createObjectURL(image)}
                        alt="Product"
                        className="w-full h-full object-cover"
                        onClick={() =>
                          openImagePreview(
                            URL.createObjectURL(image),
                            index,
                            "new"
                          )
                        }
                      />
                      <button
                        className="absolute top-2 right-2 bg-white bg-opacity-75 text-red-600 text-md hover:text-red-800 rounded-full p-1"
                        title="Delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage(index);
                        }}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                      <button
                        className="absolute top-2 right-10 bg-white bg-opacity-75 text-blue-600 text-md hover:text-blue-800 rounded-full p-1"
                        title="Preview"
                        onClick={(e) => {
                          e.stopPropagation();
                          openImagePreview(
                            URL.createObjectURL(image),
                            index,
                            "new"
                          );
                        }}
                      >
                        <FontAwesomeIcon icon={faExpand} />
                      </button>
                      {featuredImage === image && (
                        <span className="absolute bottom-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                          Featured
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Fullscreen Preview */}
            {previewImage &&
              ReactDOM.createPortal(
                <div
                  className={`fixed inset-0 h-full p-5 bg-black bg-opacity-50 flex items-center justify-center transition-all duration-500 ${
                    showPreview
                      ? "opacity-100"
                      : "opacity-0 pointer-events-none"
                  }`}
                >
                  <div className="bg-white p-6 rounded-md shadow-lg">
                    <div className="max-w-[90vw] max-h-[80vh]">
                      <img
                        src={previewImage.url}
                        alt="Preview"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex justify-center gap-4 mt-6">
                      <button
                        className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                        onClick={closeImagePreview}
                      >
                        <FontAwesomeIcon icon={faTimes} /> Close
                      </button>
                      <button
                        className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
                        onClick={() =>
                          setAsFeaturedImage(
                            previewImage.index,
                            previewImage.type
                          )
                        }
                      >
                        <FontAwesomeIcon icon={faStar} /> Make Featured Image
                      </button>
                      {previewImage.type === "existing" ? (
                        <button
                          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                          onClick={() =>
                            removeExistingImage(
                              existingImages[previewImage.index].Id
                            )
                          }
                        >
                          <FontAwesomeIcon icon={faTrash} /> Delete
                        </button>
                      ) : (
                        <button
                          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                          onClick={() => removeImage(previewImage.index)}
                        >
                          <FontAwesomeIcon icon={faTrash} /> Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>,
                document.body
              )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProduct;