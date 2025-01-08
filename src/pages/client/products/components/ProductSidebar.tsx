import { IProduct, IAccessory } from "../../types/ClientSchemas";
import FinancingTab from "./FinancingTab";
import CashTab from "./CashTab";
import { useEffect, useState } from "react";
import CheckoutForm from "./CheckoutForm";
import ReactDOM from "react-dom";
import ThankYouTab from "./ThankYouTab";

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

interface ShippingOption {
  id: string;
  name: string;
  price: number;
}

interface IProductSidebarProps {
  setShowAccessory: (value: boolean) => void;
  productDetails: IProduct;
  activeTab: string;
  handleTabClick: (tab: string) => void;
  selections: SelectionsType;
  setSelections: React.Dispatch<React.SetStateAction<SelectionsType>>;
  accessoryList: IAccessory[];
  handleAccessoryChange: (id: string, isChecked: boolean) => void;
  handleAccessoryQtyChange: (id: string, qty: number) => void;
  shippingOptions: ShippingOption[];
  handleShippingChange: (optionId: string) => void;
  totalPrices: { basePrice: number; addOns: number; netPrice: number };
  setModalAccessory: React.Dispatch<React.SetStateAction<IAccessory | null>>;
}

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
  const productName = productDetails?.name || "Product";
  const productTitle = productDetails?.product_title || "";
  const tabs = ["cash", "financing"];
  const [cashTabStep, setCashTabStep] = useState(1);
  const [financingTabStep, setFinancingTabStep] = useState(1);
  const [showCheckOutForm, setShowCheckOutForm] = useState(false);
  const [filteredAccessory, setFilteredAccessory] = useState<any>();
  const [showThankYouTab, setShowThankYouTab] = useState(false);

  useEffect(() => {
    if (!accessoryList || accessoryList.length === 0) return;

    const selectedAccessories = accessoryList
      .filter((accessory) => selections.accessories[accessory.id]?.selected)
      .map((accessory) => ({
        ...accessory,
        qty: selections.accessories[accessory.id]?.qty || 1,
      }));

    setFilteredAccessory(selectedAccessories);
    console.log("Selected=>Acc", selectedAccessories);
    console.log("Selections", selections);
  }, [selections, accessoryList]);

  const currentDate = new Date();
  // Next two months
  const twoMonthsFromNow = new Date(currentDate);
  twoMonthsFromNow.setMonth(currentDate.getMonth() + 2);
  const twoMonths = twoMonthsFromNow.toLocaleString("default", {
    month: "short",
  });

  // Next three months
  const threeMonthsFromNow = new Date(currentDate);
  threeMonthsFromNow.setMonth(currentDate.getMonth() + 3);
  const threeMonths = threeMonthsFromNow.toLocaleString("default", {
    month: "short",
  });

  const yearForTwoMonths = twoMonthsFromNow.getFullYear();
  const yearForThreeMonths = threeMonthsFromNow.getFullYear();

  return (
    <div className="w-full xl:w-[37%] md:p-3 my-3">
      {(cashTabStep == 2 || financingTabStep == 2) && (
        <p
          className="text-custom-med-gray text-[15px] font-semibold cursor-pointer "
          onClick={() => {
            if (cashTabStep === 3 || financingTabStep === 3) {
              if (activeTab === "cash") {
                setCashTabStep(2);
              } else {
                setFinancingTabStep(2);
              }
            } else {
              if (activeTab === "cash") {
                setCashTabStep(1);
              } else {
                setFinancingTabStep(1);
              }
            }
          }}
        >
          {`< Edit Build`}
        </p>
      )}
      {/* Product Heading */}
      <div className="text-center font-roboto  capitalize ">
        <h2 className="text-lg lg:text-4xl font-semibold text-custom-black-200">
          {productName}
        </h2>
        {productTitle && (
          <p className="my-1 text-md lg:text-xl  text-custom-black-200">
            {productTitle}
          </p>
        )}
      </div>

      {/* Tabs Section */}
      <div className="tabs-section font-roboto my-5">
        <ul className="flex gap-4 md:gap-12 border-b-4 border-orange-500">
          {tabs?.map((tab) => (
            <li
              key={tab}
              className={`flex-1 text-center cursor-pointer pb-2 transition-colors duration-300 ${
                activeTab === tab
                  ? "text-orange-500 border-b-8 border-orange-500"
                  : "text-custom-med-gray"
              }`}
              onClick={() => handleTabClick(tab)}
            >
              <span className="font-semibold text-lg md:text-xl leading-6 capitalize">
                {tab}
              </span>
            </li>
          ))}
        </ul>

        {/* Tab Content Area */}
        <div className="tabs-content pt-3 md:pt-8 transition-all duration-500 ease-in-out">
          {activeTab === "cash" ? (
            <CashTab
              productDetails={productDetails}
              showCheckOutForm={showCheckOutForm}
              setShowCheckOutForm={setShowCheckOutForm}
              selections={selections}
              setSelections={setSelections}
              accessoryList={accessoryList}
              cashTabStep={cashTabStep}
              handleAccessoryChange={handleAccessoryChange}
              handleAccessoryQtyChange={handleAccessoryQtyChange}
              shippingOptions={shippingOptions}
              handleShippingChange={handleShippingChange}
              totalPrices={totalPrices}
              setModalAccessory={setModalAccessory}
              setShowAccessory={setShowAccessory}
            />
          ) : (
            <FinancingTab />
          )}
        </div>
        {/* checkout form */}
        {showCheckOutForm &&
          ReactDOM.createPortal(
            <div className="fixed top-0 z-30 inset-0 backdrop-blur-sm bg-black bg-opacity-10 flex items-center justify-center lg:p-4 p-8">
              <CheckoutForm
                setShowCheckOutForm={setShowCheckOutForm}
                productDetails={productDetails}
                filteredAccessory={filteredAccessory}
                selections={selections}
                financing={activeTab}
                setThankYouTab={setShowThankYouTab}
              />
            </div>,
            document.body
          )}

        {showThankYouTab &&
          ReactDOM.createPortal(
            <div className="fixed top-0 z-30 inset-0 backdrop-blur-sm bg-black bg-opacity-10 flex items-center justify-center lg:p-4 p-8">
              <ThankYouTab setShowThankYouTab={setShowThankYouTab} />
            </div>,
            document.body
          )}
        {/* Order Block */}
        <div className=" border-t font-roboto border-gray-400 pt-9 mt-7 max-w-7xl mx-auto  capitalize">
          <h2 className="text-lg lg:text-2xl font-semibold text-custom-black-200 text-center">
            Order Your Equipter {productName}
          </h2>
          <h3 className="font-semibold text-base md:text-lg text-custom-med-gray text-center mt-2">
            {yearForTwoMonths === yearForThreeMonths
              ? `Est. Delivery:  ${threeMonths} ${yearForTwoMonths}`
              : `Est. Delivery: ${twoMonths} ${yearForTwoMonths} – ${threeMonths} ${yearForThreeMonths}`}
          </h3>
          <div className="flex flex-col xs:flex-row items-center gap-6 mt-6 justify-center">
            <button className="inline-block text-sm xl:text-md bg-custom-med-gray text-white px-4 py-2 lg:px-6 lg:py-3 hover:bg-custom-orange transition">
              Send Build
            </button>
            <button
              className="inline-block text-sm xl:text-md px-4 py-2 bg-custom-orange text-white lg:px-6 lg:py-3 hover:bg-black hover:bg-opacity-50 transition"
              onClick={() => {
                if (cashTabStep === 2 || financingTabStep === 2) {
                  if (activeTab === "cash") {
                    setShowCheckOutForm(true);
                  } else {
                    setShowCheckOutForm(true);
                  }
                } else {
                  if (activeTab === "cash") {
                    setCashTabStep(2);
                  } else {
                    setFinancingTabStep(2);
                  }
                }
              }}
            >
              {cashTabStep == 2 || financingTabStep == 2
                ? "Confirm Deposit"
                : "Continue"}
            </button>
          </div>
          <p className="text-center text-custom-med-gray-200 text-sm mt-7">
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

export default ProductSidebar;
