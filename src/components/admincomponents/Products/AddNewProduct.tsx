import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import InputField from "../../InputFeild";

const AddNewProduct = () => {
  const nav = useNavigate();

  return (
    <>
      {/* TopBar */}
      <section className="bg-custom-cream w-full p-4">
        <div className="flex gap-3">
          <div className="py-1">
            <button
              onClick={() => nav("/admin/products")}
              className="flex   border border-black text-black items-center "
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
      <div className="flex w-[80%] gap-5 mx-auto my-10">
        {/* general info */}
        <div className="flex-1 p-2">
          <p className="font-roboto">General Info</p>
          {/* Product Name */}
          <p>Product Name</p>
          <div className="grid grid-cols-2 gap-2">
            <InputField
              id="1"
              type="text"
              placeholder="Enter Product Name"
              value="1"
              name="productName"
              classes="!w-full"
            />
            <InputField
              id="1"
              type="text"
              placeholder="Enter Product Name"
              value="1"
              name="productName"
                 classes="!w-full"
            />
          </div>
        </div>
        {/* image */}
        <div className="w-[35%] p-3">
          <img
            src="https://images.pexels.com/photos/1653327/pexels-photo-1653327.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            className="w-[311px] h-[208px]"
            alt="NewProductImage"
          />
        </div>
      </div>
    </>
  );
};

export default AddNewProduct;
