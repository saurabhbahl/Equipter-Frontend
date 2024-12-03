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
import {
  AccessoriesSchema,
  AccessoryImage,
  IAccessoriesInput,
} from "./AccessoriesSchema";
import { useNotification } from "../../../contexts/NotificationContext";
import LoaderSpinner from "../../utils/LoaderSpinner";
import Loader from "../../utils/Loader";
import AccessoriesService from "./AccessoriesService";
import { useAdminContext } from "../../../hooks/useAdminContext";

// Initialize S3 client
const s3 = new S3Client({
  region: import.meta.env.VITE_AWS_REGION,
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  },
});

// Type definitions
export type ExistingImage = AccessoryImage & { markedForDeletion?: boolean };

export interface PreviewImage {
  url: string;
  index: number;
  type: "new" | "existing";
}

// Type guard to check if image is an ExistingImage
function isExistingImage(
  image: ExistingImage | File | null
): image is ExistingImage {
  return !!image && "Id" in image;
}

const EditAccessory = () => {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();
  const { addNotification } = useNotification();
  const { setAccessories, setLoading: globalLoading } = useAdminContext();

  const [formValues, setFormValues] = useState<IAccessoriesInput>({
    Name: "",
    Accessory_URL__c: "",
    Meta_Title__c: "",
    Description__c: "",
    Price__c: "",
    Quantity__c: "",
  });

  const [errors, setErrors] = useState<IAccessoriesInput>({
    Name: "",
    Description__c: "",
    Accessory_URL__c: "",
    Meta_Title__c: "",
    Price__c: "",
    Quantity__c: "",
  });

  const [isResSaving, setIsResSaving] = useState(false);
  const [currentStatus, setCurrentStatus] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<ExistingImage[]>([]);
  const [featuredImage, setFeaturedImage] = useState<
    ExistingImage | File | null
  >(null);
  const [previewImage, setPreviewImage] = useState<PreviewImage | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [loading, setLoading] = useState(true);
  const formRef = useRef<HTMLFormElement | null>(null);
  const imagesRef = useRef<HTMLDivElement | null>(null);
  const [formHeight, setFormHeight] = useState<number>(0);

  useEffect(() => {
    if (formRef.current && imagesRef.current) {
      const formHeight = formRef.current.offsetHeight;
      imagesRef.current.style.maxHeight = `${formHeight}px`;
      setFormHeight(formHeight);
    }
  }, [images, existingImages, imagesRef]);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      addNotification("error", "No accessory ID provided");
      nav("/admin/accessories");
      return;
    }

    const fetchAccessoryDetails = async () => {
      try {
        const accessory = await AccessoriesService.fetchSingleAccessoryWithImages(
          id
        );

        // Set form values
        setFormValues({
          Name: accessory.Name,
          Description__c: accessory.Description__c,
          Price__c: accessory.Price__c.toString(),
          Quantity__c: accessory.Quantity__c.toString(),
          Accessory_URL__c: accessory.Accessory_URL__c,
          Meta_Title__c: accessory.Meta_Title__c,
        });

        // Set existing images
        const images = accessory.Accesory_Images__r?.records || [];
        setExistingImages(
          images.map((img) => ({
            ...img,
            markedForDeletion: false,
          }))
        );

        // Set the featured image
        const featuredImg = images.find((img) => img.Is_Featured__c);
        setFeaturedImage(featuredImg || null);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching accessory details:", error);
        setLoading(false);
      }
    };
    fetchAccessoryDetails();
  }, [id, addNotification, nav]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormValues((prevValues) => {
      const updatedValues = { ...prevValues, [name]: value };

      if (name === "Meta_Title__c") {
        updatedValues.Accessory_URL__c = value
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-");
      }

      return updatedValues;
    });

    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors, [name]: "" };

      if (name === "Meta_Title__c") {
        updatedErrors.Meta_Title__c = "";
        updatedErrors.Accessory_URL__c = "";
      }

      return updatedErrors;
    });
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
    if (isExistingImage(featuredImage) && featuredImage.Id === imageId) {
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
      Name: formValues.Name,
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

    const validation = AccessoriesSchema.safeParse(accessoriesData);

    const totalImages =
      images.length +
      existingImages.filter((img) => !img.markedForDeletion).length;

    if (totalImages === 0) {
      setImageUploadError(true);
      return;
    }

    if (!validation.success) {
      const newErrors: IAccessoriesInput = {
        Name: "",
        Description__c: "",
        Price__c: "",
        Accessory_URL__c: "",
        Meta_Title__c: "",
        Quantity__c: "",
      };
      validation.error.issues.forEach((issue) => {
        const fieldName = issue.path[0] as keyof IAccessoriesInput;
        newErrors[fieldName] = issue.message;
      });
      setErrors(newErrors);
      return;
    }

    const slug: string = formValues.Accessory_URL__c;
    const isUnique = await AccessoriesService.isSlugUnique(slug, id);

    if (!isUnique) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        Accessory_URL__c:
          "This URL is already in use. Please modify the Meta Title.",
      }));
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
        Meta_Title__c: formValues.Meta_Title__c,
        Accessory_URL__c: formValues.Accessory_URL__c,
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
          updateImageInSalesforce(
            img.Id,
            isExistingImage(featuredImage) && featuredImage.Id === img.Id
          )
        );
      await Promise.all(resetFeaturedPromises);

      // Upload new images and save to Salesforce
      setCurrentStatus("Uploading new images...");
      const orderedImages = images;
      for (const image of orderedImages) {
        const imageUrl = await uploadImageToS3(image);
        await saveImageToSalesforce(
          id!,
          imageUrl,
          !isExistingImage(featuredImage) && featuredImage === image
        );
      }

      globalLoading((prev) => ({ ...prev, accessories: true }));
      const newAccessories = await AccessoriesService.fetchAccessoriesWithImages();
      setAccessories(newAccessories);
      globalLoading((prev) => ({ ...prev, accessories: false }));
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
    <div className="bg-gray-100 min-h-screen">
      <HeadingBar buttonLink="/admin/accessories" heading="Edit Accessory" />
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <LoaderSpinner />
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row w-[90%] gap-6 mx-auto my-10">
          {isResSaving && <Loader message={currentStatus} />}
          {/* Details section */}
          <form
            ref={formRef}
            onSubmit={handleSave}
            className="flex-1 bg-white p-6 shadow-md rounded-sm "
          >
            <h2 className="text-2xl font-semibold mb-4">General Information</h2>
            <hr className="mb-6" />
            {/* Input Fields */}
            <div className="grid my-1 grid-cols-1 gap-4">
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
                <label
                  htmlFor="description"
                  className="font-medium text-custom-gray "
                >
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
                error={errors.Price__c as string}
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
                error={errors.Quantity__c as string}
                label="Quantity"
              />
              {/* Additional info */}
              <h2 className="text-2xl font-semibold my-4 mb-2">
                Additional Information
              </h2>
              <hr className="mb-3" />
              {/* Meta Title */}
              <div className="grid grid-cols-1 gap-4">
                <InputField
                  id="metatitle"
                  type="text"
                  label="Meta Title"
                  placeholder="Meta Title"
                  name="Meta_Title__c"
                  value={formValues.Meta_Title__c}
                  onChange={handleInputChange}
                  error={errors.Meta_Title__c}
                />
                <InputField
                  id="producturl"
                  type="text"
                  readonly={true}
                  label="Accessory URL"
                  placeholder="Generated URL"
                  name="Accessory_URL__c"
                  value={formValues.Accessory_URL__c.toLocaleLowerCase()}
                  onChange={handleInputChange}
                  error={errors.Accessory_URL__c}
                  classes="text-gray-400 border-gray-200 bg-[#f9f9f9] text-[#666] border-[#ccc] cursor-not-allowed"
                />
              </div>
              <div className="flex justify-end space-x-4 ">
                <button
                  className="px-6 py-2 border border-gray-300 text-gray-600 rounded-md hover:bg-gray-100"
                  onClick={() => nav("/admin/accessories")}
                  type="button"
                >
                  Cancel
                </button>
                <button
                  className={`px-6 py-2 btn-yellow text-white rounded ${
                    isResSaving ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  type="submit"
                >
                  {isResSaving ? <LoaderSpinner /> : "Save"}
                </button>
              </div>
            </div>
          </form>

          {/* Image Section */}
          <div
            ref={imagesRef}
            className={`bg-white p-6 shadow-md flex-1 rounded space-y-4 h-fit overflow-auto `}
            style={{
              maxHeight: formHeight ? `${formHeight}px` : "auto",
            }}
          >
            <h2 className="text-2xl font-semibold mb-2">Upload Images</h2>
            <hr className="mb-6" />

            {/* Featured Image */}
            {featuredImage && (
              <>
                <h3 className="font-semibold text-lg mb-2">Featured Image:</h3>
                <div
                  className="relative w-full h-[358px] mb-6"
                  onClick={() => setShowPreview(true)}
                >
                  <img
                    src={
                      isExistingImage(featuredImage)
                        ? featuredImage.Image_URL__c
                        : URL.createObjectURL(featuredImage)
                    }
                    className="w-full h-full object-cover rounded shadow-md"
                    alt="Featured"
                  />
                </div>
              </>
            )}

            {/* Upload Input */}
            <label
              className={`relative block w-full border-2 border-dashed border-gray-300 p-3 text-center rounded-md cursor-pointer hover:border-blue-400 ${
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
              <p className="text-[11px] text-red-500">
                Minimum one accessory image is required.
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
                        {featuredImage &&
                          isExistingImage(featuredImage) &&
                          featuredImage.Id === image.Id && (
                            <span className="absolute bottom-2 left-2 bg-custom-orange text-white text-xs px-2 py-1 rounded">
                              <FontAwesomeIcon icon={faStar} />
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
                      {featuredImage &&
                        !isExistingImage(featuredImage) &&
                        featuredImage === image && (
                          <span className="absolute bottom-2 left-2 bg-custom-orange text-white text-xs px-2 py-1 rounded">
                            <FontAwesomeIcon icon={faStar} />
                          </span>
                        )}
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Full-screen preview */}
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
                    <div className="max-w-[90%] min-h-[90%] object-cover mx-auto max-h-[90%] h-[90%]">
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
                        className="btn-yellow text-white px-4 py-2 rounded"
                        onClick={() =>
                          setAsFeaturedImage(
                            previewImage.index,
                            previewImage.type
                          )
                        }
                      >
                        <FontAwesomeIcon icon={faStar} /> Make Featured Image
                      </button>
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
