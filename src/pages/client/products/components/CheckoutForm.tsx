import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";

import GroupClose from "../../../utils/GroupClose";
import GroupOpen from "../../../utils/GroupOpen";
import { useClientContext } from "../../../../hooks/useClientContext";
import CloseBtn from "../../../utils/CloseBtn";
import InputField from "../../../../components/utils/InputFeild";

const CheckoutForm = ({
  setShowCheckOutForm,
}: {
  setShowCheckOutForm: Dispatch<SetStateAction<boolean>>;
}) => {
  const { checkoutForm, setCheckoutForm } = useClientContext();
  const [isBuildSummaryOpen, setIsBuildSummaryOpen] = useState(true);
  const [isContactInfoOpen, setIsContactInfoOpen] = useState(true);
  const [isPaymentDetailsOpen, setIsPaymentDetailsOpen] = useState(true);
  const [isDeliveryAddressOpen, setIsDeliveryAddressOpen] = useState(true);
  const [isBillingInfoOpen, setIsBillingInfoOpen] = useState(true);
//   const [inputRef]
  const inputRef:React.RefObject<HTMLInputElement> = useRef(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    console.log( inputRef.current)
    // inputRef.current?.focus()
console.log( name, value, type, checked)
    if (name === "billing_same_as_delivery" && checked === true) {
      setCheckoutForm((prevForm) => ({
        ...prevForm,
        billing_same_as_delivery: true,
        billing_address_street: prevForm.delivery_address_street,
        billing_address_city: prevForm.delivery_address_city,
        billing_address_state_id: prevForm.delivery_address_state_id,
        billing_address_zip_code: prevForm.delivery_address_zip_code,
        billing_address_country: prevForm.delivery_address_country,
      }));
      return;
    }

    setCheckoutForm((prevForm) => ({
      ...prevForm,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Submit logic here
    console.log("Form data:", checkoutForm);
  };
  useEffect(() => {
    console.log(inputRef.current)
    if (inputRef.current !== null) {
      inputRef.current.focus();
    }
  }, []);
  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-[50%] mx-auto p-4 lg:p-8 lg:pl-5 bg-white overflow-y-auto max-h-[900px] shadow-2xl relative !scrollbar-hidden pt-16"
    >
      <button
        tabIndex={-1}
        className="absolute right-3"
        onClick={() => setShowCheckOutForm(false)}
      >
        <CloseBtn />
      </button>
      {/* Build Summary */}
      <div className="flex items-start mb-4">
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

        {/* {isBuildSummaryOpen ? ( */}
        <div
          className="flex-1"
          id="buildSummaryContent"
          style={{ display: isBuildSummaryOpen ? "block" : "none" }}
        >
          <h2 className="font-bold text-xl mb-4 text-custom-black-200">
            Build Summary
          </h2>
          <div className="flex flex-col w-[60%] text-black font-bold text-[17px] space-y-2">
            <div className="flex justify-between">
              <p>Equiter 4000</p>
              <p>
                $38,900 <span className="text-custom-med-gray">(1)</span>
              </p>
            </div>
            <div className="flex justify-between">
              <p>Roofing Accessories Package</p>
              <p>
                $995 <span className="text-custom-med-gray">(1)</span>
              </p>
            </div>
            <div className="flex justify-between pr-5">
              <p>Pick-up</p>
              <p>$0</p>
            </div>
          </div>
        </div>
        {/* ) : ( */}
        <h2
          style={{ display: !isBuildSummaryOpen ? "block" : "none" }}
          className="flex-1 font-bold text-xl mb-4 text-custom-black-200"
        >
          Build Summary
        </h2>
        {/* )} */}
      </div>

      {/* Contact Info */}
      <div className="flex items-start mb-4">
        <button
          type="button"
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
        {/* {isContactInfoOpen ? ( */}
        <div
          className="flex-1"
          id="contactInfoContent"
          style={{ display: isContactInfoOpen ? "block" : "none" }}
        >
          <h2 className="font-bold text-xl mb-4 text-custom-black-200">
            Contact Info
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
            <InputField
              label="First Name*"
              type="text"
              inputRef={inputRef}
              id="contact_first_name"
              name="contact_first_name"
              value={checkoutForm.contact_first_name}
              onChange={handleChange}
              required
            />
            <InputField
              label="Last Name*"
              type="text"
              inputRef={inputRef}
              id="contact_last_name"
              name="contact_last_name"
              value={checkoutForm.contact_last_name}
              onChange={handleChange}
              required
            />
            <InputField
              label="Company*"
              inputRef={inputRef}
              type="text"
              id="contact_company_name"
              name="contact_company_name"
              value={checkoutForm.contact_company_name}
              onChange={handleChange}
              required
            />
            <InputField
              label="Phone Number*"
              type="tel"
              inputRef={inputRef}
              id="contact_phone_number"
              name="contact_phone_number"
              value={checkoutForm.contact_phone_number as number}
              onChange={handleChange}
              required
            />
            <InputField
              label="Email*"
              type="email"
              id="contact_email"
              name="contact_email"
              value={checkoutForm.contact_email}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        {/* ) : ( */}
        <h2
          style={{ display: !isContactInfoOpen ? "block" : "none" }}
          className="font-bold text-xl mb-4 text-custom-black-200"
        >
          Contact Info
        </h2>
        {/* )} */}
      </div>

      {/* Payment Details */}
      <div className="flex items-start mb-4">
        <button
          type="button"
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
        {/* {isPaymentDetailsOpen ? ( */}
        <div
          className="flex-1"
          id="paymentDetailsContent"
          style={{ display: isPaymentDetailsOpen ? "block" : "none" }}
        >
          <h2 className="font-bold text-xl mb-4 text-custom-black-200">
            Payment Details
          </h2>
          <div className="grid grid-cols-1 ">
            <InputField
              label="Name on Card"
              type="text"
              id="payment_name_on_card"
              name="payment_name_on_card"
              value={checkoutForm.payment_name_on_card}
              onChange={handleChange}
              required
            />
            <InputField
              label="Card Number"
              type="text"
              id="payment_card_number"
              name="payment_card_number"
              value={checkoutForm.payment_card_number}
              onChange={handleChange}
              required
            />
            <div className="flex gap-3 grid-cols-2">
              <InputField
                label="Expiration (MM/YY)"
                type="text"
                id="payment_expiry"
                name="payment_expiry"
                value={checkoutForm.payment_expiry}
                onChange={handleChange}
                required
              />
              <InputField
                label="CVC"
                type="text"
                id="payment_cvc"
                name="payment_cvc"
                value={checkoutForm.payment_cvc}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>
        {/* ) : ( */}
        <h2
          style={{ display: !isPaymentDetailsOpen ? "block" : "none" }}
          className="font-bold text-xl mb-4 text-custom-black-200"
        >
          Payment Details
        </h2>
        {/* )} */}
      </div>

      {/* Delivery Address */}
      <div className="flex items-start mb-4">
        <button
          type="button"
          onClick={(e) => {
            console.log(e);
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
        {/* {isDeliveryAddressOpen ? ( */}
        <div
          className="flex-1"
          id="deliveryAddressContent"
          style={{ display: isDeliveryAddressOpen ? "block" : "none" }}
        >
          <h2 className="font-bold text-xl mb-4 text-custom-black-200">
            Delivery Address
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
            <InputField
              label="Address"
              type="text"
              id="delivery_address_street"
              name="delivery_address_street"
              value={checkoutForm.delivery_address_street}
              onChange={handleChange}
              required
            />
            <InputField
              label="City"
              type="text"
              id="delivery_address_city"
              name="delivery_address_city"
              value={checkoutForm.delivery_address_city}
              onChange={handleChange}
              required
            />
            <InputField
              label="State"
              type="text"
              id="delivery_address_state_id"
              name="delivery_address_state_id"
              value={checkoutForm.delivery_address_state_id}
              onChange={handleChange}
              required
            />
            <InputField
              label="Zip Code"
              type="text"
              id="delivery_address_zip_code"
              name="delivery_address_zip_code"
              value={checkoutForm.delivery_address_zip_code}
              onChange={handleChange}
              required
            />
            <InputField
              label="Country"
              type="text"
              id="delivery_address_country"
              name="delivery_address_country"
              value={checkoutForm.delivery_address_country}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        {/* ) : ( */}
        <h2
          style={{ display: !isDeliveryAddressOpen ? "block" : "none" }}
          className="font-bold text-xl mb-4 text-custom-black-200"
        >
          Delivery Address
        </h2>
        {/* )} */}
      </div>

      {/* Billing Information */}
      <div className="flex items-start mb-4">
        <button
          type="button"
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
        {/* {isBillingInfoOpen ? ( */}
        <div
          className="flex-1"
          id="billingInfoContent"
          style={{ display: isBillingInfoOpen ? "block" : "none" }}
        >
          <div className="mb-4 flex items-center space-x-2">
            <h2 className="font-bold text-xl  text-custom-black-200">
              Billing Information
            </h2>
            <label
              htmlFor="billing_same_as_delivery"
              className="text-sm !ml-8  text-[#666666] flex items-end "
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

          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
            <InputField
              label="Address"
              type="text"
              id="billing_address_street"
              name="billing_address_street"
              value={checkoutForm.billing_address_street}
              disabled={checkoutForm.billing_same_as_delivery}
              onChange={handleChange}
            />
            <InputField
              label="City"
              type="text"
              id="billing_address_city"
              name="billing_address_city"
              disabled={checkoutForm.billing_same_as_delivery}
              value={checkoutForm.billing_address_city}
              onChange={handleChange}
            />
            <InputField
              label="State"
              type="text"
              id="billing_address_state"
              disabled={checkoutForm.billing_same_as_delivery}
              name="billing_address_state"
              value={checkoutForm.billing_address_state}
              onChange={handleChange}
            />
            <InputField
              label="Zip Code"
              type="text"
              disabled={checkoutForm.billing_same_as_delivery}
              id="billing_address_zip_code"
              name="billing_address_zip_code"
              value={checkoutForm.billing_address_zip_code}
              onChange={handleChange}
            />
            <InputField
              label="Country"
              disabled={checkoutForm.billing_same_as_delivery}
              type="text"
              id="billing_address_country"
              name="billing_address_country"
              value={checkoutForm.billing_address_country}
              onChange={handleChange}
            />
          </div>
        </div>
        {/* ) : ( */}
        <h2
          style={{ display: !isBillingInfoOpen ? "block" : "none" }}
          className="font-bold text-xl mb-2 text-custom-black-200"
        >
          Billing Information
        </h2>
        {/* )} */}
      </div>

      <div className="pl-6 flex flex-col mb-8 gap-2">
        <div className="font-roboto gap-8 flex w-full justify-between items-center">
          <div className="w-[60%]">
            <p className="text-[#666666] font-bold text-[17px]">Due Today</p>
            <p className="text-black font-bold text-[23px]">
              Non-Refundable Deposit <span className="ml-[35%]">$1,500</span>
            </p>
            <p className="text-custom-med-gray text-[12px] mt-1">
              Once you confirm your build, your Equipter will be set for
              production and your deposit will be non-refundable. Pricing and
              options are subject to change until your Equiper is built.
            </p>
          </div>
          <button className="btn-yellow w-[25%] h-fit capitalize">
            Submit Deposit
          </button>
        </div>
        <label
          htmlFor="depositAgree"
          className="text-sm text-[#666666] flex items-center font-noto-sans"
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
      </div>
    </form>
  );
};

export default CheckoutForm;




