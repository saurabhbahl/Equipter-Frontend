import { useState } from "react";
import InputField from "../components/InputFeild";
import SelectField from "../components/SelectFeild";

const Home = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    company: "",
    phoneNumber: "",
    email: "",
    jobTitle: "",
    state: "",
    industry: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
            action="#"
            method="POST"
            className="grid grid-cols-1 md:grid-cols-2 gap-3"
          >
            {/* First Name Input */}
            <InputField
              label="First Name"
              type="text"
              id="firstName"
              name="firstName"
              required
              value={formData.firstName}
              onChange={handleInputChange}
            />

            {/* Last Name Input */}
            <InputField
              label="Last Name"
              type="text"
              id="lastName"
              name="lastName"
              required
              value={formData.lastName}
              onChange={handleInputChange}
            />

            {/* Company Input */}
            <InputField
              label="Company"
              type="text"
              id="company"
              name="company"
              required
              value={formData.company}
              onChange={handleInputChange}
            />

            {/* Phone Number Input */}
            <InputField
              label="Phone Number"
              type="number"
              id="phoneNumber"
              name="phoneNumber"
              required
              value={formData.phoneNumber}
              onChange={handleInputChange}
            />

            {/* Email Input */}
            <InputField
              label="Email"
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleInputChange}
            />

            {/* Job Title Select */}
            <SelectField
              label="Job Title"
              id="jobTitle"
              name="jobTitle"
              required
              value={formData.jobTitle}
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
              value={formData.state}
              onChange={handleSelectChange}
              options={[
                { value: "california", label: "California" },
                { value: "texas", label: "Texas" },
                { value: "new-york", label: "New York" },
              ]}
            />

            {/* Industry Select */}
            <SelectField
              label="Industry"
              id="industry"
              name="industry"
              required
              value={formData.industry}
              onChange={handleSelectChange}
              options={IndustryFeilds}
            />

            <div className="col-span-1 md:col-span-2 mb-4">
              <p className="text-custom-gray leading-9 md:leading-10">
                Equipter uses your contact information to discuss our products
                and services and may contact you via email, phone, or SMS.
                Unsubscribe options and privacy details are in our{" "}
                <a
                  href="#"
                  target="_blank"
                  //   rel="nofollow noopener"
                  className="text-custom-orange"
                >
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

export default Home;
