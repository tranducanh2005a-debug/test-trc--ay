import api from "./api";
import { getData } from "../utils/storage";

const authHeader = async () => {
  const token = await getData("token");
  return {
    headers: {
      Authorization: token,
    },
  };
};

export const getCart = async () => {
  return api.get("/cart", await authHeader());
};

export const addToCart = async (product_id, size) => {
  return api.post("/cart", { product_id, size }, await authHeader());
};

export const updateCart = async (id, quantity) => {
  return api.put("/cart", { id, quantity }, await authHeader());
};

export const deleteCart = async (id) => {
  return api.delete(`/cart/${id}`, await authHeader());
};
