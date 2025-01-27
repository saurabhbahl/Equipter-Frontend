import  { ChangeEvent, useState } from "react";
import CloseBtn from "../../../utils/CloseBtn";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import InputFieldCurved from "../../../../components/utils/InputFieldCurved";
import GroupClose from "../../../utils/GroupClose";
import GroupOpen from "../../../utils/GroupOpen";
import { useClientContext } from "../../../../hooks/useClientContext";
import { publicApiClient } from "../../../../utils/axios";
import { webQuoteSendmail } from "../../types/Validations";
import Loader from "../../../../components/utils/Loader";


interface SendWebQuoteUrl {
  email: string,
  webQuote_url: string,
  secondary_email: string,
}

interface formValues{
  email: string,
  webQuote_url?: string,
  secondary_email: string | null,
  product_name: string
}

const SendMailTab = () => {
  const {firstPageForm, setSidebarSteps, webQuoteId, productSelection }= useClientContext();
  const [loading,setLoading] = useState<boolean>(false);
  const [formValues, setFormValues] = useState<formValues>({
    email: firstPageForm.email ?? "",
    secondary_email: "",
    webQuote_url: window.location.href.split('?')[0]+'?webQuote='+webQuoteId,
    product_name: productSelection.productDetails?.name ?? ''
  });

  const [errors, setErrors] = useState<{ [key in keyof SendWebQuoteUrl]?: string }>();
  const [isContactInfoOpen, setIsContactInfoOpen] = useState(true);

  const handleChange = (e:ChangeEvent<HTMLInputElement>) => {
    // Update state logic here
    const { name, value } = e.target;
    setErrors({...errors, [name]: ''});
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleCloseButton = () => {
    setSidebarSteps((prev)=>({...prev,showSendEmailTab:false}))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
 
    const validation = webQuoteSendmail.safeParse(formValues);
    console.log(validation)

    if (!validation.success) {
      const newErrors: { [key in keyof SendWebQuoteUrl]?: string } = {};
      validation.error.issues.forEach((issue) => {
        const fieldName = issue.path[0] as keyof SendWebQuoteUrl;
        newErrors[fieldName] = issue.message;
      });
      setErrors(newErrors);
      return;
    }
    setLoading(true);
    const result = await publicApiClient.post("/webquote/send-mail", formValues );
    if(result.data.success){
      handleCloseButton();
    }
    setLoading(false);
  }

  return (
      <form onSubmit={handleSubmit} className="z-50 relative font-roboto bg-white max-h-[90vh] overflow-y-auto scrollbar-custom w-[100%] sm:w-[80%] md:w-[60%] px-6 py-8 md:px-8 xl:w-[35%] mx-auto   shadow-xl">
        {loading && <Loader message={'Sending Building Configuration'}/>}
        {/* Close Button */}
        <button
          type="button"
          className="absolute top-4 right-4 text-black hover:text-gray-700 focus:outline-none"
          aria-label="Close"
          onClick={handleCloseButton}
        >
          <CloseBtn />
        </button>

        {/* Heading */}
        <div className="text-center mb-6">
          <p className="text-2xl lg:text-4xl   text-black">BUILD + BUY </p>
          <p className="text-xs  xl:text-sm  text-black">
            Send Your Build Configuration
          </p>
        </div>

        {/* Enter Email Address */}
        <div className="mb-6">
          <h2 className="text-sm md:text-base lg:text-lg font-semibold text-black">
            Enter Email Address
          </h2>
          <p className="text-xs leading-3 lg:leading-6 tracking-wide md:text-sm text-black mb-2">
            A build link will be sent to the address below
          </p>
          <div className="w-full mb-1">
            <InputFieldCurved
              label="Email*"
              id="email1"
              name="email"
              type="email"
              classes="lg:w-[75%]"
              placeholder="Enter Primary Email"
              value={formValues.email}
              onChange={handleChange}
              error={errors?.email ?? ''}
            />
          </div>
        </div>

        {/* Additional Email Address (toggle) */}
        <div className="fle items-start mb-4">
          <button
            tabIndex={-1}
            onClick={(e) => {
              e.preventDefault();
              setIsContactInfoOpen(!isContactInfoOpen);
            }}
            className="pr- pt-1"
            aria-expanded={isContactInfoOpen}
            aria-controls="contactInfoContent"
          >
            <span className="flex justify-center  my-auto">
              {isContactInfoOpen ? <GroupClose /> : <GroupOpen />}{" "}
              <span className="font-semibold text-sm lg:text-xl text-custom-black-200 mb-4 ml-1 lg:ml-3">
                Additional Email Address
              </span>
            </span>
          </button>
          <div>
            {isContactInfoOpen && (
              <InputFieldCurved
                label="Secondary Email"
                type="email"
                classes="lg:w-[75%]"
                id="contact_email"
                name="secondary_email"
                placeholder="Enter Secondary Email*"
                value={formValues.secondary_email ?? ''}
                onChange={handleChange}
                error={errors?.secondary_email ?? ''}
              />
            )}
          </div>
        </div>
        <button type="submit" className="btn-yellow text-sm"> Send Email </button>

        {/* Social Icons */}
        <div className="mt-8 flex items-center md:justify-start justify-around lg:gap-6">
          <p className="sm:text-xs md:text-sm lg:text-xl font-semibold text-black">
            Stay Connected
          </p>
          <div className="flex items-center space-x-2 lg:space-x-4">
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
      </form>
  );
};

export default SendMailTab;
