import React, { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import { useNavigate } from "react-router";
import api from "../../api/axios";

const AddCar = () => {
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [dailyRate, setDailyRate] = useState("");
  const [status, setStatus] = useState("available");
  const [imageFile, setImageFile] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append("file", file);
    uploadData.append("upload_preset", "car_rental");
    setLoading(true);
    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dsgoi1hul/image/upload",
        {
          method: "POST",
          body: uploadData,
        }
      );
      const data = await res.json();

      if (data.secure_url) {
        setImageData({
          url: data.secure_url,
          public_id: data.public_id,
        });
      } else {
        throw new Error("Upload Failed");
      }
    } catch (err) {
      console.error(err);
      setMessage("Image Upload Failed!");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    if (dailyRate <= 0) {
      setMessage("Daily rate must be greater than 0");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("brand", brand);
      formData.append("model", model);
      formData.append("daily_rate", dailyRate);
      formData.append("status", status);

      if(imageData){
        formData.append("image",imageData.url);
        formData.append("image_public_id",imageData.public_id)
      }

      const res = await api.post("/cars", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage(res.data.message || "Car created successfully!");
      setName("");
      setBrand("");
      setModel("");
      setDailyRate("");
      setStatus("available");
      setTimeout(() => navigate("/dashboard/cars"), 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to create car");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageMeta
        title="Add Car | Dashboard"
        description="This is Add Car page"
      />

      <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Add New Car
        </h2>

        {message && (
          <div
            className={`mb-6 p-3 rounded text-sm ${
              message.includes("Failed") || message.includes("must")
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {" "}
            {message}{" "}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col md:flex-row md:gap-4">
            <div className="flex-1">
              <label
                htmlFor=""
                className="block mb-1 font-medium text-gray-700"
              >
                Car Name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none "
              />
            </div>
            <div className="flex-1">
              <label
                htmlFor=""
                className="block mb-1 font-medium text-gray-700"
              >
                Brand
              </label>
              <input
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none "
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:gap-4">
            <div className="flex-1">
              <label
                htmlFor=""
                className="block mb-1 font-medium text-gray-700"
              >
                Model
              </label>
              <input
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none "
              />
            </div>
            <div className="flex-1">
              <label
                htmlFor=""
                className="block mb-1 font-medium text-gray-700"
              >
                Daily Rate ($)
              </label>
              <input
                type="number"
                value={dailyRate}
                onChange={(e) => setDailyRate(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none "
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:gap-4">
            <div className="flex-1">
              <label
                htmlFor=""
                className="block mb-1 font-medium text-gray-700"
              >
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none "
              >
                <option value="available">Available</option>
                <option value="booked">Booked</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
            <div className="flex-1">
              <label
                htmlFor=""
                className="block mb-1 font-medium text-gray-700"
              >
                Car Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full px-4 py-2 border rounded-lg cursor-pointer"
              />
              {imageData?.url && (
                <div className="mt-2">
                  <img
                    src={imageData.url}
                    alt=""
                    className="w-40 h-28 object-cover rounded-lg border"
                  />
                </div>
              )}
            </div>
          </div>
          <button
            disabled={loading}
            type="submit"
            className="w-full px-6 py-3 border-2 border-blue-600 text-[#465FFF] rounded-lg shadow-md transition-all duration-200 hover:bg-[#465FFF] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Adding...." : "Add Car"}
          </button>
        </form>
      </div>
    </>
  );
};

export default AddCar;
