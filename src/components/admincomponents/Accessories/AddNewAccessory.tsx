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

const AddNewAccessory = () => {
  const nav = useNavigate();
  const [formValues, setFormValues] = useState<IAccessories>({
    description: "",
    name: "",
    price: "",
    quantity: "",
  });
  const { addNotification } = useNotification();
  const [errors, setErrors] = useState<IAccessories>({
    description: "",
    name: "",
    price: "",
    quantity: "",
  });
  // const [serverResponse, setServerResponse] = useState<{
  //   type: "error" | "info";
  //   message: string;
  // } | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<{
    url: string;
    index: number;
  } | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value ?? null });
    setErrors({ ...errors, [name]: null });
    // setServerResponse(null);
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter((file) =>
      file.type.startsWith("image/")
    );

    if (files.length !== (e.target.files || []).length) {
      // setServerResponse({
      //   type: "error",
      //   message: "Only image files are allowed.",
      // });
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
      console.log(updatedImages);
      if (index == 0 && updatedImages.length > 0) {
        setFeaturedImage(updatedImages[0]);
      } else if (updatedImages.length == 0) {
        console.log("call");
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
      price: Number(formValues.price),
      quantity: Number(formValues.quantity),
      // Product_Images__c:
      //   images.length > 0
      //     ? images.map((image) => URL.createObjectURL(image)).join(", ")
      //     : "",
    };

    const result = AccessoriesSchema.safeParse(accessoriesData);

    if (!result.success) {
      const newErrors: IAccessories = {
        description: "",
        name: "",
        price: "",
        quantity: "",
      };
      result.error.issues.forEach((issue) => {
        const fieldName = issue.path[0] as keyof IAccessories;
        newErrors[fieldName] = String(issue.message);
      });
      setErrors(newErrors);
      addNotification("error", "test");
      return;
    }

    const token = SfAccessToken;
    try {
      const response = await fetch(
        "/api//services/data/v52.0/sobjects/Accessory__c/",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            Name: formValues.name,
            Description__c: formValues.description,
            Price__c: Number(formValues.price),
            Quantity__c: Number(formValues.quantity),
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        addNotification("error", errorText);
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
        return;
      }

      const data = await response.json();
      console.log("Product created successfully:", data);
      addNotification("success", "Accessory added successfully");
      nav("/admin/accessories");
    } catch (error) {
      console.error("Error creating product:", error);
      addNotification("error", error.message);
    }
  };
  // const handleClosePortal = () => {
  //   setServerResponse(null);
  // };
 

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
        {/* Details section */}
        <div className="flex-1 bg-white p-5 shadow-md rounded-sm h-fit">
          <p className="font-roboto text-lg font-bold">General Information</p>
          <hr className="my-3 border-1 border-gray-400" />
          <form onSubmit={handleSave} className="grid my-1 grid-cols-1 gap-2">
            <InputField
              id="name"
              type="text"
              placeholder="Name"
              name="name"
              value={formValues.Name}
              onChange={handleInputChange}
              classes="!w-full"
              label="Name"
              error={errors.Name as string}
            />
            <div className="mb-3">
              <label htmlFor="desc" className="font-medium text-custom-gray ">
                Description
              </label>
              <textarea
                value={formValues.Description__c}
                name="description"
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
              name="price"
              value={formValues.Price__c as string}
              onChange={handleInputChange}
              error={errors.Price__c as string}
              classes="!w-full "
              label="Price"
            />
            <InputField
              id="quantity"
              type="number"
              placeholder="Quantity"
              name="quantity"
              value={formValues.Quantity__c as string}
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
                Save
              </button>
            </div>
          </form>
        </div>

        {/* Image section */}
        <div
          className={`bg-white p-5 shadow-md flex-1 rounded-sm space-y-3 ${
            images.length >= 3
              ? "h-[588px] overflow-y-scroll scrollbar-custom"
              : "h-fi"}`}>
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
            }`}
          >
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />
            <p className="text-center text-gray-500">
              {isUploading ? "Uploading images..." : "Click to upload images"}
            </p>
          </label>
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
                  }}>
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

export default AddNewAccessory;
