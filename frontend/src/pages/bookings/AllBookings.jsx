import PageMeta from "../../components/common/PageMeta";
import api from "../../api/axios";
import { useEffect, useState } from "react";
import { FiEye, FiFileText } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function AllBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/bookings");
      setBookings(res.data || []);
    } catch (err) {
      console.error(err);
      setMessage("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <>
      <PageMeta
        title="All Bookings | Dashboard"
        description="Bookings dashboard"
      />

      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">All Bookings</h2>

        {message && <div className="mb-4 text-sm text-green-700">{message}</div>}

        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200 shadow-sm rounded-lg">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="border px-4 py-2">#</th>
                <th className="border px-4 py-2">Car</th>
                <th className="border px-4 py-2">User</th>
                <th className="border px-4 py-2">Pickup Date</th>
                <th className="border px-4 py-2">Return Date</th>
                <th className="border px-4 py-2">Amount</th>
                <th className="border px-4 py-2">Payment</th>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking, index) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2">{booking.car?.name} </td>
                  <td className="border px-4 py-2">{booking.user?.name}</td>
                  <td className="border px-4 py-2">{booking.pickup_date}</td>
                  <td className="border px-4 py-2">{booking.return_date}</td>
                  <td className="border px-4 py-2">${booking.amount}</td>
                  <td className="border px-4 py-2 capitalize">
                    <span
                      className={`px-2 py-1 rounded-full text-sm font-semibold ${
                        booking.payment_status === "paid"
                          ? "bg-green-100 text-green-800"
                          : booking.payment_status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : booking.payment_status === "failed"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {booking.payment_status}
                    </span>
                  </td>

                  <td className="border px-4 py-2 capitalize">
                    <span
                      className={`px-2 py-1 rounded-full text-sm font-semibold ${
                        booking.booking_status === "confirmed"
                          ? "bg-green-100 text-green-800"
                          : booking.booking_status === "cancelled"
                          ? "bg-red-100 text-red-800"
                          : booking.booking_status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {booking.booking_status}
                    </span>
                  </td>

                  <td className="border px-4 py-2 text-center">
                    {booking.booking_status === "confirmed" ? (
                      <div className="flex gap-2">
                        {" "}
                        <button
                          onClick={() =>
                            navigate(
                              `/dashboard/bookings-invoice/${booking.id}`
                            )
                          }
                          className="text-green-600 hover:text-green-800"
                          title="View Invoice"
                        >
                          <FiFileText size={18} />
                        </button>
                        <button
                          onClick={() =>
                            navigate(
                              `/dashboard/booking-details/${booking.id}`
                            )
                          }
                          className="text-blue-600 hover:text-blue-800"
                          title="View Details"
                        >
                          <FiEye size={18} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() =>
                          navigate(`/dashboard/booking-details/${booking.id}`)
                        }
                        className="text-blue-600 hover:text-blue-800"
                        title="View Details"
                      >
                        <FiEye size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr>
                  <td colSpan="9" className="text-center py-4 text-gray-500 italic">
                    No bookings found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
