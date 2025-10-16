import React from "react";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";

const CarCard = ({ car }) => {
  const navigate = useNavigate();
  return (
    <div onClick={()=>{navigate(`/car-details/${car._id}`);screenTop(0,0)}} className="group relative rounded-xl overflow-hidden shadow-lg bg-white hover:-translate-y-1 transition-all duration-500 cursor-pointer">
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={car.image}
          alt={`${car.brand} ${car.model}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {car.isAvailable && (
          <p className="absolute top-3 left-3 bg-primary text-white text-xs px-2.5 py-1 rounded-full shadow-md">
            Available Now
          </p>
        )}
      </div>

      {/* Price Tag */}
      <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm text-white px-3 py-2 rounded-md text-sm">
        <span className="font-semibold">${car.pricePerDay}</span>
        <span className="text-xs text-gray-300"> / Day</span>
      </div>

      {/* Details */}
      <div className="p-4 sm:p-5">
        <h3 className="text-lg font-semibold">
          {car.brand} {car.model}
        </h3>
        <p className="text-gray-500 text-sm mb-3">
          {car.category} • {car.year}
        </p>

        <div className="grid grid-cols-2 gap-y-2 text-gray-600 text-sm">
          <div className="flex items-center">
            <img src={assets.users_icon} alt="" className="h-4 mr-2" />
            <span>{car.seating_capacity} Seats</span>
          </div>
          <div className="flex items-center">
            <img src={assets.fuel_icon} alt="" className="h-4 mr-2 ml-2" />
            <span>{car.fuel_type}</span>
          </div>
          <div className="flex items-center">
            <img src={assets.car_icon} alt="" className="h-4 mr-1" />
            <span>{car.transmission}</span>
          </div>
          <div className="flex items-center">
            <img src={assets.location_icon} alt="" className="h-4 mr-2 ml-2" />
            <span>{car.location}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
