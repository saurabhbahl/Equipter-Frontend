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
import { AccessoriesSchema, IAccessories } from "./AccessoriesSchema";
import { useNotification } from "../../../contexts/NotificationContext";
import { SfAccessToken } from "../../../utils/useEnv";
import HeadingBar from "../rootComponents/HeadingBar";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import Loader from "../../utils/Loader";
import LoaderSpinner from "../../utils/LoaderSpinner";

const s3 = new S3Client({
  region: import.meta.env.VITE_AWS_REGION,
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  },
});

const AddNewAccessory = () => {
  const nav = useNavigate();
  const [formValues, setFormValues] = useState<IAccessories>({
    Description__c: "",
    Name: "",
    Price__c: "",
    Quantity__c: "",
  });
  const { addNotification } = useNotification();
  const [errors, setErrors] = useState<IAccessories>({
    Description__c: "",
    Name: "",
    Price__c: "",
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

  const uploadImageToS3 = async (image: File): Promise<string> => {
    const uploadParams = {
      Bucket: import.meta.env.VITE_AWS_BUCKET_NAME,
      Key: `images/accessories/${Date.now()}-${image.name}`,
      Body: image,
      ContentType: image.type,
    };
    const command = new PutObjectCommand(uploadParams);
    const data = await s3.send(command);
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

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value ?? "" });
    setErrors({ ...errors, [name]: "" });
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
    console.log(accessoriesData)

    const result = AccessoriesSchema.safeParse(accessoriesData);
    console.log(result)
    if (images.length == 0) {
      setImageUploadError(true);
    }
    if (!result.success) {
      const newErrors: IAccessories = {
        Description__c: "",
        Name: "",
        Price__c: "",
        Quantity__c: "",
      };
      result.error.issues.forEach((issue) => {
        const fieldName = issue.path[0] as keyof IAccessories;
        console.log(fieldName)
        newErrors[fieldName] = String(issue.message);
      });
      setErrors(newErrors);
      console.log(errors)
      return;
    }

    if (images.length == 0) {
      setImageUploadError(true);
      addNotification("error", "At least one image is required.");
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
          body: JSON.stringify({
            Name: formValues.Name,
            Description__c: formValues.Description__c,
            Price__c: Number(formValues.Price__c),
            Quantity__c: Number(formValues.Quantity__c),
          }),
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

      addNotification("success", "Accessory added successfully");
      nav("/admin/accessories");
    } catch (error) {
      console.error("Error creating accessory:", error);
      addNotification("error", error.message);
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
        <form
          onSubmit={handleSave}
          className="flex-1 bg-white p-5 shadow-md rounded-sm h-fit"
        >
          <p className="font-roboto text-lg font-bold">General Information</p>
          <hr className="my-3 border-1 border-gray-400" />
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
            <div className="flex justify-end space-x-4 ">
              <button
                className="px-6 py-2 border border-gray-400 text-gray-500 shadow-xl hover:bg-gray-100"
                onClick={() => nav("/admin/accessories")}
              >
                Cancel
              </button>
              <button className="btn-yellow hover:bg-yellow-600" type="submit">
                {isResSaving ? <LoaderSpinner /> : "Save"}
              </button>
            </div>
          </div>
        </form>

        {/* Image section */}
        <div
          className={`bg-white p-5 shadow-md flex-1 rounded-sm space-y-3 ${
            images.length >= 3
              ? "h-[624px] overflow-y-scroll scrollbar-custom"
              : ""
          }`}
        >
          <p className="font-roboto text-lg font-bold">Upload Images</p>
          <hr className="my-3 border-1 border-gray-400" />
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

          <p className="font-medium">Accessory Images:</p>
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
              Minimum one accessory Image is required
            </p>
          )}
          {/* all images */}
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
                      className="bg-yellow-600 text-white px-4 py-2 rounded-md"
                      onClick={() => setAsFeaturedImage(previewImage.index)}
                    >
                      <FontAwesomeIcon icon={faStar} /> Make Featured Image
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
