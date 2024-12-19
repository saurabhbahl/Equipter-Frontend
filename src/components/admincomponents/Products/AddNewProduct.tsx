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
import { useAdminContext } from "../../../hooks/useAdminContext";
import { ProductSchema, TImage } from "./ProductSchema";
import { useNotification } from "../../../contexts/NotificationContext";
import LoaderSpinner from "../../utils/LoaderSpinner";
import Loader from "../../utils/Loader";

import { apiClient } from "../../../utils/axios";

interface ExtendedFile extends File {
  markedForDeletion?: boolean;
  id?: string;
  image_url?: string;
}
// Initialize S3 client
const s3 = new S3Client({
  region: import.meta.env.VITE_AWS_REGION,
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  },
});

const AddNewProduct = () => {
  const navigate = useNavigate();
  const { addNotification } = useNotification();
  const {
    accessories,
    setAccessories,
    setProducts,
    setLoading,
  } = useAdminContext();

  // State for form inputs
  const [formValues, setFormValues] = useState({
    productName: "",
    price: "",
    qty: "",
    gvwr: "",
    liftCapacity: "",
    Product_Description__c: "",
    Product_Title__c: "",
    Meta_Title__c: "",
    Product_URL__c: "",
    liftHeight: "",
    container: "",
    Down_Payment_Cost__c: "",
  });

  // State for form errors
  // const [errors, setErrors] = useState({
  //   productName: "",
  //   price: "",
  //   gvwr: "",
  //   qty: "",
  //   liftCapacity: "",
  //   Product_Description__c: "",
  //   Product_Title__c: "",
  //   Meta_Title__c: "",
  //   Product_URL__c: "",
  //   liftHeight: "",
  //   container: "",
  //   Down_Payment_Cost__c: "",
  // });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // State for handling images
  const [images, setImages] = useState<ExtendedFile[]>([]);
  const [featuredImage, setFeaturedImage] = useState<TImage | null | File>(
    null
  );
  const [previewImage, setPreviewImage] = useState<{
    url: string;
    id: string;
    type: "new" | "existing";
  } | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imageUploadError, setImageUploadError] = useState(false);

  // State for handling submission
  const [isResSaving, setIsResSaving] = useState(false);
  const [currentStatus, setCurrentStatus] = useState("");

  // State for selected accessories
  const [selectedAccessoryIds, setSelectedAccessoryIds] = useState<string[]>(
    []
  );

  // Refs for form and images container
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const imagesRef = useRef<HTMLDivElement | null>(null);
  const [formHeight, setFormHeight] = useState(0);

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
        updatedValues.Product_URL__c = value
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-");

        setErrors((prevErrors) => ({
          ...prevErrors,
          Product_URL__c: "",
        }));
      }

      return updatedValues;
    });

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  /**
   * Handle accessory selection
   */
  const handleAccessoryChange = (accessoryId: string) => {
    setSelectedAccessoryIds((prev) =>
      prev.includes(accessoryId)
        ? prev.filter((id) => id !== accessoryId)
        : [...prev, accessoryId]
    );
  };

  /**
   * Handle image uploads
   */
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

  /**
   * Set a new featured image
   */
  const setAsFeaturedImage = (id: string, type: "new" | "existing") => {
    if (type === "new") {
      const image = images.find((_, index) => index.toString() === id);
      if (image) {
        setFeaturedImage(image);
      }
    }
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
        const nextFeatured = updatedImages[0] || null;
        setFeaturedImage(nextFeatured);
      }
      return updatedImages;
    });
    setPreviewImage(null);

    // Check if there are no images left
    if (images.length - 1 === 0) {
      setImageUploadError(true);
    }
  };

  /**
   * Open image preview modal
   */
  const openImagePreview = (
    image: string,
    id: string,
    type: "new" | "existing"
  ) => {
    setPreviewImage({ url: image, id, type });
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

  /**
   * Handle form submission to add a new product
   */
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = ProductSchema.safeParse(formValues);

    // Check if at least one image is uploaded
    if (images.length === 0) {
      setImageUploadError(true);
    }

    // Validate form inputs
    if (!validation.success) {
      const newErrors: any = {
        productName: "",
        price: "",
        gvwr: "",
        qty: "",
        liftCapacity: "",
        Product_Description__c: "",
        Product_Title__c: "",
        Meta_Title__c: "",
        Product_URL__c: "",
        liftHeight: "",
        container: "",
        Down_Payment_Cost__c: "",
      };
      validation.error.issues.forEach((issue) => {
        const fieldName = issue.path[0];
        newErrors[fieldName] = issue.message;
      });
      setErrors(newErrors as any);
      return;
    }

    // Check if at least one image is uploaded
    if (images.length === 0) {
      setImageUploadError(true);
      addNotification("error", "At least one product image is required.");
      return;
    }

    const slug: string = formValues.Product_URL__c;

    // Validate slug uniqueness
    try {
      const slugCheckResponse = await apiClient.get(
        `/product/slug?slug=${slug}`
      );
      if (!slugCheckResponse.data.success) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          Product_URL__c:
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
    setCurrentStatus("Creating product...");

    try {
      // Step 1: Create the product
      const productData = {
        name: formValues.productName,
        price: parseFloat(formValues.price),
        downpayment_cost: parseFloat(formValues.Down_Payment_Cost__c),
        gvwr: parseFloat(formValues.gvwr),
        stock_quantity: formValues.qty,
        lift_capacity: parseFloat(formValues.liftCapacity),
        lift_height: parseFloat(formValues.liftHeight),
        meta_title: formValues.Meta_Title__c,
        product_url: formValues.Product_URL__c,
        description: formValues.Product_Description__c,
        product_title: formValues.Product_Title__c,
        container_capacity: formValues.container,
      };

      const createProductResponse = await apiClient.post(
        `/product`,
        productData
      );
      const newProduct = createProductResponse.data.data;
      console.log(newProduct);

      // Step 2: Attach accessories
      setCurrentStatus("Attaching accessories...");
      await attachAccessories(newProduct[0].id);

      // Step 3: Upload images to S3 and save image URLs
      setCurrentStatus("Uploading images...");
      await uploadImages(newProduct[0].id);

      setCurrentStatus("Finalizing...");
      addNotification("success", "Product added successfully!");

      // Refresh the product list
      setLoading((prev) => ({ ...prev, products: true }));
      const updatedProducts = await apiClient.get("/product");
      setProducts(updatedProducts.data.data);
      setLoading((prev) => ({ ...prev, products: false }));

      navigate("/admin/products");
    } catch (error) {
      console.error("Error adding product:", error);
      addNotification("error", "Failed to add product. Please try again.");
    } finally {
      setIsResSaving(false);
      setCurrentStatus("");
    }
  };

  /**
   * Attach selected accessories to the product
   */
  const attachAccessories = async (productId: string) => {
    if (selectedAccessoryIds.length === 0) return;

    try {
      await Promise.all(
        selectedAccessoryIds.map((accId) =>
          apiClient.post(`/accessory/accessory-products`, {
            product_id: productId,
            accessory_id: accId,
          })
        )
      );
    } catch (error) {
      console.error("Error attaching accessories:", error);
      throw new Error("Failed to attach some accessories.");
    }
  };

  /**
   * Upload images to S3 and save their URLs as product images
   */
  const uploadImages = async (productId: string) => {
    if (images.length === 0) return;

    try {
      const uploadedImages = await Promise.all(
        images.map(async (image) => {
          const imageUrl = await uploadImageToS3(image);
          const isFeatured = featuredImage === image;
          const response = await apiClient.post(`/product/product-images`, {
            product_id: productId,
            image_url: imageUrl,
            is_featured: isFeatured,
            image_descripton: formValues.productName,
          });
          return response.data.data;
        })
      );

      // Ensure at least one image is featured
      const hasFeaturedImage = uploadedImages.some(
        (img: any) => img.is_featured
      );
      if (!hasFeaturedImage && uploadedImages.length > 0) {
        // Set the first uploaded image as featured
        await apiClient.put(`/product/product-images/${uploadedImages[0].id}`, {
          is_featured: true,
        });
      }
    } catch (error) {
      console.error("Error uploading images:", error);
      throw new Error("Failed to upload some images.");
    }
  };

  /**
   * Fetch accessories data from the API
   */
  const fetchAccessoriesData = async () => {
    setLoading((prev) => ({ ...prev, accessories: true }));
    try {
      const accessoriesData = await apiClient.get(`/accessory`);
      setAccessories(accessoriesData.data.data);
    } catch (error) {
      console.error("Error fetching accessories:", error);
      addNotification("error", "Failed to fetch accessories.");
    } finally {
      setLoading((prev) => ({ ...prev, accessories: false }));
    }
  };

  // Fetch accessories on component mount if not already fetched
  useEffect(() => {
    if (accessories.length === 0) {
      fetchAccessoriesData();
    }
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      <HeadingBar buttonLink="/admin/products" heading="Add New Product" />
      <div className="flex flex-col-reverse lg:flex-row w-[90%] gap-6 mx-auto my-10">
        {isResSaving && <Loader message={currentStatus} />}
        {/* Details Section */}
        <form
          ref={formRef}
          onSubmit={handleSave}
          className="flex-1 bg-white p-6 shadow-md rounded-md"
        >
          <h2 className="text-2xl font-semibold mb-4">General Information</h2>
          <hr className="mb-6" />

          {/* Product Name, Title, Description, Price, Downpayment Cost */}
          <div className="grid grid-cols-1 gap-4">
            <InputField
              id="productName"
              type="text"
              label="Product Name"
              placeholder="e.g. 3300"
              name="productName"
              value={formValues.productName}
              onChange={handleInputChange}
              error={errors.productName}
            />
            <InputField
              id="productTitle"
              type="text"
              label="Product Title"
              placeholder="e.g. Drivable Dumpster For Debris Removal"
              name="Product_Title__c"
              value={formValues.Product_Title__c}
              onChange={handleInputChange}
              error={errors.Product_Title__c}
            />
            {/* Description */}
            <div className="mb-3">
              <label
                htmlFor="description"
                className="font-medium text-custom-gray"
              >
                Description
              </label>
              <textarea
                value={formValues.Product_Description__c}
                name="Product_Description__c"
                onChange={handleInputChange}
                maxLength={600}
                className={`mt-1 font-arial block w-full text-xs p-2 border h-[111px] border-custom-gray-200 outline-none ${
                  errors.Product_Description__c
                    ? "border-red-500"
                    : "border-custom-gray-200"
                }`}
                placeholder={`e.g. Do you want the functionality of a boom lift with the transportability of a trailer? Equipter is excited to announce the release of the Equipter 7000! This unit can be towed to a job site and, using its telescoping boom, can lift a debris container 25'-5" or optional forks 23'-5". This one-hitch multi-tool is remote controlled and has multiple steering modes to position the 7000 right where it is needed....`}
              />
              {errors.Product_Description__c && (
                <span className="text-red-500 h-6 text-[10px] font-bold">
                  {errors.Product_Description__c}
                </span>
              )}
            </div>

            <InputField
              id="price"
              label="Price"
              type="number"
              placeholder="e.g. 15000"
              name="price"
              value={formValues.price}
              error={errors.price}
              onChange={handleInputChange}
            />
            <InputField
              id="Down_Payment_Cost__c"
              type="number"
              label="Down Payment Cost"
              placeholder="e.g. 2500"
              name="Down_Payment_Cost__c"
              value={formValues.Down_Payment_Cost__c}
              error={errors.Down_Payment_Cost__c}
              onChange={handleInputChange}
            />
            <InputField
              id="qty"
              type="number"
              label="Stock"
              placeholder="e.g. 90"
              name="qty"
              value={formValues.qty}
              error={errors.qty}
              onChange={handleInputChange}
            />
          </div>

          {/* GVWR and Lift Capacity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            <InputField
              id="gvwr"
              label="GVWR (lbs)"
              placeholder="e.g. 7500"
              type="number"
              name="gvwr"
              value={formValues.gvwr}
              onChange={handleInputChange}
              error={errors.gvwr}
            />

            <InputField
              label="Lift Capacity (lbs)"
              placeholder="e.g. 7500"
              id="liftCapacity"
              type="number"
              name="liftCapacity"
              error={errors.liftCapacity}
              value={formValues.liftCapacity}
              onChange={handleInputChange}
            />
          </div>

          {/* Lift Height and Container */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            <InputField
              id="liftHeight"
              label="Lift Height (ft.in.)"
              placeholder="e.g. 12.9 (12ft 9inches)"
              type="text"
              name="liftHeight"
              error={errors.liftHeight}
              value={formValues.liftHeight}
              onChange={handleInputChange}
            />

            <InputField
              label="Container (cu. yds.)"
              placeholder="e.g. 4.1"
              id="container"
              type="text"
              name="container"
              error={errors.container}
              value={formValues.container}
              onChange={handleInputChange}
            />
          </div>

          {/* Additional Information */}
          <h2 className="text-2xl font-semibold my-4 mb-2">
            Additional Information
          </h2>
          <hr className="mb-3" />
          {/* Meta Title and Slug */}
          <div className="grid grid-cols-1 gap-4">
            <InputField
              id="metatitle"
              type="text"
              label="Meta Title"
              placeholder="e.g. Equipter 3300"
              name="Meta_Title__c"
              value={formValues.Meta_Title__c}
              onChange={handleInputChange}
              error={errors.Meta_Title__c}
            />
            <InputField
              id="producturl"
              type="text"
              readonly
              label="Product URL"
              placeholder="e.g. equipter-3300"
              name="Product_URL__c"
              value={formValues.Product_URL__c.toLowerCase()}
              onChange={handleInputChange}
              error={errors.Product_URL__c}
              classes="text-gray-400 border-gray-200 bg-[#f9f9f9] text-[#666] border-[#ccc] cursor-not-allowed"
            />
          </div>

          {/* Accessories Section */}
          <hr className="my-6" />
          <h3 className="text-xl font-semibold mb-4">Accessories</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {accessories?.map((accessory) => (
              <label
                key={accessory.id}
                className="flex items-center space-x-2 bg-gray-50 p-3 rounded-md hover:bg-gray-100"
              >
                <input
                  type="checkbox"
                  className="h-5 w-5 text-blue-600"
                  checked={selectedAccessoryIds.includes(accessory.id)}
                  onChange={() => handleAccessoryChange(accessory.id)}
                />
                <span className="capitalize text-gray-700">
                  {accessory.name} -{" "}
                  <span className="text-gray-600 font-bold">
                    ${Number(accessory.price).toFixed(2)}
                  </span>
                </span>
              </label>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 mt-8">
            <button
              className="px-6 py-2 border border-gray-300 text-gray-600 rounded-md hover:bg-gray-100"
              onClick={() => navigate("/admin/products")}
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
                  src={
                    featuredImage instanceof File
                      ? URL.createObjectURL(featuredImage)
                      : featuredImage?.image_url
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
            <p className="text-sm text-red-500">
              At least one product image is required.
            </p>
          )}

          {/* Uploaded Images */}
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
                      onClick={() =>
                        openImagePreview(
                          URL.createObjectURL(image),
                          index.toString(),
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
                          index.toString(),
                          "new"
                        );
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

          {/* Full Screen Image Preview */}
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
                        setAsFeaturedImage(previewImage.id, previewImage.type)
                      }
                    >
                      <FontAwesomeIcon icon={faStar} /> Make Featured Image
                    </button>
                    <button
                      className="bg-gray-600 text-white px-4 py-2 rounded-md"
                      onClick={() => {
                        if (previewImage.type === "new") {
                          const index = images.findIndex(
                            (_, idx) => idx.toString() === previewImage.id
                          );
                          if (index !== -1) {
                            removeImage(index);
                          }
                        }
                        // If existing images are handled in AddNewProduct, adjust accordingly
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

export default AddNewProduct;
