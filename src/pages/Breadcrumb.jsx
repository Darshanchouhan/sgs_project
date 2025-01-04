import React from "react";

const Breadcrumb = ({
  onBackClick,
  onSaveClick,
  componentName = "Default Component",
  pkoId = "N/A",
  description = "N/A",
}) => {
  return (
    <div className="py-10 bg-color-light-shade">
      <div className="container-fluid px-5">
        <div className="d-flex align-items-center justify-content-between">
          {/* Back Button and Component Name */}
          <div className="d-flex align-items-center">
            <button
              type="button"
              className="btn p-0 border-none bg-transparent me-4"
              onClick={onBackClick}
            >
              <img src="/assets/images/back-action-icon.svg" alt="Back Icon" />
            </button>
            <div className="d-flex flex-column">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <a
                      href="#"
                      className="text-decoration-none text-secondary fw-600 fs-14"
                    >
                      PKO Project ID: {pkoId}
                    </a>
                  </li>
                  <li className="breadcrumb-item">
                    <a
                      href="#"
                      className="text-decoration-none text-color-typo-secondary fw-600 fs-14"
                    >
                      {description}
                    </a>
                  </li>
                </ol>
              </nav>
              <h6 className="fw-600 text-color-typo-primary mb-0 mt-2">
                {componentName}
              </h6>
            </div>
          </div>

          {/* Save & Close Button */}
          <div className="d-flex align-items-center">
            <button className="save-button" onClick={onSaveClick}>
              Save & Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Breadcrumb;
