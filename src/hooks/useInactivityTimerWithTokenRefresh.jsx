// useInactivityTimerWithTokenRefresh.js
import { useEffect, useRef } from "react";
import axios from "axios";
import { setShouldBypassInterceptor } from "../utils/interceptorControl";
import { refreshTokenIfNeeded } from "../services/axiosInstance";

const useInactivityTimerWithTokenRefresh = () => {
  const inactivityTimerRef = useRef(null);

  // Function to reset the inactivity timer
  const resetInactivityTimer = async () => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current); // Clear existing timer
    }

    // Check if the token is about to expire within 5 minutes (300 seconds)
    const token = localStorage.getItem("authToken");
    if (token) {
      // Temporarily disable interceptor during token refresh
      setShouldBypassInterceptor(true);

      const shouldRefresh = await refreshTokenIfNeeded();

      // If the token was refreshed, update the headers
      if (shouldRefresh) {
        console.log("Token refreshed due to user activity");
      }

      setShouldBypassInterceptor(false); // Re-enable the interceptor
    }

    // Set a new inactivity timer for 60 minutes (3600,000 ms)
    inactivityTimerRef.current = setTimeout(
      () => {
        // Handle user inactivity here (e.g., log out the user)
        console.log("User logged out due to inactivity");
        localStorage.clear();
        delete axios.defaults.headers["Authorization"]; // Remove Authorization header
        window.location.href = "/login"; // Redirect to login page or show a modal
      },
      60 * 60 * 1000,
    ); // 60 minutes of inactivity
  };

  useEffect(() => {
    // Initial setup to reset the inactivity timer
    resetInactivityTimer();

    // Adding event listeners to reset the inactivity timer on activity
    window.addEventListener("mousemove", resetInactivityTimer);
    window.addEventListener("keydown", resetInactivityTimer);
    window.addEventListener("click", resetInactivityTimer); // Additional event for clicks

    // Cleanup event listeners and timer on component unmount
    return () => {
      window.removeEventListener("mousemove", resetInactivityTimer);
      window.removeEventListener("keydown", resetInactivityTimer);
      window.removeEventListener("click", resetInactivityTimer);
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current); // Clean up the timeout when component unmounts
      }
    };
  }, []); // Empty dependency array, so this runs only once when the component mounts
};

export default useInactivityTimerWithTokenRefresh;
