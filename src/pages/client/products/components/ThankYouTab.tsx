import CloseBtn from "../../../utils/CloseBtn";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import {FaXTwitter } from "react-icons/fa6";
import { useClientContext } from "../../../../hooks/useClientContext";

const ThankYouTab = () => {
  const {setSidebarSteps}=useClientContext()
  return (
    <div className="relative font-roboto bg-white max-h-[90vh] overflow-y-auto scrollbar-custom max-w-lg xl:max-w-xl mx-auto mt-8 p-6  shadow-xl">
      {/* Close Button */}
      <button
        type="button"
        className="absolute top-4 right-4 text-black hover:text-gray-700 focus:outline-none"
        aria-label="Close"
        onClick={()=>setSidebarSteps((prev)=>({...prev,showThankYouTab:false}))}>
        <CloseBtn/>
      </button>

      {/* Heading */}
      <div className="text-center mt-2">
        <p className="text-xl lg:text-4xl   text-black">Thank You</p>
        <p className="text-xs  xl:text-sm  text-black">
          Deposit Successfully Submitted
        </p>
      </div>


      <div className="mt-6">
        <h2 className="text-sm lg:text-lg font-semibold text-black mb-2">What's Next?</h2>
        <div className="text-black space-y-2 text-sm">
          <p className="text-xs lg:text-lg">
            <span className="font-semibold text-sm lg:text-lg  text-black ">Delivery Information:</span> We will
            update you with the estimated delivery date and any additional steps
            required for the processing of your order.
          </p>
          <p className="text-xs lg:text-lg">
            <span className="font-semibold text-sm lg:text-lg  text-black">Contact Us:</span> If you have any
            questions or need assistance, please don't hesitate to reach out to
            our customer support team.
          </p>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="font-semibold text-sm lg:text-lg  text-black mb-2">
          Your Satisfaction is Our Priority
        </h2>
        <p className="text-xs lg:text-sm text-black leading-relaxed">
          We are committed to providing you with the highest level of service.
          If you have any feedback or concerns, please let us know so we can
          continue to improve.
        </p>
      </div>

      <p className="mt-4 text-xs lg:text-sm font-bold text-black">
        Thank you once again for your purchase. We look forward to serving you!
      </p>

      
      <div className="mt-8 flex items-center gap-6">
        <p className="text-xs lg:text-sm font-semibold text-black ">
          Stay Connected:
        </p>
        <div className="flex items-center space-x-4">

          <span className="text-sm lg:text-xl text-gray-700 hover:text-gray-900 cursor-pointer transition-colors duration-200">
            <FaFacebook/>
          </span>
     
          <span className="text-sm lg:text-xl text-gray-700 hover:text-gray-900 cursor-pointer transition-colors duration-200">
            <FaXTwitter/>
            
          </span>
   
          <span className="text-sm lg:text-xl text-gray-700 hover:text-gray-900 cursor-pointer transition-colors duration-200">
            <FaInstagram />
          </span>
  
          <span className="text-sm lg:text-xl text-gray-700 hover:text-gray-900 cursor-pointer transition-colors duration-200">
            <FaLinkedin/>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ThankYouTab;
