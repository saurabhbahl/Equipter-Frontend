import InputField from "../../../../components/utils/InputFeild";
import { IAccessory, IProduct } from "../../types/ClientSchemas";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfo } from "@fortawesome/free-solid-svg-icons";
import CustomSlider from "../../components/CustomSlider";
import CheckoutForm from "./CheckoutForm";
import { useEffect, useState } from "react";
import ReactDOM from "react-dom";

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
interface ICashTabProps {
  productDetails: IProduct;
  showCheckOutForm: boolean;
  setShowCheckOutForm: React.Dispatch<React.SetStateAction<boolean>>;
  cashTabStep: number;
  selections: SelectionsType;
  setSelections: React.Dispatch<React.SetStateAction<SelectionsType>>;
  accessoryList: IAccessory[];
  handleAccessoryChange: (id: string, isChecked: boolean) => void;
  handleAccessoryQtyChange: (id: string, qty: number) => void;
  shippingOptions: any[];
  handleShippingChange: (optionId: string) => void;
  totalPrices: { basePrice: number; addOns: number; netPrice: number };
  setModalAccessory: React.Dispatch<React.SetStateAction<IAccessory | null>>;
  setShowAccessory: (value: boolean) => void;
}

const CashTab = ({
  productDetails,
  selections,
  setSelections,
  cashTabStep,
  showCheckOutForm,
  setShowCheckOutForm,
  accessoryList,
  handleAccessoryChange,
  handleAccessoryQtyChange,
  shippingOptions,
  handleShippingChange,
  totalPrices,
  setModalAccessory,
  setShowAccessory,
}: ICashTabProps) => {
  const productName = productDetails.name;
  const [filteredAccessory, setFilteredAccessory] = useState<any>();
  // useEffect(() => {
  //   // const ans=selections.accessories.filter((e)=>e.selected)
  //   // console.log(ans)
  //   const selectedAccessories = accessoryList.filter((accessory) => selections.accessories[accessory.id]?.selected);
  //   setFilteredAccessory(selectedAccessories);

  // }, [setSelections,selections]);

  useEffect(() => {
    if (!accessoryList || accessoryList.length === 0) return;
  
    const selectedAccessories = accessoryList
      .filter((accessory) => selections.accessories[accessory.id]?.selected)
      .map((accessory) => ({
        ...accessory,
        qty: selections.accessories[accessory.id]?.qty || 1,
      }));
  
    setFilteredAccessory(selectedAccessories);
    console.log('Selected=>Acc',selectedAccessories);
    console.log('Selections',selections);
    
  }, [selections, accessoryList]);

  const CashTabStepOne = () => {
    return (
      <div className="">
        {/* Price Table */}
        <div className="font-roboto flex justify-between items-center">
          {/* base price */}
          <div>
            <p className="text-left  text-custom-black-25 text-xs md:text-sm xl:text-md font-semibold">
              Base Price
            </p>
            <p className="text-custom-orange align-middle font-semibold text-md md:text-lg lg:text-xl xl:text-2xl">
              ${totalPrices.basePrice.toLocaleString()}{" "}
            </p>
          </div>
          {/* + */}
          <div>
            <span className="text-15 my-2 font-semibold text-custom-black-25 float-right pr-4 md:pr-2 2xl:pr-4">
              +
            </span>
          </div>
          {/* add ons */}
          <div>
            <p className="text-left  text-custom-black-25 text-xs md:text-sm xl:text-md font-semibold">
              Add Ons
            </p>
            <p className="text-custom-orange align-middle font-semibold text-md md:text-lg lg:text-xl xl:text-2xl">
              ${totalPrices.addOns.toLocaleString()}{" "}
            </p>
          </div>
          {/* = */}
          <div>
            <span className="text-15 my-2 font-semibold text-custom-black-25 float-right pr-4 md:pr-2 2xl:pr-4">
              =
            </span>
          </div>
          {/* Total */}
          <div>
            <p className="text-left  text-custom-black-25 text-xs md:text-sm xl:text-md font-semibold">
              Net Price
            </p>
            <p className="text-custom-orange align-middle font-semibold text-md md:text-lg lg:text-xl xl:text-2xl">
              ${totalPrices.netPrice.toLocaleString()}{" "}
            </p>
          </div>
        </div>

        {/* Base Unit Quantity */}
        <div className="py-2 capitalize flex flex-col justify-center xs:flex-row gap-3 items-center pt-5">
          <h3 className="font-semibold w-[90%] md:w-[65%] text-center xs:text-left text-md xl:text-lg">
            {`Equipter ${productName} Base Unit`}
          </h3>
          <form className="flex justify-end md:flex-1 items-center gap-3">
            <label
              htmlFor="baseQty"
              className="text-sm font-semibold my-auto text-black"
            >
              QTY
            </label>
            <InputField
              name="qty"
              placeholder="1"
              required
              maxUnit={5}
              maxlength={1}
              id="baseQty"
              classes="flex-1 max-w-14 h-auto"
              type="number"
              value={selections.baseUnitQty || 1}
              onChange={(e) => {
                let value = parseInt(e.target.value, 10);
                if (value.toString().split("").length > 1) {
                  value = Number(value.toString().split("")[1]);
                }
                setSelections((prevState) => ({
                  ...prevState,
                  baseUnitQty: isNaN(value) || value < 1 ? 1 : value,
                }));
              }}
            />
          </form>
        </div>

        {/* Accessories Section */}
        {accessoryList.length > 0 && (
          <div className="my-3 font-roboto overflow-y-scroll max-h-[260px] scrollbar-hide">
            <h3 className="font-semibold mb-3 text-lg md:text-xl text-center">
              Add-On Accessories
            </h3>
            <div className="space-y-2 lg:space-y-6">
              {accessoryList.map((accessory, id) => {
                const isSelected =
                  selections.accessories[accessory.id]?.selected;
                const qty = selections.accessories[accessory.id]?.qty || 1;

                return (
                  <div
                    key={accessory.id}
                    className={`p-2 transition-all duration-300 font-roboto ${
                      isSelected ? "text-black" : ""
                    }`}
                  >
                    <div
                      key={accessory.id}
                      className=" flex flex-row items-center justify-between gap-2"
                    >
                      {/* Accessory Checkbox & Label */}
                      <div className="flex items-center gap-2">
                        <input
                          key={id}
                          name="accessory"
                          type="checkbox"
                          id={accessory.id}
                          checked={isSelected || false}
                          className="form-checkbox   "
                          onChange={(e) =>
                            handleAccessoryChange(
                              accessory.id,
                              e.target.checked
                            )
                          }
                        />
                        <label
                          key={accessory.id}
                          htmlFor={accessory.id}
                          className={`font-semibold font-roboto capitalize text-sm xl:text-lg ${
                            isSelected
                              ? "text-gray-800"
                              : "text-custom-med-gray"
                          }`}
                        >
                          {accessory.name}
                        </label>
                      </div>

                      {/* Accessory Price & Info Button */}
                      <div className="flex items-center gap-2">
                        <span className="text-md font-semibold text-gray-800">
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

                    {/* Accessory Quantity if Selected */}
                    {isSelected && (
                      <div className="mt-4 flex justify-end">
                        {accessory?.slides && (
                          <CustomSlider slides={accessory.slides} />
                        )}
                        <form className="flex justify-end items-center gap-3 w-fit">
                          <label
                            htmlFor={`${accessory.id}-qty`}
                            className="text-sm font-semibold my-auto text-black"
                          >
                            QTY
                          </label>
                          <InputField
                            name={`${accessory.id}-qty`}
                            placeholder="1"
                            maxUnit={5}
                            maxlength={2}
                            required
                            id={`${accessory.id}-qty`}
                            classes="max-w-14 h-fit"
                            type="number"
                            value={qty}
                            onChange={(e) => {
                              let newQty = parseInt(e.target.value, 10);
                              if (newQty.toString().split("").length > 1) {
                                newQty = Number(newQty.toString().split("")[1]);
                              }

                              handleAccessoryQtyChange(
                                accessory.id,
                                isNaN(newQty) || newQty < 1 ? 1 : newQty
                              );
                            }}
                          />
                        </form>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Shipping Options */}
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
                    type="checkbox"
                    id={option.id}
                    name="shippingOption"
                    className="form-checkbox "
                    checked={selections.shippingOption === option.id}
                    onChange={() => handleShippingChange(option.id)}
                  />
                  <label
                    htmlFor={option.id}
                    className={`font-semibold capitalize text-sm xl:text-lg ${
                      selections.shippingOption == option.id
                        ? "text-gray-800"
                        : "text-custom-med-gray"
                    }`}
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
    );
  };

  const CashTabStepTwo = () => {
    return (
      <div className="font-roboto space-y-8">
        {/* Build Information */}
        <div className="flex justify-between items-center xl:w-[55%] mb-4">
          <div>
            <p className="text-custom-black-25 text-xs md:text-sm font-semibold">
              Build Total
            </p>
            <p className="text-custom-orange text-md md:text-lg lg:text-xl font-semibold">
              ${totalPrices.netPrice.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-custom-black-25 text-xs md:text-sm font-semibold">
              # of Units
            </p>
            <p className="text-custom-orange text-md md:text-lg lg:text-xl font-semibold">
              {selections.baseUnitQty}
            </p>
          </div>
        </div>

        {/* Accessories Section */}
        <div className="my-3">
          <h3 className="font-semibold text-custom-gray-200 text-lg md:text-xl text-center mb-3">
            Accessories
          </h3>
          {accessoryList.length > 0 ? (
            (() => {
              const selectedAccessories = accessoryList.filter(
                (accessory) => selections.accessories[accessory.id]?.selected
              );

              // Check if any accessories are selected
              if (selectedAccessories.length > 0) {
                return (
                  <div className="space-y-2">
                    {selectedAccessories.map((accessory) => {
                      const qty =
                        selections.accessories[accessory.id]?.qty || 1;
                      return (
                        <div
                          key={accessory.id}
                          className="flex justify-between items-center font-roboto text-sm md:text-base"
                        >
                          <span className="font-semibold capitalize ">
                            {accessory.name}
                          </span>
                          <span className="capitalize font-bold">
                            ${accessory.price}{" "}
                            <span className="text-custom-med-gray">
                              ({qty})
                            </span>
                          </span>
                        </div>
                      );
                    })}
                  </div>
                );
              } else {
                return (
                  <p className="text-sm md:text-base font-semibold">
                    No Accessories Selected
                  </p>
                );
              }
            })()
          ) : (
            <p className="font-semibold">No Accessories Available</p>
          )}
        </div>

        {/* Shipping Options */}
        <div className="my-3">
          <h3 className="text-custom-gray-200 font-semibold text-lg md:text-xl text-center mb-3">
            Shipping
          </h3>
          {shippingOptions.map(
            (option) =>
              selections.shippingOption === option.id && (
                <div
                  key={option.id}
                  className="flex font-semibold justify-between items-center text-sm md:text-base"
                >
                  <span>{option.name}</span>
                  <span>${option.price}</span>
                </div>
              )
          )}
        </div>

        {/* Due Today Section */}
        <div className="mt-5">
          <h3 className="font-semibold text-custom-gray-200 text-lg md:text-xl text-center mb-3">
            Due Today
          </h3>
          <div className="flex justify-between items-center text-sm md:text-base font-semibold">
            <span>Non-Refundable Deposit</span>
            <span>${1500}</span>
          </div>
        </div>

        {/* checkout form */}
        {showCheckOutForm &&
          ReactDOM.createPortal(
            <div className="fixed top-0 z-30 inset-0 backdrop-blur-sm bg-black bg-opacity-10 flex items-center justify-center p-4">
              <CheckoutForm setShowCheckOutForm={setShowCheckOutForm} productDetails={productDetails} filteredAccessory={filteredAccessory} selections={selections}/>
            </div>,
            document.body
          )}
      </div>
    );
  };

  if (cashTabStep == 1) {
    return <CashTabStepOne />;
  }
  if (cashTabStep == 2) {
    return <CashTabStepTwo />;
  }
};
export default CashTab;
