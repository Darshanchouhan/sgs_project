// src/axiosInstance.js
import axios from "axios";
import { refreshAccessToken } from "./authService";

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: "https://sgs.gramener.com/api/", // Replace with your Django backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to automatically add Authorization header if token exists
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Interceptor to handle token expiry (refresh token logic)
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem("refereshToken")
    ) {
      originalRequest._retry = true;
      const newAccessToken = await refreshAccessToken(); // Refresh the token
      if (newAccessToken) {
        // Retry the original request with the new access token
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
