import InputField from "../../../../components/utils/InputFeild";

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

// const ProductSidebar = ({
//   setShowAccessory,
//   productDetails,
//   activeTab,
//   handleTabClick,
//   selections,
//   setSelections,
//   accessoryList,
//   handleAccessoryChange,
//   handleAccessoryQtyChange,
//   shippingOptions,
//   handleShippingChange,
//   totalPrices,
//   setModalAccessory,
// }: IProductSidebarProps) => {
//   return (
//     <div className="w-full  xl:w-[37%] md:p-3  ">
//       <div className="text-center font-robot capitalize my-3">
//         <h2 className="text-xl lg:text-5xl font-semibold text-custom-black-200">
//           {productDetails.name}
//         </h2>
//         <p className="my-1 text-xl text-custom-black-200">
//           {productDetails.product_title}
//         </p>
//       </div>
//       {/* Tabs Section */}
//       <div className="tabs-sectio font-robot my-5">
//         <ul className="flex gap-4 md:gap-12 border-b-4 border-orange-500">
//           {["cash", "financing"].map((tab) => (
//             <li
//               key={tab}
//               className={`flex-1 text-center cursor-pointer pb-2 transition-colors duration-300 ${
//                 activeTab === tab
//                   ? "text-orange-500 border-b-8 border-orange-500 "
//                   : "text-gray-600"
//               }`}
//               onClick={() => handleTabClick(tab)}
//             >
//               <span className="font-semibold text-lg md:text-xl leading-6 capitalize">
//                 {tab}
//               </span>
//             </li>
//           ))}
//         </ul>
//         {/* Tab Content */}
//         <div className="tabs-content pt-5 md:pt-8 transition-all duration-500 ease-in-out">
//           {activeTab === "cash" ? (
//             // Cash tab content
//             <div className="tab-content">
//               {/* Price content block */}
//               <table className="min-w-full overflow-hidden">
//                 <thead>
//                   <tr>
//                     <th className="text-left text-custom-black-25 text-xs  md:text-sm lg:text-md font-semibold">
//                       Base Price
//                     </th>
//                     <th></th>
//                     <th className="text-left text-custom-black-25 text-xs md:text-sm lg:text-md font-semibold">
//                       Add-Ons
//                     </th>
//                     <th></th>
//                     <th className="text-left text-custom-black-25 text-xs md:text-sm lg:text-md font-semibold">
//                       Net Price
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   <tr className="">
//                     <td
//                       className="text-custom-orange-100
//                        align-middle font-semibold text-lg  md:text-xl lg:text-2xl xl:text-3xl"
//                     >
//                       ${totalPrices.basePrice.toLocaleString()}{" "}
//                       <span
//                         className="text-15
//                         my-2

//                         font-semibold text-custom-black-25 float-right pr-4 md:pr-2 2xl:pr-4"
//                       >
//                         +
//                       </span>
//                     </td>
//                     <td></td>
//                     <td className="text-custom-orange-100 align-middle  font-semibold text-lg  md:text-xl lg:text-2xl xl:text-3xl">
//                       ${totalPrices.addOns.toLocaleString()}{" "}
//                       <span
//                         className="text-15

