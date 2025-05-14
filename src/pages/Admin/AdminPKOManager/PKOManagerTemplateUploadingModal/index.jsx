const PKOManagerTemplateUploadingModal = () => {
  return (
    <div
      className="modal fade template-uploading-modal-popup"
      id="templateUploadingModal"
      tabIndex="-1"
      aria-labelledby="templateUploadingModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-md modal-dialog-centered p-0 bg-transparent shadow-none modal-dialog-scrollable">
        {/* Template Uploading */}
        <div className="modal-content">
          <div className="modal-body text-center px-4 py-70">
            <h5 className="fs-22 fw-600 text-black mb-0">
              Template uploading...
            </h5>
            <div className="text-center my-40">
              <div
                className="d-flex align-items-center mx-auto"
                style={{ maxWidth: "45%" }}
              >
                <div
                  className="progress w-100"
                  role="progressbar"
                  aria-label="Basic example"
                  aria-valuenow="75"
                  aria-valuemin="0"
                  aria-valuemax="100"
                  style={{ height: "6px" }}
                >
                  <div
                    className="progress-bar rounded-2"
                    style={{ width: "75%" }}
                  ></div>
                </div>
                <label className="fs-12 fw-600 text-primary mb-0 ms-2">
                  75%
                </label>
              </div>
              <p className="fs-14 fw-400 text-color-labels mb-0 mt-3">
                0 issues found
              </p>
            </div>
            <button
              type="button"
              className="btn text-primary p-0 border-0 fs-14 fw-600"
              data-bs-dismiss="modal"
            >
              <img
                src="/assets/images/close-icon-red.svg"
                alt="close-icon"
                className="me-12"
              />
              Cancel Upload
            </button>
          </div>
        </div>
        {/* Template Issues found */}
        <div className="modal-content d-none">
          <div className="modal-header flex-column align-items-center border-0 px-40 pt-5 pb-0">
            <h1 className="modal-title fs-22 fw-600 text-color-typo-primary mb-1">
              2 issues found
            </h1>

            <p className="fs-14 fw-400 text-color-labels mb-0">
              Please resolve the following issues.
            </p>
          </div>
          <div className="modal-body px-40 pt-32 pb-5 myScroller">
            <table className="table table-bordered fs-14 fw-400 text-color-typo-primary mb-0">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="text-nowrap p-12 fw-600 bg-color-light-shade"
                  >
                    Issue Type
                  </th>
                  <th
                    scope="col"
                    className="text-nowrap p-12 fw-600 bg-color-light-shade"
                  >
                    Details
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-12">SKUs not mapped to PKOs</td>
                  <td className="p-12">
                    The following PKOs do not have any SKUs mapped to them:
                    PRJ1102, PRJ2546
                  </td>
                </tr>
                <tr>
                  <td className="p-12">Incomplete SKU Details</td>
                  <td className="p-12">
                    The following SKU IDs do not have complete SKU details:
                    23005, 21003, 19540
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="modal-footer justify-content-center border-0 px-40 pt-0 pb-5">
            <button
              type="button"
              className="btn btn-outline-secondary rounded-1 fs-14 fw-600 px-4 py-12 m-0"
              data-bs-dismiss="modal"
            >
              Ok
            </button>
          </div>
        </div>
        {/* Template Issues Not found */}
        <div className="modal-content d-none">
          <div className="modal-body text-center px-4 py-70">
            <h5 className="fs-22 fw-600 text-black mb-4">No issues found</h5>
            <button
              type="button"
              className="btn btn-outline-secondary px-4 py-12 fs-14 fw-600"
            >
              Proceed to preview data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PKOManagerTemplateUploadingModal;
