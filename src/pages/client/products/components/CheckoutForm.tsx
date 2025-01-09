import React, { useEffect, useRef, useState } from "react";
import InputFieldCurved from "../../../../components/utils/InputFieldCurved";
import GroupClose from "../../../utils/GroupClose";
import GroupOpen from "../../../utils/GroupOpen";
import { useClientContext } from "../../../../hooks/useClientContext";
import CloseBtn from "../../../utils/CloseBtn";
import {
  CheckoutFormDefaultValues,
  IAccessory,
  ICheckoutForm,
  IProduct,
} from "../../types/ClientSchemas";
import { CheckoutFormSchema } from "../../types/Validations";
import SelectField from "../../../../components/utils/SelectFeild";
import { IState, ShippingOption } from "../../../../contexts/ClientContext";
import { publicApiClient } from "../../../../utils/axios";

interface ICheckoutFormProps {
  productDetails: IProduct;
  filteredAccessory: IAccessory[];
}
const STORAGE_KEY = "checkoutData";
const EXPIRATION_TIME = 15 * 24 * 60 * 60 * 1000;

const CheckoutForm = ({
  productDetails,
  filteredAccessory,
}: ICheckoutFormProps) => {
  const {
    shippingOptions,
    statesData,
    activeTab,
    selections,
    setTotalPrices,
    firstPageForm,
    loadFromLocalStorage,
    saveToLocalStorage,
    filterState,
    totalPrices,
    setShippingOptions,
    setSidebarSteps,
  } = useClientContext();

  const [checkoutForm, setCheckoutForm] = useState<ICheckoutForm>(
    CheckoutFormDefaultValues
  );
  const [validationErrors, setValidationErrors] = useState<
    { [key in keyof ICheckoutForm]?: string }
  >({});
  // states for different sections
  const [isBuildSummaryOpen, setIsBuildSummaryOpen] = useState(true);
  const [isContactInfoOpen, setIsContactInfoOpen] = useState(true);
  const [isPaymentDetailsOpen, setIsPaymentDetailsOpen] = useState(true);
  const [isDeliveryAddressOpen, setIsDeliveryAddressOpen] = useState(true);
  const [isBillingInfoOpen, setIsBillingInfoOpen] = useState(true);
  const inputRef: React.RefObject<HTMLInputElement> = useRef(null);
  const [selectedDelivery, setSelectedDelivery] = useState<ShippingOption>();

  const getDigits = (input: string) => input.replace(/\D/g, "");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    let newValue: string | boolean | number;
    let checked;

    if (type === "checkbox") {
      checked = (e.target as HTMLInputElement).checked;
      newValue = checked;
    } else {
      newValue = value;
    }

    if (name === "delivery_address_state_id") {
      const state = filterState(value);
      const newShippingOption: ShippingOption[] = [
        { id: "pickup", name: "Pick-up", price: 0 },
        {
          id: "delivery",
          name: `Delivery to the State of ${state.state_name}`,
          price: parseFloat(state.shipping_rate),
          uuid: state.state_id,
          zone_id: state.zone_id,
          zone_name: state.zone_name,
        },
      ];
      setShippingOptions([...newShippingOption]);

      setCheckoutForm((prev) => ({ ...prev, zone_id: state.zone_id }));
    }

    // Handle card number formatting
    if (name === "payment_card_number") {
      const digits = getDigits(value).slice(0, 16);
      let formattedCardNumber = digits.replace(/(.{4})/g, "$1-").trim();
      if (formattedCardNumber.endsWith("-")) {
        formattedCardNumber = formattedCardNumber.slice(0, -1);
      }
      newValue = formattedCardNumber;
    }

    // Handle card expiry validation
    if (name === "payment_expiry") {
      let digits = getDigits(value).slice(0, 4); // MMYY
      if (digits.length > 2) {
        digits = digits.slice(0, 2) + "/" + digits.slice(2);
      }
      newValue = digits;
    }

    // Handle CVC (limit to 4 digits)
    if (name === "payment_cvc") {
      newValue = getDigits(value).slice(0, 4);
    }

    // Handle Billing same as Delivery than copy data
    if (name === "billing_same_as_delivery") {
      if (checked) {
        // Remove any validation errors for billing address
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          billing_address_street: undefined,
          billing_address_city: undefined,
          billing_address_state: undefined,
          billing_address_zip_code: undefined,
          billing_address_country: undefined,
        }));

        setCheckoutForm((prevForm) => ({
          ...prevForm,
          billing_same_as_delivery: true,
          billing_address_street: prevForm.delivery_address_street as string,
          billing_address_city: prevForm.delivery_address_city as string,
          billing_address_state: prevForm.delivery_address_state_id as string,
          billing_address_zip_code: prevForm.delivery_address_zip_code as string,
          billing_address_country: prevForm.delivery_address_country as string,
        }));
      } else {
        // If user unchecks, just set it to false (fields remain but are again independent)
        setCheckoutForm((prevForm) => ({
          ...prevForm,
          billing_same_as_delivery: false,
        }));
      }
      return;
    }

    setCheckoutForm((prevForm) => ({
      ...prevForm,
      [name]: newValue,
    }));
    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      [name]: undefined,
    }));
    saveToLocalStorage(checkoutForm, STORAGE_KEY, EXPIRATION_TIME);
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
   
    e.preventDefault();
    setCheckoutForm((prev: ICheckoutForm) => ({
      ...prev,
      shipping_method_used:
        selections.shippingOption == "pickup"
          ? selections.shippingOption
          : "delivery",
      zone_id: selectedDelivery?.zone_id,
      delivery_cost:
        selections.shippingOption == "pickup"
          ? "0"
          : String(selectedDelivery?.price),
      accessories: filteredAccessory,
      non_refundable_deposit: Math.floor(
        Number((Number(totalPrices.netPrice) * 0.2).toFixed(2))
      ),
    }));

    const validation = CheckoutFormSchema.safeParse(checkoutForm);

    if (!validation.success) {
      const newErrors: { [key in keyof ICheckoutForm]?: string } = {};
      validation.error.issues.forEach((issue) => {
        const fieldName = issue.path[0] as keyof ICheckoutForm;
        newErrors[fieldName] = issue.message;
      });
      setValidationErrors(newErrors);

      const sections = {
        contactInfo: [
          "contact_first_name",
          "contact_last_name",
          "contact_company_name",
          "contact_phone_number",
          "contact_email",
        ] as const,
        paymentDetails: [
          "payment_name_on_card",
          "payment_card_number",
          "payment_expiry",
          "payment_cvc",
        ] as const,
        deliveryAddress: [
          "delivery_address_street",
          "delivery_address_city",
          "delivery_address_state_id",
          "delivery_address_zip_code",
          "delivery_address_country",
        ] as const,
        billingInfo: [
          "billing_address_street",
          "billing_address_city",
          "billing_address_state",
          "billing_address_zip_code",
          "billing_address_country",
        ] as const,
        depositAgreement: ["i_understand_deposit_is_non_refundable"] as const,
      };

      // Function to check if any fields in a section have errors
      const hasErrorsInSection = (fields: readonly (keyof ICheckoutForm)[]) =>
        fields.some((field) => newErrors[field]);

      // Open sections that have validation errors
      if (hasErrorsInSection(sections.contactInfo)) {
        setIsContactInfoOpen(true);
      }
      if (hasErrorsInSection(sections.paymentDetails)) {
        setIsPaymentDetailsOpen(true);
      }
      if (hasErrorsInSection(sections.deliveryAddress)) {
        setIsDeliveryAddressOpen(true);
      }
      if (hasErrorsInSection(sections.billingInfo)) {
        setIsBillingInfoOpen(true);
      }
      return;
    }


    const result = await publicApiClient.post("/webquote", { checkoutForm });
 
    if(result.data.success){
      setSidebarSteps((prev)=>({...prev,showCheckOutForm:false,showThankYouTab:true}))
    }
  };
  //  the first input on mount
  useEffect(() => {
    if (inputRef.current !== null) {
      inputRef.current.focus();
    }

    // Prefill certain fields from firstPageForm
    setCheckoutForm((prev: ICheckoutForm) => ({
      ...prev,
      contact_first_name: firstPageForm.fName as string,
      contact_last_name: firstPageForm.lName,
      contact_company_name: firstPageForm.company,
      contact_phone_number: firstPageForm.phNo,
      contact_email: firstPageForm.email,
      contact_job_title: firstPageForm.jobTitle,
      delivery_address_state_id: firstPageForm.state,
      financing: activeTab,
      product_id: productDetails.id,
      product_name: productDetails.name,
      product_price: Number(productDetails.price),
      product_qty: selections.baseUnitQty,
      zone_id: selectedDelivery?.zone_id,
      product_total_cost: Number(productDetails.price) * selections.baseUnitQty,
      shipping_method_used:
        selections.shippingOption == "pickup"
          ? selections.shippingOption
          : "delivery",
      contact_industry: (firstPageForm.industry as string) ?? "",
    }));
    const savedData = loadFromLocalStorage(STORAGE_KEY);
    if (savedData) {
      setCheckoutForm({
        ...savedData,
        i_understand_deposit_is_non_refundable: false,
        payment_card_number: "",
        payment_cvc: "",
        payment_expiry: "",
        payment_name_on_card: "",
      });
    }
  }, [firstPageForm, activeTab]);
  // Sync up billing if "billing_same_as_delivery" is true
  useEffect(() => {
    if (checkoutForm.billing_same_as_delivery) {
      setCheckoutForm((prevForm) => ({
        ...prevForm,
        billing_address_street: prevForm.delivery_address_street as string,
        billing_address_city: prevForm.delivery_address_city as string,
        billing_address_state: prevForm.delivery_address_state_id as string,
        billing_address_zip_code: prevForm.delivery_address_zip_code as string,
        billing_address_country: prevForm.delivery_address_country as string,
      }));
    }
  }, [
    checkoutForm.delivery_address_street,
    checkoutForm.delivery_address_city,
    checkoutForm.delivery_address_state_id,
    checkoutForm.delivery_address_zip_code,
    checkoutForm.delivery_address_country,
    checkoutForm.billing_same_as_delivery,
  ]);
  useEffect(() => {
    const delivery = shippingOptions.find(
      (sh) => sh?.id == selections?.shippingOption
    );
    setSelectedDelivery(delivery);
  }, [checkoutForm.delivery_address_state_id]);

  // Update total prices when selections change
  useEffect(() => {
    if (!productDetails?.price) return;

    const basePrice = parseFloat(productDetails.price) * selections.baseUnitQty;

    let shippingPrice = 0;
    if (selections.shippingOption) {
      const shippingOption = shippingOptions.find(
        (option) => option.id === selections.shippingOption
      );
      if (shippingOption) {
        shippingPrice = shippingOption.price;
      }
    }

    const netPrice = basePrice + shippingPrice;

    setTotalPrices({
      basePrice,
      netPrice,
    });
  }, [
    selections,
    productDetails?.price,
    checkoutForm.delivery_address_state_id,
  ]);

  // useEffect(() => {
  //   console.log("first")
  //   setFirstPageForm((prev)=>({ ...prev, state:selections?.selectedState?.state_id }));
  // }, [selections,shippingOptions,totalPrices])

  return (
    <form
      onSubmit={handleSubmit}
      className="z-50 w-full md:max-w-[80%] xl:max-w-[60%] mx-auto p-4 p lg:p-8 lg:pl-5 bg-white overflow-y-auto    shadow-2xl relative scrollbar-custom pt-10  max-h-[90vh]   sm:max-h-[80vh]   md:max-h-[80%]     xl:max-h-[85vh] "
    >
      {/* close btn */}
      <button
        tabIndex={-1}
        className="absolute right-3 top-5 lg:right-6"
        onClick={() =>
          setSidebarSteps((prev) => ({ ...prev, showCheckOutForm: false }))
        }
      >
        <CloseBtn />
      </button>
      {/* Build Summary */}
      <div className="flex items-start mb-4 overflow-y-auto">
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setIsBuildSummaryOpen(!isBuildSummaryOpen)}
          className={`${isBuildSummaryOpen ? "pt-0.5 pr-3" : "pr-3 pt-[3px]"}`}
          aria-expanded={isBuildSummaryOpen}
          aria-controls="buildSummaryContent"
        >
          {isBuildSummaryOpen ? <GroupClose /> : <GroupOpen />}
        </button>

        {isBuildSummaryOpen ? (
          <div className="flex-1" id="buildSummaryContent">
            <h2 className="font-semibold text-md  lg:font-bold  lg:text-xl  mb-4 text-custom-black-200">
              Build Summary
            </h2>
            <div className="flex flex-col lg:w-[60%] text-black lg:font-bold font-semibold text-sm lg:text-[17px] space-y-2">
              {/* product info */}
              <div className="flex justify-between">
                <p>Equiter {productDetails?.name}</p>
                <p>
                  ${Number(productDetails?.price) * selections?.baseUnitQty}{" "}
                  <span className="text-custom-med-gray">
                    ({selections.baseUnitQty})
                  </span>
                </p>
              </div>
              {/* accessories */}
              <div className="flex gap-1 justify-between flex-col">
                {filteredAccessory.map((acc) => {
                  return (
                    <div className="flex justify-between " key={acc.id}>
                      <p className="capitalize">{acc.name}</p>
                      <p>
                        ${Number(acc.price) * acc.qty}{" "}
                        <span className="text-custom-med-gray">
                          ({acc.qty})
                        </span>
                      </p>
                    </div>
                  );
                })}
              </div>
              {/* delivery */}
              {shippingOptions.map(
                (option) =>
                  selections.shippingOption === option.id && (
                    <div key={option.id} className="flex  justify-between pr-5">
                      <p>{option.name}</p>
                      <span>${option.price}</span>
                    </div>
                  )
              )}
            </div>
          </div>
        ) : (
          <h2 className="flex-1 font-semibold text-md  lg:font-bold  lg:text-xl  mb-4 text-custom-black-200">
            Build Summary
          </h2>
        )}
      </div>

      {/* Contact Info */}
      <div className="flex items-start mb-4">
        <button
          tabIndex={-1}
          onClick={(e) => {
            e.currentTarget.blur();
            setIsContactInfoOpen(!isContactInfoOpen);
          }}
          className={`${isContactInfoOpen ? "pt-0.5 pr-3" : "pr-3 pt-[3px]"}`}
          aria-expanded={isContactInfoOpen}
          aria-controls="contactInfoContent"
        >
          {isContactInfoOpen ? <GroupClose /> : <GroupOpen />}
        </button>
        {isContactInfoOpen ? (
          <div className="flex-1" id="contactInfoContent">
            <h2 className="font-semibold text-md  lg:font-bold  lg:text-xl  mb-4 text-custom-black-200">
              Contact Info
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
              <InputFieldCurved
                label="First Name*"
                type="text"
                ref={inputRef}
                id="contact_first_name"
                error={validationErrors.contact_first_name}
                name="contact_first_name"
                value={checkoutForm.contact_first_name}
                onChange={handleChange}
              />
              <InputFieldCurved
                label="Last Name*"
                type="text"
                id="contact_last_name"
                name="contact_last_name"
                value={checkoutForm.contact_last_name}
                onChange={handleChange}
                error={validationErrors.contact_last_name}
              />
              <InputFieldCurved
                label="Company*"
                type="text"
                id="contact_company_name"
                name="contact_company_name"
                value={checkoutForm.contact_company_name}
                onChange={handleChange}
                error={validationErrors.contact_company_name}
              />
              <InputFieldCurved
                label="Phone Number*"
                type="text"
                id="contact_phone_number"
                name="contact_phone_number"
                value={checkoutForm.contact_phone_number as number}
                onChange={handleChange}
                error={validationErrors.contact_phone_number}
              />
              <InputFieldCurved
                label="Email*"
                type="email"
                id="contact_email"
                name="contact_email"
                value={checkoutForm.contact_email}
                onChange={handleChange}
                error={validationErrors.contact_email}
              />
            </div>
          </div>
        ) : (
          <h2 className="font-semibold text-md  lg:font-bold  lg:text-xl  mb-4 text-custom-black-200">
            Contact Info
          </h2>
        )}
      </div>

      {/* Payment Details */}
      <div className="flex items-start mb-4">
        <button
          tabIndex={-1}
          onClick={(e) => {
            e.currentTarget.blur();
            setIsPaymentDetailsOpen(!isPaymentDetailsOpen);
          }}
          className={`${
            isPaymentDetailsOpen ? "pt-0.5 pr-3" : "pr-3 pt-[3px]"
          }`}
          aria-expanded={isPaymentDetailsOpen}
          aria-controls="paymentDetailsContent"
        >
          {isPaymentDetailsOpen ? <GroupClose /> : <GroupOpen />}
        </button>
        {isPaymentDetailsOpen ? (
          <div className="flex-1" id="paymentDetailsContent">
            <h2 className="font-semibold text-md  lg:font-bold  lg:text-xl  mb-4 text-custom-black-200">
              Payment Details
            </h2>
            <div className="grid grid-cols-1 ">
              <InputFieldCurved
                label="Name on Card*"
                type="text"
                id="payment_name_on_card"
                name="payment_name_on_card"
                value={checkoutForm.payment_name_on_card}
                onChange={handleChange}
                error={validationErrors.payment_name_on_card}
              />
              <InputFieldCurved
                label="Card Number*"
                type="text"
                id="payment_card_number"
                name="payment_card_number"
                maxlength={19}
                error={validationErrors.payment_card_number}
                value={checkoutForm.payment_card_number}
                onChange={handleChange}
              />
              <div className="flex gap-3 grid-cols-2">
                <InputFieldCurved
                  label="Expiration(MM/YY)*"
                  type="text"
                  id="payment_expiry"
                  name="payment_expiry"
                  maxlength={5}
                  value={checkoutForm.payment_expiry}
                  error={validationErrors.payment_expiry}
                  onChange={handleChange}
                />
                <InputFieldCurved
                  label="CVC*"
                  type="number"
                  id="payment_cvc"
                  maxlength={4}
                  name="payment_cvc"
                  value={checkoutForm.payment_cvc}
                  error={validationErrors.payment_cvc}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        ) : (
          <h2 className="font-semibold text-md  lg:font-bold  lg:text-xl  mb-4 text-custom-black-200">
            Payment Details
          </h2>
        )}
      </div>

      {/* Delivery Address */}
      <div className="flex items-start mb-4">
        <button
          tabIndex={-1}
          onClick={(e) => {
            e.currentTarget.blur();
            setIsDeliveryAddressOpen(!isDeliveryAddressOpen);
          }}
          className={`${
            isDeliveryAddressOpen ? "pt-0.5 pr-3" : "pr-3 pt-[3px]"
          }`}
          aria-expanded={isDeliveryAddressOpen}
          aria-controls="deliveryAddressContent"
        >
          {isDeliveryAddressOpen ? <GroupClose /> : <GroupOpen />}
        </button>
        {isDeliveryAddressOpen ? (
          <div className="flex-1" id="deliveryAddressContent">
            <h2 className="font-semibold text-md  lg:font-bold  lg:text-xl  mb-4 text-custom-black-200">
              Delivery Address
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
              <InputFieldCurved
                label="Address"
                type="text"
                id="delivery_address_street"
                name="delivery_address_street"
                value={checkoutForm.delivery_address_street}
                onChange={handleChange}
                error={validationErrors.delivery_address_street}
              />
              <InputFieldCurved
                label="City"
                type="text"
                id="delivery_address_city"
                name="delivery_address_city"
                value={checkoutForm.delivery_address_city}
                onChange={handleChange}
                error={validationErrors.delivery_address_city}
              />
              <SelectField
                label="State*"
                id="delivery_address_state_id"
                name="delivery_address_state_id"
                labelClasses={
                  "text-[12px] lg:text-[14px]  mb-2 !text-[#666666]"
                }
                classes="mt-1 text-[#666666] text-xs font-noto-sans rounded-md block w-full  border border-inset border-custom-gray-200 outline-none px-3 h-8 lg:h-12 py-2 lg:py-3.5"
                defaultValue="Select State*"
                value={checkoutForm.delivery_address_state_id || ""}
                onChange={handleChange}
                options={statesData
                  ?.filter((state) => state.is_delivery_paused == false)
                  .map((state: IState) => ({
                    value: state.state_id,
                    label: state.state_name,
                  }))}
                error={validationErrors.delivery_address_state_id}
              />

              <InputFieldCurved
                label="Zip Code"
                type="number"
                id="delivery_address_zip_code"
                name="delivery_address_zip_code"
                value={checkoutForm.delivery_address_zip_code}
                onChange={handleChange}
                error={validationErrors.delivery_address_zip_code}
              />

              <SelectField
                label="Country*"
                labelClasses={
                  "text-[12px] lg:text-[14px]  mb-2 !text-[#666666]"
                }
                classes="mt-1 text-[#666666] text-xs font-noto-sans rounded-md block w-full  border border-inset border-custom-gray-200 outline-none px-3 h-8 lg:h-12 py-2 lg:py-3.5"
                defaultValue="Select Country"
                id="delivery_address_country"
                name="delivery_address_country"
                error={validationErrors.delivery_address_country}
                value={checkoutForm.delivery_address_country}
                onChange={handleChange}
                options={[{ value: "United States", label: "United States" }]}
              />
            </div>
          </div>
        ) : (
          <h2 className="font-semibold text-md  lg:font-bold  lg:text-xl  mb-4 text-custom-black-200">
            Delivery Address
          </h2>
        )}
      </div>

      {/* Billing Information */}
      <div className="flex items-start mb-4">
        <button
          tabIndex={-1}
          onClick={(e) => {
            e.currentTarget.blur();
            setIsBillingInfoOpen(!isBillingInfoOpen);
          }}
          className={`${isBillingInfoOpen ? "pt-0.5 pr-3" : "pr-3 pt-[3px]"}`}
          aria-expanded={isBillingInfoOpen}
          aria-controls="billingInfoContent"
        >
          {isBillingInfoOpen ? <GroupClose /> : <GroupOpen />}
        </button>
        {isBillingInfoOpen ? (
          <div className="flex-1" id="billingInfoContent">
            <div className="flex mb-4 md:flex-row flex-col">
              <h2 className="font-semibold text-md  lg:font-bold  lg:text-xl   text-custom-black-200">
                Billing Information
              </h2>
              <label
                htmlFor="billing_same_as_delivery"
                className=" text-xs lg:text-sm lg:!ml-8  text-[#666666] lg:flex items-end "
              >
                <input
                  className="form-checkbox mr-3 pt-1 mt-0.5 "
                  type="checkbox"
                  id="billing_same_as_delivery"
                  name="billing_same_as_delivery"
                  checked={checkoutForm.billing_same_as_delivery}
                  onChange={handleChange}
                />
                Billing address is same as delivery address
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
              <InputFieldCurved
                label="Address*"
                type="text"
                id="billing_address_street"
                name="billing_address_street"
                value={checkoutForm.billing_address_street}
                disabled={checkoutForm.billing_same_as_delivery}
                onChange={handleChange}
                error={validationErrors.billing_address_street}
              />
              <InputFieldCurved
                label="City*"
                type="text"
                id="billing_address_city"
                name="billing_address_city"
                disabled={checkoutForm.billing_same_as_delivery}
                value={checkoutForm.billing_address_city}
                error={validationErrors.billing_address_city}
                onChange={handleChange}
              />

              <SelectField
                label="State*"
                labelClasses={
                  "text-[12px] lg:text-[14px]  mb-2 !text-[#666666]"
                }
                classes="mt-1 text-[#666666] text-xs font-noto-sans rounded-md block w-full  border border-inset border-custom-gray-200 outline-none px-3 h-8 lg:h-12 py-2 lg:py-3.5"
                defaultValue="Select State"
                id="billing_address_state"
                name="billing_address_state"
                error={validationErrors.billing_address_state || ""}
                value={checkoutForm.billing_address_state}
                onChange={handleChange}
                options={statesData
                  ?.filter((state) => state.is_delivery_paused == false)
                  .map((state: IState) => ({
                    value: state.state_id,
                    label: state.state_name,
                  }))}
              />

              <InputFieldCurved
                label="Zip Code*"
                type="number"
                disabled={checkoutForm.billing_same_as_delivery}
                id="billing_address_zip_code"
                name="billing_address_zip_code"
                error={validationErrors.billing_address_zip_code}
                value={checkoutForm.billing_address_zip_code}
                onChange={handleChange}
              />
              <SelectField
                labelClasses={
                  "text-[12px] lg:text-[14px]  mb-2 !text-[#666666]"
                }
                classes="mt-1 text-[#666666] text-xs font-noto-sans rounded-md block w-full  border border-inset border-custom-gray-200 outline-none px-3 h-8 lg:h-12 py-2 lg:py-3.5"
                label="Country*"
                defaultValue="Select Country"
                id="billing_address_country"
                name="billing_address_country"
                error={validationErrors.billing_address_country}
                value={checkoutForm.billing_address_country}
                onChange={handleChange}
                options={[{ value: "United States", label: "United States" }]}
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center mb-2">
            <h2 className="font-semibold text-md  lg:font-bold  lg:text-xl  text-custom-black-200">
              Billing Information
            </h2>
            <label
              htmlFor="billing_same_as_delivery"
              className="text-xs lg:text-sm lg:!ml-8  text-[#666666] flex items-end "
            >
              <input
                className="form-checkbox mr-3  "
                type="checkbox"
                id="billing_same_as_delivery"
                name="billing_same_as_delivery"
                checked={checkoutForm.billing_same_as_delivery}
                onChange={handleChange}
              />
              Billing address is same as delivery address
            </label>
          </div>
        )}
      </div>
      {/* submit btn */}
      <div className="pl-6 flex  flex-col mb-8 gap-2">
        <div className="font-roboto gap-3 lg:gap-8 flex flex-col lg:flex-row w-full justify-between items-center">
          <div className="w-[100%] lg:w-[60%]">
            <p className="text-[#666666] font-semibold lg:font-bold lg:text-[15px]">
              Due Today
            </p>
            <div className="flex w-full justify-between items-center font-semibold lg:font-bold">
              <p className="text-black  text-[16px]  2xl:text-[20px]">
                Non-Refundable Deposit
              </p>

              <span>
                $
                {Math.floor(
                  Number((Number(totalPrices.netPrice) * 0.2).toFixed(2))
                )}
              </span>
            </div>

            <p className="text-custom-med-gray text-[12px] mt-1">
              Once you confirm your build, your Equipter will be set for
              production and your deposit will be non-refundable. Pricing and
              options are subject to change until your Equiper is built.
            </p>
          </div>
          <label
            htmlFor="depositAgree"
            className="text-sm text-[#666666] flex lg:hidden items-center font-noto-sans"
          >
            <input
              className="form-checkbox mr-3"
              type="checkbox"
              id="i_understand_deposit_is_non_refundable"
              name="i_understand_deposit_is_non_refundable"
              checked={checkoutForm.i_understand_deposit_is_non_refundable}
              onChange={handleChange}
            />
            I understand my deposit is non-refundable.
          </label>
          <button className="btn-yellow w-full lg:w-[35%] h-fit capitalize">
            Submit Deposit
          </button>
        </div>
        <label
          htmlFor="depositAgree"
          className="text-sm hidden  text-[#666666] lg:flex items-center font-noto-sans"
        >
          <input
            className="form-checkbox mr-3"
            type="checkbox"
            id="i_understand_deposit_is_non_refundable"
            name="i_understand_deposit_is_non_refundable"
            checked={checkoutForm.i_understand_deposit_is_non_refundable}
            onChange={handleChange}
          />
          I understand my deposit is non-refundable.
        </label>
        {validationErrors.i_understand_deposit_is_non_refundable && (
          <span className="text-red-500 h-6 text-[10px] font-bold">
            {validationErrors.i_understand_deposit_is_non_refundable}
          </span>
        )}
      </div>
    </form>
  );
};

export default CheckoutForm;