//                         font-semibold text-custom-black-25 float-right pr-4 md:pr-2 h-full
//                         my-2
//                         "
//                       >
//                         =
//                       </span>
//                     </td>
//                     <td></td>
//                     <td className="text-custom-orange-100 align-middle font-semibold text-lg  md:text-xl lg:text-2xl xl:text-3xl">
//                       ${totalPrices.netPrice.toLocaleString()}
//                     </td>
//                   </tr>
//                 </tbody>
//               </table>
//               {/* Base unit quantity */}
//               <div className=" py-2 flex flex-col justify-center md:flex-row gap-3  items-center pt-5">
//                 <h3 className="font-semibold w-[90%] md:w-[65%] text-center xl:text-left text-xl">{`Equipter ${productDetails.name} Base Unit`}</h3>
//                 <form className="flex justify-end  md:flex-1 items-center gap-3">
//                   <label
//                     htmlFor="baseQty"
//                     className="text-md font-bold text-gray-500"
//                   >
//                     QTY
//                   </label>
//                   <InputField
//                     name="qty"
//                     placeholder="1"
//                     required
//                     id="baseQty"
//                     classes="flex-1 max-w-16 h-auto"
//                     type="number"
//                     value={selections.baseUnitQty}
//                     onChange={(e) => {
//                       const value = parseInt(e.target.value, 10);
//                       setSelections((prevState: SelectionsType) => ({
//                         ...prevState,
//                         baseUnitQty: isNaN(value) || value < 1 ? 1 : value,
//                       }));
//                     }}
//                   />
//                 </form>
//               </div>
//               {/* Accessories */}
//               <div className="my-3 overflow-y-scroll max-h-[260px] scrollbar-hide">
//                 <h3 className="font-semibold text-lg md:text-xl text-center ">
//                   Add-On Accessories
//                 </h3>
//                 <div className="space-y-3">
//                   {accessoryList.map((accessory) => (
//                     <div
//                       key={accessory.id}
//                       className={`p-2  transition-all duration-300 ${
//                         selections.accessories[accessory.id]?.selected
//                           ? "text-black"
//                           : " "
//                       }`}
//                     >
//                       <div className="flex flex-row items-center justify-between gap-2">
//                         <div className="flex items-center gap-3">
//                           <InputField
//                             name="accessory"
//                             type="checkbox"
//                             id={accessory.id}
//                             checked={
//                               selections.accessories[accessory.id]?.selected ||
//                               false
//                             }
//                             classes="form-checkbox   text-black"
//                             onChange={(e) =>
//                               handleAccessoryChange(
//                                 accessory.id,
//                                 e.target.checked
//                               )
//                             }
//                           />
//                           <label
//                             htmlFor={accessory.id}
//                             className={`font-semibold  capitalize text-sm xl:text-lg ${
//                               selections.accessories[accessory.id]?.selected
//                                 ? "text-gray-800"
//                                 : "text-gray-400"
//                             }`}
//                           >
//                             {accessory.name}
//                           </label>
//                         </div>
//                         <div className="flex items-center gap-3">
//                           <span className="text-lg font-semibold text-gray-800">
//                             ${accessory.price}
//                           </span>
//                           <button
//                             type="button"
//                             onClick={() => {
//                               setShowAccessory(true);
//                               setModalAccessory(accessory);
//                             }}
//                             className="px-2 rotate-6 text-sm text-gray-500 border border-gray-500 bg-gray-100 rounded-full transition"
//                             aria-label={`Info about ${accessory.name}`}
//                           >
//                             <FontAwesomeIcon icon={faInfo} />
//                           </button>
//                         </div>
//                       </div>
//                       {selections.accessories[accessory.id]?.selected && (
//                         <div className="mt-4 flex justify-end">
//                           {accessory.slides && (
//                             <CustomSlider slides={accessory.slides} />
//                           )}
//                           <form className="flex fle justify-end items-center gap-3 w-fit">
//                             <label
//                               htmlFor={`${accessory.id}-qty`}
//                               className="text-md font-bold text-gray-500"
//                             >
//                               QTY
//                             </label>
//                             <InputField
//                               name={`${accessory.id}-qty`}
//                               placeholder="1"
//                               required
//                               id={`${accessory.id}-qty`}
//                               classes="max-w-16 h-fit"
//                               type="number"
//                               value={
//                                 selections.accessories[accessory.id]?.qty || 1
//                               }
//                               onChange={(e) => {
//                                 const qty = parseInt(e.target.value, 10);
//                                 handleAccessoryQtyChange(
//                                   accessory.id,
//                                   isNaN(qty) || qty < 1 ? 1 : qty
//                                 );
//                               }}
//                             />
//                           </form>
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//               {/* Shipping options */}
//               <div className="my-3">
//                 <h3 className="font-semibold text-lg md:text-xl text-center my-5">
//                   Shipping Options
//                 </h3>
//                 <div className="space-y-4">
//                   {shippingOptions.map((option) => (
//                     <div
//                       key={option.id}
//                       className="flex items-center justify-between"
//                     >
//                       <div className="flex items-center gap-3">
//                         <input
//                           type="radio"
//                           id={option.id}
//                           name="shippingOption"
//                           className="form-radio text-black"
//                           checked={selections.shippingOption === option.id}
//                           onChange={() => handleShippingChange(option.id)}
//                         />
//                         <label
//                           htmlFor={option.id}
//                           className="font-semibold text-base md:text-lg text-gray-600"
//                         >
//                           {option.name}
//                         </label>
//                       </div>
//                       <span className="text-lg font-semibold text-gray-800">
//                         ${option.price}
//                       </span>
//                     </div>
//                   ))}
//                   <p className="text-sm md:text-base text-gray-500">
//                     *Tax, title, and registration fees will be additional costs.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           ) : (
//             // Financing tab content
//             <div className="tab-content">
//               <p className="text-gray-700">
//                 Financing options will be displayed here.
//               </p>
//             </div>
//           )}
//         </div>

//         <div className="order-block border-t border-gray-400 pt-9 mt-7 max-w-7xl mx-auto px-4">
//           <h2 className="text-2xl md:text-3xl font-semibold text-center">
//             Order Your Equipter {productDetails.name}
//           </h2>
//           <h3 className="font-semibold text-base md:text-lg text-gray-600 text-center mt-2">
//             Est. Delivery: Jul – Aug 2024
//           </h3>
//           <div className="flex flex-col sm:flex-row items-center gap-6 mt-6 justify-center">
//             <a
//               href="#"
//               className="inline-block bg-black bg-opacity-10 text-white px-7 py-3 hover:bg-custom-orange transition"
//             >
//               Send Build
//             </a>
//             <a
//               href="#"
//               className="inline-block bg-custom-orange text-white px-7 py-3 hover:bg-black hover:bg-opacity-20 transition"
//             >
//               Continue
//             </a>
//           </div>
//           <p className="text-center text-gray-500 text-sm mt-7">
//             To talk to a rep call:{" "}
//             <a
//               href="tel:717-661-3591"
//               className="underline hover:no-underline text-gray-700"
//             >
//               717-661-3591
//             </a>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };
// export default ProductSidebar;

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
        <div className=" border-t border-gray-400 pt-9 mt-7 max-w-7xl mx-auto  capitalize">
          <h2 className="text-lg lg:text-2xl font-semibold text-custom-black-200 text-center">
            Order Your Equipter {productName}
          </h2>
          <h3 className="font-semibold text-base md:text-lg text-gray-600 text-center mt-2">
            Est. Delivery: Jul – Aug 2024
          </h3>
          <div className="flex flex-col xs:flex-row items-center gap-6 mt-6 justify-center">
            <button className="inline-block bg-black bg-opacity-50 text-white px-7 py-3 hover:bg-custom-orange transition">
              Send Build
            </button>
            <button className="inline-block bg-custom-orange text-white px-7 py-3 hover:bg-black hover:bg-opacity-50 transition">
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
