import InputField from "../../../../components/utils/InputFeild";
import { IAccessory, IProduct } from "../../types/ClientSchemas";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfo } from "@fortawesome/free-solid-svg-icons";
import CustomSlider from "../../components/CustomSlider";

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
  

  return (
    <div className="">
      {/* Price Table */}
      <div className="font-roboto flex justify-between items-center">
        {/* base price */}
        <div>
          <p className="text-left  text-custom-black-25 text-xs md:text-sm xl:text-md font-semibold">
            Base Price
          </p>
          <p className="text-custom-orange-100 align-middle font-semibold text-md md:text-lg lg:text-xl xl:text-2xl">
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
          <p className="text-custom-orange-100 align-middle font-semibold text-md md:text-lg lg:text-xl xl:text-2xl">
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
          <p className="text-custom-orange-100 align-middle font-semibold text-md md:text-lg lg:text-xl xl:text-2xl">
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
          <label htmlFor="baseQty" className="text-sm font-semibold my-auto text-black">
            QTY
          </label>
          <InputField
            name="qty"
            placeholder="1"
            required
            id="baseQty"
            classes="flex-1 max-w-14 h-auto"
            type="number"
            value={(selections.baseUnitQty) || 1}
            onChange={(e) => {
              
              const value = parseInt(e.target.value, 10);
              if(value>5){
                return
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
            {accessoryList.map((accessory) => {
              const isSelected = selections.accessories[accessory.id]?.selected;
              const qty = selections.accessories[accessory.id]?.qty || 1;

              return (
                <div
                  key={accessory.id}
                  className={`p-2 transition-all duration-300 font-roboto ${
                    isSelected ? "text-black" : ""
                  }`}
                >
                  <div className="flex flex-row items-center justify-between gap-2">
                    {/* Accessory Checkbox & Label */}
                    <div className="flex items-center gap-2">
                      <input
                        name="accessory"
                        type="checkbox"
                        id={accessory.id}
                        checked={isSelected || false}
                        className="form-checkbox   "
                        onChange={(e) =>
                          handleAccessoryChange(accessory.id, e.target.checked)}/>
                      <label
                        htmlFor={accessory.id}
                        className={`font-semibold capitalize text-sm xl:text-lg ${
                          isSelected ? "text-gray-800" : "text-gray-400"
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
                        aria-label={`Info about ${accessory.name}`}>
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
                          className="text-sm font-semibold my-auto text-black">
                          QTY
                        </label>
                        <InputField
                          name={`${accessory.id}-qty`}
                          placeholder="1"
                          required
                          id={`${accessory.id}-qty`}
                          classes="max-w-14 h-fit"
                          type="number"
                          value={qty}
                          onChange={(e) => {
                            const newQty = parseInt(e.target.value, 10);
                            if(newQty>5){
                              return
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
            <div key={option} className="flex items-center justify-between">
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
                  className={`font-semibold capitalize text-sm xl:text-lg ${selections.shippingOption == option.id ? "text-gray-800" : "text-gray-400"}`}>
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
export default CashTab;
