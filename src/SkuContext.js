import React, { createContext, useState } from "react";

// Create Context
export const SkuContext = createContext();

// Context Provider
export const SkuProvider = ({ children }) => {
  const [skuData, setSkuData] = useState({
    dimensionsAndWeights: {
      height: "",
      width: "",
      depth: "",
      netWeight: "",
      tareWeight: "",
      grossWeight: "",
    },
    recycleLabel: "",
    isMultipack: "",
    additionalComments: "",
    components: [],
    showTable: false,
    newComponent: "",
    componentNumber: 0,
    showInput: true,
    hasAddedFirstComponent: false,
    isCancelDisabled: true,
  });

  return (
    <SkuContext.Provider value={{ skuData, setSkuData }}>
      {children}
    </SkuContext.Provider>
  );
};
