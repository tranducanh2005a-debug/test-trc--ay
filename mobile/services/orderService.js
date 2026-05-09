import api from "./api";
import { getData } from "../utils/storage";

// ===== HEADER =====
const authHeader = async () => {
  const token = await getData("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`, 
    },
  };
};

// ===== CREATE ORDER =====
export const createOrder = async (data) => {
  return api.post("/orders", data, await authHeader());
};

// ===== GET ORDERS =====
export const getOrders = async () => {
  return api.get("/orders", await authHeader());
};