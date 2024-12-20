import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactDOM from "react-dom";
import {
  faEdit,
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
import { useAdminContext } from "../../../hooks/useAdminContext";
import { ProductSchema } from "./ProductSchema";
import { useNotification } from "../../../contexts/NotificationContext";
import LoaderSpinner from "../../utils/LoaderSpinner";
import Loader from "../../utils/Loader";

import { apiClient } from "../../../utils/axios";

// Type Definitions
interface IProductInputValues {
  productName: string;
  price: string;
  qty: string;
  gvwr: string;
  liftCapacity: string;
  Product_Description__c: string;
  Product_Title__c: string;
  Meta_Title__c: string;
  Product_URL__c: string;
  liftHeight: string;
  container: string;
  Down_Payment_Cost__c: string;
}
interface ExtendedFile extends File {
  markedForDeletion?: boolean;
  id?: string;
  image_url?: string;
}

interface ExistingImage {
  id: string;
  image_url: string;
  is_featured: boolean;
  markedForDeletion?: boolean;
}

interface PreviewImage {
  url: string;
  id: string;
  type: "new" | "existing";
}

// Initialize S3 client
const s3 = new S3Client({
  region: import.meta.env.VITE_AWS_REGION,
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  },
});

const EditProduct = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addNotification } = useNotification();
  const {
    accessories,
    setAccessories,
    setProducts,
    setLoading,
  } = useAdminContext();

  // State for form inputs
  const [formValues, setFormValues] = useState<IProductInputValues>({
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
  });

  // State for form errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // State for handling images
  const [existingImages, setExistingImages] = useState<ExistingImage[]>([]);
  const [newImages, setNewImages] = useState<ExtendedFile[]>([]);
  const [featuredImage, setFeaturedImage] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<PreviewImage | null>(null);
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
  const [existingAccessoryIds, setExistingAccessoryIds] = useState<string[]>(
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
  }, [existingImages, newImages]);

  // Fetch product details on mount
  useEffect(() => {
    if (id) {
      fetchProductDetails();
    }
    if (accessories.length == 0) {
      (async () => {
        const res = await apiClient.get("/accessory");
        setAccessories(res.data.data);
      })();
    }
    // Cleanup object URLs on unmount
    return () => {
      // newImages.forEach((image) => URL.revokeObjectURL(URL.createObjectURL(image.name)));
      newImages.forEach((image) => URL.revokeObjectURL(image.name));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  /**
   * Fetch product details from API and populate form
   */
  const fetchProductDetails = async () => {
    setLoading((prev) => ({ ...prev, products: true }));
    try {
      const productResponse = await apiClient.get(`/product/${id}`);
      const productDetail = productResponse.data.data;

      const {
        name,
        description,
        stock_quantity,
        price,
        container_capacity,
        downpayment_cost,
        gvwr,
        lift_height,
        product_title,
        product_url,
        meta_title,
        lift_capacity,
        images,
        accessories: productAccessories,
      } = productDetail;

      // Set form values
      setFormValues({
        qty: stock_quantity,
        productName: name,
        Product_Description__c: description,
        Product_Title__c: product_title,
        Meta_Title__c: meta_title,
        Product_URL__c: product_url,
        price: price.toString(),
        Down_Payment_Cost__c: downpayment_cost
          ? downpayment_cost.toString()
          : "",
        gvwr: gvwr ? gvwr.toString() : "",
        liftCapacity: lift_capacity ? lift_capacity.toString() : "",
        liftHeight: lift_height ? lift_height.toString() : "",
        container: container_capacity || "",
      });

      // Set existing images
      const formattedExistingImages: ExistingImage[] = images.map(
        (img: any) => ({
          id: img.id,
          image_url: img.image_url,
          is_featured: img.is_featured,
          markedForDeletion: false,
        })
      );
      setExistingImages(formattedExistingImages);

      // Set the featured image
      const featuredImg = formattedExistingImages.find(
        (img) => img.is_featured
      );
      setFeaturedImage(featuredImg ? featuredImg.id : null);

      // Set selected accessories
      const selectedAccessories = productAccessories.map((acc: any) => acc.id);
      setSelectedAccessoryIds(selectedAccessories);
      setExistingAccessoryIds(selectedAccessories);

      setLoading((prev) => ({ ...prev, products: false }));
    } catch (error) {
      console.error("Error fetching product details:", error);
      addNotification("error", "Failed to load product details.");
      setLoading((prev) => ({ ...prev, products: false }));
    }
  };

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
      }
      setErrors((prevErrors) => ({
        ...prevErrors,
        Product_URL__c: "",
      }));
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
   * Handle image uploads (new images)
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
        setNewImages((prevImages) => {
          const updatedImages = [...prevImages, ...files];
          // If no featured image is set, set the first new image as featured
          if (!featuredImage && updatedImages.length > 0) {
            // Using a temporary unique identifier for the new featured image
            setFeaturedImage(`new-${prevImages.length}`);
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
      // For new images, the id is in the format `new-{index}`
      setFeaturedImage(id);
    } else {
      // For existing images, the id is the image's unique ID
      setFeaturedImage(id);
    }
    closeImagePreview();
  };

  /**
   * Remove a new image from the list
   */
  const removeNewImage = (index: number) => {
    setNewImages((prevImages) => {
      // const removedImage = prevImages[index];
      const updatedImages = prevImages.filter((_, i) => i !== index);
      // If the removed image was featured, set a new featured image
      if (featuredImage === `new-${index}`) {
        if (updatedImages.length > 0) {
          setFeaturedImage(`new-${0}`);
        } else {
          const existingFeatured = existingImages.find(
            (img) => img.is_featured
          );
          setFeaturedImage(existingFeatured ? existingFeatured.id : null);
        }
      }
      return updatedImages;
    });
    setPreviewImage(null);

    // Check if there are no images left
    const totalImages =
      existingImages.filter((img) => !img.markedForDeletion).length +
      (newImages.length - 1);
    if (totalImages === 0) {
      setImageUploadError(true);
      addNotification("error", "At least one product image is required.");
    }
  };

  /**
   * Remove an existing image (mark for deletion)
   */
  const removeExistingImage = (imageId: string) => {
    setExistingImages((prevImages) =>
      prevImages.map((img) =>
        img.id === imageId ? { ...img, markedForDeletion: true } : img
      )
    );

    // If the removed image was featured, set a new featured image
    if (featuredImage === imageId) {
      const nextFeatured = existingImages.find(
        (img) => img.id !== imageId && !img.markedForDeletion
      );
      setFeaturedImage(nextFeatured ? nextFeatured.id : null);
    }

    // Check if there are no images left
    const totalImages =
      existingImages.filter((img) => !img.markedForDeletion).length +
      newImages.length;
    if (totalImages === 0) {
      setImageUploadError(true);
      addNotification("error", "At least one product image is required.");
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
   * Handle form submission to edit the product
   */

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const totalImages =
      existingImages.filter((img) => !img.markedForDeletion).length +
      newImages.length;

    if (totalImages < 1) {
      setImageUploadError(true);
      addNotification("error", "At least one product image is required.");
      return;
    } else {
      setImageUploadError(false);
    }
    const validation = ProductSchema.safeParse(formValues);
    if (!validation.success) {
      const validationErrors = validation.error.issues.reduce(
        (acc, issue) => ({
          ...acc,
          [issue.path[0] as keyof IProductInputValues]: issue.message,
        }),
        {}
      );
      setErrors(validationErrors);
      return;
    }

    const slug: string = formValues.Product_URL__c;

    // Validate slug uniqueness
    try {
      const slugCheckResponse = await apiClient.get(
        `/product/slug?slug=${slug}&id=${id}`
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

    try {
      setIsResSaving(true);
      setCurrentStatus("Saving product details...");

      // Update product details
      const productData = {
        name: formValues.productName,
        price: parseFloat(formValues.price),
        downpayment_cost: parseFloat(formValues.Down_Payment_Cost__c),
        gvwr: parseFloat(formValues.gvwr),
        stock_quantity: formValues.qty,
        lift_capacity: parseFloat(formValues.liftCapacity),
        lift_height: formValues.liftHeight,
        meta_title: formValues.Meta_Title__c,
        product_url: formValues.Product_URL__c,
        description: formValues.Product_Description__c,
        product_title: formValues.Product_Title__c,
        container_capacity: formValues.container,
      };
      await apiClient.put(`/product/${id}`, productData);

      // Update accessories
      setCurrentStatus("Updating accessories...");
      await updateAccessories();

      // Handle images
      setCurrentStatus("Updating images...");
      await handleImageUpdates();
      const newProd = await apiClient.get("/product");
      setProducts(newProd.data.data);
      addNotification("success", "Product updated successfully!");
      navigate("/admin/products");
    } catch (error) {
      console.error("Error saving product:", error);
      addNotification("error", "Failed to save product.");
    } finally {
      setIsResSaving(false);
      setCurrentStatus("");
    }
  };

  /**
   * Attach and detach accessories based on user selection
   */
  const updateAccessories = async () => {
    const accessoriesToAdd = selectedAccessoryIds.filter(
      (accId) => !existingAccessoryIds.includes(accId)
    );
    const accessoriesToDelete = existingAccessoryIds.filter(
      (accId) => !selectedAccessoryIds.includes(accId)
    );

    // Delete accessory associations
    if (accessoriesToDelete.length > 0) {
      try {
        await Promise.all(
          accessoriesToDelete.map((accId) =>
            apiClient.delete(
              `/accessory/accessory-products/?aId=${accId}&pId=${id}`
            )
          )
        );
      } catch (error) {
        console.error("Error deleting accessories:", error);
        throw new Error("Failed to delete some accessories.");
      }
    }

    // Add accessory associations
    if (accessoriesToAdd.length > 0) {
      try {
        await Promise.all(
          accessoriesToAdd.map((accId) =>
            apiClient.post(`/accessory/accessory-products`, {
              product_id: id,
              accessory_id: accId,
            })
          )
        );
      } catch (error) {
        console.error("Error adding accessories:", error);
        throw new Error("Failed to add some accessories.");
      }
    }
  };

  /**
   * Handle image updates: delete marked images, upload new images, and ensure a featured image exists
   */

  const handleImageUpdates = async () => {
    // Step 1: Delete marked images
    const imagesToDelete = existingImages.filter(
      (img) => img.markedForDeletion
    );
    if (imagesToDelete.length > 0) {
      try {
        // Delete from S3
        const imageUrls = imagesToDelete.map((img) => img.image_url);
        await deleteImagesFromS3(imageUrls);

        // Delete from Database
        await Promise.all(
          imagesToDelete.map((img) =>
            apiClient.delete(`/product/product-images/${img.id}`)
          )
        );
      } catch (error) {
        console.error("Error deleting images:", error);
        throw new Error("Failed to delete some images.");
      }
    }

    // Step 2: Unset `is_featured` for all existing images
    try {
      const imgRes = await Promise.all(
        existingImages
          .filter((img) => !img.markedForDeletion && img.is_featured)
          .map((img) =>
            apiClient.put(`/product/product-images/${img.id}`, {
              is_featured: false,
            })
          )
      );
      console.log(imgRes);
    } catch (error) {
      console.error("Error unsetting existing featured images:", error);
      throw new Error("Failed to unset existing featured images.");
    }

    // Step 3: Upload new images to S3 and save in the database
    if (newImages.length > 0) {
      try {
        await Promise.all(
          newImages.map(async (image, index) => {
            const imageUrl = await uploadImageToS3(image);
            const isFeatured = featuredImage === `new-${index}`;
            await apiClient.post(`/product/product-images`, {
              product_id: id,
              image_url: imageUrl,
              is_featured: isFeatured,
            });
          })
        );
      } catch (error) {
        console.error("Error uploading new images:", error);
        throw new Error("Failed to upload new images.");
      }
    }

    // Step 4: Set the featured image for an existing image if applicable
    if (featuredImage && !featuredImage.startsWith("new-")) {
      try {
        await apiClient.put(`/product/product-images/${featuredImage}`, {
          is_featured: true,
        });
      } catch (error) {
        console.error("Error setting featured image:", error);
        throw new Error("Failed to set the featured image.");
      }
    }
  };

  /**
   * Delete multiple images from S3
   */
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
    await s3.send(command);
    console.log("Deleted images from S3:", objectsToDelete);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <HeadingBar buttonLink="/admin/products" heading="Edit Product" />
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
                className="font-medium text-custom-gray "
              >
                Description
              </label>
              <textarea
                value={formValues.Product_Description__c}
                name="Product_Description__c"
                maxLength={600}
                onChange={handleInputChange}
                className={`mt-1 font-arial block w-full text-xs p-2 border border-inset h-[111px] border-custom-gray-200 outline-none py-2 px-3 ${
                  errors.Product_Description__c
                    ? "border-red-500"
                    : "border-custom-gray-200"
                } `}
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
              type="number"
              label="GVWR (lbs)"
              placeholder="e.g. 7500"
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
                  className="form-checkbox text-black w-fit h-fit !p-0"
                  checked={selectedAccessoryIds.includes(accessory.id)}
                  onChange={() => handleAccessoryChange(accessory.id)}
                />
                <div className="capitalize flex w-full justify-between text-gray-700">
                  <div>
                  {accessory.name} -{" "}
                    
                  <span className="text-gray-600 font-bold">
                    ${Number(accessory.price).toFixed(2)}
                  </span>
                  </div>
                  <span className="cursor-pointer hover:scale-105" onClick={()=>{
          
                    navigate(`/admin/accessories/edit/${accessory.id}`)
                  }}>
                    <FontAwesomeIcon icon={faEdit}/>
                  </span>
                </div>
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
          <h2 className="text-2xl font-semibold mb-2">Upload Images</h2>
          <hr className="mb-6" />

          {/* Featured Image */}
          {featuredImage && (
            <>
              <h3 className="font-semibold text-lg mb-2">Featured Image:</h3>
              <div className="relative w-full h-[358px] mb-6">
                <img
                  src={
                    featuredImage.startsWith("new-")
                      ? URL.createObjectURL(
                          newImages[parseInt(featuredImage.split("-")[1])]
                        )
                      : existingImages.find((img) => img.id === featuredImage)
                          ?.image_url || ""
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

          {/* Existing Images */}
          {existingImages.filter((img) => !img.markedForDeletion).length >
            0 && (
            <>
              <h3 className="font-semibold text-lg mt-6">Existing Images:</h3>
              <div className="flex flex-wrap gap-4 mt-4">
                {existingImages
                  .filter((img) => !img.markedForDeletion)
                  .map((image) => (
                    <div
                      key={image.id} // Use unique key based on image ID
                      className="relative w-[150px] h-[150px] border border-gray-200 rounded-md overflow-hidden cursor-pointer shadow-sm"
                    >
                      <img
                        src={image.image_url}
                        alt="Product"
                        className="w-full h-full object-cover"
                        onClick={() =>
                          openImagePreview(
                            image.image_url,
                            image.id,
                            "existing"
                          )
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
                          openImagePreview(
                            image.image_url,
                            image.id,
                            "existing"
                          );
                        }}
                      >
                        <FontAwesomeIcon icon={faExpand} />
                      </button>
                      {featuredImage === image.id && (
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
          {newImages.length > 0 && (
            <>
              <h3 className="font-semibold text-lg mt-6">New Images:</h3>
              <div className="flex flex-wrap gap-4 mt-4">
                {newImages.map((image, index) => {
                  const tempId = `new-${index}`;
                  return (
                    <div
                      key={tempId} // Unique temporary ID for new images
                      className="relative w-[150px] h-[150px] border border-gray-200 rounded-md overflow-hidden cursor-pointer shadow-sm"
                    >
                      <img
                        src={URL.createObjectURL(image)}
                        alt="Product"
                        className="w-full h-full object-cover"
                        onClick={() =>
                          openImagePreview(
                            URL.createObjectURL(image),
                            tempId,
                            "new"
                          )
                        }
                      />
                      <button
                        className="absolute top-2 right-2 bg-white bg-opacity-75 text-red-600 text-md hover:text-red-800 rounded-full p-1"
                        title="Delete"
                        onClick={(e) => {
                          e.stopPropagation();

                          removeNewImage(index);
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
                            tempId,
                            "new"
                          );
                        }}
                      >
                        <FontAwesomeIcon icon={faExpand} />
                      </button>
                      {featuredImage === tempId && (
                        <span className="absolute bottom-2 left-2 bg-custom-orange text-white text-xs px-2 py-1 rounded">
                          <FontAwesomeIcon icon={faStar} />
                        </span>
                      )}
                    </div>
                  );
                })}
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
                        closeImagePreview();
                        if (previewImage.type === "new") {
                          const index = newImages.findIndex(
                            (_, idx) => `new-${idx}` === previewImage.id
                          );
                          if (index !== -1) {
                            removeNewImage(index);
                          }
                        } else {
                          removeExistingImage(previewImage.id);
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

export default EditProduct;
