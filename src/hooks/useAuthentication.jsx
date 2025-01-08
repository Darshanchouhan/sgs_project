import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login, logout } from "../store/authSlice"; // Redux actions
import { fetchLoginTokens, refreshAccessToken } from "../services/authService"; // Service functions
import axios from "axios";

const useAuthentication = () => {
  const dispatch = useDispatch();
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Function to login and store token
  const loginUser = async (username, password) => {
    try {
      const tokens = await fetchLoginTokens(username, password);

      // Dispatch Redux action to update global authentication state
      dispatch(
        login({
          token: tokens.access,
          refershToken: tokens.token, // Assuming user data is returned
        }),
      );

      // Set token in axios default headers for future requests
      axios.defaults.headers["Authorization"] = `Bearer ${tokens.access}`;
      return tokens; // Return the tokens
    } catch (err) {
      setError(err.message || "Invalid username or password");
      console.error("Authentication error:", err.response);
      throw new Error(err.message || "Invalid username or password");
    }
  };

  // Function to logout user and remove token from localStorage and Redux state
  const logoutUserAction = () => {
    dispatch(logout()); // Clear the Redux authentication state
    delete axios.defaults.headers["Authorization"]; // Remove Authorization header
    navigate("/login"); // Redirect to login Page
  };

  // Function to check if the token is expired and refresh it
  const refreshTokenIfNeeded = async () => {
    const accessToken = localStorage.getItem("authToken");
    const refreshToken = localStorage.getItem("refereshToken");

    if (!accessToken || !refreshToken) {
      return false; // If no tokens are present, return false
    }

    try {
      // Check if the access token is expired or close to expiration
      const tokenExpiryTime = parseJwt(accessToken)?.exp; // Parse JWT to get the expiration time
      const currentTime = Math.floor(Date.now() / 1000); // Get the current time in seconds

      // If the access token is about to expire (e.g., within 5 minutes), refresh it
      if (tokenExpiryTime && tokenExpiryTime - currentTime <= 300) {
        const newAccessToken = await refreshAccessToken();
        localStorage.setItem("authToken", newAccessToken); // Store the new access token

        // Update axios default headers with the new token
        axios.defaults.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return true; // Indicate that the token was refreshed successfully
      }

      return false; // No need to refresh if the token is still valid
    } catch (err) {
      console.error("Error refreshing token:", err);
      return false; // Return false if the refresh process fails
    }
  };

  // Utility function to decode JWT token and extract its payload
  const parseJwt = (token) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split(" ")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join(""),
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  };

  // Function to check if user is authenticated based on token in localStorage
  const isAuthenticated = () => {
    return !!localStorage.getItem("authToken"); // Return true if token exists
  };

  return {
    loginUser,
    logoutUserAction,
    isAuthenticated,
    refreshTokenIfNeeded,
    error,
  };
};

export default useAuthentication;
