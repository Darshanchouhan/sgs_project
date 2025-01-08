// Import necessary libraries and components
import { StrictMode } from "react"; // React's StrictMode helps identify potential problems in an application
import { createRoot } from "react-dom/client"; // createRoot is used for rendering the React application
import { Provider } from "react-redux"; // The Provider component makes the Redux store available to the rest of the app
import App from "./App"; // Import the main App component
import store from "./store/store"; // Import the Redux store that holds the app state
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// Render the application inside the root element
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      {/* Provide the Redux store to the App component */}
      <App /> {/* Main component of the app */}
    </Provider>
  </StrictMode>,
);
