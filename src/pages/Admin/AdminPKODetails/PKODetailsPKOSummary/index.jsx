const PKODetailsPKOSummary = () => {
  return (
    <div className="pkoSummaryCard card border-0 rounded-3 shadow-1 px-32 py-3">
      <div className="card-body p-0 border-0">
        <div className="row">
          <div className="col-12 col-md-6">
            <h2 className="fs-18 fw-600 text-color-typo-primary mb-12">
              PKO Summary
            </h2>
            <ul className="list-unstyled w-100 mb-0">
              <li className="d-flex align-items-center mb-3">
                <p className="fs-14 text-color-labels mb-0 w-50">
                  Supplier Name
                </p>
                <span className="fs-14 fw-600 text-color-typo-primary">
                  Perrigo Company Inc.
                </span>
              </li>
              <li className="d-flex align-items-center mb-3">
                <p className="fs-14 text-color-labels mb-0 w-50">Supplier ID</p>
                <span className="fs-14 fw-600 text-color-typo-primary">
                  18249
                </span>
              </li>
              <li className="d-flex align-items-center mb-3">
                <p className="fs-14 text-color-labels mb-0 w-50">
                  Supplier Contact
                </p>
                <span className="fs-14 fw-600 text-color-typo-primary">
                  supplier@gmail.com
                </span>
              </li>
              <li className="d-flex align-items-center mb-3">
                <p className="fs-14 text-color-labels mb-0 w-50">Start Date</p>
                <span className="fs-14 fw-600 text-color-typo-primary">
                  12/07/2024
                </span>
              </li>
              <li className="d-flex align-items-center mb-3">
                <p className="fs-14 text-color-labels mb-0 w-50">Due Date</p>
                <span className="fs-14 fw-600 text-color-typo-primary">
                  12/10/2024 (5 days left)
                </span>
              </li>
            </ul>
          </div>
          <div className="col-12 col-md-6 d-flex align-items-center">
            <div className="d-flex align-items-center justify-content-between w-100">
              <div className="overall-progress-block text-center pe-60 border-end">
                <h3 className="fs-16 fw-600 text-color-typo-primary mb-3">
                  Overall Progress
                </h3>
                <div className="position-relative w-130 h-130">
                  <img
                    src="https://dummyimage.com/130x130/c2c2c2/000000&text=Donut+chart"
                    alt="dummy-image"
                  />
                </div>
              </div>
              <div className="w-50">
                <h3 className="fs-16 fw-600 text-color-typo-primary mb-3">
                  SKU Progress
                </h3>
                <div className="d-flex align-items-center justify-content-between h-100 gap-4">
                  <div className="position-relative w-130 h-130">
                    <img
                      src="https://dummyimage.com/130x130/c2c2c2/000000&text=Donut+chart"
                      alt="dummy-image"
                    />
                  </div>
                  <ul className="list-unstyled w-100 mb-0">
                    <li className="d-flex align-items-center justify-content-between mb-12">
                      <div className="d-flex align-items-center gap-2">
                        <span className="status-dot not-started"></span>
                        <p className="fs-12 text-color-typo-primary mb-0">
                          Not Started
                        </p>
                      </div>
                      <span className="fs-12 fw-700">5</span>
                    </li>
                    <li className="d-flex align-items-center justify-content-between mb-12">
                      <div className="d-flex align-items-center gap-2">
                        <span className="status-dot draft"></span>
                        <p className="fs-12 text-color-typo-primary mb-0">
                          Draft
                        </p>
                      </div>
                      <span className="fs-12 fw-700">2</span>
                    </li>
                    <li className="d-flex align-items-center justify-content-between mb-12">
                      <div className="d-flex align-items-center gap-2">
                        <span className="status-dot in-review"></span>
                        <p className="fs-12 text-color-typo-primary mb-0">
                          In Review
                        </p>
                      </div>
                      <span className="fs-12 fw-700">4</span>
                    </li>
                    <li className="d-flex align-items-center justify-content-between mb-12">
                      <div className="d-flex align-items-center gap-2">
                        <span className="status-dot completed"></span>
                        <p className="fs-12 text-color-typo-primary mb-0">
                          Completed
                        </p>
                      </div>
                      <span className="fs-12 fw-700">6</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PKODetailsPKOSummary;
