import { useEffect, useRef } from "react";
import useAuthentication from "../hooks/useAuthentication";

const useInactivityTimer = () => {
  const inactivityTimerRef = useRef(null);
  const { logoutUserAction } = useAuthentication();

  // Function to log out the user after inactivity
  const logoutUserOnInactivity = () => {
    logoutUserAction();
  };

  // Function to reset the inactivity timer
  const resetInactivityTimer = () => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current); // Clear existing timer
    }

    // Set a new inactivity timer for 5 minutes (300,000 ms)
    inactivityTimerRef.current = setTimeout(
      () => {
        logoutUserOnInactivity();
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
