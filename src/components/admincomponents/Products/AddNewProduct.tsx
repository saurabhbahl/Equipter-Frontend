import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactDOM from "react-dom";
import {
  faExpand,
  faStar,
  faTimes,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useState, ChangeEvent, useRef, useEffect } from "react";
import InputField from "../../utils/InputFeild";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
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

const AddNewProduct = () => {
  const {
    accessories,
    error,
    loading,
    setLoading,
    setError,
    setAccessories,
  } = useAdminContext();
  const nav = useNavigate();
  const [isResSaving, setIsResSaving] = useState(false);
  const [errors, setErrors] = useState<InputValues>({
    productName: "",
    price: "",
    gvwr: "",
    Down_Payment_Cost__c: "",
    liftCapacity: "",
    liftHeight: "",
    container: "",
  });
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [formValues, setFormValues] = useState<InputValues>({
    productName: "",
    subtitle: "",
    price: "",
    gvwr: "",
    liftCapacity: "",
    Down_Payment_Cost__c: "",
    liftHeight: "",
    container: "",
  });
  const [previewImage, setPreviewImage] = useState<{
    url: string;
    index: number;
  } | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [currentStatus, setCurrentStatus] = useState("");
  const [imageUploadError, setImageUploadError] = useState(false);
  const [newAccessories, setNewAccessories] = useState<string[]>([]);
  const { addNotification } = useNotification();

  const uploadImageToS3 = async (image: File): Promise<string> => {
    const uploadParams = {
      Bucket: import.meta.env.VITE_AWS_BUCKET_NAME,
      Key: `images/products/${Date.now()}-${image.name}`,
      Body: image,
      ContentType: image.type,
    };
    const command = new PutObjectCommand(uploadParams);
    const data = await s3.send(command);
    console.log(data);
    return `https://${import.meta.env.VITE_AWS_BUCKET_NAME}.s3.${
      import.meta.env.VITE_AWS_REGION
    }.amazonaws.com/${uploadParams.Key}`;
  };

  const saveImageToSalesforce = async (
    productId: string,
    imageUrl: string,
    isFeatured: boolean
  ) => {
    try {
      const imagePayload = {
        Name: formValues.productName,
        Product_Id__c: productId,
        Is_Featured__c: isFeatured,
        Image_URL__c: imageUrl,
      };
      console.log(imagePayload);

      const response = await fetch(
        "/api/services/data/v52.0/sobjects/Product_Images__c",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${SfAccessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(imagePayload),
        }
      );
      console.log(response);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to save image to Salesforce: ${errorText}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleAccessoryChange = (accessoryId: string) => {
    setNewAccessories((prev) =>
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

  const setAsFeaturedImage = (index: number) => {
    if (images[index]) {
      setFeaturedImage(images[index]);
      closeImagePreview();
    }
  };

  const removeImage = (index: number) => {
    setImages((prevImages) => {
      const updatedImages = prevImages.filter((_, i) => i !== index);
      if (index === 0 && updatedImages.length > 0) {
        setFeaturedImage(updatedImages[0]);
      } else if (updatedImages.length === 0) {
        setFeaturedImage(null);
      } else {
        setFeaturedImage(updatedImages[index - 1]);
      }
      return updatedImages;
    });
    setPreviewImage(null);
  };

  const openImagePreview = (image: string, index: number) => {
    setPreviewImage({ url: image, index });
    setShowPreview(true);
  };

  const closeImagePreview = () => {
    setShowPreview(false);
    setTimeout(() => setPreviewImage(null), 350);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const result = ProductSchema.safeParse(formValues);
    console.log(result);
    if (images.length == 0) {
      setImageUploadError(true);
    }
    if (!result.success) {
      const newErrors: { [key in keyof InputValues]: string } = {
        productName: "",
        price: "",
        gvwr: "",
        liftCapacity: "",
        liftHeight: "",
        Down_Payment_Cost__c: "",
        container: "",
      };
      result.error.issues.forEach((issue) => {
        const fieldName = issue.path[0] as keyof InputValues;
        newErrors[fieldName] = issue.message;
      });
      setErrors(newErrors);

      // return;
    } else {
      if (images.length == 0) {
        setImageUploadError(true);
        return
      }
      setIsResSaving(true);
      setCurrentStatus("Creating product  ")

      const token = SfAccessToken;
      const productData = {
        Name: formValues.productName,
        Product_Price__c: parseFloat(formValues.price),
        Down_Payment_Cost__c: formValues.Down_Payment_Cost__c,
        GVWR__c: parseFloat(formValues.gvwr),
        Lift_Capacity__c: parseFloat(formValues.liftCapacity),
        Lift_Height__c: parseFloat(formValues.liftHeight),
        Container__c: formValues.container,
      };
      try {
        // add product
        const productResponse = await fetch(
          "/api/services/data/v52.0/sobjects/Product__c/",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(productData),
          }
        );
        setCurrentStatus("adding product")
        if (!productResponse.ok) {
          const errorText = await productResponse.text();
          throw new Error(`Product creation failed: ${errorText}`);
        }

        const productDataResponse = await productResponse.json();
        console.log(productDataResponse);
        const newProductId = productDataResponse.id;

        // add accessories
        const accessoryRequests = newAccessories.map((accessoryId) => ({
          method: "POST",
          url: "/services/data/v52.0/sobjects/Accessory_Product__c",
          richInput: {
            Name: formValues.productName,
            Accessory_Id__c: accessoryId,
            Product_Id__c: newProductId,
          },
        }));
        console.log(accessoryRequests);

        const batchRequestData = { batchRequests: accessoryRequests };
        setCurrentStatus("attaching accessories")
        const accessoryResponse = await fetch(
          "/api/services/data/v52.0/composite/batch",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(batchRequestData),
          }
        );

        if (!accessoryResponse.ok) {
          const errorText = await accessoryResponse.text();
          throw new Error(`Accessory creation failed: ${errorText}`);
        }
        console.log(featuredImage);
        setCurrentStatus("uploading images")
        const orderedImages = featuredImage
          ? [featuredImage, ...images.filter((img) => img !== featuredImage)]
          : images;

        const imageUrls = [];

        for (const [index, image] of orderedImages.entries()) {
          console.log(index, image);
          const imageUrl = await uploadImageToS3(image);
          console.log(imageUrl);
          imageUrls.push(imageUrl);

          await saveImageToSalesforce(newProductId, imageUrl, index === 0);
        }
        setIsResSaving(false);
        addNotification("success", "Product Added Successfully");

        nav("/admin/products");
      } catch (error) {
        console.error("Error creating product or accessory:", error);
        setIsResSaving(false);
        addNotification("error", "Error while creating product");
      }
    }
  };

  const fetchAccessoriesData = async () => {
    setLoading((prevState) => ({ ...prevState, accessories: true }));
    try {
      const accessoriesData = await AccessoriesService.fetchAccessories();
      setAccessories(accessoriesData);
    } catch (error) {
      setError((prev) => ({
        ...prev,
        accessories: error.message || "An error occurred",
      }));
    } finally {
      setLoading((prevState) => ({ ...prevState, accessories: false }));
    }
  };

  useEffect(() => {
    if (accessories.length == 0) {
      fetchAccessoriesData();
    }
  }, []);

  return (
    <div className="bg-[#F6F8FF] min-h-screen">
      <HeadingBar buttonLink="/admin/products" heading="Add New Product" />
      {/* Product Details */}
      <div
        className={`flex w-[90%] gap-6 mx-auto my-10 ${isResSaving ? "" : ""}`}>
        {isResSaving && <Loader message={currentStatus} />}

        {/*Details section */}
        <form
          onSubmit={handleSave}
          className="flex-1 bg-white p-5 shadow-md rounded-sm"
        >
          <p className="font-roboto text-lg font-bold">General Information</p>
          <hr className="my-3 border-1 border-gray-900" />

          {/* Product Name and Price,Downpayment cost */}
          <div className="grid my-1 grid-cols-1 ">
            <InputField
              id="productName"
              type="name"
              label="Product Name"
              placeholder="Enter Product Name"
              name="productName"
              value={formValues.productName}
              onChange={handleInputChange}
              error={errors.productName}
              classes="!w-full"
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
              classes="!w-full "
            />{" "}
            {/* Price */}
            <InputField
              id="price"
              label="Price"
              type="number"
              placeholder="Enter Price"
              name="price"
              value={formValues.price}
              error={errors.price}
              onChange={handleInputChange}
              classes="!w-full"
            />
          </div>

          {/* GVWR and Lift Capacity*/}
          <div className="grid grid-cols-2 gap-2">
            <InputField
              id="gvwr"
              label="GVWR"
              type="number"
              placeholder="7,500 Lbs"
              name="gvwr"
              value={formValues.gvwr}
              onChange={handleInputChange}
              error={errors.gvwr}
              classes="!w-full"
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
              classes="!w-full"
            />
          </div>
          {/* Lift height and Container */}
          <div className="grid grid-cols-2 gap-2">
            <InputField
              id="liftHeight"
              label="Lift Height"
              type="number"
              placeholder="12' 0\"
              name="liftHeight"
              error={errors.liftHeight}
              value={formValues.liftHeight}
              onChange={handleInputChange}
              classes="!w-full"
            />

            <InputField
              label="Container"
              id="container"
              type="number"
              placeholder="4.1 Cu Yds"
              name="container"
              error={errors.container}
              value={formValues.container}
              onChange={handleInputChange}
              classes="!w-full"
            />
          </div>

          {/* Accessories Section */}
          <hr className="my-3 border-1 border-gray-900" />
          <p className="font-medium text-xl my-3">Accessories</p>
          <div className="grid grid-cols-2 gap-2 my-3">
            {accessories?.map((accessory, index) => (
              <label key={index} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="h-4 w-4"
                  onChange={() => handleAccessoryChange(accessory.Id)}
                />
                <span className="capitalize">
                  {accessory?.Name} -{" "}
                  <span className="text-gray-600 font-bold">
                    ${accessory?.Price__c}
                  </span>
                </span>
              </label>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 mt-6">
            <button
              className="px-6 py-2 border border-gray-400 text-gray-500 shadow-xl hover:bg-gray-100"
              onClick={() => nav("/admin/products")}
            >
              Cancel
            </button>
            <button
              className={`btn-yellow  ${
                isResSaving ? "bg-custom-orange/40" : ""
              }`}
              type="submit"
              // onClick={handleSave}
            >
              {isResSaving ? <LoaderSpinner /> : "Save"}
            </button>
          </div>
        </form>

        {/* Image section */}
        <div
          className={`bg-white p-5 shadow-md flex-1 rounded-sm space-y-3 ${
            images.length >= 3
              ? "h-[704px] overflow-y-scroll scrollbar-custom"
              : "h-"
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

          <p className="font-medium">Product Images:</p>
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
              Minimum one product Image is required
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
                  alt="Product"
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

export default AddNewProduct;
