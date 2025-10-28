import React, { useEffect, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import api from "../../api/axios";

const MyAssignment = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDriverBookings = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      const res = await api.get("/driver/bookings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(res.data.bookings);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDriverBookings();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center text-red-600 mt-10">{error}</p>;

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-16">
      <PageMeta title="My Tasks" description="Driver assigned trips" />

      <h1 className="text-2xl font-bold mb-6">My Assigned Trips</h1>

      {bookings.length === 0 ? (
        <p className="text-gray-500">No assigned trips yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white shadow-md rounded-xl p-5 hover:shadow-lg transition"
            >
              <img
                src={booking.car?.image}
                alt={booking.car?.model}
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
              <h2 className="text-lg font-semibold mb-2">
                {booking.car?.brand} | {booking.car?.model}
              </h2>
              <p>
                <strong>Pickup Date:</strong> {booking.pickup_date}
              </p>
              <p>
                <strong>Return Date:</strong> {booking.return_date}
              </p>
              <p>
                <strong>User Name:</strong> {booking.user?.name}
              </p>
              <p>
                <strong>User Email:</strong> {booking.user?.email}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={`capitalize ${
                    booking.booking_status === "confirmed"
                      ? "text-green-600"
                      : "text-yellow-600"
                  }`}
                >
                  {booking.booking_status}
                </span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAssignment;
