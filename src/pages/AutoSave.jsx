import React, { useState, useEffect, useRef } from "react";
import "./../styles/style.css";

const Autosave = ({ saveFunction, dependencies }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const saveTimer = useRef(null);

  // Autosave logic
  const handleAutosave = async () => {
    try {
      setIsSaving(true); // Show saving status
      await saveFunction(); // Execute the passed save function
      setLastSaved(new Date().toLocaleTimeString()); // Update the last saved time
      setIsSaving(false); // Hide saving status
    } catch (error) {
      console.error("Autosave failed:", error);
      setIsSaving(false);
    }
  };

  useEffect(() => {
    // Start autosave interval
    saveTimer.current = setInterval(() => {
      handleAutosave();
    }, 600000); // 10 mins interval

    return () => {
      if (saveTimer.current) clearInterval(saveTimer.current); // Cleanup on unmount
    };
  }, dependencies); // Re-run when dependencies change

  return (
    <div className="autosave-container px-40">
      {isSaving ? (
        <span className="autosave-status">Saving...</span>
      ) : lastSaved ? (
        <span className="autosave-status">Last saved at {lastSaved}</span>
      ) : (
        <div className="d-flex align-items-center justify-content-end">
          <img src="/assets/images/check-tick-correct.svg" alt="Forward" />
          <span className="autosave-status ms-12">
            Your form will be Autosaved
          </span>
        </div>
      )}
    </div>
  );
};

export default Autosave;
