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
              Save & Draft
            </button>

            <div
              className="modal fade analysisModal"
              id="analysisModal"
              tabIndex="-1"
              aria-labelledby="analysisModalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog p-0">
                <div className="modal-content">
                  <div className="modal-header flex-column align-items-center border-0 px-40">
                    <h1
                      className="modal-title fs-22 fw-600 text-color-black mb-1"
                      id="analysisModalLabel"
                    >
                      2 issues found
                    </h1>
                    <p className="fs-14 fw-400 text-color-labels mb-0">
                      Please resolve the following issues.
                    </p>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="modal-body px-40 py-0">
                    <table className="table table-bordered analysisTable fs-14 fw-400 text-color-typo-primary mb-0">
                      <thead>
                        <tr>
                          <th scope="col" className="text-nowrap p-12 fw-600">
                            Component Name
                          </th>
                          <th scope="col" className="text-nowrap p-12 fw-600">
                            Issue found
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="p-12">Component C</td>
                          <td className="p-12">
                            <div className="d-flex justify-content-between align-items-center">
                              <p className="mb-0">
                                Length can not be greater than component A’s
                                height.
                              </p>
                              <button
                                type="button"
                                className="btn p-0 border-0 shadow-none"
                              >
                                <img
                                  src="/assets/images/forward-arrow-img.png"
                                  alt="arrow"
                                />
                              </button>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td className="p-12">Component A, Component D</td>
                          <td className="p-12">
                            <div className="d-flex justify-content-between align-items-center">
                              <p className="mb-0">
                                As per previous submissions, component A and
                                component D may not have different material
                                types.
                              </p>
                              <button
                                type="button"
                                className="btn p-0 border-0 shadow-none"
                              >
                                <img
                                  src="/assets/images/forward-arrow-img.png"
                                  alt="arrow"
                                />
                              </button>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="modal-footer justify-content-center border-0 px-40">
                    <button
                      type="button"
                      className="btn btn-outline-secondary rounded-pill fs-14 fw-600 px-4 py-12 m-0 mx-2 my-0"
                    >
                      Back to the Current Section
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary rounded-pill fs-14 fw-600 px-4 py-12 m-0 mx-2 my-0"
                    >
                      Proceed to Next Section
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Breadcrumb;
