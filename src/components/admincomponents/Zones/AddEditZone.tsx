import React, { useEffect, useState } from "react";
import CloseBtn from "../../../pages/utils/CloseBtn";
import InputField from "../../utils/InputFeild";
import { useAdminContext } from "../../../hooks/useAdminContext";
import { apiClient } from "../../../utils/axios";
import { useNotification } from "../../../contexts/NotificationContext";

interface AddAndEditZoneProps {
  status?: "Edit" | "Add";
  onClose: () => void;
  zone_id?: string;
}

interface ZoneFormData {
  zone_name: string;
  shipping_rate: number|null;
}

const AddAndEditZone: React.FC<AddAndEditZoneProps> = ({
  status = "Add",
  onClose,
  zone_id,
}) => {
  const { fetchZones } = useAdminContext(); 
  const { addNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<ZoneFormData>({
    zone_name: "",
    shipping_rate: null,
  });

  const isEditMode = status === "Edit";

  useEffect(() => {
    if (isEditMode && zone_id) {
      fetchSingleZoneData();
    }
  }, [isEditMode, zone_id]);

  const fetchSingleZoneData = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(`/state/zones/?zone_id=${zone_id}`);
      if (res.data.success && res.data.data.length > 0) {
        const zoneData = res.data.data[0];
        setFormData({
          zone_name: zoneData.zone_name,
          shipping_rate: Number(zoneData.shipping_rate),
        });
      } else {
        setError("Zone data not found.");
        addNotification("error", "Zone data not found.");
      }
    } catch (error: any) {
      console.error(error);
      setError("Failed to fetch zone data.");
      addNotification("error", "Failed to fetch zone data.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    if (type === "number") {
      setFormData((prev) => ({
        ...prev,
        [name]: Number(value),
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

      if (isEditMode && zone_id) {
        const updateRes = await apiClient.put(`/state/zones/${zone_id}`, formData);
        if (updateRes.status === 200) {
          fetchZones(); 
          addNotification("success", "Zone updated successfully!");
          onClose();
        } else {
          setError("Failed to update the zone.");
          addNotification("error", "Failed to update the zone.");
        }
      } else {       
        const createRes = await apiClient.post("/state/zones", formData);
        if (createRes.status === 201) {
          fetchZones();
          addNotification("success", "Zone created successfully!");
          onClose();
        } else {
          setError("Failed to create the zone.");
          addNotification("error", "Failed to create the zone.");
        }
      }
    } catch (error: any) {
      console.error(error);
      setError("An error occurred during the operation.");
      addNotification("error", "An error occurred during the operation.");
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
          {isEditMode ? "Edit Zone" : "Add Zone"}
        </h2>

        {/* Display Loading Indicator */}
        {loading && <p className="text-center">Loading...</p>}

        {/* Display Error Message */}
        {error && <p className="text-center text-red-500">{error}</p>}

        {/* FORM */}
        {!loading && (
          <form onSubmit={handleSubmit} className="space-y-2">
            {/* Zone Name */}
            <div className="flex flex-col">
              <InputField
                value={formData.zone_name}
                id="zone_name"
                name="zone_name"
                type="text"
                key={"zone_name"}
                placeholder="Zone Name"
                label="Zone Name"
                onChange={handleChange}
                required
              />
            </div>

            {/* Shipping Rate */}
            <div className="flex flex-col">
              <InputField
                value={formData.shipping_rate as number}
                id="shipping_rate"
                name="shipping_rate"
                type="number"
                key={"shipping_rate"}
                placeholder="Shipping Rate"
                label="Shipping Rate"
                onChange={handleChange}
                required               
              />
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
                disabled={loading}>
                {isEditMode ? "Update" : "Add"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddAndEditZone;
