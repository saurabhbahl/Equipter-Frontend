import React, { useEffect, useState } from "react";
import CloseBtn from "../../../pages/utils/CloseBtn";
import InputField from "../../utils/InputFeild";
import SelectField from "../../utils/SelectFeild";
import { useAdminContext } from "../../../hooks/useAdminContext";
import { apiClient } from "../../../utils/axios";
import { useNotification } from "../../../contexts/NotificationContext";
import { Zone } from "../Zones/ZoneSchemas";


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
  const { fetchStates } = useAdminContext();
  const { addNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [zones, setZones] = useState<Zone[]>([]);
  let zonesDropdownValues: { value: string; label: string }[] = [];

  const fetchZonesData = async () => {
    try {
      const url = `/state/zones?page=${1}&limit=${10}`;
      const response = await apiClient.get(url);
      const { data } = response.data;
      setZones(data);
    } catch (error: any) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchZonesData();
  }, []);

  zonesDropdownValues = zones?.map((z) => {
    return {
      label: `${z.zone_name} - $${z.shipping_rate}` as string,
      value: z?.id as string,
    };
  });


  const [formData, setFormData] = useState<StateFormData>({
    zone_id: "",
    state_name: "",
    is_delivery_paused: false,
  });

  const isEditMode = status === "Edit";

  useEffect(() => {
    if (isEditMode && state_id) {
      fetchData();
    }
  }, [isEditMode, state_id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(`/state/states/?state_id=${state_id}`);
      if (res.data.success && res.data.data.length > 0) {
        const stateData = res.data.data[0];
        setFormData({
          zone_id: stateData.zone_id,
          state_name: stateData.state_name,
          is_delivery_paused: stateData.is_delivery_paused,
        });
      } else {
        setError("State data not found.");
      }
    } catch (error: any) {
      console.error(error);
      setError("Failed to fetch state data.");
    } finally {
      setLoading(false);
    }
  };

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
    setLoading(true);
    setError(null);
    try {
      if (isEditMode && state_id) {
        const updateRes = await apiClient.put(
          `/state/states/${state_id}`,
          formData
        );
        if (updateRes.status === 200) {
          // fetchStates()
          const zoneStateData = {
            zone_id: formData.zone_id,
          };
          const zoneStateRes = await apiClient.put(
            `/state/zone-states/${state_id}`,
            zoneStateData
          );
          if (zoneStateRes.status === 200) {
            onClose();
            fetchStates();
            addNotification("success", "State Created Successfully!");
          } else {
            setError("Failed to associate state with zone.");
          }
          addNotification("success", "State Updated Successfully!");
          onClose();
        } else {
          setError("Failed to update the state.");
          addNotification("error", "Failed to update the state.");
        }
      } else {
        // create (POST) request
        const stateRes = await apiClient.post("/state/states", formData);
        if (stateRes.status === 201) {
          const zoneStateData = {
            zone_id: formData.zone_id,
            state_id: stateRes.data.data.id,
          };
          const zoneStateRes = await apiClient.post(
            "/state/zone-states",
            zoneStateData
          );
          if (zoneStateRes.status === 201) {
            onClose();
            fetchStates();
            addNotification("success", "State Created Successfully!");
          } else {
            setError("Failed to associate state with zone.");
          }
        } else {
          setError("Failed to add the state.");
          addNotification("error", "Failed to add the state.");
        }
      }
    } catch (error: any) {
      console.error(error);
      setError("An error occurred during the operation.");
    } finally {
      setLoading(false);
    }
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

        {loading && <p className="text-center">Loading...</p>}

        {error && <p className="text-center text-red-500">{error}</p>}

        {/* FORM */}
        {!loading && (
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
                required
              />
            </div>

            {/* Zone ID */}
            <div className="flex flex-col">
              <SelectField
                value={formData.zone_id}
                options={zonesDropdownValues || []}
                id="zone_id"
                label="Select Zone"
                onChange={handleChange}
                name="zone_id"
                key={"zone_id"}
                required
              />
            </div>

            {/* Is Delivery Paused */}
            <div className="flex items-center">
              <label
                htmlFor="is_delivery_paused"
                className="text-sm flex items-center"
              >
                {" "}
                <input
                  id="is_delivery_paused"
                  name="is_delivery_paused"
                  type="checkbox"
                  checked={formData.is_delivery_paused}
                  onChange={handleChange}
                  className="mr-2 w-4 h-4  form-checkbox "
                />
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
                disabled={loading}
              >
                {isEditMode ? "Update" : "Add"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddAndEditState;
