import React from "react";

const Breadcrumb = ({
  onBackClick,
  onSaveClick,
  isFormFilled, // Receive the prop
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
                      className="text-decoration-none fw-600 fs-14 text-secondary"
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
            {/* <button
              className="save-button fs-14 fw-600 border-0 px-4 py-12"
              data-bs-toggle="modal"
              data-bs-target="#analysisModal"
            // onClick={onSaveClick}
            >
              Save & Draft
            </button> */}
            <button
              className="save-button fs-14 fw-600 border-0 px-4 py-12"
              style={{
                backgroundColor: isFormFilled ? "#d43014" : "#cccccc",
                color: isFormFilled ? "#ffffff" : "#666666",
              }}
              onClick={onSaveClick}
            >
              Save as Draft
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Breadcrumb;
