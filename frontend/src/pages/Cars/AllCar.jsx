import React, { useEffect, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import api from "../../api/axios";
import { FiEdit, FiEye, FiTrash2 } from "react-icons/fi";

const AllCar = () => {
  const [cars, setCars] = useState([]);
  const [message, setMessage] = useState("");
  // Edit modal state
  const [editingCar, setEditingCar] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    brand: "",
    model: "",
    daily_rate: "",
    status: "available",
  });

  const [editImage, setEditImage] = useState(null);

  const fetchCars = async () => {
    try {
      const res = await api.get("/cars");
      setCars(res.data.data || res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this car?")) return;

    try {
      await api.delete(`/cars/${id}`);
      setMessage("Car delete successfully!");
      fetchCars();
    } catch (err) {
      setMessage(err.response?.data?.message || "Delete Failed!");
    }
  };

  const handleEditClick = (car) => {
    setEditingCar(car);
    setEditForm({
      name: car.name,
      brand: car.brand,
      model: car.model,
      daily_rate: car.daily_rate,
      status: car.status,
    });
    setEditImage(null);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", editForm.name);
      formData.append("brand", editForm.brand);
      formData.append("model", editForm.model);
      formData.append("daily_rate", editForm.daily_rate);
      formData.append("status", editForm.status);

      if (editImage) {
        formData.append("image", editImage);
      }

      await api.post(`/cars/${editingCar.id}?_method=PUT`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("Car Updated Successfully.");
      setEditingCar(null);
      fetchCars();
    } catch (err) {
      setMessage(err.response?.data?.message || "Update Failed!");
    }
  };

  return (
    <>
      <PageMeta
        title="All Car | Dashboard"
        description="This is All Car page"
      />

      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
          All Car
        </h2>
        <hr />

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

        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200 shadow-sm rounded-lg">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="border px-4 py-2 text-left">#</th>
                <th className="border px-4 py-2 text-left">Image</th>
                <th className="border px-4 py-2 text-left">Name</th>
                <th className="border px-4 py-2 text-left">Brand</th>
                <th className="border px-4 py-2 text-left">Model</th>
                <th className="border px-4 py-2 text-left">Daily Rate</th>
                <th className="border px-4 py-2 text-left">Status</th>
                <th className="border px-4 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {cars.map((car, index) => (
                <tr key={car.id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2"> {index + 1} </td>
                  <td className="border px-4 py-2">
                    <img
                      src={`http://127.0.0.1:8000/${car.image}`}
                      className="w-16 h-10 object-cover rounded"
                      alt=""
                    />
                  </td>
                  <td className="border px-4 py-2"> {car.name} </td>
                  <td className="border px-4 py-2"> {car.brand} </td>
                  <td className="border px-4 py-2"> {car.model} </td>
                  <td className="border px-4 py-2">$ {car.daily_rate} </td>
                  <td className="border px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        car.status === "available"
                          ? "bg-green-100 text-green-700"
                          : car.status === "booked"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {" "}
                      {car.status}{" "}
                    </span>
                  </td>
                  <td className="border px-4 py-2 text-center flex justify-center gap-3">
                    <button
                      onClick={() => alert(JSON.stringify(car, null, 2))}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FiEye size={18} />
                    </button>
                    <button
                      onClick={() => handleEditClick(car)}
                      className="text-green-600 hover:text-green-800"
                    >
                      <FiEdit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(car.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {cars.length === 0 && (
                <tr>
                  <td
                    colSpan="8"
                    className="text-center py-4 text-gray-500 italic"
                  >
                    No cars found!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* EditModel */}
      {editingCar && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
            <h3 className="text-xl font-semibold mb-6">
              Edit Car - {editingCar.name}
            </h3>
            <form onSubmit={handleUpdate} className="space-y-5">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label htmlFor="" className="block mb-1 font-medium">
                    Name
                  </label>
                  <input
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="" className="block mb-1 font-medium">
                    Brand
                  </label>
                  <input
                    value={editForm.brand}
                    onChange={(e) =>
                      setEditForm({ ...editForm, brand: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label htmlFor="" className="block mb-1 font-medium">
                    Model
                  </label>
                  <input
                    value={editForm.model}
                    onChange={(e) =>
                      setEditForm({ ...editForm, model: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="" className="block mb-1 font-medium">
                    Daily Rate ($)
                  </label>
                  <input
                    type="number"
                    value={editForm.daily_rate}
                    onChange={(e) =>
                      setEditForm({ ...editForm, daily_rate: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label htmlFor="" className="block mb-1 font-medium">
                    Status
                  </label>
                  <select
                    value={editForm.status}
                    onChange={(e) => {
                      setEditForm({ ...editForm, status: e.target.value });
                    }}
                    className="w-full px-3 py-2 border rounded"
                  >
                    <option value="available">Available</option>
                    <option value="booked">Booked</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label htmlFor="" className="block mb-1 font-medium">
                    Car Image
                  </label>
                  <input
                    type="file"
                    onChange={(e) => setEditImage(e.target.files[0])}
                    className="w-full px-3 py-2 border rounded"
                    accept="image/*"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={()=>setEditingCar(null)} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Update Car</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AllCar;
