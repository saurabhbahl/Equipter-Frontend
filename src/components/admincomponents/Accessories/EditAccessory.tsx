import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactDOM from "react-dom";
import {
  faExpand,
  faStar,
  faTimes,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, ChangeEvent, useRef, FormEvent } from "react";
import InputField from "../../utils/InputFeild";
import {
  AccessoriesSchema,
  IAccessoryImage,
  IAccessoriesInput,
} from "./AccessoriesSchema";
import { useNotification } from "../../../contexts/NotificationContext";
import HeadingBar from "../rootComponents/HeadingBar";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectsCommand,
} from "@aws-sdk/client-s3";
import LoaderSpinner from "../../utils/LoaderSpinner";
import Loader from "../../utils/Loader";
import { apiClient } from "../../../utils/axios";
import { useAdminContext } from "../../../hooks/useAdminContext";

// Initialize S3 client
const s3 = new S3Client({
  region: import.meta.env.VITE_AWS_REGION,
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  },
});

interface ExistingImage extends IAccessoryImage, File {
  markedForDeletion?: boolean;
}

export interface PreviewImage {
  url: string;
  index: number;
  type: "new" | "existing";
}

const EditAccessory = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addNotification } = useNotification();
  const { setAccessories, setLoading: globalLoading } = useAdminContext();

  // State for form inputs
  const [formValues, setFormValues] = useState<IAccessoriesInput>({
    Name: "",
    Accessory_URL__c: "",
    accessory_title: "",
    Meta_Title__c: "",
    Description__c: "",
    Price__c: "",
    Quantity__c: "",
  });

  // State for form errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // State for handling submission
  const [isResSaving, setIsResSaving] = useState(false);
  const [currentStatus, setCurrentStatus] = useState("");

  const [images, setImages] = useState<ExistingImage[]>([]);
  const [existingImages, setExistingImages] = useState<ExistingImage[]>([]);
  const [featuredImage, setFeaturedImage] = useState<any>(null);
  const [previewImage, setPreviewImage] = useState<PreviewImage | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [imageUploadError, setImageUploadError] = useState(false);

  // loading state
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  // Refs for form and images container
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const imagesRef = useRef<HTMLDivElement | null>(null);
  const [formHeight, setFormHeight] = useState<number>(0);

  // Adjust images container height based on form height
  useEffect(() => {
    if (formRef.current && imagesRef.current) {
      const formHeightFn = formRef.current.offsetHeight;
      setFormHeight(formHeightFn);
      imagesRef.current.style.maxHeight = `${formHeightFn}px`;
    }
  }, [images, existingImages]);

  /**
   * Fetch accessory details on component mount
   */
  useEffect(() => {
    if (!id) {
      setLoading(false);
      addNotification("error", "No accessory ID provided");
      navigate("/admin/accessories");
      return;
    }

    const fetchAccessoryDetails = async () => {
      try {
        const response = await apiClient.get(`/accessory/${id}/`);
        const accessory = response.data.data;

        // Set form values
        setFormValues({
          Name: accessory.name || "",
          accessory_title: accessory.accessory_title,
          Description__c: accessory.description || "",
          Price__c: accessory.price || "",
          Quantity__c: accessory.stock_quantity || "",
          Accessory_URL__c: accessory.accessory_url || "",
          Meta_Title__c: accessory.meta_title || "",
        });

        // Set existing images
        const fetchedImages = accessory.images || [];
        setExistingImages(
          fetchedImages.map((img: any) => ({
            id: img.id,
            image_url: img.image_url,
            is_featured: img.is_featured,
            markedForDeletion: false,
          }))
        );

        // Set the featured image
        const featuredImg = fetchedImages.find((img: any) => img.is_featured);
        setFeaturedImage(featuredImg || null);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching accessory details:", error);
        addNotification("error", "Failed to fetch accessory details.");
        setLoading(false);
      }
    };

    fetchAccessoryDetails();
  }, [id]);

  /**
   * Handle input changes for form fields
   */
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
      setErrors((prevErrors) => ({
        ...prevErrors,
        Accessory_URL__c: "",
      }));
      return updatedValues;
    });

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  /**
   * Handle image uploads
   */
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    setImageUploadError(false);
    const files = Array.from(e.target.files || []).filter((file) =>
      file.type.startsWith("image/")
    );

    if (files.length !== (e.target.files || []).length) {
      addNotification("error", "Only image files are allowed.");
      return;
    }

    if (files.length > 0) {
      setIsUploading(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(() => {
        setImages((prevImages) => {
          const updatedImages = [...prevImages, ...files] as any;
          // If no featured image is set, set the first new image as featured
          if (!featuredImage && updatedImages.length > 0) {
            setFeaturedImage(updatedImages[0]);
          }
          return updatedImages;
        });
        setIsUploading(false);
      }, 400);
    }
  };

  /**
   * Set a new featured image
   */

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
  };
  /**
   * Remove a new image from the list
   */
  const removeImage = (index: number) => {
    setImages((prevImages) => {
      const removedImage = prevImages[index];
      const updatedImages = prevImages.filter((_, i) => i !== index) as any;
      if (featuredImage === removedImage) {
        if (updatedImages.length > 0) {
          setFeaturedImage(updatedImages[0]);
        } else {
          const nextExistingImage = existingImages.find(
            (img) => !img.markedForDeletion
          );
          setFeaturedImage(nextExistingImage || (null as any));
        }
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

  /**
   * Remove an existing image by marking it for deletion
   */
  const removeExistingImage = (imageId: string) => {
    setExistingImages((prevImages) =>
      prevImages.map((img) =>
        img.id === imageId ? { ...img, markedForDeletion: true } : img
      )
    );
    if (
      featuredImage &&
      "id" in featuredImage &&
      featuredImage.id === imageId
    ) {
      const nextFeatured =
        images[0] ||
        existingImages.find(
          (img) => img.id !== imageId && !img.markedForDeletion
        ) ||
        null;
      setFeaturedImage(nextFeatured as any);
    }
    setPreviewImage(null);
  };

  /**
   * Open image preview modal
   */
  const openImagePreview = (
    image: string,
    index: number,
    type: "new" | "existing"
  ) => {
    setPreviewImage({ url: image, index, type });
    setShowPreview(true);
  };

  /**
   * Close image preview modal
   */
  const closeImagePreview = () => {
    setShowPreview(false);
    setTimeout(() => setPreviewImage(null), 350);
  };

  /**
   * Upload an image to S3 and return its URL
   */
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

  /**
   * Delete an image from S3
   */
  const deleteImageFromS3 = async (imageUrl: string): Promise<void> => {
    const bucketName = import.meta.env.VITE_AWS_BUCKET_NAME;
    const region = import.meta.env.VITE_AWS_REGION;

    const key = imageUrl.split(
      `https://${bucketName}.s3.${region}.amazonaws.com/`
    )[1];
    if (!key) throw new Error(`Invalid image URL: ${imageUrl}`);

    const deleteParams = {
      Bucket: bucketName,
      Delete: {
        Objects: [{ Key: key }],
      },
    };

    const command = new DeleteObjectsCommand(deleteParams);
    await s3.send(command);
  };

  /**
   * Handle form submission to update an accessory
   */
  const handleSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const accessoriesData = {
      ...formValues,
      Price__c: parseFloat(formValues.Price__c) || 0,
      Quantity__c: parseInt(formValues.Quantity__c) || 0,
    };

    const validation = AccessoriesSchema.safeParse(accessoriesData);

    // Validate form inputs
    if (!validation.success) {
      const newErrors = {
        Name: "",
        Description__c: "",
        Price__c: "",
        Quantity__c: "",
        accessory_title: "",
        Meta_Title__c: "",
        Accessory_URL__c: "",
      };
      validation.error.issues.forEach((issue) => {
        const fieldName = issue.path[0] as keyof IAccessoriesInput;
        newErrors[fieldName] = issue.message;
      });
      setErrors(newErrors);
      if (
        images.length === 0 &&
        existingImages.filter((img) => !img.markedForDeletion).length === 0
      ) {
        setImageUploadError(true);
      }
      return;
    }

    // Check if at least one image is uploaded
    const totalImages =
      images.length +
      existingImages.filter((img) => !img.markedForDeletion).length;
    console.log("Total", totalImages);
    if (totalImages === 0) {
      setImageUploadError(true);
      addNotification("error", "At least one accessory image is required.");
      return;
    }

    const slug: string = formValues.Accessory_URL__c;

    // Validate slug uniqueness via custom REST API
    try {
      const response = await apiClient.get(`/accessory/slug`, {
        params: { slug, id },
      });
      const isUnique = response.data.isUnique;
      if (!isUnique) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          Accessory_URL__c:
            "This URL is already in use. Please modify the Meta Title.",
        }));

        return;
      }
    } catch (err) {
      console.error("Error validating slug uniqueness:", err);
      addNotification("error", "Failed to validate URL uniqueness.");
      return;
    }

    setIsResSaving(true);
    setCurrentStatus("Updating accessory...");

    try {
      // Step 1: Update the accessory via custom REST API
      const accessoryPayload = {
        name: formValues.Name,
        accessory_title: formValues.accessory_title,
        description: formValues.Description__c,
        price: parseFloat(formValues.Price__c),
        stock_quantity: parseInt(formValues.Quantity__c),
        meta_title: formValues.Meta_Title__c,
        accessory_url: formValues.Accessory_URL__c,
      };

      await apiClient.put(`/accessory/${id}`, accessoryPayload);

      // Step 2: Delete images marked for deletion
      if (existingImages.some((img) => img.markedForDeletion)) {
        setCurrentStatus("Deleting removed images...");
        const imagesToDelete = existingImages.filter(
          (img) => img.markedForDeletion
        );

        for (const img of imagesToDelete) {
          await apiClient.delete(`/accessory/accessory-images/${img.id}`);
          await deleteImageFromS3(img?.image_url);
        }

        setExistingImages((prevImages) =>
          prevImages.filter((img) => !img.markedForDeletion)
        );
      }

      // Step 3: Upload new images to S3 and save via custom REST API
      const uploadedImageIds: string[] = [];
      if (images.length > 0) {
        setCurrentStatus("Uploading new images...");
        // const orderedImages = featuredImage
        //   ? [featuredImage, ...images.filter((img) => img !== featuredImage)]
        //   : images;
        // Arrange images so that the featured image (if new) is first for convenience
        const orderedImages =
          featuredImage && !("id" in featuredImage)
            ? [featuredImage, ...images.filter((img) => img !== featuredImage)]
            : images;
        for (const image of orderedImages) {
          const imageUrl = await uploadImageToS3(image);
          const isFeatured =
            featuredImage === image &&
            (featuredImage as File).name === image.name;
          const uploadResponse = await apiClient.post(
            `/accessory/accessory-images`,
            {
              accessory_id: id,
              image_url: imageUrl,
              is_featured: isFeatured,
            }
          );
          uploadedImageIds.push(uploadResponse.data.data.id);
        }
      }

      // Step 4: Ensure at least one image is featured
      setCurrentStatus("Setting featured image...");
      // if (featuredImage) {
      //   if ("id" in featuredImage) {
      //     // Existing image
      //     await apiClient.post(`/accessory/${id}/images/ensure-featured`, {
      //       featuredImageId: featuredImage.id,
      //     });
      //   } else {
      //     // New image: Find the corresponding uploaded image URL
      //     const uploadedImage = await apiClient.post(
      //       `/accessory/accessory-images`,
      //       {
      //         accessory_id: id,
      //         image_url: `https://${import.meta.env.VITE_AWS_BUCKET_NAME}.s3.${
      //           import.meta.env.VITE_AWS_REGION
      //         }.amazonaws.com/${Date.now()}-${featuredImage.name}`,
      //         is_featured: true,
      //       }
      //     );

      //     // Ensure only this image is featured
      //     await apiClient.post(`/accessory/${id}/images/ensure-featured`, {
      //       featuredImageId: uploadedImage.data.data.id,
      //     });
      //   }
      // }

      if (featuredImage) {
        let featuredImageId: string | null = null;

        if ("id" in featuredImage) {
          // Featured image is existing
          featuredImageId = featuredImage.id;
        } else {
          // Featured image is a new file
          // It's the first in uploadedImageIds if we placed it first in orderedImages above,
          // or we can find it by matching file names or indexes if needed.
          // Assuming it was placed first if it's new:
          featuredImageId = uploadedImageIds[0] || null;
        }

        if (featuredImageId) {
          await apiClient.post(`/accessory/${id}/images/ensure-featured`, {
            featuredImageId: featuredImageId,
          });
        }
      }

      setCurrentStatus("Finalizing...");
      addNotification("success", "Accessory updated successfully!");

      // Refresh the accessories list
      globalLoading((prev) => ({ ...prev, accessories: true }));
      const updatedAccessoriesResponse = await apiClient.get(`/accessory`);
      setAccessories(updatedAccessoriesResponse.data.data);
      globalLoading((prev) => ({ ...prev, accessories: false }));

      navigate("/admin/accessories");
    } catch (error) {
      console.error("Error updating accessory:", error);
      addNotification("error", "Failed to update accessory. Please try again.");
    } finally {
      setIsResSaving(false);
      setCurrentStatus("");
    }
  };

  /**
   * Handle Image Preview Modal Visibility
   */
  useEffect(() => {
    if (previewImage) {
      setShowPreview(true);
    } else {
      setShowPreview(false);
    }
  }, [previewImage]);

  if (loading) {
    return (
      <div className="bg-gray-100 min-h-screen">
        <HeadingBar buttonLink="/admin/accessories" heading="Edit Accessory" />
        <div className="flex justify-center items-center h-screen">
          <LoaderSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <HeadingBar buttonLink="/admin/accessories" heading="Edit Accessory" />
      <div className="flex flex-col-reverse lg:flex-row w-[90%] gap-6 mx-auto my-10">
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
              placeholder="e.g. Side Extension Kit"
              name="Name"
              maxlength={20} 
              value={formValues.Name}
              onChange={handleInputChange}
              classes="!w-full"
              label="Name"
              error={errors.Name}
            />
            <InputField
              id="accessory_title"
              type="text"
              maxlength={20}
              placeholder="e.g. Side Extension Kit"
              name="accessory_title"
              value={formValues.accessory_title}
              onChange={handleInputChange}
              classes="!w-full"
              label="Accessory Title"
              error={errors.accessory_title}
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
                maxLength={400}
                onChange={handleInputChange}
                className={`mt-1 font-arial block w-full text-xs p-2 border border-inset h-[111px] border-custom-gray-200 outline-none py-2 px-3 ${
                  errors.Description__c
                    ? "border-red-500"
                    : "border-custom-gray-200"
                } `}
                placeholder="e.g. Control your debris even easier with the new Side Extension Kit. The kit increases the catch span of the Equipter 2000 and Equipter 2500, letting you keep your portable dump container in one spot longer."
              />
              <span className="text-red-500 h-6 text-[10px] font-bold">
                {errors.Description__c}
              </span>
            </div>
            <InputField
              id="price"
              type="number"
              placeholder="e.g. 485"
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
              placeholder="e.g. 100"
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
                placeholder="e.g. Side Extension Kit"
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
                placeholder="e.g. side-extension-kit"
                name="Accessory_URL__c"
                value={formValues.Accessory_URL__c.toLowerCase()}
                onChange={handleInputChange}
                error={errors.Accessory_URL__c}
                classes="text-gray-400 border-gray-200 bg-[#f9f9f9] text-[#666] border-[#ccc] cursor-not-allowed"
              />
            </div>
            <div className="flex justify-end space-x-4 ">
              <button
                className="px-6 py-2 border border-gray-300 text-gray-600 rounded-md hover:bg-gray-100"
                onClick={() => navigate("/admin/accessories")}
                type="button"
              >
                Cancel
              </button>
              <button
                className={`px-6 py-2 btn-yellow text-white rounded ${
                  isResSaving ? "opacity-50 cursor-not-allowed" : ""
                }`}
                type="submit"
                disabled={isResSaving}
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
                    "image_url" in featuredImage
                      ? (featuredImage.image_url as any)
                      : (URL.createObjectURL(featuredImage) as any)
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
              At least one accessory image is required.
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
                      key={image.id}
                      className="relative w-[150px] h-[150px] border border-gray-200 rounded-md overflow-hidden cursor-pointer shadow-sm"
                    >
                      <img
                        src={image.image_url}
                        alt="Product"
                        className="w-full h-full object-cover"
                        onClick={() =>
                          openImagePreview(image.image_url, index, "existing")
                        }
                      />
                      <button
                        className="absolute top-2 right-2 bg-white bg-opacity-75 text-red-600 text-md hover:text-red-800 rounded-full p-1"
                        title="Delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeExistingImage(image.id);
                        }}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                      <button
                        className="absolute top-2 right-10 bg-white bg-opacity-75 text-blue-600 text-md hover:text-blue-800 rounded-full p-1"
                        title="Preview"
                        onClick={(e) => {
                          e.stopPropagation();
                          openImagePreview(image.image_url, index, "existing");
                        }}
                      >
                        <FontAwesomeIcon icon={faExpand} />
                      </button>
                      {featuredImage &&
                        "id" in featuredImage &&
                        featuredImage.id === image.id && (
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
                      !("id" in featuredImage) &&
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
                  showPreview ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
              >
                <div className="h-[90%] max-w-[90%] bg-gray-300 p-3 rounded">
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
                      onClick={() => {
                        setAsFeaturedImage(
                          previewImage.index,
                          previewImage.type
                        );
                        closeImagePreview();
                      }}
                    >
                      <FontAwesomeIcon icon={faStar} /> Make Featured Image
                    </button>
                    <button
                      className="bg-gray-600 text-white px-4 py-2 rounded-md"
                      onClick={() => {
                        if (previewImage.type === "new") {
                          removeImage(previewImage.index);
                        } else {
                          const imageToRemove =
                            existingImages[previewImage.index];
                          if (imageToRemove) {
                            removeExistingImage(imageToRemove.id);
                          }
                        }
                        closeImagePreview();
                      }}
                    >
                      <FontAwesomeIcon icon={faTrash} /> Delete
                    </button>
                  </div>
                </div>
              </div>,
              document.body
            )}
        </div>
      </div>
    </div>
  );
};

export default EditAccessory;
        