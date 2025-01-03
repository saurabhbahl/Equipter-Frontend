import React, { useState } from "react";
import CloseBtn from "../../../utils/CloseBtn";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const SendMailTab = ({ setShowSendMailTab }: any) => {
  const [email, setEmail] = useState("");
  const [additionalEmail, setAdditionalEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Submitted Emails: ", { email, additionalEmail });
  };

  return (
    <div className="relative font-roboto bg-white max-h-[90vh] overflow-y-auto scrollbar-custom max-w-lg xl:max-w-xl mx-auto mt-8 p-6 shadow-xl">
      {/* Close Button */}
      <button
        type="button"
        className="absolute top-4 right-4 text-black hover:text-gray-700 focus:outline-none"
        aria-label="Close"
        onClick={() => setShowSendMailTab(false)}
      >
        <CloseBtn />
      </button>

      {/* Heading */}
      <div className="text-center mt-2">
        <p className="text-xl lg:text-4xl text-black">BUILD + BUY</p>
        <p className="text-xs xl:text-sm text-black">
          Send Your Build Configuration
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        {/* Primary Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Enter Email Address
          </label>
          <p className="text-xs text-gray-500">
            A build link will be sent to the address below
          </p>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Auto Populate"
            className="mt-2 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

  
        <div>
          <label
            htmlFor="additionalEmail"
            className="block text-sm font-medium text-gray-700"
          >
            Additional Email Address
          </label>
          <input
            type="email"
            id="additionalEmail"
            name="additionalEmail"
            value={additionalEmail}
            onChange={(e) => setAdditionalEmail(e.target.value)}
            placeholder="Optional"
            className="mt-2 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>


        <div className="text-center">
          <button
            type="submit"
            className="btn-yellow w-full py-2 rounded-md text-white font-bold"
          >
            Send Build Link
          </button>
        </div>
      </form>

      {/* Social Icons */}
      <div className="mt-8 flex items-center gap-6">
        <p className="text-xs lg:text-sm font-semibold text-black">
          Stay Connected:
        </p>
        <div className="flex items-center space-x-4">

          <span className="text-sm lg:text-xl text-gray-700 hover:text-gray-900 cursor-pointer transition-colors duration-200">
            <FaFacebook />
          </span>

          <span className="text-sm lg:text-xl text-gray-700 hover:text-gray-900 cursor-pointer transition-colors duration-200">
            <FaXTwitter />
          </span>
      
          <span className="text-sm lg:text-xl text-gray-700 hover:text-gray-900 cursor-pointer transition-colors duration-200">
            <FaInstagram />
          </span>
 
          <span className="text-sm lg:text-xl text-gray-700 hover:text-gray-900 cursor-pointer transition-colors duration-200">
            <FaLinkedin />
          </span>
        </div>
      </div>
    </div>
  );
};

export default SendMailTab;
