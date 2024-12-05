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
import { ProductsService } from "./ProductsService";
import { ErrorWithMessage } from "../../../types/componentsTypes";

const s3 = new S3Client({
  region: import.meta.env.VITE_AWS_REGION,
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  },
});

export interface IProductInputValues {
  productName: string;
  Product_Title__c: string;
  Product_Description__c: string;
  price: string;
  gvwr: string;
  liftCapacity: string;
  liftHeight: string;
  Meta_Title__c: string;
  container: string;
  Down_Payment_Cost__c: string;
  Product_URL__c: string;
}

const AddNewProduct = () => {
  const {
    accessories,
    setProducts,
    setLoading,
    setError,
    setAccessories,
  } = useAdminContext();

  const nav = useNavigate();
  const [isResSaving, setIsResSaving] = useState(false);
  const [errors, setErrors] = useState<IProductInputValues>({
    productName: "",
    price: "",
    Product_Description__c: "",
    Product_Title__c: "",
    gvwr: "",
    Down_Payment_Cost__c: "",
    liftCapacity: "",
    liftHeight: "",
    container: "",
    Product_URL__c: "",
    Meta_Title__c: "",
  });
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [formValues, setFormValues] = useState<IProductInputValues>({
    productName: "",
    price: "",
    Meta_Title__c: "",
    Product_Description__c: "",
    Product_Title__c: "",
    gvwr: "",
    liftCapacity: "",
    Down_Payment_Cost__c: "",
    liftHeight: "",
    container: "",
    Product_URL__c: "",
  });
  const [previewImage, setPreviewImage] = useState<{
    url: string;
    index: number;
  } | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState("");
  const [imageUploadError, setImageUploadError] = useState(false);
  const [newAccessories, setNewAccessories] = useState<string[]>([]);
  const { addNotification } = useNotification();

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
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
    try {
      const imagePayload = {
        Name: formValues.productName,
        Product_Id__c: productId,
        Is_Featured__c: isFeatured,
        Image_URL__c: imageUrl,
      };

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

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to save image to Salesforce: ${errorText}`);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormValues((prevValues) => {
      const updatedValues = { ...prevValues, [name]: value };

      if (name === "Meta_Title__c") {
        updatedValues.Product_URL__c = value
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
        updatedErrors.Product_URL__c = "";
      }

      if (name === "Product_URL__c") {
        updatedErrors.Product_URL__c = "";
      }

      return updatedErrors;
    });
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const slug: string = formValues.Product_URL__c;
    const result = ProductSchema.safeParse(formValues);
    if (images.length === 0) {
      setImageUploadError(true);
    }
    if (!result.success) {
      const newErrors: { [key in keyof IProductInputValues]: string } = {
        productName: "",
        price: "",
        Product_Description__c: "",
        Product_Title__c: "",
        gvwr: "",
        Down_Payment_Cost__c: "",
        Meta_Title__c: "",
        Product_URL__c: "",
        liftCapacity: "",
        liftHeight: "",
        container: "",
      };
      result.error.issues.forEach((issue) => {
        const fieldName = issue.path[0] as keyof IProductInputValues;
        newErrors[fieldName] = issue.message;
      });
      setErrors(newErrors);
    } else {
      if (images.length === 0) {
        setImageUploadError(true);
        return;
      }
      const isUnique = await ProductsService.isSlugUnique(slug);

      if (!isUnique) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          Product_URL__c:
            "This URL is already in use. Please modify the Meta Title.",
        }));
        console.log(errors);
        return;
      }
      setIsResSaving(true);
      setCurrentStatus("Creating product...");

      const token = SfAccessToken;
      const productData = {
        Name: formValues.productName,
        Product_Price__c: parseFloat(formValues.price),
        Down_Payment_Cost__c: formValues.Down_Payment_Cost__c,
        GVWR__c: parseFloat(formValues.gvwr),
        Lift_Capacity__c: parseFloat(formValues.liftCapacity),
        Lift_Height__c: parseFloat(formValues.liftHeight),
        Container__c: formValues.container,
        Meta_Title__c: formValues.Meta_Title__c,
        Product_URL__c: formValues.Product_URL__c,
        Product_Title__c: formValues.Product_Title__c,
        Product_Description__c: formValues.Product_Description__c,
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
        setCurrentStatus("Adding product...");
        if (!productResponse.ok) {
          const errorText = await productResponse.text();
          throw new Error(`Product creation failed: ${errorText}`);
        }
        const productDataResponse = await productResponse.json();
        const newProductId = productDataResponse.id;

        // add accessories
        if (newAccessories.length > 0) {
          const accessoryRequests = newAccessories.map((accessoryId) => ({
            method: "POST",
            url: "/api/services/data/v52.0/sobjects/Accessory_Product__c",
            richInput: {
              Name: formValues.productName,
              Accessory_Id__c: accessoryId,
              Product_Id__c: newProductId,
            },
          }));

          const batchRequestData = { batchRequests: accessoryRequests };
          setCurrentStatus("Attaching accessories...");

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
        }

        setCurrentStatus("Uploading images...");
        const orderedImages = featuredImage
          ? [featuredImage, ...images.filter((img) => img !== featuredImage)]
          : images;

        for (const [index, image] of orderedImages.entries()) {
          const imageUrl = await uploadImageToS3(image);
          await saveImageToSalesforce(newProductId, imageUrl, index === 0);
        }
        setIsResSaving(false);
        addNotification("success", "Product Added Successfully");

        setLoading((prev) => ({ ...prev, products: true }));
        const newProd = await ProductsService.fetchProductsWithImages();
        setProducts(newProd);
        setLoading((prev) => ({ ...prev, products: false }));
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
      const accessoriesData = await AccessoriesService.fetchAccessoriesWithImages();
      setAccessories(accessoriesData);
    } catch (error) {
      setError((prev) => ({
        ...prev,
        accessories: (error as ErrorWithMessage).message || "An error occurred",
      }));
    } finally {
      setLoading((prevState) => ({ ...prevState, accessories: false }));
    }
  };

  useEffect(() => {
    if (accessories.length === 0) {
      fetchAccessoriesData();
    }
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      <HeadingBar buttonLink="/admin/products" heading="Add New Product" />
      <div className="flex flex-col lg:flex-row w-[90%] gap-6 mx-auto my-10">
        {isResSaving && <Loader message={currentStatus} />}
        {/* Details Section */}
        <form
          ref={formRef}
          onSubmit={handleSave}
          className="flex-1 bg-white p-6 shadow-md rounded-md"
        >
          <h2 className="text-2xl font-semibold mb-4">General Information</h2>
          <hr className="mb-6" />

          {/* Product Name and Price, Description Downpayment cost */}
          <div className="grid grid-cols-1 gap-4">
            <InputField
              id="productName"
              type="text"
              label="Product Name"
              placeholder="4000"
              name="productName"
              value={formValues.productName}
              onChange={handleInputChange}
              error={errors.productName}
            />
            <InputField
              id="productTitle"
              type="text"
              label="Product Title"
              placeholder="Drivable Dumpster For Derbis Removal"
              name="Product_Title__c"
              value={formValues.Product_Title__c}
              onChange={handleInputChange}
              error={errors.Product_Title__c}
            />
            <div className="mb-3">
              <label
                htmlFor="description"
                className="font-medium text-custom-gray "
              >
                Description
              </label>
              <textarea
                value={formValues.Product_Description__c}
                name="Product_Description__c"
                onChange={handleInputChange}
                className={`mt-1 font-arial block w-full text-xs p-2 border border-inset h-[111px] border-custom-gray-200 outline-none py-2 px-3 ${
                  errors.Product_Description__c
                    ? "border-red-500"
                    : "border-custom-gray-200"
                } `}
                placeholder="DescrGo beyond the standard scissor lift with the Equipter 4000 drivable dumpster. Originally designed as a self-propelled roofing trailer and known as one of the best roofing tools for debris management......."
              />
              <span className="text-red-500 h-6 text-[10px] font-bold">
                {errors.Product_Description__c}
              </span>
            </div>
            <InputField
              id="price"
              label="Price"
              type="number"
              placeholder="$8000"
              name="price"
              value={formValues.price}
              error={errors.price}
              onChange={handleInputChange}
            />
            <InputField
              id="Down_Payment_Cost__c"
              type="number"
              label="Down Payment Cost"
              placeholder="$1200"
              name="Down_Payment_Cost__c"
              value={formValues.Down_Payment_Cost__c}
              error={errors.Down_Payment_Cost__c}
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
              label="Product URL"
              placeholder="Generated URL"
              name="Product_URL__c"
              value={formValues.Product_URL__c.toLocaleLowerCase()}
              onChange={handleInputChange}
              error={errors.Product_URL__c}
              classes="text-gray-400 border-gray-200 bg-[#f9f9f9] text-[#666] border-[#ccc] cursor-not-allowed"
            />
          </div>

          {/* Accessories Section */}
          <hr className="my-6" />
          <h3 className="text-xl font-semibold mb-4">Accessories</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {accessories.map((accessory, index) => {
              console.log(accessory.Accesory_Images__r);
              const featuredImageUrl =
                accessory?.Accesory_Images__r?.records?.filter(
                  (data) => data.Is_Featured__c == true
                ) || [];
              return (
                <>
                  <label
                    key={index}
                    className="flex items-center space-x-2 bg-gray-50 p-3 rounded-md hover:bg-gray-100"
                  >
                    <input
                      type="checkbox"
                      className="h-5 w-5 text-blue-600"
                      onChange={() => handleAccessoryChange(accessory.Id)}
                    />

                    <span className="capitalize flex gap-1 items-center text-gray-700">
                      {featuredImageUrl.length > 0 &&
                        featuredImageUrl[0]?.Image_URL__c && (
                          <img
                            className="shadow-sm w-[30px] h-[30px] object-cover rounded border border-gray-300"
                            src={featuredImageUrl[0]?.Image_URL__c}
                            alt="Img"
                          />
                        )}
                      {accessory?.Name} -{" "}
                      <span className="text-gray-600 font-bold">
                        ${accessory?.Price__c}
                      </span>
                    </span>
                  </label>{" "}
                </>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex  justify-end space-x-4 mt-8">
            <button
              className="px-6 py-2 border border-gray-300 text-gray-600 rounded-md hover:bg-gray-100"
              onClick={() => nav("/admin/products")}
            >
              Cancel
            </button>
            <button
              className={`px-6 py-2 btn-yellow  rounded-md ${
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
          // className={`bg-white p-6 shadow-md flex-1 rounded-md space-y-4 ${
          //   images.length >= 3
          //     ? "max-h-auto overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300"
          //     : "h-"
          // }`}
          ref={imagesRef}
          className={`bg-white p-6 shadow-md flex-1 rounded-md space-y-4 h-fit overflow-auto `}
        >
          <h2 className="text-2xl font-semibold mb-4">Upload Images</h2>
          <hr className="mb-6" />

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
              Minimum one product image is required.
            </p>
          )}

          {/* All Images */}
          {images.length > 0 && (
            <>
              <h3 className="font-semibold text-lg mt-6">Product Images:</h3>
              <div className="flex flex-wrap gap-4 mt-6">
                {images.map((image, index) => (
                  <div
                    key={index}
                    className="relative w-[150px] h-[150px] border border-gray-200 rounded-md overflow-hidden cursor-pointer shadow-sm"
                  >
                    <img
                      src={URL.createObjectURL(image)}
                      alt="Product"
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
                    {featuredImage === image && (
                      <span className="absolute bottom-2 left-2 bg-custom-orange text-white text-xs px-2 py-1 rounded">
                        <FontAwesomeIcon icon={faStar} />
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
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

export default AddNewProduct;
