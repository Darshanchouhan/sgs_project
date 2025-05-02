import axios from "axios";
import { refreshAccessToken } from "./authService"; // Service functions
import {
  shouldBypassInterceptor,
  setShouldBypassInterceptor,
} from "../utils/interceptorControl";

// Function to check if the token is expired and refresh it
export const refreshTokenIfNeeded = async () => {
  const accessToken = localStorage.getItem("authToken");
  const refreshToken = localStorage.getItem("refereshToken");
  if (!accessToken || !refreshToken) {
    return false; // If no tokens are present, return false
  }
  try {
    // Check if the access token is expired or close to expiration
    const tokenExpiryTime = parseJwt(accessToken)?.exp; // Parse JWT to get the expiration time
    const currentTime = Math.floor(Date.now() / 1000); // Get the current time in seconds
    // If the access token is about to expire (e.g., within 15 minutes), refresh it
    if (tokenExpiryTime && tokenExpiryTime - currentTime <= 900) {
      setShouldBypassInterceptor(true); // Temporarily disable the request interceptor
      const newAccessToken = await refreshAccessToken();
      localStorage.setItem("authToken", newAccessToken); // Store the new access token
      // Update axios default headers with the new token
      axios.defaults.headers["Authorization"] = `Bearer ${newAccessToken}`;
      setShouldBypassInterceptor(false); // Re-enable the interceptor after refreshing
      return true; // Indicate that the token was refreshed successfully
    }
    return false; // No need to refresh if the token is still valid
  } catch (err) {
    console.error("Error refreshing token:", err);
    return false; // Return false if the refresh process fails
  }
};

const parseJwt = (token) => {
  try {
    // Split the token to extract the payload (middle part)
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = atob(base64);
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Error parsing JWT:", e);
    return null;
  }
};

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: "https://demo.gramener.com/api/", // Replace with your Django backend URL

  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to automatically add Authorization header if token exists
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("authToken");
    // Skip the request interceptor if bypassing for token refresh
    if (shouldBypassInterceptor) {
      config.headers["Authorization"] = `Bearer ${token}`;
      return config;
    }

    // Ensure the token is refreshed if it's close to expiration
    const shouldRefresh = await refreshTokenIfNeeded();

    // If a new token was refreshed, update the request headers
    if (shouldRefresh) {
      const newAccessToken = localStorage.getItem("authToken"); // Get the new access token
      config.headers["Authorization"] = `Bearer ${newAccessToken}`;
    } else if (token) {
      // If no refresh was needed, proceed with the current token
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
    if (
      error.response.status === 401 &&
      localStorage.getItem("refereshToken")
    ) {
      localStorage.clear();
      delete axios.defaults.headers["Authorization"]; // Remove Authorization header
      window.location.href = "/login"; // Redirect to login page or show a modal
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
