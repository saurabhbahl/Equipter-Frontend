import Slider from "react-slick";
import ReactDOM from "react-dom";
import { useState, useEffect, useCallback, useMemo } from "react";
import CustomSlider from "../components/CustomSlider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfo } from "@fortawesome/free-solid-svg-icons";
import { publicApiClient } from "../../../utils/axios";
import { useParams } from "react-router-dom";
import LoaderSpinner from "../../../components/utils/LoaderSpinner";
import { useClientContext } from "../../../hooks/useClientContext";
import InputField from "../../../components/utils/InputFeild";
import MetaComponent from "../../../utils/MetaComponent";
import { IAccessory, IProduct, TImage } from "../types/ClientSchemas";

interface IBuildList {
  title: string;
  value: string;
}
interface IProductSidebarProps {
  setShowAccessory: (value: boolean) => void;
  productDetails: IProduct;
  activeTab: string;
  handleTabClick: (tab: string) => void;
  selections: any;
  setSelections: React.Dispatch<React.SetStateAction<any>>;
  accessoryList: any[];
  handleAccessoryChange: (id: string, isChecked: boolean) => void;
  handleAccessoryQtyChange: (id: string, qty: number) => void;
  shippingOptions: { id: string; name: string; price: number }[];
  handleShippingChange: (optionId: string) => void;
  totalPrices: { basePrice: number; addOns: number; netPrice: number };
  setModalAccessory: React.Dispatch<React.SetStateAction<any>>;
}

interface IAccessorySliderModalProps {
  accessories: IAccessory[];
  onClose: () => void;
  selections: any;
  setSelections: React.Dispatch<React.SetStateAction<any>>;
}
interface ShippingOption {
  id: string;
  name: string;
  price: number;
}

interface AccessorySelection {
  selected: boolean;
  qty: number;
}

interface SelectionsType {
  baseUnitQty: number;
  accessories: {
    [accId: string]: AccessorySelection;
  };
  shippingOption: string | null;
}

