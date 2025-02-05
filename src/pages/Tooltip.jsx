import React, { useEffect, useState, useRef } from "react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined"; // Assuming you're using MUI for the icon
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import { Tooltip as BootstrapTooltip } from "bootstrap"; // Import Bootstrap Tooltip functionality

const Tooltip = ({ instructions, id, activeTooltipId, setActiveTooltipId }) => {
  const tooltipRef = useRef(null); // To manage the tooltip reference
  const [tooltipInstance, setTooltipInstance] = useState(null); // Store the Bootstrap tooltip instance

  useEffect(() => {
    // Initialize Bootstrap tooltip only once
    const tooltipElement = tooltipRef.current;
    if (tooltipElement) {
      const newTooltip = new BootstrapTooltip(tooltipElement, {
        trigger: "click", // Show tooltip on click
        placement: "bottom",
      });

      setTooltipInstance(newTooltip);

      return () => {
        newTooltip.dispose(); // Cleanup tooltip instance when component is unmounted
      };
    }
  }, []);

  // Handle tooltip click, toggling active state
  const handleTooltipClick = () => {
    if (activeTooltipId !== id) {
      // If the clicked tooltip is not active, close the previous and show the new one
      tooltipInstance?.hide();
      setActiveTooltipId(id);
      tooltipInstance?.show();
    } else {
      // If the tooltip is already active, hide it
      tooltipInstance?.hide();
      setActiveTooltipId(null);
    }
  };

  // Hide the tooltip when clicked outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
        tooltipInstance?.hide();
        setActiveTooltipId(null);
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [tooltipInstance, setActiveTooltipId]);

  return (
    <div>
      <InfoOutlinedIcon
        ref={tooltipRef}
        id={id}
        className="info-icon"
        data-toggle="tooltip"
        data-placement="bottom"
        data-bs-custom-class="custom-tooltip"
        title={instructions} // Tooltip content will be the 'instructions'
        onClick={handleTooltipClick} // Handle click to toggle tooltip visibility
      />
    </div>
  );
};

export default Tooltip;
