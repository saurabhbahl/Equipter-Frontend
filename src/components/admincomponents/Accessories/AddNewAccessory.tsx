import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactDOM from "react-dom";
import {
  faTimes,
  faStar,
  faTrash,
  faExpand,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useState, ChangeEvent, useRef, FormEvent, useEffect } from "react";
import InputField from "../../utils/InputFeild";
import { AccessoriesSchema, IAccessoriesInput } from "./AccessoriesSchema";
import { useNotification } from "../../../contexts/NotificationContext";
import { SfAccessToken } from "../../../utils/useEnv";
import HeadingBar from "../rootComponents/HeadingBar";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import Loader from "../../utils/Loader";
import LoaderSpinner from "../../utils/LoaderSpinner";

import AccessoriesService from "./AccessoriesService";
import { ErrorWithMessage } from "../../../types/componentsTypes";
import { useAdminContext } from "../../../hooks/useAdminContext";

const s3 = new S3Client({
  region: import.meta.env.VITE_AWS_REGION,
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  },
});

const AddNewAccessory = () => {
  const nav = useNavigate();
  const {setLoading,setAccessories}=useAdminContext()
  const [formValues, setFormValues] = useState<IAccessoriesInput>({
    Description__c: "",
    Name: "",
    Price__c: "",
    Quantity__c: "",
    Accessory_URL__c: "",
    Meta_Title__c: "",
  });
  const { addNotification } = useNotification();
  const [errors, setErrors] = useState<IAccessoriesInput>({
    Description__c: "",
    Name: "",
    Price__c: "",
    Accessory_URL__c: "",
    Meta_Title__c: "",
    Quantity__c: "",
  });
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<{
    url: string;
    index: number;
  } | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isResSaving, setIsResSaving] = useState(false);
  const [currentStatus, setCurrentStatus] = useState("");
  const [imageUploadError, setImageUploadError] = useState(false);
  const formRef = useRef<HTMLFormElement | null>(null);
  const imagesRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (formRef.current && imagesRef.current) {
      const formHeight = formRef.current.offsetHeight;
      imagesRef.current.style.maxHeight = `${formHeight}px`;
    }
  }, [images]);

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
    try {
      const imagePayload = {
        Name: formValues.Name,
        Accessory_Id__c: accessoryId,
        Is_Featured__c: isFeatured,
        Image_URL__c: imageUrl,
      };
      const response = await fetch(
        "/api/services/data/v52.0/sobjects/Accessory_Image__c",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${SfAccessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(imagePayload),
        }
      );
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to save image to Salesforce: ${errorText}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
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
      const updatedErrors = { ...prevErrors ,[name]: ""};

      if (name === "Meta_Title__c") {
        updatedErrors.Meta_Title__c = "";
        updatedErrors.Accessory_URL__c = "";
      }

      if (name === "Product_URL__c") {
        updatedErrors.Accessory_URL__c = "";
      }

      return updatedErrors;
    });
    // console.log(formValues)
    console.log(errors)
  };

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

  const removeImage = (index: number) => {
    setImages((prevImages) => {
      const updatedImages = prevImages.filter((_, i) => i !== index);
      if (index == 0 && updatedImages.length > 0) {
        setFeaturedImage(updatedImages[0]);
      } else if (updatedImages.length == 0) {
        setFeaturedImage(null);
      } else {
        setFeaturedImage(updatedImages[index - 1]);
      }
      return updatedImages;
    });
    setPreviewImage(null);
  };

  const setAsFeaturedImage = (index: number) => {
    if (images[index]) {
      setFeaturedImage(images[index]);
      closeImagePreview();
    }
  };

  const openImagePreview = (image: string, index: number) => {
    setPreviewImage({ url: image, index });
  };

  const closeImagePreview = () => {
    setShowPreview(false);
    setTimeout(() => setPreviewImage(null), 350);
  };

  const handleSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const accessoriesData = {
      ...formValues,
      Price__c: Number(formValues.Price__c),
      Quantity__c: Number(formValues.Quantity__c),
    };
    console.log(accessoriesData);

    const result = AccessoriesSchema.safeParse(accessoriesData);
    console.log(result);
 
    if (!result.success) {
      const newErrors: IAccessoriesInput = {
        Description__c: "",
        Name: "",
        Price__c: "",
        Quantity__c: "",
        Accessory_URL__c:"",
        Meta_Title__c:""
      };
      result.error.issues.forEach((issue) => {
        const fieldName = issue.path[0] as keyof IAccessoriesInput;
        console.log(fieldName);
        newErrors[fieldName] = String(issue.message);
      });
      setErrors(newErrors);
      if (images.length == 0) {
        setImageUploadError(true);
 
 
      }
      return;
    }
    if (images.length == 0) {
      setImageUploadError(true);

      return;
    }
    
    const slug: string = formValues.Accessory_URL__c;
    const isUnique = await AccessoriesService.isSlugUnique(slug);
  console.log(isUnique)
    if (!isUnique) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        Accessory_URL__c:
          "This URL is already in use. Please modify the Meta Title.",
      }));
      console.log(errors);
      return;
    }

    setIsResSaving(true);
    setCurrentStatus("Creating accessory");

    const token = SfAccessToken;
    try {

      const response = await fetch(
        "/api/services/data/v52.0/sobjects/Accessory__c/",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(formValues),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        addNotification("error", errorText);
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }

      const data = await response.json();
      const newAccessoryId = data.id;

      // Upload images
      setCurrentStatus("Uploading images");
      const orderedImages = featuredImage
        ? [featuredImage, ...images.filter((img) => img !== featuredImage)]
        : images;

      for (const [index, image] of orderedImages.entries()) {
        const imageUrl = await uploadImageToS3(image);
        await saveImageToSalesforce(newAccessoryId, imageUrl, index === 0);
      }

      setLoading((prev) => ({ ...prev, accessories: true }));
      const newProd = await AccessoriesService.fetchAccessoriesWithImages();
      setAccessories(newProd);
      addNotification("success", "Accessory added successfully");
      setLoading((prev) => ({ ...prev, accessories: false }));
      nav("/admin/accessories");
    } catch (error) {
      console.error("Error creating accessory:", error);
      addNotification("error", (error as ErrorWithMessage).message);
    } finally {
      setIsResSaving(false);
    }
  };

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
      <div className="flex w-[90%] gap-6 mx-auto my-10">
        {isResSaving && <Loader message={currentStatus} />}
        {/* Details section */}
        <form onSubmit={handleSave} ref={formRef} className="flex-1 bg-white p-5 shadow-md rounded-sm h-fit">
          <h2 className="text-2xl font-semibold mb-4">General Information</h2>
          <hr className="mb-6" />
          <div className="grid my-1 grid-cols-1 gap-5">
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
            {/* additional info */}
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
                onClick={() => nav("/admin/products")}
                type="button">Cancel</button>
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

        {/* Image section */}
        <div ref={imagesRef} className={`bg-white p-6 shadow-md flex-1 rounded-md space-y-4 h-fit overflow-auto `}>
          <h2 className="text-2xl font-semibold mb-2">Upload Images</h2>
          <hr className="mb-6" />
          {featuredImage && (
            <>
              <p className="font-roboto text-md font-medium">Featured Image:</p>
              <div className="relative w-full h-[258px]">
                <img
                  src={URL.createObjectURL(featuredImage)}
                  className="w-full h-full object-cover rounded-md"
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
            <p className="text-[11px] font-semibold text-red-500">
              Minimum one accessory Image is required
            </p>
          )}
          {images.length > 0 && (
            <p className="font-medium">Accessory Images:</p>
          )}
          {/* all images */}
          <div className="flex justify-start flex-wrap gap-4 mt-4">
            {images.map((image, index) => (
              <div
                key={index}
                className="relative w-[150px] h-[150px] border border-gray-300 rounded-md overflow-hidden cursor-pointer"
              >
                <img
                  src={URL.createObjectURL(image)}
                  alt="Accessory"
                  className="w-full h-full object-cover"
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
                    openImagePreview(URL.createObjectURL(image), index);
                  }}
                >
                  <FontAwesomeIcon icon={faExpand} />
                </button>
              </div>
            ))}
          </div>
          {/* full screen */}
          {previewImage &&
            ReactDOM.createPortal(
              <div
                className={`fixed inset-0 h-full p-5 bg-black bg-opacity-40 flex items-center justify-center transition-all duration-500 ${
                  showPreview ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
              >
                <div className="h-[90%]">
                  <div className="max-w-[90%] min-h-[90%] object-cove mx-auto max-h-[90%]  h-[90%]">
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
                      onClick={() => setAsFeaturedImage(previewImage.index)}
                    >
                      <FontAwesomeIcon icon={faStar} /> Make Feature Image
                    </button>
                    <button
                      className="bg-gray-600 text-white px-4 py-2 rounded-md"
                      onClick={() => removeImage(previewImage.index)}
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
