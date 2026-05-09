import axios from "axios";
import { getData, saveData } from "../utils/storage";

const api = axios.create({
  baseURL: "http://192.168.1.12:5000/api",
});

// ================= REQUEST =================
// 🔥 tự động gắn token
api.interceptors.request.use(
  async (config) => {
    const token = await getData("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (err) => Promise.reject(err)
);

// ================= RESPONSE =================
// 🔥 tự refresh token khi 401
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    if (
      err.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = await getData("refreshToken");

        if (!refreshToken) {
          throw new Error("No refresh token");
        }

        const res = await axios.post(
          "http://192.168.1.12:5000/api/auth/refresh",
          { refreshToken }
        );

        const newToken = res.data.accessToken;

        //lưu token mới
        await saveData("token", newToken);

        //gắn lại header
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return api(originalRequest);
      } catch (refreshErr) {
        console.log("Refresh failed:", refreshErr);

        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(err);
  }
);

export default api;