import api from "./axios";

export const getAllCars = async () => {
  const res = await api.get("/cars-page");
  return res.data;
};

export const getFeaturedCars = async () => {
  const res = await api.get("/cars/featured");
  return res.data;
};

export const getCarById = async (id) => {
  const res = await api.get(`/cars/${id}`);
  return res.data.data;
};
