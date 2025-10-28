import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageMeta from "../../components/common/PageMeta";
import api from "../../api/axios";
import { FiArrowLeft } from "react-icons/fi";

export default function BookingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [cancel, setCancel] = useState(false);
  const [message, setMessage] = useState("");

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("auth_token");
      const res = await api.get(`/admin/bookings/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBooking(res.data.booking);
      setDriver(res.data.driver || null);
    } catch (err) {
      console.error(err);
      setMessage("Failed to fetch booking!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [id]);

  const confirmBooking = async () => {
    if (!window.confirm("Are you sure you want to confirm this booking?"))
      return;
    setUpdating(true);
    try {
      const token = localStorage.getItem("auth_token");
      const res = await api.patch(
        `/admin/bookings/${id}/confirm`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setBooking(res.data.booking);
      alert(res.data.message);
      navigate("/dashboard/bookings");
    } catch (err) {
      console.error(err);
      alert("Failed to confirm booking!");
    } finally {
      setUpdating(false);
    }
  };
  const cancelBooking = async () => {
    if (!window.confirm("Are you sure you want to cancel this booking?"))
      return;
    setCancel(true);
    try {
      const token = localStorage.getItem("auth_token");
      const res = await api.patch(
        `/admin/bookings/${id}/cancel`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setBooking(res.data.booking);
      alert(res.data.message);
      navigate("/dashboard/bookings");
    } catch (err) {
      console.error(err);
      alert("Failed to cancel booking!");
    } finally {
      setCancel(false);
    }
  };

  if (loading) return <p className="text-center mt-10"> Loading... </p>;
  if (!booking) return <p className="text-center mt-10"> Booking not found </p>;

  const { user, car } = booking;

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-16">
      <PageMeta
        title={`Booking #${booking.id} | Dashboard`}
        description="Booking details dashboard"
      />

      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-6 text-gray-500 cursor-pointer"
      >
        <FiArrowLeft />
        Back to All Bookings
      </button>

      {message && <div className="mb-4 text-sm text-red-600">{message}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Booking Details */}
        <div className="shadow-lg p-6 rounded-xl space-y-4 bg-white">
          <h2 className="text-xl font-semibold mb-4">Booking Details</h2>

          <p>
            <strong>Booking ID:</strong> {booking.id}
          </p>
          <p>
            <strong>Pickup Date:</strong> {booking.pickup_date}
          </p>
          <p>
            <strong>Return Date:</strong> {booking.return_date}
          </p>
          <p>
            <strong>Days:</strong> {booking.days}
          </p>
          <p>
            <strong>Amount:</strong> ${booking.amount}
          </p>
          <p>
            <strong>Transition ID:</strong> {booking.transaction_id}
          </p>
          <p>
            <strong>Payment Status:</strong>{" "}
            <span
              className={`capitalize ${
                booking.payment_status === "paid"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {booking.payment_status}
            </span>
          </p>
          <p>
            <strong>Booking Status:</strong>{" "}
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

          {booking.booking_status !== "confirmed" && (
            <div className="flex gap-4">
              <button
                onClick={confirmBooking}
                disabled={updating}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg mt-4"
              >
                {updating ? "Updating..." : "Confirm Booking"}
              </button>
              <button
                onClick={cancelBooking}
                disabled={cancel}
                className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg mt-4"
              >
                {updating ? "Cancelling..." : "Cancel Booking"}
              </button>
            </div>
          )}

          {/* {booking.booking_status === "confirmed" && (
            <button
              onClick={handlePrint}
              className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg mt-4"
            >
              Print / PDF
            </button>
          )} */}
        </div>

        {/* Right: User & Car Details */}
        <div className="space-y-6">
          {/* User Info */}
          <div className="shadow-lg p-6 rounded-xl bg-white">
            <h2 className="text-xl font-semibold mb-4">User Details</h2>
            <p>
              <strong>Name:</strong> {user.name}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
          </div>

          {/* Driver Info */}
          {driver ? (
            <div className="shadow-lg p-6 rounded-xl bg-white">
              <h2 className="text-xl font-semibold mb-4">Driver Details</h2>
              <p>
                <strong>Name:</strong> {driver.name}
              </p>
              <p>
                <strong>Email:</strong> {driver.email}
              </p>
              <p>
                <strong>Phone:</strong> {driver.phone}
              </p>
              <p>
                <strong>Address:</strong> {driver.address}
              </p>
              <p>
                <strong>License:</strong> {driver.license_number}
              </p>
              <p>
                <strong>Nid:</strong> {driver.nid}
              </p>
            </div>
          ) : (
            <div className="shadow-lg p-6 rounded-xl bg-white">
              No driver assigned to this car!
            </div>
          )}

          {/* Car Info */}
          <div className="shadow-lg p-6 rounded-xl bg-white">
            <h2 className="text-xl font-semibold mb-4">Car Details</h2>
            <img
              src={car.image}
              alt={car.model}
              className="w-full h-48 object-cover rounded mb-4"
            />
            <p>
              <strong>Brand:</strong> {car.brand}
            </p>
            <p>
              <strong>Model:</strong> {car.model}
            </p>
            <p>
              <strong>Daily Rate:</strong> ${car.daily_rate}
            </p>
            <p>
              <strong>Seats:</strong> {car.seating_capacity}
            </p>
            <p>
              <strong>Fuel:</strong> {car.fuel_type}
            </p>
            <p>
              <strong>Transmission:</strong> {car.transmission}
            </p>
            <p>
              <strong>Location:</strong> {car.location}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
