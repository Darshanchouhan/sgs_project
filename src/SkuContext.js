import React, { createContext, useState,} from "react";

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
   // Add state for SKU Details and PKO Data
   const [skuDetails, setSkuDetails] = useState(null);
   const [pkoData, setPkoData] = useState(null);
  

  return (
    <SkuContext.Provider value={{ 
      skuData,
     setSkuData,
     skuDetails,
     setSkuDetails,
     pkoData,
     setPkoData,

      }}>
      {children}
    </SkuContext.Provider>
  );
};
