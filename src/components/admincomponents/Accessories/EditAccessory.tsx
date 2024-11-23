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
import { SfAccessToken } from "../../../utils/useEnv";
import { AccessoriesSchema } from "./AccessoriesSchema";
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
  Name: string;
  Description__c: string;
  Price__c: string;
  Quantity__c: string;
}

const EditAccessory = () => {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();
  const { addNotification } = useNotification();

  const [formValues, setFormValues] = useState<InputValues>({
    Name: "",
    Description__c: "",
    Price__c: "",
    Quantity__c: "",
  });
  const [errors, setErrors] = useState<InputValues>({
    Name: "",
    Description__c: "",
    Price__c: "",
    Quantity__c: "",
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

  useEffect(() => {
    const fetchAccessoryDetails = async () => {
      try {
        // Fetch accessory details including images
        const accessoryResponse = await fetch(
          `/api/services/data/v52.0/query/?q=SELECT+Id,Name,Description__c,Price__c,Quantity__c,(SELECT+Id,Image_URL__c,Is_Featured__c+FROM+Accesory_Images__r)+FROM+Accessory__c+WHERE+Id='${id}'`,
          {
            headers: {
              Authorization: `Bearer ${SfAccessToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!accessoryResponse.ok) {
          throw new Error("Failed to fetch accessory details");
        }
        const accessoryData = await accessoryResponse.json();
        const accessory = accessoryData.records[0];
        // Set form values
        setFormValues({
          Name: accessory.Name,
          Description__c: accessory.Description__c,
          Price__c: accessory.Price__c.toString(),
          Quantity__c: accessory.Quantity__c.toString(),
        });
        // Set existing images
        const images = accessory.Accesory_Images__r?.records || [];
        setExistingImages(images);

        // Set the featured image
        const featuredImg = images.find((img: any) => img.Is_Featured__c);
        setFeaturedImage(featuredImg || null);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching accessory details:", error);
        setLoading(false);
      }
    };
    fetchAccessoryDetails();
  }, [id]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value ?? null });
    setErrors({ ...errors, [name]: "" });
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
        setFeaturedImage(
          updatedImages[0] ||
            existingImages.find((img) => !img.markedForDeletion) ||
            null
        );
      }
      return updatedImages;
    });
    setPreviewImage(null);
  };

  const removeExistingImage = (imageId: string) => {
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
      Key: `images/accessories/${Date.now()}-${image.name}`,
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
    accessoryId: string,
    imageUrl: string,
    isFeatured: boolean
  ) => {
    const imagePayload = {
      Name: formValues.name,
      Accessory_Id__c: accessoryId,
      Is_Featured__c: isFeatured,
      Image_URL__c: imageUrl,
    };
    await fetch("/api/services/data/v52.0/sobjects/Accessory_Image__c", {
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
      `/api/services/data/v52.0/sobjects/Accessory_Image__c/${imageId}`,
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
      `/api/services/data/v52.0/sobjects/Accessory_Image__c/${imageId}`,
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
    const accessoriesData = {
      ...formValues,
      Price__c: parseFloat(formValues.Price__c) || 0,
      Quantity__c: parseFloat(formValues.Quantity__c) || 0,
    };
    console.log(accessoriesData)
    const validation = AccessoriesSchema.safeParse(accessoriesData);
    console.log(validation);
    // if (images.length == 0) {
    //   setImageUploadError(true);
    // }
    const totalImages =
      images.length +
      existingImages.filter((img) => !img.markedForDeletion).length;
    console.log(totalImages);
    if (totalImages === 0) {
      setImageUploadError(true);
      return;
    }

    if (!validation.success) {
      const newErrors: InputValues = {
        Name: "",
        Description__c: "",
        Price__c: "",
        Quantity__c: "",
      };
      validation.error.issues.forEach((issue) => {
        const fieldName = issue.path[0] as keyof InputValues;
        newErrors[fieldName] = issue.message;
      });
      setErrors(newErrors);
      return;
    }
    setIsResSaving(true);
    setCurrentStatus("Updating accessory...");
    try {
      // Update accessory details
      const accessoryData = {
        Name: formValues.Name,
        Description__c: formValues.Description__c,
        Price__c: parseFloat(formValues.Price__c),
        Quantity__c: parseInt(formValues.Quantity__c),
      };
      const response = await fetch(
        `/api/services/data/v52.0/sobjects/Accessory__c/${id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${SfAccessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(accessoryData),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update accessory");
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
      const orderedImages = images;
      for (const [index, image] of orderedImages.entries()) {
        const imageUrl = await uploadImageToS3(image);
        await saveImageToSalesforce(id!, imageUrl, featuredImage === image);
      }
      addNotification("success", "Accessory updated successfully");
      nav("/admin/accessories");
    } catch (error) {
      console.error("Error updating accessory:", error);
      addNotification("error", "Failed to update accessory");
    } finally {
      setIsResSaving(false);
    }
  };

  return (
    <div className="bg-[#F6F8FF] min-h-screen">
      <HeadingBar buttonLink="/admin/accessories" heading="Edit Accessory" />
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <LoaderSpinner />
        </div>
      ) : (
        <div className="flex w-[90%] gap-6 mx-auto my-10">
          {isResSaving && <Loader message={currentStatus} />}
          {/* Details section */}
          <div className="flex-1 bg-white p-5 shadow-md rounded-sm h-fit">
            <p className="font-roboto text-lg font-bold">General Information</p>
            <hr className="my-3 border-1 border-gray-400" />
            <form onSubmit={handleSave} className="grid my-1 grid-cols-1 gap-2">
              <InputField
                id="name"
                type="text"
                placeholder="Name"
                name="Name"
                value={formValues.Name}
                onChange={handleInputChange}
                classes="!w-full"
                label="Name"
                error={errors.Name}
              />
              <div className="mb-3">
                <label htmlFor="desc" className="font-medium text-custom-gray ">
                  Description
                </label>
                <textarea
                  value={formValues.Description__c}
                  name="Description__c"
                  onChange={handleInputChange}
                  className={`mt-1 font-arial block w-full text-xs p-2 border border-inset h-[111px] border-custom-gray-200 outline-none py-2 px-3 ${
                    errors.Description__c
                      ? "border-red-500"
                      : "border-custom-gray-200"
                  } `}
                  placeholder="Description"
                />
                <span className="text-red-500 h-6 text-[10px] font-bold">
                  {errors.Description__c}
                </span>
              </div>
              <InputField
                id="price"
                type="number"
                placeholder="Price"
                name="Price__c"
                value={formValues.Price__c}
                onChange={handleInputChange}
                error={errors.Price__c}
                classes="!w-full "
                label="Price"
              />
              <InputField
                id="quantity"
                type="number"
                placeholder="Quantity"
                name="Quantity__c"
                value={formValues.Quantity__c}
                onChange={handleInputChange}
                classes="!w-full"
                error={errors.Quantity__c}
                label="Quantity"
              />
              <div className="flex justify-end space-x-4 ">
                <button
                  className="px-6 py-2 border border-gray-400 text-gray-500 shadow-xl hover:bg-gray-100"
                  onClick={() => nav("/admin/accessories")}
                  type="button"
                >
                  Cancel
                </button>
                <button
                  className={`btn-yellow  ${
                    isResSaving ? "bg-custom-orange/40" : ""
                  }`}
                  type="submit"
                >
                  {isResSaving ? <LoaderSpinner /> : "Save"}
                </button>
              </div>
            </form>
          </div>

          {/* Image section */}
          <div
            className={`bg-white p-5 shadow-md flex-1 rounded-sm space-y-3 ${
              images.length + existingImages.length >= 3
                ? "h-[704px] overflow-y-scroll scrollbar-custom"
                : ""
            }`}
          >
            <p className="font-roboto text-lg font-bold">Upload Images</p>
            <hr className="my-3 border-1 border-gray-400" />
            {/* Featured Image */}
            {featuredImage && (
              <>
                <p className="font-roboto text-md font-medium">
                  Featured Image:
                </p>
                <div className="relative w-full h-[258px]">
                  <img
                    src={
                      featuredImage instanceof File
                        ? URL.createObjectURL(featuredImage)
                        : featuredImage.Image_URL__c
                    }
                    className="w-full h-full object-cover rounded-md"
                    alt="Featured"
                  />
                </div>
              </>
            )}
            {/* upload input */}
            <label
              className={`relative block w-full border border-dashed border-gray-400 p-2 rounded-md cursor-pointer ${
                isUploading ? "animate-pulse duration-500" : ""
              } ${imageUploadError ? "border-red-500 border-1" : ""}`}
            >
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
              <p className={`text-center text-gray-500 `}>
                {isUploading ? "Uploading images..." : "Click to upload images"}
              </p>
            </label>
            {imageUploadError && (
              <p className="text-[11px] font-semibold text-red-500">
                Minimum one accessory image is required
              </p>
            )}
            {/* Existing Images */}
            {existingImages.filter((img) => !img.markedForDeletion).length >
              0 && (
              <p className="font-roboto text-md font-medium mb-[30px]">
                Existing Images:
              </p>
            )}
            <div className="flex justify-start flex-wrap gap-5 mt-5">
              {existingImages
                .filter((img) => !img.markedForDeletion)
                .map((image, index) => (
                  <div
                    key={index}
                    className="relative w-[150px] h-[150px] border border-gray-300 rounded-md overflow-hidden cursor-pointer"
                  >
                    <img
                      src={image.Image_URL__c}
                      alt="Accessory"
                      className="w-full h-full object-cover"
                      onClick={() =>
                        openImagePreview(image.Image_URL__c, index, "existing")
                      }
                    />
                    <button
                      className="absolute top-2 right-2 bg-red-60 text-red-600 text-md hover:scale-125 duration-100 ease-linear rounded-full px1"
                      title="Delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeExistingImage(image.Id);
                      }}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                    <button
                      className="absolute top-2 right-8 bg-red-60 text-green-600 text-md hover:scale-125 duration-100 ease-linear rounded-full px1"
                      title="Preview"
                      onClick={(e) => {
                        e.stopPropagation();
                        openImagePreview(image.Image_URL__c, index, "existing");
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

            {/* New Images */}
            {images.length > 0 && (
              <p className="font-roboto text-md font-medium mt-10">
                New Images:
              </p>
            )}
            <div className="flex justify-start flex-wrap gap-5 mt-5">
              {images.map((image, index) => (
                <div
                  key={index}
                  className="relative w-[150px] h-[150px] border border-gray-300 rounded-md overflow-hidden cursor-pointer"
                >
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Accessory"
                    className="w-full h-full object-cover"
                    onClick={() =>
                      openImagePreview(URL.createObjectURL(image), index, "new")
                    }
                  />
                  <button
                    className="absolute top-2 right-2 bg-red-60 text-red-600 text-md hover:scale-125 duration-100 ease-linear rounded-full px1"
                    title="Delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(index);
                    }}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                  <button
                    className="absolute top-2 right-8  bg-red-60 text-green-600 text-md hover:scale-125 duration-100 ease-linear rounded-full px1"
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

            {/* full screen */}
            {previewImage &&
              ReactDOM.createPortal(
                <div
                  className={`fixed inset-0 h-full p-5 bg-black bg-opacity-40 flex items-center justify-center transition-all duration-500 ${
                    showPreview
                      ? "opacity-100"
                      : "opacity-0 pointer-events-none"
                  }`}
                >
                  <div className="h-[90%]">
                    <div className="max-w-[90%] min-h-[90%] object-cover mx-auto max-h-[90%]  h-[90%]">
                      <img
                        src={previewImage.url}
                        alt="Preview"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex justify-center gap-5 mt-4">
                      <button
                        className="bg-red-600 text-white px-4 py-2 rounded-md"
                        onClick={closeImagePreview}
                      >
                        <FontAwesomeIcon icon={faTimes} /> Close
                      </button>
                      <button
                        className="bg-yellow-600 text-white px-4 py-2 rounded-md"
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
                          className="bg-gray-600 text-white px-4 py-2 rounded-md"
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
                          className="bg-gray-600 text-white px-4 py-2 rounded-md"
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

export default EditAccessory;

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
// import { SfAccessToken } from "../../../utils/useEnv";
// import { AccessoriesSchema } from "./AccessoriesSchema";
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
//   name: string;
//   description: string;
//   price: string;
//   quantity: string;
// }

// const EditAccessory = () => {
//   const { id } = useParams<{ id: string }>();
//   const nav = useNavigate();
//   const { addNotification } = useNotification();

//   const [formValues, setFormValues] = useState<InputValues>({
//     name: "",
//     description: "",
//     price: "",
//     quantity: "",
//   });
//   const [errors, setErrors] = useState<InputValues>({
//     name: "",
//     description: "",
//     price: "",
//     quantity: "",
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

//   useEffect(() => {
//     const fetchAccessoryDetails = async () => {
//       try {
//         // Fetch accessory details including images
//         const accessoryResponse = await fetch(
//           `/api/services/data/v52.0/query/?q=SELECT+Id,Name,Description__c,Price__c,Quantity__c,(SELECT+Id,Image_URL__c,Is_Featured__c+FROM+Accesory_Images__r)+FROM+Accessory__c+WHERE+Id='${id}'`,
//           {
//             headers: {
//               Authorization: `Bearer ${SfAccessToken}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );
//         if (!accessoryResponse.ok) {
//           throw new Error("Failed to fetch accessory details");
//         }
//         const accessoryData = await accessoryResponse.json();
//         const accessory = accessoryData.records[0];
//         // Set form values
//         setFormValues({
//           name: accessory.Name,
//           description: accessory.Description__c,
//           price: accessory.Price__c.toString(),
//           quantity: accessory.Quantity__c.toString(),
//         });
//         // Set existing images
//         const images = accessory.Accesory_Images__r?.records || [];
//         setExistingImages(images);

//         // Set the featured image
//         const featuredImg = images.find((img: any) => img.Is_Featured__c);
//         setFeaturedImage(featuredImg || null);

//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching accessory details:", error);
//         setLoading(false);
//       }
//     };
//     fetchAccessoryDetails();
//   }, [id]);

//   const handleInputChange = (
//     e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormValues({ ...formValues, [name]: value ?? null });
//     setErrors({ ...errors, [name]: "" });
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
//         setFeaturedImage(
//           updatedImages[0] ||
//             existingImages.find((img) => !img.markedForDeletion) ||
//             null
//         );
//       }
//       return updatedImages;
//     });
//     setPreviewImage(null);
//   };

//   const removeExistingImage = (imageId: string) => {
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
//       Key: `images/accessories/${Date.now()}-${image.name}`,
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
//     accessoryId: string,
//     imageUrl: string,
//     isFeatured: boolean
//   ) => {
//     const imagePayload = {
//       Name: formValues.name,
//       Accessory_Id__c: accessoryId,
//       Is_Featured__c: isFeatured,
//       Image_URL__c: imageUrl,
//     };
//     await fetch("/api/services/data/v52.0/sobjects/Accessory_Image__c", {
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
//       `/api/services/data/v52.0/sobjects/Accessory_Image__c/${imageId}`,
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
//       `/api/services/data/v52.0/sobjects/Accessory_Image__c/${imageId}`,
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
//     const accessoriesData = {
//       ...formValues,
//       price: Number(formValues.price),
//       quantity: Number(formValues.quantity),
//     };
//     const validation = AccessoriesSchema.safeParse(accessoriesData);
//     if (images.length == 0) {
//       setImageUploadError(true);
//     }
//     if (!validation.success) {
//       const newErrors: InputValues = {
//         name: "",
//         description: "",
//         price: "",
//         quantity: "",
//       };
//       validation.error.issues.forEach((issue) => {
//         const fieldName = issue.path[0] as keyof InputValues;
//         newErrors[fieldName] = issue.message;
//       });
//       setErrors(newErrors);
//       return;
//     }
//     setIsResSaving(true);
//     setCurrentStatus("Updating accessory...");
//     try {
//       // Update accessory details
//       const accessoryData = {
//         Name: formValues.name,
//         Description__c: formValues.description,
//         Price__c: parseFloat(formValues.price),
//         Quantity__c: parseInt(formValues.quantity),
//       };
//       const response = await fetch(
//         `/api/services/data/v52.0/sobjects/Accessory__c/${id}`,
//         {
//           method: "PATCH",
//           headers: {
//             Authorization: `Bearer ${SfAccessToken}`,
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(accessoryData),
//         }
//       );
//       if (!response.ok) {
//         throw new Error("Failed to update accessory");
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
//       const orderedImages = images;
//       for (const [index, image] of orderedImages.entries()) {
//         const imageUrl = await uploadImageToS3(image);
//         await saveImageToSalesforce(id!, imageUrl, featuredImage === image);
//       }
//       addNotification("success", "Accessory updated successfully");
//       nav("/admin/accessories");
//     } catch (error) {
//       console.error("Error updating accessory:", error);
//       addNotification("error", "Failed to update accessory");
//     } finally {
//       setIsResSaving(false);
//     }
//   };

//   return (
//     <div className="bg-[#F6F8FF] min-h-screen">
//       <HeadingBar buttonLink="/admin/accessories" heading="Edit Accessory" />
//       {loading ? (
//         <div className="flex justify-center items-center h-screen">
//           <LoaderSpinner />
//         </div>
//       ) : (
//         <div className="flex w-[90%] gap-6 mx-auto my-10">
//           {isResSaving && <Loader message={currentStatus} />}
//           {/* Details section */}
//           <div className="flex-1 bg-white p-5 shadow-md rounded-sm h-fit">
//             <p className="font-roboto text-lg font-bold">General Information</p>
//             <hr className="my-3 border-1 border-gray-400" />
//             <form onSubmit={handleSave} className="grid my-1 grid-cols-1 gap-2">
//               <InputField
//                 id="name"
//                 type="text"
//                 placeholder="Name"
//                 name="name"
//                 value={formValues.name}
//                 onChange={handleInputChange}
//                 classes="!w-full"
//                 label="Name"
//                 error={errors.name}
//               />
//               <div className="mb-3">
//                 <label htmlFor="desc" className="font-medium text-custom-gray ">
//                   Description
//                 </label>
//                 <textarea
//                   value={formValues.description}
//                   name="description"
//                   onChange={handleInputChange}
//                   className={`mt-1 font-arial block w-full text-xs p-2 border border-inset h-[111px] border-custom-gray-200 outline-none py-2 px-3 ${
//                     errors.description
//                       ? "border-red-500"
//                       : "border-custom-gray-200"
//                   } `}
//                   placeholder="Description"
//                 />
//                 <span className="text-red-500 h-6 text-[10px] font-bold">
//                   {errors.description}
//                 </span>
//               </div>
//               <InputField
//                 id="price"
//                 type="number"
//                 placeholder="Price"
//                 name="price"
//                 value={formValues.price}
//                 onChange={handleInputChange}
//                 error={errors.price}
//                 classes="!w-full "
//                 label="Price"
//               />
//               <InputField
//                 id="quantity"
//                 type="number"
//                 placeholder="Quantity"
//                 name="quantity"
//                 value={formValues.quantity}
//                 onChange={handleInputChange}
//                 classes="!w-full"
//                 error={errors.quantity}
//                 label="Quantity"
//               />
//               <div className="flex justify-end space-x-4 ">
//                 <button
//                   className="px-6 py-2 border border-gray-400 text-gray-500 shadow-xl hover:bg-gray-100"
//                   onClick={() => nav("/admin/accessories")}
//                   type="button"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   className={`btn-yellow  ${
//                     isResSaving ? "bg-custom-orange/40" : ""
//                   }`}
//                   type="submit"
//                 >
//                   {isResSaving ? <LoaderSpinner /> : "Save"}
//                 </button>
//               </div>
//             </form>
//           </div>

//           {/* Image section */}
//           <div
//             className={`bg-white p-5 shadow-md flex-1 rounded-sm space-y-3 ${
//               images.length + existingImages.length >= 3
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
//                 Minimum one accessory image is required
//               </p>
//             )}
//             {/* Existing Images */}
//             {existingImages.filter((img) => !img.markedForDeletion).length >
//               0 && (
//               <p className="font-roboto text-md font-medium mb-[30px]">
//                 Existing Images:
//               </p>
//             )}
//             <div className="flex justify-start flex-wrap gap-5 mt-5">
//               {existingImages
//                 .filter((img) => !img.markedForDeletion)
//                 .map((image, index) => (
//                   <div
//                     key={index}
//                     className="relative w-[150px] h-[150px] border border-gray-300 rounded-md overflow-hidden cursor-pointer"
//                   >
//                     <img
//                       src={image.Image_URL__c}
//                       alt="Accessory"
//                       className="w-full h-full object-cover"
//                       onClick={() =>
//                         openImagePreview(image.Image_URL__c, index, "existing")
//                       }
//                     />
//                     <button
//                       className="absolute top-2 right-2 bg-red-60 text-red-600 text-md hover:scale-125 duration-100 ease-linear rounded-full px1"
//                       title="Delete"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         removeExistingImage(image.Id);
//                       }}
//                     >
//                       <FontAwesomeIcon icon={faTrash} />
//                     </button>
//                     <button
//                       className="absolute top-2 right-8 bg-red-60 text-green-600 text-md hover:scale-125 duration-100 ease-linear rounded-full px1"
//                       title="Preview"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         openImagePreview(image.Image_URL__c, index, "existing");
//                       }}
//                     >
//                       <FontAwesomeIcon icon={faExpand} />
//                     </button>
//                     {featuredImage?.Id === image.Id && (
//                       <span className="absolute bottom-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
//                         Featured
//                       </span>
//                     )}
//                   </div>
//                 ))}
//             </div>

//             {/* New Images */}
//             {images.length > 0 && (
//               <p className="font-roboto text-md font-medium mt-10">
//                 New Images:
//               </p>
//             )}
//             <div className="flex justify-start flex-wrap gap-5 mt-5">
//               {images.map((image, index) => (
//                 <div
//                   key={index}
//                   className="relative w-[150px] h-[150px] border border-gray-300 rounded-md overflow-hidden cursor-pointer"
//                 >
//                   <img
//                     src={URL.createObjectURL(image)}
//                     alt="Accessory"
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

// export default EditAccessory;
