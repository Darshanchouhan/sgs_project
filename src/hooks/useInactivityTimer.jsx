import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { logout } from "../store/authSlice"; // Adjust the import according to your project structure

const useInactivityTimer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const inactivityTimerRef = useRef(null);

  // Function to log out the user after inactivity
  const logoutUserOnInactivity = () => {
    localStorage.clear(); // Clear localStorage
    dispatch(logout()); // Clear Redux state
    delete axios.defaults.headers["Authorization"]; // Remove Authorization header from axios
    navigate("/login"); // Redirect to login page
  };

  // Function to reset the inactivity timer
  const resetInactivityTimer = () => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current); // Clear existing timer
    }

    // Set a new inactivity timer for 5 minutes (300,000 ms)
    inactivityTimerRef.current = setTimeout(() => {
      console.log("User has been inactive for 5 minutes, logging out...");
      logoutUserOnInactivity();
    }, 1 * 60 * 1000); // 5 minutes of inactivity
  };

  useEffect(() => {
    // Initial setup to reset the inactivity timer
    resetInactivityTimer();

    // Adding event listeners to reset the inactivity timer on activity
    window.addEventListener("mousemove", resetInactivityTimer);
    window.addEventListener("keydown", resetInactivityTimer);

    // Cleanup event listeners and timer on component unmount
    return () => {
      window.removeEventListener("mousemove", resetInactivityTimer);
      window.removeEventListener("keydown", resetInactivityTimer);
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current); // Clean up the timeout when component unmounts
      }
    };
  }, []); // Empty dependency array, so this runs only once when the component mounts

  // No return value is needed, as this hook only sets side effects
};

export default useInactivityTimer;
