// Importing createSlice from Redux Toolkit to simplify slice creation
import { createSlice } from "@reduxjs/toolkit";

// Define the initial state for authentication
const initialState = {
  token: localStorage.getItem("authToken") || null, // Retrieve the token from localStorage or set to null if not found
  user: null, // Placeholder for user information (can be extended as needed)
  isAuthenticated: false, // Tracks whether the user is authenticated (logged in)
};

// Create a slice using createSlice
const authSlice = createSlice({
  name: "auth", // Name of the slice (used in debugging and for devtools)
  initialState, // The initial state defined above
  reducers: {
    // Reducers handle changes to the state based on dispatched actions
    // Reducer for handling user login
    login: (state, action) => {
      state.token = action.payload.token; // Set the token from the action's payload
      state.isAuthenticated = true; // Set isAuthenticated to true
      state.refershToken = action.payload.refershToken; // Set the user information from the action's payload
      localStorage.setItem("authToken", action.payload.token); // Store the token in localStorage for persistence
    },

    // Reducer for handling user logout
    logout: (state) => {
      localStorage.clear();
      state.token = null; // Clear the token when logging out
      state.isAuthenticated = false; // Set isAuthenticated to false
      state.user = null; // Clear the user data on logout
    },

    // Reducer to manually set the user information (optional, if needed)
    // setUser: (state, action) => {
    //   state.user = action.payload; // Set the user data from the action's payload
    // },
  },
});

// Exporting the actions so they can be dispatched in components or other parts of the app
export const { login, logout } = authSlice.actions;

// Exporting the reducer to be included in the store configuration
export default authSlice.reducer;
