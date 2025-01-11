import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthentication from "../hooks/useAuthentication"; // Import the custom hook
import Login from "../components/login/login";
import { fetchUserProfile } from "../services/authService";

const LoginPage = () => {
  const { loginUser, error: authError } = useAuthentication(); // Use the custom hook
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Handle input changes for email and password
  const handleInputChange = (field) => (e) => {
    if (field === "email") {
      setEmail(e.target.value);
    } else if (field === "password") {
      setPassword(e.target.value);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!email || !password) {
      setError("Please fill in both fields");
      return;
    }

    setError(""); // Clear previous errors
    setLoading(true); // Show loading indicator

    try {
      // Call the loginUser function from the useAuthentication hook
      await loginUser(email, password);
      setLoading(false);

      // Fetch user profile after login
      await fetchUserProfile(); // Fetch user profile after successful login

      // Redirect or handle success, like showing a dashboard page, etc.
      navigate("/vendordashboard");
    } catch (err) {
      setError("Invalid username or password");
      console.error("Authentication error:", err);
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  return (
    <Login
      email={email}
      password={password}
      handleInputChange={handleInputChange}
      handleSubmit={handleSubmit}
      error={error}
      loading={loading}
    />
  );
};

export default LoginPage;
