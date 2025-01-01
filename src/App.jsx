import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./styles/style.scss";

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

localStorage.clear(); // Clears the localStorage immediately before the app renders

function App() {
  return (
    <Router>
      {/* Wrap all providers around the Router */}
      <SkuProvider>
        <VendorProvider>
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

              {/* Other routes can go here */}
            </Routes>
          </PkgDataProvider>
        </VendorProvider>
      </SkuProvider>
    </Router>
  );
}

export default App;
