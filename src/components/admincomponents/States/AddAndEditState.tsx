import React, { useEffect, useState } from "react";
import CloseBtn from "../../../pages/utils/CloseBtn";
import InputField from "../../utils/InputFeild";
import SelectField from "../../utils/SelectFeild";
import { useAdminContext } from "../../../hooks/useAdminContext";

interface AddAndEditStateProps {
  status?: "Edit" | "Add";
  onClose: () => void;
  state_id?: string;
}

interface StateFormData {
  zone_id: string;
  state_name: string;
  is_delivery_paused: boolean;
}

const AddAndEditState: React.FC<AddAndEditStateProps> = ({
  status = "Add",
  onClose,
  state_id,
}) => {
  const {zones} =useAdminContext()
  
  
   const zonesDropdownValues = zones?.map((z)=>{
    return {
      label:z.zone_name,
      value:z.id
    }
   })
   console.log(zones,zonesDropdownValues)
   
  //  [
  //   { label: "Zone A", value: "zone a" },
  //   { label: "Zone B", value: "zone b" },
  // ];
  
  
  
  const [formData, setFormData] = useState<StateFormData>({
    zone_id: "",
    state_name: "",
    is_delivery_paused: false,
  });
  

  const isEditMode = status === "Edit";

  useEffect(() => {
    if (isEditMode && state_id) {
      console.log("hello");
    }
  }, [isEditMode, state_id]);

  // 2) Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditMode && state_id) {
      alert(`Editing state:\n${JSON.stringify(formData, null, 2)}`);
    } else {
      alert(`Adding new state:\n${JSON.stringify(formData, null, 2)}`);
    }

    onClose();
  };
  
  
 
  return (
    <div className="fixed z-30 inset-0 backdrop-blur-sm bg-black bg-opacity-10 flex items-center justify-center p-4">
      {/* CLOSE BUTTON */}
      <button
        onClick={onClose}
        className="absolute z-50 top-4 right-4 sm:top-6 sm:right-6 text-lg text-black xl:text-5xl hover:text-gray-600 font-bold"
        aria-label="Close Slider"
      >
        <CloseBtn />
      </button>

      {/* CONTENT WRAPPER */}
      <div className="w-full max-w-lg bg-white rounded shadow-lg p-6 relative font-work-sans">
        <h2 className="text-xl font-semibold mb-4">
          {isEditMode ? "Edit State" : "Add State"}
        </h2>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-2">
          {/* State Name */}
          <div className="flex flex-col">
            <InputField
              value={formData.state_name}
              id="state_name"
              name="state_name"
              type="text"
              key={"state_name"}
              placeholder="State Name"
              label="State Name"
              onChange={handleChange}
            />
          </div>

          {/* Zone ID */}
          <div className="flex flex-col">
            <SelectField
              value={formData.zone_id}
              options={zonesDropdownValues}
              id="zone_id"
              label="Select Zone"
              onChange={handleChange}
              name="zone_id"
              key={"zone_id"}
            />
          </div>

          {/* Is Delivery Paused */}
          <div className="flex items-center">
            <input
              id="is_delivery_paused"
              name="is_delivery_paused"
              type="checkbox"
              checked={formData.is_delivery_paused}
              onChange={handleChange}
              className="mr-2 w-4 h-4 accent-white border"
            />
            <label htmlFor="is_delivery_paused" className="text-sm">
              Delivery Paused
            </label>
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="border border-gray-300 text-gray-700 px-3 py-0.5 rounded hover:bg-gray-100 focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-yellow px-3 py-0.5 text-sm font-sans hover:shadow-3xl capitalize rounded"
            >
              {isEditMode ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAndEditState;
