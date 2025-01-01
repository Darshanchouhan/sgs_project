import axiosInstance from "./axiosInstance";

// Function to log in and get access & refresh tokens
export const fetchLoginTokens = async (username, password) => {
  try {
    const response = await axiosInstance.post("token/", {
      username,
      password,
    });

    localStorage.setItem("username", username); // save the username
    // Store the tokens in localStorage
    localStorage.setItem("authToken", response.data.access); // Access token
    localStorage.setItem("refresh_token", response.data.token); // Refresh token

    return response.data; // Return both tokens
  } catch (error) {
    console.error("Login failed:", error.response?.data || error);
    throw error;
  }
};

// Function to refresh the access token using the refresh token
export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refresh_token");

  try {
    const response = await axiosInstance.post("refresh_token/", {
      refresh: refreshToken,
    });

    const newAccessToken = response.data.access; // Get new access token
    localStorage.setItem("authToken", newAccessToken); // Store new access token

    return newAccessToken; // Return new access token
  } catch (error) {
    console.error(
      "Failed to refresh access token:",
      error.response?.data || error
    );
    return null; // Return null if refresh fails
  }
};

// Function to log out the user and remove tokens from localStorage
export const logoutUser = () => {
  localStorage.clear();
};

// Function to fetch the profile of the currently authenticated user
export const fetchUserProfile = async () => {
  try {
    // Get the username from localStorage or from the authenticated user state
    const username = localStorage.getItem("username");

    if (!username) {
      throw new Error("Username is missing. Please log in.");
    }

    // Make the API call to fetch user profile using the username
    const response = await axiosInstance.get(
      `getLoggedInUserDetails?username=${username}/`
    );

    // Store the 'cvs_supplier' value in localStorage for further use
    const cvsSupplier = response.data.cvs_supplier; // Assuming the 'cvs_supplier' is returned in the response
    localStorage.setItem("cvs_supplier", cvsSupplier);

    return response.data; // Return the user profile data
  } catch (error) {
    console.error(
      "Failed to fetch user profile:",
      error.response?.data || error
    );
    throw error;
  }
};
