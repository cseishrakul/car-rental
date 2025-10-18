import React, { useEffect, useState } from "react";
import Title from "./Title";
import { dummyCarData } from "../../assets/assets";
import CarCard from "./CarCard";
import { FiArrowRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { getFeaturedCars } from "../../api/carApi";

const FeaturedSection = () => {
  const [cars, setCars] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const data = await getFeaturedCars();
        setCars(data);
      } catch (err) {
        console.error("Failed to fetch cars", err);
      }
    })();
  }, []);

  return (
    <div className="flex flex-col items-center py-24 px-6 md:px-16 lg:px-24 xl:px-32">
      <div className="">
        <Title
          title="Featured Vehicles"
          subTitle="Explore our selection of premium vehicles available for your next adventure."
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-18">
        {cars.map((car) => (
          <CarCard key={car.id} car={car} />
        ))}
      </div>
      <button
        onClick={() => {
          navigate("/cars");
          scrollTo(0, 0);
        }}
        className="flex items-center justify-center gap-2 px-6 py-2 border border-borderColor hover:bg-gray-50 rounded-md mt-18 cursor-pointer"
      >
        Explore all cars <FiArrowRight />
      </button>
    </div>
  );
};

export default FeaturedSection;
