import { IProduct, IAccessory } from "../../types/ClientSchemas";
import FinancingTab from "./FinancingTab";
import CashTab from "./CashTab";



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

  return (
    <div className="w-full xl:w-[37%] md:p-3 my-3">
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
      <div className="tabs-section font-robot my-5">
        <ul className="flex gap-4 md:gap-12 border-b-4 border-orange-500">
          {["cash", "financing"].map((tab) => (
            <li
              key={tab}
              className={`flex-1 text-center cursor-pointer pb-2 transition-colors duration-300 ${
                activeTab === tab
                  ? "text-orange-500 border-b-8 border-orange-500"
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

        {/* Tab Content Area */}
        <div className="tabs-content pt-3 md:pt-8 transition-all duration-500 ease-in-out">
          {activeTab === "cash" ? (
            <CashTab
              productDetails={productDetails}
              selections={selections}
              setSelections={setSelections}
              accessoryList={accessoryList}
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

        {/* Order Block */}
        <div className=" border-t font-roboto border-gray-400 pt-9 mt-7 max-w-7xl mx-auto  capitalize">
          <h2 className="text-lg lg:text-2xl font-semibold text-custom-black-200 text-center">
            Order Your Equipter {productName}
          </h2>
          <h3 className="font-semibold text-base md:text-lg text-gray-600 text-center mt-2">
            Est. Delivery: Jul – Aug 2024
          </h3>
          <div className="flex flex-col xs:flex-row items-center gap-6 mt-6 justify-center">
            <button className="inline-block text-sm xl:text-lg bg-black bg-opacity-50 text-white px-4 py-2 lg:px-7 lg:py-3 hover:bg-custom-orange transition">
              Send Build
            </button>
            <button className="inline-block text-sm xl:text-lg px-4 py-2 bg-custom-orange text-white lg:px-7 lg:py-3 hover:bg-black hover:bg-opacity-50 transition">
              Continue
            </button>
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

export default ProductSidebar;
