import ReactDOM from "react-dom";
import { useState, useEffect, useCallback, useMemo } from "react";
import CustomSlider from "../components/CustomSlider";

import { publicApiClient } from "../../../utils/axios";
import { useParams } from "react-router-dom";
import LoaderSpinner from "../../../components/utils/LoaderSpinner";
import { useClientContext } from "../../../hooks/useClientContext";

import MetaComponent from "../../../utils/MetaComponent";
import { IAccessory, IProduct, TImage } from "../types/ClientSchemas";
import AccessorySlider from "./components/AccessorySlider";
import ProductSidebar from "./components/ProductSidebar";
import FirstPageForm from "../FirstPageForm";
import NotFound from "../../NotFound";
import { ShippingOption } from "../../../contexts/ClientContext";

interface IBuildList {
  title: string;
  value: string;
}

interface AccessorySelection {
  selected: boolean;
  qty: number;
}

export interface SelectionsType {
  baseUnitQty: number;
  accessories: {
    [accId: string]: AccessorySelection;
  };
  shippingOption?: string;
}

const ViewSingleProduct = () => {
  const {
    firstPageForm,
    shippingOptions,
    activeTab,
    setActiveTab,
    selections,setSelections,
    totalPrices, setTotalPrices,
    handleAccessoryChange,
    handleAccessoryQtyChange,
    handleShippingChange,
  } = useClientContext();
  const { productUrl } = useParams();
  const [error, setError] = useState(false);

  const [modalAccessory, setModalAccessory] = useState<IAccessory | null>(null);
  const [showAccessories, setShowAccessories] = useState<boolean>(false);
  const [productDetails, setProductDetails] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [slides, setSlides] = useState<string[]>([]);
  const [buildList, setBuildList] = useState<IBuildList[]>([]);
  const [accessoryList, setAccessoryList] = useState<IAccessory[]>([]);
  // const [selections, setSelections] = useState<SelectionsType>({
  //   baseUnitQty: 1,
  //   accessories: {},
  //   shippingOption: "",
  // });

  // const [totalPrices, setTotalPrices] = useState({
  //   basePrice: 0,
  //   addOns: 0,
  //   netPrice: 0,
  // });

  // Fetch product data
  const fetchData = async () => {
    try {
      // get product data
      const resData = await publicApiClient.get(`/product/url/${productUrl}`);
      const data = resData.data.data;
      setProductDetails(data);
      setLoading(false);
      const heightFt = data.lift_height.split(".")[0];
      const heightInch = data.lift_height.split(".")[1];
      setBuildList([
        { title: "GVWR", value: `${data.gvwr} lbs` },
        { title: "Lift Capacity", value: `${data.lift_capacity} lbs` },
        { title: "Lift Height", value: `${heightFt}'-${heightInch || 0}"` },
        { title: "Container", value: `${data.container_capacity} cu yds` },
      ]);

      if (data.images && data.images.length > 0) {
        const imgs = data.images.map((e: TImage) => e.image_url);
        setSlides(imgs);
      }

      setAccessoryList(data.accessories || []);

      const initialAccessoriesState: { [key: string]: AccessorySelection } = {};

      (data.accessories || []).forEach((acc: IAccessory) => {
        initialAccessoriesState[acc.id] = { selected: false, qty: 1 };
      });
      console.log(shippingOptions);
      const shippingOptionState = firstPageForm.state;
      setSelections((prevState) => ({
        ...prevState,
        accessories: initialAccessoriesState,
        shippingOption: shippingOptions[1]?.id,
        // shippingOption: shippingOptionState
        //   ? shippingOptions[1]?.id
        //   : shippingOptions[0]?.id,
      }));

      // Set total prices based on base price
      const basePrice = parseFloat(data.price) || 0;
      setTotalPrices({
        basePrice,
        addOns: 0,
        netPrice: basePrice,
      });
    } catch {
      setLoading(false);
      setError(true);
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

  // const handleAccessoryChange = (accId: string, isChecked: boolean) => {
  //   setSelections((prevState) => ({
  //     ...prevState,
  //     accessories: {
  //       ...prevState.accessories,

  //       [accId]: {
  //         ...prevState.accessories[accId],
  //         // qty:isChecked==false?1:...prevState.accessories.qty,
  //         qty: isChecked ? prevState.accessories[accId]?.qty || 1 : 1,
  //         selected: isChecked,
  //       },
  //     },
  //   }));
  // };

  // const handleAccessoryQtyChange = (accId: string, qty: number) => {
  //   setSelections((prevState) => ({
  //     ...prevState,
  //     accessories: {
  //       ...prevState.accessories,
  //       [accId]: {
  //         ...prevState.accessories[accId],
  //         qty: qty < 1 ? 1 : qty,
  //       },
  //     },
  //   }));
  // };

  // const handleShippingChange = (optionId: any) => {
  //   setSelections((prevState) => ({
  //     ...prevState,
  //     shippingOption: optionId,
  //   }));
  // };

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

  if (error) {
    return <NotFound />;
  }
  if (!firstPageForm.isFormFilled) {
    return <FirstPageForm />;
  }
  if (loading) {
    return (
      <div className="w-full h-full flex justify-center items-center my-20">
        <LoaderSpinner />
      </div>
    );
  }

  return error ? (
    <NotFound />
  ) : (
    <>
      <MetaComponent
        title={productDetails?.meta_title as string}
        description={productDetails?.description as string}
      />
      <div className="products-component md:px-20 xl:w-[90%]  px-3 max-w-[2500px] mx-auto">
        {/* Main content */}
        <section className=" p-5">
          <div className=" mx-auto flex flex-col xl:flex-row gap-3">
            {/* Left content */}
            <div className="w-full xl:w-[63%]">
              {/* Build + Buy heading */}
              <div className="main-heading relative -top-6 lg:block ">
                <h1 className="uppercase text-sm lg:text-[10px] font-roboto text-gray-700">
                  Build + Buy
                </h1>
              </div>
              {/* Image Slider */}
              <div className="relative top-0 xl:-top-8">
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
              <div className="grid grid-cols-4 xl:mt-12 mt-8 text-left w-full">
                {buildList.map((item, index) => (
                  <div key={index} className="w-full my-2 lg:m-0">
                    <h4 className="font-roboto text-[10px] lg:text-lg">
                      {item.title}
                    </h4>
                    <h3 className="font-roboto text-sm lg:text-2xl  text-gray-800 heading-bottom-border">
                      {item.value}
                    </h3>
                  </div>
                ))}
              </div>
            </div>
            {/* Sidebar content */}
            {productDetails && (
              <ProductSidebar
                setShowAccessory={setShowAccessories}
                productDetails={productDetails}
            
                handleTabClick={handleTabClick}
                selections={selections}
                setSelections={setSelections}
                accessoryList={accessoryList}
                // handleAccessoryChange={handleAccessoryChange}
                // handleAccessoryQtyChange={handleAccessoryQtyChange}
                // handleShippingChange={handleShippingChange}
                shippingOptions={shippingOptions}
                setModalAccessory={setModalAccessory}
              />
            )}
          </div>
        </section>
      </div>
      {showAccessories &&
        ReactDOM.createPortal(
          <AccessorySlider
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
