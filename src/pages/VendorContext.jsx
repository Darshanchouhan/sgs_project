import React, { createContext, useState } from "react";

// Create Vendor Context
export const VendorContext = createContext();

// Vendor Context Provider
export const VendorProvider = ({ children }) => {
  const [skuStatuses, setSkuStatuses] = useState({}); // Store SKU status mapping

  // Method to update the SKU status
  const updateSkuStatus = (skuId, status) => {
    setSkuStatuses((prevStatuses) => ({
      ...prevStatuses,
      [skuId]: status,
    }));
  };

  return (
    <VendorContext.Provider value={{ skuStatuses, updateSkuStatus }}>
      {children}
    </VendorContext.Provider>
  );
};
