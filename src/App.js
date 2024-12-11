import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PkgDataForm from "./PkgDataForm"; // Adjust path based on your project structure
import Sku_Page from "./Sku_Page"; // Replace with your SKU page component
import { SkuProvider } from "./SkuContext"; // Import the context provider
import { PkgDataProvider } from "./Pkg_DataContext"; 

const App = () => {
  return (
    <SkuProvider>
      <PkgDataProvider>
    <Router>
      <div>
        <Routes>
          {/* Default Route */}
          <Route path="/" element={<Sku_Page />} />

          {/* PkgDataForm Route */}
          <Route path="/pkgdataform" element={<PkgDataForm />} />

          {/* SKU Page Route */}
          <Route path="/sku_page" element={<Sku_Page />} />
        </Routes>
      </div>
    </Router>
    </PkgDataProvider>
    </SkuProvider>
  );
};

export default App;
