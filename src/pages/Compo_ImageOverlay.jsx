import { useEffect } from "react";
import { Offcanvas } from "bootstrap";
import "./../styles/style.css";

const Compo_ImageOverlay = ({ onClose, imagePath }) => {
  useEffect(() => {
    const overlayElement = document.getElementById("offcanvasRight-component");
    let offcanvasInstance;

    if (overlayElement) {
      offcanvasInstance = new Offcanvas(overlayElement, { backdrop: false }); // No backdrop
      offcanvasInstance.show(); // Show the overlay
    }

    return () => {
      if (offcanvasInstance) {
        offcanvasInstance.hide(); // Cleanup on unmount
      }
    };
  }, []);

  const handleClose = () => {
    const overlayElement = document.getElementById("offcanvasRight-component");
    if (overlayElement) {
      const offcanvasInstance = Offcanvas.getInstance(overlayElement);
      if (offcanvasInstance) {
        offcanvasInstance.hide(); // Close the overlay
      }
    }
    onClose && onClose(); // Notify parent to update state
  };

  return (
    <div
      id="offcanvasRight-component"
      className="offcanvas offcanvas-end width-50 bg-color-light-shade"
      tabIndex="-1"
      aria-labelledby="offcanvasRight-componentLabel"
    >
      {/* Close Button */}
      <button
        type="button"
        className="btn-close"
        aria-label="Close"
        onClick={handleClose}
      ></button>

      {/* Image Content */}
      <div className="offcanvas-body p-32 d-flex justify-content-center align-items-center h-100">
        <img
          src={imagePath}
          alt="Dimension Guide"
          className="w-100 h-100 object-fit-contain"
        />
      </div>
    </div>
  );
};

export default Compo_ImageOverlay;
