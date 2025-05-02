import { useNavigate } from "react-router-dom";

const PKODetailsSKUStatusAndTable = () => {
  const navigate = useNavigate();

  const handleForwardClick = () => {
    navigate('/adminskudetails')
  }
  return (
    <>
      <div className="d-flex align-items-center justify-content-between mt-30">
        <div className="d-flex align-items-center">
          <div className="input-group border border-secondary rounded-2 fs-14 me-4">
            <label
              className="d-flex align-items-center ps-10 bg-white rounded-2 mb-0 border-0 fs-14 text-color-labels"
              htmlFor="inputGroupSkuStatus"
            >
              SKU Status
            </label>
            <select
              className="form-select border-color-labels border-0 fs-14 fw-600 ps-10 pe-40 text-secondary"
              id="inputGroupSkuStatus"
              value="All SKUs"
            >
              <option value="All SKUs">All SKUs</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <h3 className="fs-18 fw-600 text-nowrap mb-0">10 Total SKUs</h3>
        </div>
      </div>

      {/* Table Section */}
      <div className="table-container-skus-tbl-admin mt-3 table-responsive">
        <table className="table table-bordered table-striped fs-14">
          <thead>
            <tr>
              <th className="h-48 align-middle w-150">SKU ID</th>
              <th className="h-48 align-middle">Description</th>
              <th className="h-48 align-middle">Form Completion %</th>
              <th className="h-48 align-middle">Status</th>
              <th className="h-48 align-middle"></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="align-middle">277197</td>
              <td className="align-middle">
                <span className="text-truncate d-inline-block w-50">
                  CVS Miconazole3 Vaginal Antifungal CVS Miconazole3 Vaginal
                  Antifungal
                </span>
              </td>
              <td className="align-middle">
                <div className="d-flex align-items-center justify-content-between w-100">
                  <div className="w-50">
                    <div
                      className="progress"
                      role="progressbar"
                      aria-label="Basic example"
                      aria-valuenow="100"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      <div
                        className="progress-bar"
                        style={{ width: "100%", background: "#155DC9" }}
                      ></div>
                    </div>
                  </div>
                  <span>100%</span>
                </div>
              </td>
              <td className="align-middle text-center">
                <span className="fs-14 fw-600 text-nowrap px-12 py-6 d-inline-block border rounded-pill completed-pill w-120">
                  Completed
                </span>
              </td>
              <td className="align-middle text-center">
                <button className="btn p-0 border-0 shadow-none" onClick={handleForwardClick}>
                  <img
                    src="/assets/images/forward-arrow-img.png"
                    alt="Forward"
                  />
                </button>
              </td>
            </tr>
            <tr>
              <td className="align-middle">271541</td>
              <td className="align-middle">
                <span className="text-truncate d-inline-block w-50">
                  CVS HEALTH OMPRZLE MINI
                </span>
              </td>
              <td className="align-middle">
                <div className="d-flex align-items-center justify-content-between w-100">
                  <div className="w-50">
                    <div
                      className="progress"
                      role="progressbar"
                      aria-label="Basic example"
                      aria-valuenow="100"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      <div
                        className="progress-bar"
                        style={{ width: "100%", background: "#155DC9" }}
                      ></div>
                    </div>
                  </div>
                  <span>100%</span>
                </div>
              </td>
              <td className="align-middle text-center">
                <span className="fs-14 fw-600 text-nowrap px-12 py-6 d-inline-block border rounded-pill in-review-pill w-120">
                  In Review
                </span>
              </td>
              <td className="align-middle text-center">
                <button className="btn p-0 border-0 shadow-none" onClick={handleForwardClick}>
                  <img
                    src="/assets/images/forward-arrow-img.png"
                    alt="Forward"
                  />
                </button>
              </td>
            </tr>
            <tr>
              <td className="align-middle">277197</td>
              <td className="align-middle">
                <span className="text-truncate d-inline-block w-50">
                  CVS Miconazole3 Vaginal Antifungal
                </span>
              </td>
              <td className="align-middle">
                <div className="d-flex align-items-center justify-content-between w-100">
                  <div className="w-50">
                    <div
                      className="progress"
                      role="progressbar"
                      aria-label="Basic example"
                      aria-valuenow="0"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      <div
                        className="progress-bar"
                        style={{ width: "0%", background: "#155DC9" }}
                      ></div>
                    </div>
                  </div>
                  <span>0%</span>
                </div>
              </td>
              <td className="align-middle text-center">
                <span className="fs-14 fw-600 text-nowrap px-12 py-6 d-inline-block border rounded-pill not-started-pill w-120">
                  Not Started
                </span>
              </td>
              <td className="align-middle text-center">
                <button className="btn p-0 border-0 shadow-none" onClick={handleForwardClick}>
                  <img
                    src="/assets/images/forward-arrow-img.png"
                    alt="Forward"
                  />
                </button>
              </td>
            </tr>
            <tr>
              <td className="align-middle">423103</td>
              <td className="align-middle">
                <span className="text-truncate d-inline-block w-50">
                  CVS HEALTH OMPRZLE MINI
                </span>
              </td>
              <td className="align-middle">
                <div className="d-flex align-items-center justify-content-between w-100">
                  <div className="w-50">
                    <div
                      className="progress"
                      role="progressbar"
                      aria-label="Basic example"
                      aria-valuenow="20"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      <div
                        className="progress-bar"
                        style={{ width: "20%", background: "#155DC9" }}
                      ></div>
                    </div>
                  </div>
                  <span>20%</span>
                </div>
              </td>
              <td className="align-middle text-center">
                <span className="fs-14 fw-600 text-nowrap px-12 py-6 d-inline-block border rounded-pill draft-pill w-120">
                  Draft
                </span>
              </td>
              <td className="align-middle text-center">
                <button className="btn p-0 border-0 shadow-none" onClick={handleForwardClick}>
                  <img
                    src="/assets/images/forward-arrow-img.png"
                    alt="Forward"
                  />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default PKODetailsSKUStatusAndTable;
