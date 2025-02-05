import React, { useState, useEffect } from "react";
import "./../styles/ModalLoad.css"; // Import the custom CSS file for the modal

const ModalLoad = ({ count, isVisible, closeModal }) => {
  // Save the updated count back to localStorage
  localStorage.setItem("loadCount", 1);

  // Auto-close the modal after 5 seconds (optional, adjust as needed)
  useEffect(() => {
    if (count === 0) {
      const timer = setTimeout(
        () => {
          closeModal();
        },
        5 * 60 * 1000,
      ); // Auto close after 5 seconds

      return () => clearTimeout(timer); // Cleanup timer on component unmount
    }
  }, [isVisible, count, closeModal]);

  // Add "overflow-hidden" class to body when modal is visible, remove when not visible
  useEffect(() => {
    if (isVisible) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    // Cleanup the class when the component unmounts or visibility changes
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isVisible]);

  return (
    isVisible && (
      <div className="modal-overlay">
        <div className="modal-dialog modal-dialog-scrollable p-0 rounded-0">
          <div className="modal-content">
            <div className="modal-header px-40 pt-32 pb-0 d-flex justify-content-end">
              <button
                className="continue-btn bg-secondary"
                onClick={closeModal}
              >
                Continue to your dashboard{" "}
                <img
                  src="/assets/images/arrow-right-forward.svg"
                  alt="arrow-right"
                />
              </button>
            </div>
            <div className="modal-body px-60 py-0 mt-5 mb-3">
              <h1 className="title text-secondary mb-12 fs-32">
                Sustainable Packaging Platform
              </h1>
              <p className="fs-16 fw-600 text-color-labels">
                This application enables suppliers of CVS to submit packaging
                specifications accurately with clear instructions and automated
                validation checks. The application serves the following
                objectives.
              </p>
              <div className="feature-cards">
                <div className="feature-card">
                  <img
                    src="/assets/images/package.svg"
                    height="88px"
                    alt="package"
                  />
                  <p className="fs-14">
                    To establish a packaging specifications baseline for CVS
                    owned brands.
                  </p>
                </div>
                <div className="feature-card">
                  <img
                    src="/assets/images/inform-brand-package.svg"
                    height="88px"
                    alt="package"
                  />
                  <p className="fs-14">
                    Inform a packaging strategy focused on sustainable packaging
                    goals and EPR cost mitigation.
                  </p>
                </div>
                <div className="feature-card">
                  <img
                    src="/assets/images/accurate-reporting.svg"
                    height="88px"
                    alt="package"
                  />
                  <p className="fs-14">
                    To enable accurate reporting for compliance with EPR and
                    packaging regulations.
                  </p>
                </div>
              </div>
              <h2 className="text-color-typo-primary fs-22 mb-32">
                What will CVS product vendors have to do?
              </h2>
              <p className="fs-14">
                Suppliers will have to submit packaging data for all active
                PKOs, covering all SKUs assigned in respective PKOs. For each
                SKU, suppliers will need to add components and then complete
                component-specific forms. Suppliers will need to submit all
                forms for review before the last date of submission.
              </p>
            </div>
            <div className="modal-footer"></div>
          </div>
        </div>
      </div>
    )
  );
};

export default ModalLoad;
