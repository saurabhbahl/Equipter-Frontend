import { useClientContext } from "../../../../hooks/useClientContext";

const FinancingTab = () => {
  const { totalPrices, sidebarSteps, selections } = useClientContext();

  const FinancingTabStepOne = () => {
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
          {/* Estimated Payment */}
          <div>
            <p className="text-left  text-custom-black-25 text-xs md:text-sm xl:text-md font-semibold">
              Est.Mo.Payment
            </p>
            <p className="text-custom-orange align-middle font-semibold text-md md:text-lg lg:text-xl xl:text-2xl">
              ${Math.ceil(Number(totalPrices.netPrice) / 24)}
            </p>
          </div>
        </div>
      </div>
    );
  };

  const FinancingTabStepTwo = () => {
    return (
      <div className=" font-roboto space-y-8">
        {/* Payment Information */}
        <div className="flex justify-between items-center xl:w-[55%] mb-4">
          <div>
            <p className="text-custom-black-25 text-xs md:text-sm font-semibold">
              Est. Mo. Payment
            </p>
            <p className="text-custom-orange text-md md:text-lg lg:text-xl font-semibold">
              ${Math.ceil(Number(totalPrices.netPrice) / 24)}
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

  if (sidebarSteps.financingStep == 1) {
    return <FinancingTabStepOne />;
  }
  if (sidebarSteps.financingStep == 2) {
    return <FinancingTabStepTwo />;
  }
};
export default FinancingTab;
