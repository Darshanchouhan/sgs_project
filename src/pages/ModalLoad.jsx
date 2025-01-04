import React, { useState, useEffect } from "react";
import "./../styles/ModalLoad.css"; // Import the custom CSS file for the modal

const ModalLoad = () => {
  const [isModalVisible, setIsModalVisible] = useState(true); // Modal visibility state

  // Close the modal
  const closeModal = () => {
    setIsModalVisible(false);
  };

  // Auto-close the modal after 5 seconds (optional, adjust as needed)
  useEffect(() => {
    const timer = setTimeout(
      () => {
        closeModal();
      },
      5 * 60 * 1000,
    ); // Auto close after 5 seconds

    return () => clearTimeout(timer); // Cleanup timer on component unmount
  }, []);

  return (
    isModalVisible && (
      <div className="modal-overlay">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button className="close-btn" onClick={closeModal}>
                X
              </button>
            </div>
            <div className="modal-body">
              <h1 className="title">Sustainable Packaging Platform</h1>
              <p>
                Packaging data collection enables the CVS Our brands to submit
                packaging related data accurately with automated validation
                checks during the process of data submission, and expert-based
                validation post submission.
              </p>
              <div className="feature-cards">
                <div className="feature-card">
                  <img
                    src="/assets/images/package.svg"
                    height="88px"
                    alt="package"
                  />
                  <p>
                    To establish a packaging baseline for all CVS Our Brands
                    products
                  </p>
                </div>
                <div className="feature-card">
                  <img
                    src="/assets/images/inform-brand-package.svg"
                    height="88px"
                    alt="package"
                  />
                  <p>
                    Inform an Our Brands packaging strategy (focused on EPR cost
                    mitigation) and target setting.
                  </p>
                </div>
                <div className="feature-card">
                  <img
                    src="/assets/images/accurate-reporting.svg"
                    height="88px"
                    alt="package"
                  />
                  <p>
                    To enable accurate reporting for compliance with plastics
                    and packaging regulations.
                  </p>
                </div>
              </div>
              <h2>What will CVS product vendors have to do?</h2>
              <p>
                The CVS Our brands will have to complete filling up of forms for
                sharing information related to packaging for a list of
                pre-identified product SKUs and submit all forms for review
                before the last date of submission.
              </p>
              <div className="modal-footer">
                <button className="continue-btn" onClick={closeModal}>
                  Continue to your dashboard{" "}
                  <img
                    src="/assets/images/arrow-right-forward.svg"
                    alt="arrow-right"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default ModalLoad;
