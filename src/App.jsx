import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./styles/style.scss";
import useInactivityTimerWithTokenRefresh from "./hooks/useInactivityTimerWithTokenRefresh";

// Import Pages and Components
import LoginPage from "./pages/LoginPage"; // Login page component
import VendorDashboard from "./pages/VendorDashboard";
import Sku_Page from "./pages/Sku_Page";
import PkgDataForm from "./pages/PkgDataForm";
import PrivateRoute from "./components/PrivateRoute"; // PrivateRoute for protected pages

// Import your context providers
import { SkuProvider } from "./pages/SkuContext"; // Assuming you have this context
import { PkgDataProvider } from "./pages/Pkg_DataContext"; // Assuming you have this context
import { VendorProvider } from "./pages/VendorContext"; // Assuming you have this context

// Import Redux actions
import { login } from "./store/authSlice"; // Import login action
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminPKODetails from "./pages/Admin/AdminPKODetails";
import AdminSKUDetails from "./pages/Admin/AdminSKUDetails";
import AdminComponentPage from "./pages/Admin/AdminComponent";
import AdminPKOManager from "./pages/Admin/AdminPKOManager";
import AdminPKOManagerPreview from "./pages/Admin/AdminPKOManagerPreview";
import AdminPKOManagerUploadSuccessful from "./pages/Admin/AdminPKOManagerUploadSuccessful";

function App() {
  // Call the hook to start tracking inactivity and refreshing the token
  useInactivityTimerWithTokenRefresh();

  const dispatch = useDispatch();

  // Check if user is logged in by checking localStorage for token on app load
  useEffect(() => {
    const isFirstLogin = localStorage.getItem("isFirstLogin");

    if (isFirstLogin === null) {
      // If it's the first login, clear localStorage
      localStorage.clear();
      // Set flag in localStorage to indicate it's not the first login anymore
      localStorage.setItem("isFirstLogin", "false");
    }

    const token = localStorage.getItem("authToken");
    const refreshToken = localStorage.getItem("refereshToken"); // Assuming you store user info in localStorage
    if (token && refreshToken) {
      // Dispatch login to set Redux state with token and user info
      dispatch(
        login({
          token: token,
          refershToken: refreshToken,
        }),
      );
    }
  }, [dispatch]);

  return (
    <Router>
      {/* Wrap all providers around the Router */}
      <VendorProvider>
        <SkuProvider>
          <PkgDataProvider>
            <Routes>
              {/* Redirect root (/) to /login */}
              <Route path="/" element={<Navigate to="/login" replace />} />

              {/* Public Route - Login */}
              <Route path="/login" element={<LoginPage />} />

              {/* Private Route - Dashboard */}
              <Route
                path="/vendordashboard"
                element={<PrivateRoute element={<VendorDashboard />} />}
              />

              {/* Private Route - SKU Page */}
              <Route
                path="/skus"
                element={<PrivateRoute element={<Sku_Page />} />}
              />

              {/* Private Route - PkgDataForm */}
              <Route
                path="/component"
                element={<PrivateRoute element={<PkgDataForm />} />}
              />

              {/* Private Route - Admin Dashboard */}
              <Route
                path="/admindashboard"
                element={<PrivateRoute element={<AdminDashboard />} />}
              />

              {/* Private Route - Admin PKO Details */}
              <Route
                path="/adminpkodetails/:pkoId"
                element={<PrivateRoute element={<AdminPKODetails />} />}
              />

              {/* Private Route - Admin SKU Details */}
              <Route
                path="/adminskudetails/:pkoId/:skuId"
                element={<PrivateRoute element={<AdminSKUDetails />} />}
              />

              {/* Private Route - Admin SKU component Details */}
              <Route
                path="/admincomponent/:pkoId/:skuId/:componentId"
                element={<PrivateRoute element={<AdminComponentPage />} />}
              />

              {/* Private Route - Admin PKO Manager */}
              <Route
                path="/adminpkomanager"
                element={<PrivateRoute element={<AdminPKOManager />} />}
              />

              {/* Private Route - Admin PKO Manager Preview */}
              <Route
                path="/adminpkomanagerpreview"
                element={<PrivateRoute element={<AdminPKOManagerPreview />} />}
              />

              {/* Private Route - Admin PKO Manager Upload Successful */}
              <Route
                path="/adminpkomanageruploadsuccessful"
                element={
                  <PrivateRoute element={<AdminPKOManagerUploadSuccessful />} />
                }
              />

              {/* Other routes can go here */}
            </Routes>
          </PkgDataProvider>
        </SkuProvider>
      </VendorProvider>
    </Router>
  );
}

export default App;
