import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

// Check if the user is authenticated by decoding the JWT token
const isAuthenticated = () => {
  const token = localStorage.getItem("authToken");
  if (!token) return false; // No token found, user is not authenticated

  try {
    const decoded = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    const isTokenExpired = decoded.exp < currentTime; // Check if token is expired
    return !isTokenExpired; // Return false if token is expired
  } catch (err) {
    console.error("Error decoding token", err);
    return false; // Token is invalid or has expired
  }
};

// PrivateRoute component that protects routes requiring authentication
const PrivateRoute = ({ element }) => {
  if (isAuthenticated()) {
    return element; // Render the protected component if authenticated
  } else {
    return <Navigate to="/login" replace />; // Redirect to login if not authenticated
  }
};

export default PrivateRoute;
