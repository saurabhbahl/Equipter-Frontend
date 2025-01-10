import { useClientContext } from "../../../../hooks/useClientContext";

const CashTab = () => {
  const { totalPrices, selections, sidebarSteps } = useClientContext();

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
              ${totalPrices?.addOns?.toLocaleString()}{" "}
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
              Net Price{"              "}
              {"     "}
            </p>
            <p className="text-custom-orange align-middle font-semibold text-md md:text-lg lg:text-xl xl:text-2xl">
              ${totalPrices.netPrice.toLocaleString()}{" "}
            </p>
          </div>
        </div>
      </div>
    );
  };

  const CashTabStepTwo = () => {
    return (
      <div className=" font-roboto space-y-8">
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
      </div>
    );
  };

  if (sidebarSteps.cashStep == 1) {
    return <CashTabStepOne />;
  }
  if (sidebarSteps.cashStep == 2) {
    return <CashTabStepTwo />;
  }
};
export default CashTab;
