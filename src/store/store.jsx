// Import the necessary functions from Redux Toolkit
import { configureStore } from "@reduxjs/toolkit"; // Function to configure the Redux store
import authReducer from "./authSlice"; // Import the auth reducer (created in authSlice.js)

// Configure and create the Redux store
const store = configureStore({
  reducer: {
    auth: authReducer, // The auth slice will handle the authentication-related state
  },
});

export default store; // Export the store to be used by the Provider component in the app
