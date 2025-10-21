import React, { useEffect, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import { useNavigate, useParams } from "react-router";
import api from "../../api/axios";
import { Editor } from "react-draft-wysiwyg";
import { ContentState, convertToRaw, EditorState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const EditCar = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    model: "",
    dailyRate: "",
    status: "available",
    seating_capacity: "",
    fuel_type: "",
    transmission: "",
    location: "",
  });

  const [description, setDescription] = useState(EditorState.createEmpty());
  const [features, setFeatures] = useState([]);
  const [featureInput, setFeatureInput] = useState("");

  const [imageData, setImageData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const res = await api.get(`/cars/${id}`);
        const car = res.data.data;
        console.log(car);

        if (!car) {
          setMessage("Car not found.");
          return;
        }
        setFormData({
          name: car.name || "",
          brand: car.brand || "",
          model: car.model || "",
          dailyRate: car.daily_rate || "",
          status: car.status || "",
          seating_capacity: car.seating_capacity || "",
          fuel_type: car.fuel_type || "",
          transmission: car.transmission || "",
          location: car.location || "",
        });
        setFeatures(car.features || []);
        if (car.description) {
          const contentBlock = htmlToDraft(car.description);
          if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(
              contentBlock.contentBlocks
            );
            setDescription(EditorState.createWithContent(contentState));
          }
        }
        if (car.image) {
          setImageData({ url: car.image });
        }
      } catch (er) {
        console.error(er);
        setMessage("Failed to fetch Data");
      }
    };
    fetchCar();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddFeature = () => {
    if (featureInput.trim() !== "") {
      setFeatures([...features, featureInput.trim()]);
      setFeatureInput("");
    }
  };

  const handleRemoveFeature = (index) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

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

    try {
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("brand", formData.brand);
      submitData.append("model", formData.model);
      submitData.append("daily_rate", formData.dailyRate);
      submitData.append("status", formData.status);
      submitData.append("seating_capacity", formData.seating_capacity);
      submitData.append("fuel_type", formData.fuel_type);
      submitData.append("transmission", formData.transmission);
      submitData.append("location", formData.location);
      submitData.append(
        "description",
        draftToHtml(convertToRaw(description.getCurrentContent()))
      );

      if (imageData?.url) {
        submitData.append("image", imageData.url);
      }

      features.forEach((feature) => submitData.append("features[]", feature));

      const res = await api.post(`/cars/${id}?_method=PUT`, submitData);

      setMessage(res.data.message || "Car updated successfully!");
      setTimeout(() => navigate("/dashboard/cars"), 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to update car");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageMeta
        title="Update Car | Dashboard"
        description="This is Update Car page"
      />

      <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Update Car
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "name",
              "brand",
              "model",
              "dailyRate",
              "seating_capacity",
              "fuel_type",
              "transmission",
              "location",
            ].map((field) => (
              <div key={field}>
                <label className="block mb-1 font-medium text-gray-700">
                  {" "}
                  {field.replace("_", " ").toUpperCase()}{" "}
                </label>
                <input
                  name={field}
                  type={
                    field === "dailyRate" || field === "seating_capacity"
                      ? "number"
                      : "text"
                  }
                  value={formData[field]}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  required
                />
              </div>
            ))}
          </div>
          <div className="">
            <label className="block mb-1 font-medium text-gray-700">
              Description
            </label>
            <Editor
              editorState={description}
              onEditorStateChange={setDescription}
              wrapperClassName="border rounded-lg"
              editorClassName="p-2 min-h-[120px]"
              toolbar={{
                options: ["inline", "list", "textAlign", "link", "history"],
                inline: { options: ["bold", "italic", "underline"] },
              }}
            />
          </div>
          {/* Features */}
          <div className="">
            <label className="block mb-1 font-medium text-gray-700">
              Features
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                placeholder="Add features"
                className="pz-3 py-2 border rounded-lg flex-1"
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {features.map((feat, i) => (
                <span
                  key={i}
                  className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full flex items-center gap-1"
                >
                  {" "}
                  {feat}
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(i)}
                    className="text-red-500 font-bold"
                  >
                    X
                  </button>{" "}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:gap-4 items-center">
            <div className="flex-">
              <label className="block mb-1 font-medium text-gray-700">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              >
                <option value="available">Avaiable</option>
                <option value="maintenance">Maintenance</option>
                <option value="booked">Booked</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block mb-1 font-medium text-gray-700">
                Car Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full px-4 py-2 border rounded-lg cursor-pointer"
              />
              {imageData?.url && (
                <img
                  src={imageData.url}
                  alt=""
                  className="w-40 h-40 mt-4 object-cover rounded-lg border"
                />
              )}
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-2 border-2 border-blue-600 text-[#465FFF] rounded-lg shadow-md transition-all duration-200 hover:bg-[#465FFF] hover:text-white disabled:opactity-50 disabled:cursor-not-allowed"
          >
            {" "}
            {loading ? "Processing" : "Update Car"}{" "}
          </button>
        </form>
      </div>
    </>
  );
};

export default EditCar;
