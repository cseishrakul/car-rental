import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { assets, dummyCarData } from "../../assets/assets";
import { FiArrowRight } from "react-icons/fi";
import { FaRegCheckCircle } from "react-icons/fa";
import Loader from "../../components/frontend/Loader";
import { getCarById } from "../../api/carApi";

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    (async () => {
      try {
        const data = await getCarById(id);
        setCar(data);
      } catch (err) {
        console.error("Failed to fetch cars", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <Loader />;
  if (!car) return <p className="text-center mt-10">Car not found</p>;

  return car ? (
    <div
      onClick={() => navigate(-1)}
      className="px-6 md:px-16 lg:px-24 xl:px-32 mt-16"
    >
      <button className="flex items-center gap-2 mb-6 text-gray-500 cursor-pointer">
        <FiArrowRight className="rotate-180 opacity-65" />
        Back To All Cars
      </button>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        {/* Left: Car image & Details */}
        <div className="lg:col-span-2">
          <img
            src={car.image}
            alt=""
            className="w-full h-auto md:max-h-100 object-cover rounded-xl mb-6 shadow-md"
          />
          <div className="space-y-6">
            <div className="">
              <h1 className="text-3xl font-bold">{car.name}</h1>
              <p className="text-gray-500 text-lg">
                {" "}
                {car.brand} {car.model}{" "}
              </p>
            </div>
            <hr className="border-borderColor my-6" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                {
                  icon: assets.users_icon,
                  text: `${car.seating_capacity} Seats`,
                },
                { icon: assets.fuel_icon, text: car.fuel_type },
                { icon: assets.car_icon, text: car.transmission },
                { icon: assets.location_icon, text: car.location },
              ].map(({ icon, text }) => (
                <div
                  key={text}
                  className="flex flex-col items-center bg-light p-4 rounded-lg"
                >
                  <img src={icon} alt="" className="h-5 mb-2" /> {text}
                </div>
              ))}
            </div>
            {/* Description */}
            <div className="">
              <h1 className="text-xl font-medium mb-3">Description</h1>
              <p className="text-gray-500"> {car.description} </p>
            </div>
            {/* Features */}
            <div className="">
              <h1 className="text-xl font-medium mb-3">Features</h1>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {car.features?.map((item) => (
                  <li key={item} className="flex items-center text-gray-500">
                    <FaRegCheckCircle className="h-4 mr-2 text-blue-600" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right: Booking Form */}
        <form
          onSubmit={handleSubmit}
          className="shadow-lg h-max sticky top-18 rounded-xl p-6 space-y-6 text-gray-500"
        >
          <p className="flex items-center justify-between text-xl text-gray-800 font-semibold">
            {" "}
            ${car.daily_rate}{" "}
            <span className="text-base text-gray-400 font-normal">Per Day</span>{" "}
          </p>
          <hr className="border-borderColor my-6" />

          <div className="flex flex-col gap-2">
            <label htmlFor="pickup-date"> Pickup Date </label>
            <input
              type="date"
              className="border border-borderColor px-3 py-2 rounded-lg"
              required
              id="pickup-date"
              min={new Date().toISOString().split("T")[0]}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="return-date"> Return Date </label>
            <input
              type="date"
              className="border border-borderColor px-3 py-2 rounded-lg"
              required
              id="return-date"
            />
          </div>
          <button className="w-full bg-primary hover:bg-primary-dull transition-all py-3 font-medium text-white rounded-xl cursor-pointer">
            Book Now
          </button>
          <p className="text-center text-sm">
            {" "}
            No credit card required to reserve{" "}
          </p>
        </form>
      </div>
    </div>
  ) : (
    <Loader />
  );
};

export default CarDetails;