const ViewSingleProduct = () => {
  const { firstPageForm } = useClientContext();
  const { productUrl } = useParams();
  const [activeTab, setActiveTab] = useState<string>("cash");
  const [modalAccessory, setModalAccessory] = useState<IAccessory | null>(null);
  const [showAccessories, setShowAccessories] = useState<boolean>(false);
  const [productDetails, setProductDetails] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [slides, setSlides] = useState<string[]>([]);
  const [buildList, setBuildList] = useState<IBuildList[]>([]);
  const [accessoryList, setAccessoryList] = useState<IAccessory[]>([]);
  const [selections, setSelections] = useState<SelectionsType>({
    baseUnitQty: 1,
    accessories: {},
    shippingOption: null,
  });
  const [totalPrices, setTotalPrices] = useState({
    basePrice: 0,
    addOns: 0,
    netPrice: 0,
  });

  const shippingOptions: ShippingOption[] = [
    { id: "pickup", name: "Pick-up", price: 0 },
    {
      id: "delivery",
      name: `Delivery to the State of ${firstPageForm.state}`,
      price: 400,
    },
  ];
  

  // Fetch product data
  const fetchData = async () => {
    try {
      const resData = await publicApiClient.get(`/product/url/${productUrl}`);
      const data = resData.data.data;
      setProductDetails(data);
      setLoading(false);

      setBuildList([
        { title: "GVWR", value: `${data.gvwr} lbs` },
        { title: "Lift Capacity", value: `${data.lift_capacity} lbs` },
        { title: "Lift Height", value: `${data.lift_height}` },
        { title: "Container", value: `${data.container_capacity} cu yds` },
      ]);

      if (data.images && data.images.length > 0) {
        const imgs = data.images.map((e: TImage) => e.image_url);
        setSlides(imgs);
      }

      setAccessoryList(data.accessories || []);

      const initialAccessoriesState: {
        [key: string]: AccessorySelection;
      } = {};
      (data.accessories || []).forEach((acc: IAccessory) => {
        initialAccessoriesState[acc.id] = { selected: false, qty: 1 };
      });

      setSelections((prevState) => ({
        ...prevState,
        accessories: initialAccessoriesState,
      }));

      // Set total prices based on base price
      const basePrice = parseFloat(data.price) || 0;
      setTotalPrices({
        basePrice,
        addOns: 0,
        netPrice: basePrice,
      });
    } catch (error) {
      console.error("Error fetching product data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [productUrl]);

  // Update total prices when selections change
  useEffect(() => {
    if (!productDetails?.price) return;

    const basePrice = parseFloat(productDetails.price) * selections.baseUnitQty;
    let addOns = 0;

    Object.keys(selections.accessories).forEach((accId) => {
      const accessory = selections?.accessories[accId];
      if (accessory.selected) {
        const accessoryInfo = accessoryList.find((item) => item.id === accId);
        if (accessoryInfo) {
          addOns += Number(accessoryInfo.price) * accessory.qty;
        }
      }
    });

    let shippingPrice = 0;
    if (selections.shippingOption) {
      const shippingOption = shippingOptions.find(
        (option) => option.id === selections.shippingOption
      );
      if (shippingOption) {
        shippingPrice = shippingOption.price;
      }
    }

    const netPrice = basePrice + addOns + shippingPrice;

    setTotalPrices({
      basePrice,
      addOns,
      netPrice,
    });
  }, [selections, productDetails?.price, accessoryList]);

  const handleTabClick = useCallback(
    (tab: string) => {
      setActiveTab(tab);
    },
    [accessoryList]
  );

  const handleAccessoryChange = (accId: string, isChecked: boolean) => {
    setSelections((prevState) => ({
      ...prevState,
      accessories: {
        ...prevState.accessories,
        [accId]: {
          ...prevState.accessories[accId],
          selected: isChecked,
        },
      },
    }));
  };

  const handleAccessoryQtyChange = (accId: string, qty: number) => {
    setSelections((prevState) => ({
      ...prevState,
      accessories: {
        ...prevState.accessories,
        [accId]: {
          ...prevState.accessories[accId],
          qty: qty < 1 ? 1 : qty,
        },
      },
    }));
  };

  const handleShippingChange = (optionId: string) => {
    setSelections((prevState) => ({
      ...prevState,
      shippingOption: optionId,
    }));
  };

  // Reorder accessories so that the clicked one is first
  const reorderedAccessories = useMemo(() => {
    if (!modalAccessory || !productDetails?.accessories) return [];
    const allAccessories = [...productDetails.accessories];
    const selectedIndex = allAccessories.findIndex(
      (acc) => acc.id === modalAccessory.id
    );
    if (selectedIndex > -1) {
      const [selected] = allAccessories.splice(selectedIndex, 1);
      allAccessories.unshift(selected);
    }
    return allAccessories;
  }, [modalAccessory, productDetails?.accessories]);

  if (loading) {
    return (
      <div className="w-full h-full flex justify-center items-center my-20">
        <LoaderSpinner />
      </div>
    );
  }

  return (
    <>
      <MetaComponent
        title={productDetails?.meta_title as string}
        description={productDetails?.description as string}
      />
      <div className="products-component md:px-20 xl:w-[90%] mx-auto">
        {/* Main content */}
        <section className="content-with-sidebar p-5">
          <div className=" mx-auto flex flex-col xl:flex-row gap-3">
            {/* Left content */}
            <div className="w-full xl:w-[63%]">
              {/* Build + Buy heading */}
              <div className="main-heading relative top-16 lg:block lg:mb-8">
                <h1 className="uppercase text-sm lg:text-[10px] font-robot text-gray-700">
                  Build + Buy
                </h1>
              </div>
              {/* Image Slider */}
              <div className="relative lg:pb-14 pb-6 lg:my-8">
                {slides.length > 1 ? (
                  <CustomSlider slides={slides} />
                ) : (
                  <img
                    src={slides[0]}
                    alt={productDetails?.name}
                    draggable="false"
                    className="w-full transition-transform ease-in-out duration-300 max-h-[611px] object-contain"
                  />
                )}
              </div>

              {/* Build lists content */}
              <div className="grid grid-cols-2 md:grid-cols-4 px-5 text-left w-full">
                {buildList.map((item, index) => (
                  <div key={index} className="w-full my-2 lg:m-0">
                    <h4 className="font-roboto lg:text-lg">{item.title}</h4>
                    <h3 className="font-robot lg:text-2xl text-xl text-gray-800 heading-bottom-border">
                      {item.value}
                    </h3>
                  </div>
                ))}
              </div>
            </div>
            {/* Sidebar content */}
            <ProductSidebar
              setShowAccessory={setShowAccessories}
              productDetails={productDetails as IProduct}
              activeTab={activeTab}
              handleTabClick={handleTabClick}
              selections={selections}
              setSelections={setSelections}
              accessoryList={accessoryList}
              handleAccessoryChange={handleAccessoryChange}
              handleAccessoryQtyChange={handleAccessoryQtyChange}
              shippingOptions={shippingOptions}
              handleShippingChange={handleShippingChange}
              totalPrices={totalPrices}
              setModalAccessory={setModalAccessory}
            />
          </div>
        </section>
      </div>
      {showAccessories &&
        ReactDOM.createPortal(
          <AccessorySliderModal
            accessories={reorderedAccessories}
            onClose={() => setShowAccessories(false)}
            selections={selections}
            setSelections={setSelections}
          />,
          document.body
        )}
    </>
  );
};

export default ViewSingleProduct;

const ProductSidebar = ({
  setShowAccessory,
  productDetails,
  activeTab,
  handleTabClick,
  selections,
  setSelections,
  accessoryList,
  handleAccessoryChange,
  handleAccessoryQtyChange,
  shippingOptions,
  handleShippingChange,
  totalPrices,
  setModalAccessory,
}: IProductSidebarProps) => {
  return (
    <div className="w-full  xl:w-[37%] md:p-3  ">
      <div className="text-center font-robot capitalize my-3">
        <h2 className="text-xl lg:text-5xl font-semibold text-custom-black-200">
          {productDetails.name}
        </h2>
        <p className="my-1 text-xl text-custom-black-200">
          {productDetails.product_title}
        </p>
      </div>
      {/* Tabs Section */}
      <div className="tabs-sectio font-robot my-5">
        <ul className="flex gap-4 md:gap-12 border-b-4 border-orange-500">
          {["cash", "financing"].map((tab) => (
            <li
              key={tab}
              className={`flex-1 text-center cursor-pointer pb-2 transition-colors duration-300 ${
                activeTab === tab
                  ? "text-orange-500 border-b-8 border-orange-500 "
                  : "text-gray-600"
              }`}
              onClick={() => handleTabClick(tab)}
            >
              <span className="font-semibold text-lg md:text-xl leading-6 capitalize">
                {tab}
              </span>
            </li>
          ))}
        </ul>
        {/* Tab Content */}
        <div className="tabs-content pt-5 md:pt-8 transition-all duration-500 ease-in-out">
          {activeTab === "cash" ? (
            // Cash tab content
            <div className="tab-content">
              {/* Price content block */}
              <table className="min-w-full overflow-hidden">
                <thead>
                  <tr>
                    <th className="text-left text-custom-black-25 text-xs  md:text-sm lg:text-md font-semibold">
                      Base Price
                    </th>
                    <th></th>
                    <th className="text-left text-custom-black-25 text-xs md:text-sm lg:text-md font-semibold">
                      Add-Ons
                    </th>
                    <th></th>
                    <th className="text-left text-custom-black-25 text-xs md:text-sm lg:text-md font-semibold">
                      Net Price
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="">
                    <td
                      className="text-custom-orange-100
                     align-middle font-semibold text-lg  md:text-xl lg:text-2xl xl:text-3xl"
                    >
                      ${totalPrices.basePrice.toLocaleString()}{" "}
                      <span
                        className="text-15
                      my-2
                      
                      font-semibold text-custom-black-25 float-right pr-4 md:pr-2 2xl:pr-4"
                      >
                        +
                      </span>
                    </td>
                    <td></td>
                    <td className="text-custom-orange-100 align-middle  font-semibold text-lg  md:text-xl lg:text-2xl xl:text-3xl">
                      ${totalPrices.addOns.toLocaleString()}{" "}
                      <span
                        className="text-15
              
                      font-semibold text-custom-black-25 float-right pr-4 md:pr-2 h-full
                      my-2
                      "
                      >
                        =
                      </span>
                    </td>
                    <td></td>
                    <td className="text-custom-orange-100 align-middle font-semibold text-lg  md:text-xl lg:text-2xl xl:text-3xl">
                      ${totalPrices.netPrice.toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
              {/* Base unit quantity */}
              <div className=" py-2 flex flex-col justify-center md:flex-row gap-3  items-center pt-5">
                <h3 className="font-semibold w-[90%] md:w-[65%] text-center xl:text-left text-xl">{`Equipter ${productDetails.name} Base Unit`}</h3>
                <form className="flex justify-end  md:flex-1 items-center gap-3">
                  <label
                    htmlFor="baseQty"
                    className="text-md font-bold text-gray-500"
                  >
                    QTY
                  </label>
                  <InputField
                    name="qty"
                    placeholder="1"
                    required
                    id="baseQty"
                    classes="flex-1 max-w-16 h-auto"
                    type="number"
                    value={selections.baseUnitQty}
                    onChange={(e) => {
                      const value = parseInt(e.target.value, 10);
                      setSelections((prevState: SelectionsType) => ({
                        ...prevState,
                        baseUnitQty: isNaN(value) || value < 1 ? 1 : value,
                      }));
                    }}
                  />
                </form>
              </div>
              {/* Accessories */}
              <div className="my-3 overflow-y-scroll max-h-[260px] scrollbar-hide">
                <h3 className="font-semibold text-lg md:text-xl text-center ">
                  Add-On Accessories
                </h3>
                <div className="space-y-3">
                  {accessoryList.map((accessory) => (
                    <div
                      key={accessory.id}
                      className={`p-2  transition-all duration-300 ${
                        selections.accessories[accessory.id]?.selected
                          ? "text-black"
                          : " "
                      }`}
                    >
                      <div className="flex flex-row items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <InputField
                            name="accessory"
                            type="checkbox"
                            id={accessory.id}
                            checked={
                              selections.accessories[accessory.id]?.selected ||
                              false
                            }
                            classes="form-checkbox   text-black"
                            onChange={(e) =>
                              handleAccessoryChange(
                                accessory.id,
                                e.target.checked
                              )
                            }
                          />
                          <label
                            htmlFor={accessory.id}
                            className={`font-semibold  capitalize text-sm xl:text-lg ${
                              selections.accessories[accessory.id]?.selected
                                ? "text-gray-800"
                                : "text-gray-400"
                            }`}
                          >
                            {accessory.name}
                          </label>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-semibold text-gray-800">
                            ${accessory.price}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setShowAccessory(true);
                              setModalAccessory(accessory);
                            }}
                            className="px-2 rotate-6 text-sm text-gray-500 border border-gray-500 bg-gray-100 rounded-full transition"
                            aria-label={`Info about ${accessory.name}`}
                          >
                            <FontAwesomeIcon icon={faInfo} />
                          </button>
                        </div>
                      </div>
                      {selections.accessories[accessory.id]?.selected && (
                        <div className="mt-4 flex justify-end">
                          {accessory.slides && (
                            <CustomSlider slides={accessory.slides} />
                          )}
                          <form className="flex fle justify-end items-center gap-3 w-fit">
                            <label
                              htmlFor={`${accessory.id}-qty`}
                              className="text-md font-bold text-gray-500"
                            >
                              QTY
                            </label>
                            <InputField
                              name={`${accessory.id}-qty`}
                              placeholder="1"
                              required
                              id={`${accessory.id}-qty`}
                              classes="max-w-16 h-fit"
                              type="number"
                              value={
                                selections.accessories[accessory.id]?.qty || 1
                              }
                              onChange={(e) => {
                                const qty = parseInt(e.target.value, 10);
                                handleAccessoryQtyChange(
                                  accessory.id,
                                  isNaN(qty) || qty < 1 ? 1 : qty
                                );
                              }}
                            />
                          </form>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              {/* Shipping options */}
              <div className="my-3">
                <h3 className="font-semibold text-lg md:text-xl text-center my-5">
                  Shipping Options
                </h3>
                <div className="space-y-4">
                  {shippingOptions.map((option) => (
                    <div
                      key={option.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          id={option.id}
                          name="shippingOption"
                          className="form-radio text-black"
                          checked={selections.shippingOption === option.id}
                          onChange={() => handleShippingChange(option.id)}
                        />
                        <label
                          htmlFor={option.id}
                          className="font-semibold text-base md:text-lg text-gray-600"
                        >
                          {option.name}
                        </label>
                      </div>
                      <span className="text-lg font-semibold text-gray-800">
                        ${option.price}
                      </span>
                    </div>
                  ))}
                  <p className="text-sm md:text-base text-gray-500">
                    *Tax, title, and registration fees will be additional costs.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            // Financing tab content
            <div className="tab-content">
              <p className="text-gray-700">
                Financing options will be displayed here.
              </p>
            </div>
          )}
        </div>

        <div className="order-block border-t border-gray-400 pt-9 mt-7 max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-semibold text-center">
            Order Your Equipter {productDetails.name}
          </h2>
          <h3 className="font-semibold text-base md:text-lg text-gray-600 text-center mt-2">
            Est. Delivery: Jul – Aug 2024
          </h3>
          <div className="flex flex-col sm:flex-row items-center gap-6 mt-6 justify-center">
            <a
              href="#"
              className="inline-block bg-black bg-opacity-10 text-white px-7 py-3 hover:bg-custom-orange transition"
            >
              Send Build
            </a>
            <a
              href="#"
              className="inline-block bg-custom-orange text-white px-7 py-3 hover:bg-black hover:bg-opacity-20 transition"
            >
              Continue
            </a>
          </div>
          <p className="text-center text-gray-500 text-sm mt-7">
            To talk to a rep call:{" "}
            <a
              href="tel:717-661-3591"
              className="underline hover:no-underline text-gray-700"
            >
              717-661-3591
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

const AccessorySliderModal = ({
  accessories,
  onClose,
  selections,
  setSelections,
}: IAccessorySliderModalProps) => {
  const [flash, setFlash] = useState(false);
  // const [currentIndex, setCurrentIndex] = useState(0);

  if (accessories.length === 0) return null;

  const placeholderImg = "https://via.placeholder.com/600x400?text=No+Image";

  const handleAddAccessory = (currentAccessory: IAccessory) => {
    // Update selections: if not selected, select it and qty=1; if selected, increment qty
    setSelections((prev: SelectionsType) => {
      const prevAccessory = prev.accessories[currentAccessory.id] || {
        selected: false,
        qty: 1,
      };
      return {
        ...prev,
        accessories: {
          ...prev.accessories,
          [currentAccessory.id]: {
            selected: true,
            qty: prevAccessory.qty + 1,
          },
        },
      };
    });

    // Trigger flash animation
    setFlash(true);
    setTimeout(() => setFlash(false), 500);
  };

  // Slider settings
  const settings = {
    className: "center",
    centerMode: true,
    infinite: true,
    arrows: false,
    centerPadding: "50px",
    slidesToShow: 3,
    speed: 500,
    // beforeChange: (oldIndex, newIndex) => {
    //   setCurrentIndex(newIndex);
    // },
  };

  return (
    <div className="fixed z-50 inset-0 h-full p-5 bg-black bg-opacity-40 flex items-center justify-center">
      <button
        onClick={onClose}
        className="absolute top-6 right-12 text-black text-2xl hover:text-gray-600 font-bold"
      >
        X
      </button>
      <div className="relative  w-full p ">
        <Slider {...settings}>
          {accessories.map((acc) => {
            const selectedAcc = selections.accessories[acc.id];
            const featureImg = acc?.images.filter((e) => e.is_featured == true);
            const isSelected = selectedAcc?.selected;
            const qty = selectedAcc?.qty || 0;

            return (
              <div key={acc.id} className="m- flex p-9   h-[600px]  ">
                <div className="flex w-full p-9 h-full gap-5 justify-center items-center bg-white ">
                  <div className="h-[100%] w-[50%]">
                    <img
                      src={featureImg[0]?.image_url || placeholderImg}
                      alt={acc.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="w-[50%] flex flex-col items-start justify-start">
                    <h3 className="font-semibold capitalize ">{acc.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {acc.description}
                    </p>
                    {isSelected && (
                      <p
                        className={`text-sm font-semibold mb-2 ${
                          flash ? "animate-pulse text-green-600" : "text-black"
                        }`}
                      >
                        Qty: {qty}
                      </p>
                    )}
                    <button
                      className="btn-yellow text-xs px-3 self-end"
                      onClick={() => handleAddAccessory(acc)}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </Slider>
      </div>
    </div>
  );
};
