import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import CloseBtn from "../../../utils/CloseBtn";

const ThankYouTab = () => {
  return (
    <div className="relative bg-white max-w-md mx-auto mt-8 p-6 rounded-md shadow-md">
      {/* Close Button */}
      <button
        type="button"
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
        aria-label="Close"
      >
        <CloseBtn/>
      </button>

      {/* Heading */}
      <div className="text-center mt-2">
        <h1 className="text-xl font-bold text-black">Thank You</h1>
        <p className="text-sm font-medium text-gray-700">
          Deposit Successfully Submitted
        </p>
      </div>

      {/* What's Next */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold text-black mb-2">What's Next?</h2>
        <div className="text-gray-700 space-y-2 text-sm">
          <p>
            <span className="font-semibold text-black">Delivery Information:</span> We will
            update you with the estimated delivery date and any additional steps
            required for the processing of your order.
          </p>
          <p>
            <span className="font-semibold text-black">Contact Us:</span> If you have any
            questions or need assistance, please don't hesitate to reach out to
            our customer support team.
          </p>
        </div>
      </div>

      {/* Satisfaction */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold text-black mb-2">
          Your Satisfaction is Our Priority
        </h2>
        <p className="text-sm text-gray-700 leading-relaxed">
          We are committed to providing you with the highest level of service.
          If you have any feedback or concerns, please let us know so we can
          continue to improve.
        </p>
      </div>

      <p className="mt-4 text-sm font-bold text-black">
        Thank you once again for your purchase. We look forward to serving you!
      </p>

      {/* Social Icons */}
      <div className="mt-8 flex items-center gap-6">
        <p className="text-sm font-semibold text-black mb-2">
          Stay Connected
        </p>
        <div className="flex items-center space-x-4">
          {/* Facebook */}
          <span className="text-xl text-gray-700 hover:text-gray-900 cursor-pointer transition-colors duration-200">
            <FontAwesomeIcon icon={["fab", "facebook-f"]} />
          </span>
          {/* Twitter */}
          <span className="text-xl text-gray-700 hover:text-gray-900 cursor-pointer transition-colors duration-200">
            <FontAwesomeIcon icon={["fab", "twitter"]} />
          </span>
          {/* Instagram */}
          <span className="text-xl text-gray-700 hover:text-gray-900 cursor-pointer transition-colors duration-200">
            <FontAwesomeIcon icon={["fab", "instagram"]} />
          </span>
          {/* LinkedIn */}
          <span className="text-xl text-gray-700 hover:text-gray-900 cursor-pointer transition-colors duration-200">
            <FontAwesomeIcon icon={["fab", "linkedin-in"]} />
          </span>
        </div>
      </div>
    </div>
  );
};

export default ThankYouTab;
