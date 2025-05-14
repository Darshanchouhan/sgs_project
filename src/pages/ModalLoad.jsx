import React, { useState, useEffect } from "react";
import "./../styles/ModalLoad.css"; // Import the custom CSS file for the modal

const ModalLoad = ({ count, isVisible, closeModal }) => {
  const [currentStep, setCurrentStep] = useState(0); // State to track the current step

  // Save the updated count back to localStorage
  // useEffect(() => {
  //   localStorage.setItem("loadCount", 1);
  // }, []);

  // Auto-close the modal after 5 minutes (optional, adjust as needed)
  useEffect(() => {
    if (count === 0) {
      const timer = setTimeout(
        () => {
          closeModal();
        },
        5 * 60 * 1000,
      ); // Auto close after 5 minutes

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

  // Reset the current step when the modal is reopened
  useEffect(() => {
    if (!isVisible) {
      setCurrentStep(0); // Reset to the first step
    }
  }, [isVisible]);

  // Function to handle navigation to the next step
  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep((prevStep) => prevStep + 1);
    }
  };

  // Function to handle navigation to the previous step
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prevStep) => prevStep - 1);
    }
  };

  // Function to handle the "Start" button click
  const handleStart = () => {
    closeModal(); // Close the modal
    setCurrentStep(0); // Reset to the first step
  };

  return (
    isVisible && (
      <div className="modal-overlay vendorOnboarding-modal font-britanica">
        <div className="modal-dialog modal-dialog-scrollable p-0 rounded-0">
          {/* Step 1 */}
          {currentStep === 0 && (
            <div className="modal-content h-100 firstView-modal">
              <div className="modal-header p-20 py-3">
                <button
                  type="button"
                  className="btn-close opacity-100 fs-20"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={closeModal}
                ></button>
              </div>
              <div className="modal-body text-center px-40 py-0 myScroller">
                <h1 className="title text-secondary mb-12 fs-36 lh-25">
                  Welcome to the CVS Sustainable Packaging Platform
                </h1>
                <p className="fs-16 fw-600 text-color-labels">
                  This application enables suppliers of CVS to submit packaging
                  specifications accurately with clear instructions and
                  automated validation checks.
                </p>
              </div>
              <div className="modal-footer align-items-end p-20 position-relative">
                <img
                  src="/assets/images/sustainable-packaging-modal-image.svg"
                  alt="sustainable-packaging-modal-image"
                  className="w-100"
                />
                <div className="actionBtns-group d-flex justify-content-between align-items-center w-100">
                  <button
                    className="btn btn-outline-secondary p-6 ps-12 pe-4 fs-16 lh-14 ls-20 text-uppercase rounded-1 d-flex ms-auto fw-600"
                    onClick={handleNext}
                  >
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {currentStep === 1 && (
            <div className="modal-content h-100">
              <div className="modal-header p-20 py-3">
                <button
                  type="button"
                  className="btn-close opacity-100 fs-20"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={closeModal}
                ></button>
              </div>
              <div className="modal-body text-center px-40 py-0 myScroller">
                <p className="fs-16 fw-600 text-color-labels">
                  With the CVS Sustainable Packaging Platform you will be able
                  to accomplish the following:
                </p>
                <h1 className="title text-secondary mb-12 fs-36 lh-25">
                  Establish a packaging specification baseline for CVS owned
                  brands.
                </h1>
              </div>
              <div className="modal-footer align-items-end p-20 position-relative">
                <img
                  src="/assets/images/packaging-specifications-image.svg"
                  alt="packaging-specifications-image"
                  className="w-100"
                />
                <div className="actionBtns-group d-flex justify-content-between align-items-center w-100">
                  <button
                    className="backButton btn btn-outline-secondary p-6 ps-4 pe-12 fs-16 lh-14 ls-20 text-uppercase rounded-1 d-flex fw-600"
                    onClick={handleBack}
                  >
                    Back
                  </button>
                  <button
                    className="btn btn-outline-secondary p-6 ps-12 pe-4 fs-16 lh-14 ls-20 text-uppercase rounded-1 d-flex ms-auto fw-600"
                    onClick={handleNext}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {currentStep === 2 && (
            <div className="modal-content h-100">
              <div className="modal-header p-20 py-3">
                <button
                  type="button"
                  className="btn-close opacity-100 fs-20"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={closeModal}
                ></button>
              </div>
              <div className="modal-body text-center px-40 py-0 myScroller">
                <p className="fs-16 fw-600 text-color-labels">
                  With the CVS Sustainable Packaging Platform you will be able
                  to accomplish the following:
                </p>
                <h1 className="title text-secondary mb-12 fs-36 lh-25">
                  Plan strategic and sustainable packaging goals and EPR cost
                  mitigation
                </h1>
              </div>
              <div className="modal-footer align-items-end p-20 position-relative">
                <img
                  src="/assets/images/packaging-goals-image.svg"
                  alt="packaging-goals-image"
                  className="w-100"
                />
                <div className="actionBtns-group d-flex justify-content-between align-items-center w-100">
                  <button
                    className="backButton btn btn-outline-secondary p-6 ps-4 pe-12 fs-16 lh-14 ls-20 text-uppercase rounded-1 d-flex fw-600"
                    onClick={handleBack}
                  >
                    Back
                  </button>
                  <button
                    className="btn btn-outline-secondary p-6 ps-12 pe-4 fs-16 lh-14 ls-20 text-uppercase rounded-1 d-flex ms-auto fw-600"
                    onClick={handleNext}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 4 */}
          {currentStep === 3 && (
            <div className="modal-content h-100">
              <div className="modal-header p-20 py-3">
                <button
                  type="button"
                  className="btn-close opacity-100 fs-20"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={closeModal}
                ></button>
              </div>
              <div className="modal-body text-center px-40 py-0 myScroller">
                <p className="fs-16 fw-600 text-color-labels">
                  With the CVS Sustainable Packaging Platform you will be able
                  to accomplish the following:
                </p>
                <h1 className="title text-secondary mb-12 fs-36 lh-25">
                  Enable accurate reporting for compliance with EPR and
                  packaging regulations.
                </h1>
              </div>
              <div className="modal-footer align-items-end p-20 position-relative">
                <img
                  src="/assets/images/reporting-image.svg"
                  alt="reporting-image"
                  className="w-100"
                />
                <div className="actionBtns-group d-flex justify-content-between align-items-center w-100">
                  <button
                    className="backButton btn btn-outline-secondary p-6 ps-4 pe-12 fs-16 lh-14 ls-20 text-uppercase rounded-1 d-flex fw-600"
                    onClick={handleBack}
                  >
                    Back
                  </button>
                  <button
                    className="btn btn-outline-secondary p-6 ps-12 pe-4 fs-16 lh-14 ls-20 text-uppercase rounded-1 d-flex ms-auto fw-600"
                    onClick={handleNext}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 5 */}
          {currentStep === 4 && (
            <div className="modal-content h-100">
              <div className="modal-header p-20 py-3">
                <button
                  type="button"
                  className="btn-close opacity-100 fs-20"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={closeModal}
                ></button>
              </div>
              <div className="modal-body text-center px-40 py-0 myScroller">
                <h1 className="title text-secondary mb-12 fs-36 lh-25">
                  What will CVS product vendors have to do?
                </h1>
                <p className="fs-16 fw-600 text-color-labels">
                  Suppliers will have to submit packaging data for all active
                  PKOs, covering all SKUs assigned in respective PKOs. For each
                  SKU, suppliers will need to add components and then complete
                  component-specific forms.
                </p>
                <p className="fs-16 fw-600 text-color-labels">
                  Suppliers will need to submit all forms for review before the
                  last date of submission.
                </p>
              </div>
              <div className="modal-footer align-items-end p-20 position-relative">
                <img
                  src="/assets/images/reporting-image.svg"
                  alt="reporting-image"
                  className="w-100"
                />
                <div className="actionBtns-group d-flex justify-content-between align-items-center w-100">
                  <button
                    className="backButton btn btn-outline-secondary p-6 ps-4 pe-12 fs-16 lh-14 ls-20 text-uppercase rounded-1 d-flex fw-600"
                    onClick={handleBack}
                  >
                    Back
                  </button>
                  <button
                    className="btn btn-outline-secondary p-6 ps-12 pe-4 fs-16 lh-14 ls-20 text-uppercase rounded-1 d-flex ms-auto fw-600"
                    onClick={handleStart}
                  >
                    Start
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  );
};

export default ModalLoad;