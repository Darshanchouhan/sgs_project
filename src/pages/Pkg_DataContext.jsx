import React, { createContext, useState } from "react";

// Create the Context
export const PkgDataContext = createContext();

// Provider Component
export const PkgDataProvider = ({ children }) => {
  const [pkgData, setPkgData] = useState({
    sections: {}, // Store sections and their questions
    answers: {}, // Store answers for the questions
    mandatoryAnsweredCount: 0, // Count of mandatory questions answered
    totalMandatoryCount: 0, // Total number of mandatory questions
    activeSection: "Component Information", // Currently active section
  });

  return (
    <PkgDataContext.Provider value={{ pkgData, setPkgData }}>
      {children}
    </PkgDataContext.Provider>
  );
};