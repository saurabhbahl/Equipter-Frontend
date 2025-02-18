import { useEffect, useState } from "react";
import InputField from "../../components/utils/InputFeild";
import SelectField from "../../components/utils/SelectFeild";
import { useClientContext } from "../../hooks/useClientContext";
import {
  AccessorySelection,
  IState,
  ShippingOption,
} from "../../contexts/ClientContext";
import { useSearchParams } from "react-router-dom";
import { publicApiClient } from "../../utils/axios";
import { IQuoteAccessory } from "../../components/admincomponents/WebQuotes/WebQuoteSchema";
import axios from "axios";
import { BackendUrl } from "../../utils/useEnv";

const STORAGE_KEY = "firstPageForm";

const EXPIRATION_TIME = 7 * 24 * 60 * 60 * 1000;

const FirstPageForm = () => {
  const [searchParams] = useSearchParams();
  const webQuoteID = searchParams.get("webQuote");
  const [shippingMethod, setShippingMethod] = useState<string>("delivery");
  const {
    firstPageForm,
    setFirstPageForm,
    saveToLocalStorage,
    setShippingOptions,
    loadFromLocalStorage,
    statesData,
    setSelections,
  } = useClientContext();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedForm = { ...firstPageForm, [e.target.name]: e.target.value };
    setFirstPageForm(updatedForm);
    saveToLocalStorage(updatedForm, STORAGE_KEY, EXPIRATION_TIME);
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const updatedForm = { ...firstPageForm, [e.target.name]: e.target.value };
    setFirstPageForm(updatedForm);
    saveToLocalStorage(updatedForm, STORAGE_KEY, EXPIRATION_TIME);
  };
  const saveLead = async () => {   
      const selectedState = statesData.find(
        (st) => st.state_id === firstPageForm.state
      );
      await axios.post(`${BackendUrl}/webquote/soft-lead`, {
        ...firstPageForm,
        state: selectedState?.state_name,
      });    
  };

  async function handleSubmit(e: React.ChangeEvent<HTMLFormElement>) {
    e.preventDefault();
    setFirstPageForm((prev) => ({ ...prev, isFormFilled: true }));

    if (firstPageForm.state !== "") {
      await saveLead();
      const selectedState = statesData.find(
        (st) => st.state_id === firstPageForm.state
      );
      if (selectedState) {
        const newShippingOption: ShippingOption[] = [
          { id: "pickup", name: "Pick-up", price: 0 },
          {
            id: "delivery",
            name: `Delivery to the State of ${selectedState.state_name}`,
            price: parseFloat(selectedState.shipping_rate),
            uuid: selectedState.state_id,
            zone_id: selectedState.zone_id,
            zone_name: selectedState.zone_name,
          },
        ];
        setShippingOptions([...newShippingOption]);
        setSelections((prev) => ({ ...prev, shippingOption: shippingMethod }));
      }
    }
  }

  const IndustryFeilds = [
    { value: "residential_roofing", label: "Residential Roofing" },
    { value: "commercial_roofing", label: "Commercial Roofing" },
    {
      value: "general_construction",
      label: "General Construction",
    },
    {
      value: "fire_water_restoration",
      label: "Fire & Water Restoration",
    },
    {
      value: "graveyard_management",
      label: "Graveyard Management",
    },
    { value: "landscaping", label: "Landscaping" },
    { value: "hardscaping", label: "Hardscaping" },
    { value: "exterior_remodeling", label: "Exterior Remodeling" },
    { value: "interior_remodeling", label: "Interior Remodeling" },
    { value: "building_supply", label: "Building Supply" },
    { value: "equipment_rental", label: "Equipment Rental" },
    { value: "event_services", label: "Event Services" },
    { value: "transportation", label: "Transportation" },
    { value: "manufacturing", label: "Manufacturing" },
    {
      value: "trash_disposal_recycle",
      label: "Trash Disposal / Recycle",
    },
    { value: "hvac", label: "HVAC" },
    { value: "solar", label: "Solar" },
    { value: "other", label: "Other" },
  ];

  useEffect(() => {
    const savedData = loadFromLocalStorage(STORAGE_KEY);
    const token = localStorage.getItem("token");
    if (savedData) {
      setFirstPageForm({
        ...savedData,
        isFormFilled: token !== null ? true : false,
      });
    }
  }, []);

  useEffect(() => {
    if (webQuoteID) {
      const fetchWebQuote = async () => {
        try {
          // get products data with related accessories
          const resData = await publicApiClient.get(`/webquote/${webQuoteID}`);
          const data = resData.data.data[0];
          const quoteAccessory = data.quote_accessory;

          // Ensure accessory_id is present and loop through all items
          if (quoteAccessory && quoteAccessory.length > 0) {
            // Loop through all accessories in quoteAccessory array
            const updatedAccessories = quoteAccessory.reduce(
              (
                acc: Record<string, AccessorySelection>,
                item: IQuoteAccessory
              ) => {
                if (item.accessory_id) {
                  acc[item.accessory_id] = {
                    selected: true, // Dynamically set based on your logic
                    qty: Number(item.quantity), // Dynamically set qty or default value
                  };
                } else {
                  console.error("Accessory ID not found for item:", item);
                }
                return acc;
              },
              {}
            );

            // Update selections with the new accessories
            setSelections((prevSelections) => ({
              ...prevSelections,
              accessories: {
                ...prevSelections.accessories,
                ...updatedAccessories,
              },
            }));
          } else {
            console.error(
              "No valid accessories found in quoteAccessory:",
              quoteAccessory
            );
          }

          setSelections((prevState) => ({
            ...prevState,
            baseUnitQty: data.product_qty,
            shippingOption: data.shipping_method_used,
          }));
          setShippingMethod(data.shipping_method_used);
        } catch (error) {
          console.error(`error: ${error}`);
        }
      };

      fetchWebQuote();
    } else {
      setSelections((prevState) => ({
        ...prevState,
        shippingOption: "delivery",
      }));
    }
  }, [webQuoteID]);

  return (
    <>
      <div className="p-9 md:p-8 font-work-sans w-full ">
        <div className="max-w-lg mx-auto  px-1">
          <h2 className="text-3xl font-semibold text-custom-gray text-center uppercase mb-4">
            Let's Get Started
          </h2>
          <p className=" mb-5 text-center text-custom-gray">
            Fill out the form below to start building your perfect Equipter.
          </p>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-3"
          >
            {/* First Name Input */}
            <InputField
              label="First Name"
              type="text"
              id="firstName"
              name="fName"
              required
              value={firstPageForm.fName}
              onChange={handleInputChange}
            />

            {/* Last Name Input */}
            <InputField
              label="Last Name"
              type="text"
              id="lastName"
              name="lName"
              required
              value={firstPageForm.lName}
              onChange={handleInputChange}
            />

            {/* Company Input */}
            <InputField
              label="Company"
              type="text"
              id="company"
              name="company"
              required
              value={firstPageForm.company}
              onChange={handleInputChange}
            />

            {/* Phone Number Input */}
            <InputField
              label="Phone Number"
              type="number"
              id="phoneNumber"
              name="phNo"
              required
              value={firstPageForm.phNo}
              onChange={handleInputChange}
            />

            {/* Email Input */}
            <InputField
              label="Email"
              type="email"
              id="email"
              name="email"
              required
              value={firstPageForm.email}
              onChange={handleInputChange}
            />

            {/* Job Title Select */}
            <SelectField
              label="Job Title"
              id="jobTitle"
              name="jobTitle"
              required
              value={firstPageForm.jobTitle}
              onChange={handleSelectChange}
              options={[
                { value: "Co-Owner/Partner", label: "Co-Owner/Partner" },
                { value: "Employee/Staff", label: "Employee/Staff" },
                {
                  value: "Manager/Supervisor/Assistant",
                  label: "Manager/Supervisor/Assistant",
                },
                {
                  value: "Owner/Founder/Executive",
                  label: "Owner/Founder/Executive",
                },
              ]}
            />

            {/* State Select */}
            <SelectField
              label="State"
              id="state"
              name="state"
              required
              value={firstPageForm.state}
              onChange={handleSelectChange}
              options={statesData
                ?.filter((state) => state.is_delivery_paused == false)
                .map((state: IState) => ({
                  value: state.state_id,
                  label: state.state_name,
                }))}
            />

            {/* Industry Select */}
            <SelectField
              label="Industry"
              id="industry"
              name="industry"
              required
              value={firstPageForm.industry}
              onChange={handleSelectChange}
              options={IndustryFeilds}
            />

            <div className="col-span-1 md:col-span-2 mb-4">
              <p className="text-custom-gray leading-9 md:leading-10">
                Equipter uses your contact information to discuss our products
                and services and may contact you via email, phone, or SMS.
                Unsubscribe options and privacy details are in our{" "}
                <a href="#" target="_blank" className="text-custom-orange">
                  Privacy Policy
                </a>
                .
              </p>
            </div>
            <div className="col-span-1 md:col-span-2 w-full text-center">
              <input type="submit" value="Build Now" className="btn-yellow" />
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default FirstPageForm;
