import React, { useEffect, useState } from "react";
import Title from "../../components/frontend/Title";
import { FiSearch } from "react-icons/fi";
import { CiFilter } from "react-icons/ci";
import CarCard from "../../components/frontend/CarCard";
import { getAllCars } from "../../api/carApi";

const Cars = () => {
  const [input, setInput] = useState("");
  const [cars, setCars] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await getAllCars();
        setCars(data);
      } catch (err) {
        console.error("Failed to fetch cars", err);
      }
    })();
  }, []);

  const filteredCars = cars.filter(
    (car) =>
      car.name?.toLowerCase().includes(input.toLowerCase()) ||
      car.brand?.toLocaleLowerCase().includes(input.toLowerCase())
  );

  return (
    <div className="">
      <div className="flex flex-col items-center py-20 bg-light max-md:px-4">
        <Title
          title="Available Cars"
          subTitle="Browse our selection of premium vehicles available for your next adventure"
        />

        <div className="flex items-center bg-white px-4 mt-6 max-w-140 w-full h-12 rounded-full shadow">
          <FiSearch className="w-4.5 h-4.5 mr-2" />
          <input
            onClick={(e) => setInput(e.target.value)}
            value={input}
            type="text"
            placeholder="Search by make,model or features"
            className="w-full h-full outline-none text-gray-500"
          />
          <CiFilter className="w-4.5 h-4.5 ml-2 font-bold" />
        </div>
      </div>
      <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-10">
        <p className="text-gray-500 xl:px-20 max-w-7xl mx-auto">
          Showing {filteredCars.length} Cars{" "}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4 xl:px-20 max-w-7xl mx-auto">
          {filteredCars.map((car, index) => (
            <div key={index} className="">
              <CarCard car={car} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Cars;
