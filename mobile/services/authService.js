import api from "./api";
import { getData } from "../utils/storage";

// ===== LOGIN / REGISTER =====
export const login = (data) => api.post("/auth/login", data);
export const register = (data) => api.post("/auth/register", data);

// ===== TOKEN HEADER =====
const authHeader = async () => {
  const token = await getData("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// ===== GET PROFILE =====
export const getMe = async () => {
  return api.get("/auth/me", await authHeader());
};

// ===== UPDATE PROFILE + UPLOAD AVATAR =====
export const updateProfile = async (data) => {
  const token = await getData("token");

  const formData = new FormData();

  formData.append("name", data.name);

  if (data.avatar) {
    formData.append("avatar", {
      uri: data.avatar,
      name: "avatar.jpg",
      type: "image/jpeg",
    });
  }

  return api.put("/auth/update", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};