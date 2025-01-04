import React, { createContext, useState, useEffect } from "react";

export const SkuContext = createContext();

export const SkuProvider = ({ children }) => {
  const [skuData, setSkuData] = useState(() => {
    const savedData = localStorage.getItem("skuData");
    return savedData
      ? JSON.parse(savedData)
      : {
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
        };
  });

  const [skuDetails, setSkuDetails] = useState(() => {
    const savedDetails = localStorage.getItem("skuDetails");
    return savedDetails ? JSON.parse(savedDetails) : null;
  });

  const [pkoData, setPkoData] = useState(() => {
    const savedPkoData = localStorage.getItem("pkoData");
    return savedPkoData ? JSON.parse(savedPkoData) : null;
  });

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("skuData") || "{}");
    setSkuData((prev) => ({
      ...prev,
      ...savedData,
      components: savedData.components || prev.components,
    }));
  }, []);

  return (
    <SkuContext.Provider
      value={{
        skuData,
        setSkuData,
        skuDetails,
        setSkuDetails,
        pkoData,
        setPkoData,
      }}
    >
      {children}
    </SkuContext.Provider>
  );
};
