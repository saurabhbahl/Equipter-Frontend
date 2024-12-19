import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactDOM from "react-dom";
import {
  faExpand,
  faStar,
  faTimes,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useState, ChangeEvent, useRef, FormEvent, useEffect } from "react";
import InputField from "../../utils/InputFeild";
import { AccessoriesSchema, IAccessoriesInput } from "./AccessoriesSchema";
import { useNotification } from "../../../contexts/NotificationContext";
import HeadingBar from "../rootComponents/HeadingBar";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import Loader from "../../utils/Loader";
import LoaderSpinner from "../../utils/LoaderSpinner";

import { apiClient } from "../../../utils/axios"; // Ensure this points to your custom REST API client
import { useAdminContext } from "../../../hooks/useAdminContext";

const s3 = new S3Client({
  region: import.meta.env.VITE_AWS_REGION,
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  },
});

const AddNewAccessory = () => {
  const navigate = useNavigate();
  const { setLoading, setAccessories } = useAdminContext();
  const { addNotification } = useNotification();

  // State for form inputs
  const [formValues, setFormValues] = useState<IAccessoriesInput>({
    Name: "",
    accessory_title: "",
    Description__c: "",
    Price__c: "",
    Quantity__c: "",
    Meta_Title__c: "",
    Accessory_URL__c: "",
  });

  // State for form errors
  const [errors, setErrors] = useState<IAccessoriesInput>({
    Name: "",
    Description__c: "",
    accessory_title: "",
    Price__c: "",
    Quantity__c: "",
    Meta_Title__c: "",
    Accessory_URL__c: "",
  });

  // State for handling images
  const [images, setImages] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<{
    url: string;
    index: number;
    type: "new" | "existing";
  } | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [imageUploadError, setImageUploadError] = useState(false);

  // State for handling submission
  const [isResSaving, setIsResSaving] = useState(false);
  const [currentStatus, setCurrentStatus] = useState("");

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
  }, [images]);

  // Cleanup object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      images.forEach((image) => URL.revokeObjectURL(image.name));
    };
  }, [images]);

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

  /**
   * Set a new featured image
   */
  const setAsFeaturedImage = (index: number, type: "new" | "existing") => {
    if (type === "new") {
      if (images[index]) {
        setFeaturedImage(images[index]);
      }
    }
    // If handling existing images, extend logic here
    closeImagePreview();
  };

  /**
   * Remove an image from the list
   */
  const removeImage = (index: number) => {
    setImages((prevImages) => {
      const removedImage = prevImages[index];
      const updatedImages = prevImages.filter((_, i) => i !== index);
      if (featuredImage === removedImage) {
        if (updatedImages.length > 0) {
          setFeaturedImage(updatedImages[0]);
        } else {
          setFeaturedImage(null);
        }
      }
      return updatedImages;
    });
    setPreviewImage(null);

    // Check if there are no images left
    const totalImages = images.length - 1;
    if (totalImages === 0) {
      setImageUploadError(true);
      addNotification("error", "At least one accessory image is required.");
    }
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
   * Handle form submission to add a new accessory
   */
  const handleSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const accessoriesData = {
      ...formValues,
      Price__c: parseFloat(formValues.Price__c) || 0,
      Quantity__c: parseFloat(formValues.Quantity__c) || 0,
    };

    const validation = AccessoriesSchema.safeParse(accessoriesData);

    // Validate form inputs
    if (!validation.success) {
      const newErrors: IAccessoriesInput = {
        Name: "",
        accessory_title: "",
        Description__c: "",
        Price__c: "",
        Quantity__c: "",
        Meta_Title__c: "",
        Accessory_URL__c: "",
      };
      validation.error.issues.forEach((issue) => {
        const fieldName = issue.path[0] as keyof IAccessoriesInput;
        newErrors[fieldName] = issue.message;
      });
      setErrors(newErrors);
      if (images.length === 0) {
        setImageUploadError(true);
      }
      return;
    }

    // Check if at least one image is uploaded
    if (images.length === 0) {
      setImageUploadError(true);
      addNotification("error", "At least one accessory image is required.");
      return;
    }

    const slug: string = formValues.Accessory_URL__c;

    // Validate slug uniqueness via custom REST API
    try {
      const response = await apiClient.get(`/accessory/slug`, {
        params: { slug },
      });
      console.log(response);
      const isUnique = response.data.isUnique;
      if (!isUnique) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          Accessory_URL__c:
            "This URL is already in use. Please modify the Meta Title.",
        }));
        addNotification(
          "error",
          "Slug is already in use. Please choose another one."
        );
        return;
      }
    } catch (err) {
      console.error("Error validating slug uniqueness:", err);
      addNotification("error", "Failed to validate URL uniqueness.");
      return;
    }

    setIsResSaving(true);
    setCurrentStatus("Creating accessory...");

    try {
      // Step 1: Create the accessory via custom REST API
      const accessoryPayload = {
        name: formValues.Name,
        accessory_title: formValues.accessory_title,
        description: formValues.Description__c,
        price: parseFloat(formValues.Price__c),
        stock_quantity: parseInt(formValues.Quantity__c),
        meta_title: formValues.Meta_Title__c,
        accessory_url: formValues.Accessory_URL__c,
      };
      console.log(accessoryPayload);

      const createAccessoryResponse = await apiClient.post(
        `/accessory`,
        accessoryPayload
      );
      console.log(createAccessoryResponse);
      // After creating the new accessory:
      const newAccessory = createAccessoryResponse.data.data;
      const newAccessoryId = newAccessory.id;

      // Upload images and capture their responses
      setCurrentStatus("Uploading images...");
      const orderedImages = featuredImage
        ? [featuredImage, ...images.filter((img) => img !== featuredImage)]
        : images;

      const imageResponses = [];
      for (const image of orderedImages) {
        const imageUrl = await uploadImageToS3(image);
        const isFeatured = featuredImage === image;

        // Capture the response data, which should include the new image's ID
        const imageResp = await apiClient.post(`/accessory/accessory-images`, {
          accessory_id: newAccessoryId,
          image_url: imageUrl,
          image_description: formValues.Name,
          is_featured: isFeatured,
        });

        imageResponses.push({ data: imageResp.data.data, isFeatured });
      }

      // Once all images are posted, find the featured image's ID
      const featuredImageResp = imageResponses.find((res) => res.isFeatured);
      if (featuredImageResp) {
        // We have a featured image ID, pass it along
        await apiClient.post(
          `/accessory/${newAccessoryId}/images/ensure-featured`,
          {
            featuredImageId: featuredImageResp.data.id,
          }
        );
      } else {
        // No explicitly featured image found, let the backend ensure one is featured
        await apiClient.post(
          `/accessory/${newAccessoryId}/images/ensure-featured`
        );
      }

      // Final steps...
      setCurrentStatus("Finalizing...");
      addNotification("success", "Accessory added successfully!");

      // const newAccessory = createAccessoryResponse.data.data;
      // const newAccessoryId = newAccessory.id;

      // // Step 2: Upload images to S3 and save their URLs via custom REST API
      // setCurrentStatus("Uploading images...");
      // const orderedImages = featuredImage
      //   ? [featuredImage, ...images.filter((img) => img !== featuredImage)]
      //   : images;

      // for (const [, image] of orderedImages.entries()) {
      //   const imageUrl = await uploadImageToS3(image);
      //   // const isFeatured = featuredImage === image && index === 0;
      //   const isFeatured = featuredImage === image;

      //   await apiClient.post(`/accessory/accessory-images`, {
      //     accessory_id: newAccessoryId,
      //     image_url: imageUrl,
      //     image_description: formValues.Name,
      //     is_featured: isFeatured,
      //   });
      // }

      // // Step 3: Ensure at least one image is featured
      // await apiClient.post(
      //   `/accessory/${newAccessoryId}/images/ensure-featured`
      // );

      // setCurrentStatus("Finalizing...");
      // addNotification("success", "Accessory added successfully!");

      // Refresh the accessories list
      setLoading((prev) => ({ ...prev, accessories: true }));
      const updatedAccessoriesResponse = await apiClient.get(`/accessory`);
      setAccessories(updatedAccessoriesResponse.data.data);
      setLoading((prev) => ({ ...prev, accessories: false }));

      navigate("/admin/accessories");
    } catch (error) {
      console.error("Error adding accessory:", error);
      addNotification("error", "Failed to add accessory. Please try again.");
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

  return (
    <div className="bg-[#F6F8FF] min-h-screen">
      <HeadingBar buttonLink="/admin/accessories" heading="Add New Accessory" />
      <div className="flex flex-col-reverse lg:flex-row w-[90%] gap-6 mx-auto my-10">
        {isResSaving && <Loader message={currentStatus} />}
        {/* Details Section */}
        <form
          onSubmit={handleSave}
          ref={formRef}
          className="flex-1 bg-white p-6 shadow-md rounded-sm h-fit"
        >
          <h2 className="text-2xl font-semibold mb-4">General Information</h2>
          <hr className="mb-6" />
          <div className="grid my-1 grid-cols-1 gap-5">
            <InputField
              id="name"
              maxlength={20}
              type="text"
              placeholder="e.g. Side Extension Kit"
              name="Name"
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
                className="font-medium text-custom-gray"
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
              type="string"
              placeholder="e.g. 485"
              name="Price__c"
              value={formValues.Price__c}
              onChange={handleInputChange}
              error={errors.Price__c as string}
              classes="!w-full"
              label="Price "
            />
            <InputField
              id="quantity"
              type="string"
              placeholder="e.g. 100"
              name="Quantity__c"
              value={formValues.Quantity__c}
              onChange={handleInputChange}
              classes="!w-full"
              error={errors.Quantity__c as string}
              label="Quantity"
            />
            {/* Additional Information */}
            <h2 className="text-2xl font-semibold my-4 mb-2">
              Additional Information
            </h2>
            <hr className="mb-3" />
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
                id="accessoryurl"
                type="text"
                readonly
                label="Accessory URL"
                placeholder="e.g. side-extension-kit"
                name="Accessory_URL__c"
                value={formValues.Accessory_URL__c.toLowerCase()}
                onChange={handleInputChange}
                error={errors.Accessory_URL__c}
                classes="text-gray-400 border-gray-200 bg-[#f9f9f9] text-[#666] border-[#ccc] cursor-not-allowed"
              />
            </div>
            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 mt-8">
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
          className={`bg-white p-6 shadow-md flex-1 rounded-md space-y-4 h-fit overflow-auto`}
          style={{
            maxHeight: formHeight ? `${formHeight}px` : "auto",
          }}
        >
          <h2 className="text-2xl font-semibold mb-4">Upload Images</h2>
          <hr className="mb-6" />

          {/* Featured Image */}
          {featuredImage && (
            <>
              <h3 className="font-semibold text-lg mb-2">Featured Image:</h3>
              <div className="relative w-full h-[358px] mb-6">
                <img
                  src={URL.createObjectURL(featuredImage)}
                  className="w-full h-full object-cover rounded-md shadow-md"
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
            <p className="text-sm text-red-500">
              At least one accessory image is required.
            </p>
          )}
          {images.length > 0 && (
            <p className="font-medium">Accessory Images:</p>
          )}
          {/* Uploaded Images */}
          <div className="flex flex-wrap gap-4 mt-6">
            {images.map((image, index) => (
              <div
                key={index}
                className="relative w-[150px] h-[150px] border border-gray-200 rounded-md overflow-hidden cursor-pointer shadow-sm"
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
                    openImagePreview(URL.createObjectURL(image), index, "new");
                  }}
                >
                  <FontAwesomeIcon icon={faExpand} />
                </button>
                {featuredImage === image && (
                  <span className="absolute bottom-2 left-2 bg-custom-orange text-white text-xs px-2 py-1 rounded">
                    <FontAwesomeIcon icon={faStar} />
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Full-screen Image Preview */}
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
                      onClick={() =>
                        setAsFeaturedImage(
                          previewImage.index,
                          previewImage.type
                        )
                      }
                    >
                      <FontAwesomeIcon icon={faStar} /> Make Featured Image
                    </button>
                    <button
                      className="bg-gray-600 text-white px-4 py-2 rounded-md"
                      onClick={() => {
                        if (previewImage.type === "new") {
                          removeImage(previewImage.index);
                        }
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

export default AddNewAccessory;
