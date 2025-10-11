import React, { useEffect, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import api from "../../api/axios";

const PendingDrivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [message, setMessage] = useState("");
  const [cars, setCars] = useState([]);
  const [loadingDriverId, setLoadingDriverId] = useState(null); // Track loading for each driver

  // Fetch pending drivers
  const fetchPending = async () => {
    try {
      const res = await api.get("/driver/pending");
      setDrivers(res.data.data || res.data);
    } catch (err) {
      console.error(err);
      setMessage("Failed to fetch pending drivers.");
    }
  };

  // Fetch available cars
  const fetchCars = async () => {
    try {
      const res = await api.get("/cars");
      setCars(res.data.data || res.data);
    } catch (err) {
      console.error(err);
      setMessage("Failed to fetch cars.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchPending();
      await fetchCars();
    };
    fetchData();
  }, []);

  // Handle car selection change
  const handleCarSelect = (e, driverId) => {
    const updatedDrivers = drivers.map((driver) =>
      driver.id === driverId
        ? { ...driver, selectedCar: e.target.value }
        : driver
    );
    setDrivers(updatedDrivers);
  };

  // Handle approve action
  const handleApprove = async (id, assigned_car_id = null) => {
    if (!confirm("Approve this driver?")) return;
    setLoadingDriverId(id); // Set loading for specific driver
    try {
      await api.post(`/driver/${id}/approve`, { assigned_car_id });
      setMessage("Driver Approved!");
      fetchPending(); // Refresh the pending drivers list
    } catch (err) {
      setMessage(
        err.response?.data?.message ||
          "There was an error approving the driver."
      );
    } finally {
      setLoadingDriverId(null); // Reset loading after the request completes
    }
  };

  // Handle reject action
  const handleReject = async (id) => {
    if (!confirm("Reject this driver?")) return;
    setLoadingDriverId(id); // Set loading for specific driver
    try {
      await api.post(`/driver/${id}/reject`);
      setMessage("Driver Rejected!");
      fetchPending(); // Refresh the pending drivers list
    } catch (err) {
      setMessage(
        err.response?.data?.message ||
          "There was an error rejecting the driver."
      );
    } finally {
      setLoadingDriverId(null); // Reset loading after the request completes
    }
  };

  return (
    <>
      <PageMeta title="Pending Drivers" description="Approve Drivers" />
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Pending Drivers</h2>

        {message && (
          <div className="mb-4 text-sm text-green-700"> {message} </div>
        )}

        <div className="space-y-4">
          {drivers.length === 0 && (
            <div className="text-gray-500 italic">No Pending Drivers!</div>
          )}
          {drivers.map((driver) => (
            <div
              key={driver.id}
              className="p-4 border rounded flex gap-4 items-start"
            >
              <img
                src={
                  driver.profile_photo ||
                  driver.user?.driverProfile?.profile_photo ||
                  "/images/user/default.png"
                }
                alt={driver.user?.name}
                className="w-20 h-20 object-cover rounded"
              />
              <div className="flex-1">
                <div className="font-semibold">
                  {" "}
                  {driver.user?.name} ({driver.user?.email}){" "}
                </div>
                <div className="text-sm text-gray-600">
                  Phone: {driver.phone}
                </div>
                <div className="text-sm text-gray-600">
                  License: {driver.license_number}
                </div>
                <div className="text-sm text-gray-600">
                  Experience: {driver.experience_years} years
                </div>
                <div className="mt-2">
                  <label htmlFor="" className="text-sm">
                    Assign Car{" "}
                  </label>
                  <select
                    value={driver.selectedCar || ""}
                    onChange={(e) => handleCarSelect(e, driver.id)}
                    className="ml-2 px-2 py-1 border rounded"
                  >
                    <option value=""> -- Select -- </option>
                    {cars.map((c) => (
                      <option key={c.id} value={c.id}>
                        {" "}
                        {c.name} - {c.brand}{" "}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  disabled={loadingDriverId === driver.id}
                  onClick={() =>
                    handleApprove(driver.id, driver.selectedCar || null)
                  }
                  className="px-3 py-1 bg-green-600 text-white rounded"
                >
                  Accept
                </button>
                <button
                  disabled={loadingDriverId === driver.id}
                  onClick={() => handleReject(driver.id)}
                  className="px-3 py-1 bg-red-600 text-white rounded"
                >
                  Reject
                </button>
                <button
                  onClick={() => alert(JSON.stringify(driver, null, 2))}
                  className="px-3 py-1 bg-gray-200 rounded"
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default PendingDrivers;
