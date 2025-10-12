import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import PageMeta from "../../components/common/PageMeta";

const DriverProfile = () => {
  const [data, setData] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/driver/me");
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-6">Loading....!</div>;

  const { user, profile } = data || {};
  return (
    <>
      <PageMeta title="Drivers List" description="Become a driver" />
      <div className="max-w-full mx-auto p-6">
        <h2 className="text-2xl font-semibold mb-4 text-center mt-4">
          Welcome, {user?.name || "Driver"}
        </h2>
        <hr className="my-3 border" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="">
            <h3 className="text-lg font-semibold mb-2">Profile</h3>
            <ul className="text-gray-700 space-y-1">
              <li>Email: {user?.email} </li>
              <li>Phone: {profile?.phone}</li>
              <li> Address : {profile?.address} </li>
              <li>
                Status:
                <span
                  className={`ml-2 px-2 py-1 rounded text-white text-sm ${
                    profile?.status === "approved"
                      ? "bg-green-600"
                      : "bg-yellow-500"
                  }`}
                >
                  {profile?.status}
                </span>
              </li>
              <li></li>
            </ul>
          </div>
          <div className="">
            <h3 className="text-lg font-semibole mb-2">Assigned Car</h3>
            {profile?.car ? (
              <div className="border p-4 rounded flex items-center gap-4">
                <img
                  src={profile.car.image}
                  alt={profile?.car.name}
                  className="w-24 h-24 object-cover rounded"
                />
                <div className="">
                  <p className="font-semibold"> {profile.car.name} </p>
                  <p className="text-sm text-gray-600"> {profile.car.brand} </p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 italic">No car assigned yet!</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DriverProfile;
