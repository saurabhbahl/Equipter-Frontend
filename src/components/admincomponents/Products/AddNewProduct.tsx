import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faRemove,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useState, ChangeEvent, useRef } from "react";
import InputField from "../../utils/InputFeild";
import { SfAccessToken } from "../../../utils/useEnv";

type Accessory = { label: string; price: string };
type FormValues = {
  productName: string;
  subtitle: string;
  price: string;
  gvwr: string;
  liftCapacity: string;
  liftHeight: string;
  container: string;
  accessories: Accessory[];
};

const AddNewProduct = () => {
  const nav = useNavigate();

  const accessories: Accessory[] = [
    { label: "8' Roof Chute", price: "$165" },
    { label: "8' Gutter Protector", price: "$154" },
    { label: "Rear Extension Kit", price: "$489" },
    { label: "2 x 6 Track Mat", price: "$329" },
    { label: "18' x 18' Outrigger Pad", price: "$79" },
    { label: "Tire Sealant Kit", price: "$195" },
    { label: "Roofing Accessories Package", price: "$995" },
    { label: "Premium Accessories Package", price: "$2675" },
  ];

  const [formValues, setFormValues] = useState<FormValues>({
    productName: "",
    subtitle: "",
    price: "",
    gvwr: "",
    liftCapacity: "",
    liftHeight: "",
    container: "",
    accessories: [],
  });

  const [images, setImages] = useState<File[]>([]);


  const [isUploading, setIsUploading] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };
  const timeoutRef = useRef<number | null>(null);
 
  const handleAccessoryChange = (
    e: ChangeEvent<HTMLInputElement>,
    accessory: Accessory
  ) => {
    const isChecked = e.target.checked;
    setFormValues((prevValues) => {
      const updatedAccessories = isChecked
        ? [...prevValues.accessories, accessory]
        : prevValues.accessories.filter((acc) => acc.label !== accessory.label);
      return { ...prevValues, accessories: updatedAccessories };
    });
  };

 
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length > 0) {
      setIsUploading(true);

      // Clear previous timeout if it exists
      if (timeoutRef.current) {
        console.log("call");
        clearTimeout(timeoutRef.current);
      }

      //  image upload 
      timeoutRef.current = setTimeout(() => {
        setImages((prevImages) => [...prevImages, ...files]);
        setIsUploading(false);
      }, 400);
    }
  };

  const removeImage = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleImageClick = (index: number) => {
    if (index === 0) return;
    const newImages = [...images];
    const selectedImage = newImages.splice(index, 1)[0];
    setImages([selectedImage, ...newImages]);
  };

  const handleSave = async () => {
    const productData = {
      Name: formValues.productName,
      Product_Price__c: parseFloat(formValues.price),
      Down_Payment_Cost__c: 30.0,
      GVWR__c: parseFloat(formValues.gvwr),
      Lift_Capacity__c: parseFloat(formValues.liftCapacity),
      Lift_Height__c: parseFloat(formValues.liftHeight),
      Container__c: formValues.container,
      Product_Images__c:
        images.length > 0
          ? images.map((image) => URL.createObjectURL(image)).join(", ")
          : "",
    };

    const token = SfAccessToken;
    try {
      const response = await fetch(
        "/api/services/data/v52.0/sobjects/Product__c/",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(productData),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }

      const data = await response.json();
      console.log("Product created successfully:", data);
      nav("/admin/products");
    } catch (error:any) {
      console.error("Error creating product:", error);
      alert("Failed to create product: " + error.message);
    }
  };

  return (
    <div className="bg-[#F6F8FF] min-h-screen">
      {/* TopBar */}
      <section className="bg-custom-cream w-full p-4">
        <div className="flex gap-3">
          <div className="py-1">
            <button
              onClick={() => nav("/admin/products")}
              className="flex border border-black text-black items-center hover:bg-gray-200"
            >
              <FontAwesomeIcon
                icon={faArrowLeft}
                className="m-3 font-bold text-xl"
              />
            </button>
          </div>
          <div>
            <p className="text-sm font-sans">Back To List</p>
            <p className="font-bold text-xl mt-0.5">Add New Product</p>
          </div>
        </div>
      </section>

      {/* Product Details */}
      <div className="flex w-[90%] gap-6 mx-auto my-10">
        {/* General Information */}
        <div className="flex-1 bg-white p-5 shadow-md rounded-md">
          <p className="font-roboto text-lg font-bold">General Information</p>
          <hr className="my-3 border-1 border-gray-400" />

          {/* Product Name */}
          <p className="font-medium my-3">Product Name</p>
          <div className="grid my-1 grid-cols-2 gap-2">
            <InputField
              id="productName"
              type="text"
              placeholder="Enter Product Name"
              name="productName"
              value={formValues.productName}
              onChange={handleInputChange}
              classes="!w-full"
            />
            <InputField
              id="subtitle"
              type="text"
              placeholder="Subtitles"
              name="subtitle"
              value={formValues.subtitle}
              onChange={handleInputChange}
              classes="!w-full"
            />
          </div>

          {/* Price */}
          <p className="font-medium my-3">Price</p>
          <InputField
            id="price"
            type="text"
            placeholder="Enter Price"
            name="price"
            value={formValues.price}
            onChange={handleInputChange}
            classes="!w-full"
          />

          {/* Specifications */}
          <div className="grid grid-cols-4 gap-4 my-5">
            <div>
              <p className="font-medium">GVWR</p>
              <InputField
                id="gvwr"
                type="text"
                placeholder="7,500 Lbs"
                name="gvwr"
                value={formValues.gvwr}
                onChange={handleInputChange}
                classes="!w-full"
              />
            </div>
            <div>
              <p className="font-medium">Lift Capacity</p>
              <InputField
                id="liftCapacity"
                type="text"
                placeholder="4,000 Lbs"
                name="liftCapacity"
                value={formValues.liftCapacity}
                onChange={handleInputChange}
                classes="!w-full"
              />
            </div>
            <div>
              <p className="font-medium">Lift Height</p>
              <InputField
                id="liftHeight"
                type="text"
                placeholder="12' 0\"
                name="liftHeight"
                value={formValues.liftHeight}
                onChange={handleInputChange}
                classes="!w-full"
              />
            </div>
            <div>
              <p className="font-medium">Container</p>
              <InputField
                id="container"
                type="text"
                placeholder="4.1 Cu Yds"
                name="container"
                value={formValues.container}
                onChange={handleInputChange}
                classes="!w-full"
              />
            </div>
          </div>

          {/* Accessories Section */}
          <p className="font-medium my-3">Accessories</p>
          <div className="grid grid-cols-2 gap-2 my-3">
            {accessories.map((accessory, index) => (
              <label key={index} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="h-4 w-4"
                  onChange={(e) => handleAccessoryChange(e, accessory)}
                />
                <span>
                  {accessory.label} -{" "}
                  <span className="text-gray-600">{accessory.price}</span>
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
              className="btn-yellow hover:bg-yellow-600"
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        </div>

        {/* Image Upload Section */}
        <div
          className={`bg-white p-5 shadow-md flex-1 space-y-4 ${
            images.length >= 5
              ? "h-[617px] overflow-y-scroll scrollbar-custom"
              : ""
          }`}
        >
          {/* <div className="flex-1 bg-white p-5 shadow-md rounded-md"> */}
          <p className="font-roboto text-lg font-bold">Image Upload</p>
          <hr className="my-3 border-1 border-gray-400" />
          {images[0] ? (
            <div className="relative w-full h-[258px]">
              <img
                src={URL.createObjectURL(images[0])}
                className="w-full h-full object-cover rounded-md"
                alt={`Uploaded ${images[0]}`}
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 hover:opacity-100 transition-opacity">
                <button
                  className="bg-red-500 text-white px-4 py-1 rounded"
                  onClick={() => removeImage(0)}
                >
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <p>No image uploaded yet.</p>
          )}

          {/* Image Upload Input */}
          <div className="mt-5">
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
                {isUploading
                  ? "Uploading images..."
                  : "Click to upload images or drag them here"}
              </p>
            </label>

            {/* Uploaded Images */}
            <div className="mt-5 ">
              <p className="font-medium">Uploaded Images:</p>
              <div className="flex w-full mx-auto  flex-wrap gap-[18px] mt-2">
                {images.map((image, index) => (
                  <div
                    key={index}
                    className="relative group cursor-pointer"
                    onClick={() => handleImageClick(index)}
                  >
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`upload-preview-${index}`}
                      className="w-[120px] h-[120px] object-cover rounded-md"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(index);
                      }}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-1 py-[1px] opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      {/* &times; */}
                      <FontAwesomeIcon icon={faRemove} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNewProduct;
