const PKOManagerUploadStepper = () => {
  return (
    <div className="py-4 bg-white rounded-3 d-flex align-items-center mb-3 w-100">
      <div className="w-100 h-100 d-flex flex-column justify-content-center px-4">
        <div className="d-flex align-items-center">
          <span
            className="rounded-circle text-secondary bg-color-badge d-flex justify-content-center align-items-center me-10"
            style={{ width: "32px", height: "32px", minWidth: "32px" }}
          >
            1
          </span>
          <h3 className="fs-14 fw-600 text-black mb-0">
            Download the excel template and fill it with relevant PKO-Vendor-SKU
            data
          </h3>
        </div>
        <button
          type="button"
          className="btn p-0 fs-12 fw-600 text-secondary text-start mt-3 ms-40 d-flex align-items-center"
        >
          <img
            src="/assets/images/download-icon.svg"
            alt="download-icon"
            className="me-2"
          />
          Download template (.xls)
        </button>
      </div>
      <div className="w-100 h-100 d-flex flex-column justify-content-center px-4 border-start border-end border-color-desabled-lite">
        <div className="d-flex align-items-center">
          <span
            className="rounded-circle text-secondary bg-color-badge d-flex justify-content-center align-items-center me-10"
            style={{ width: "32px", height: "32px", minWidth: "32px" }}
          >
            2
          </span>
          <h3 className="fs-14 fw-600 text-black mb-0">
            Upload the filled excel template back
          </h3>
        </div>
        <div
          className="btn-group w-mx-content mt-12 ms-40"
          role="group"
          aria-label="Basic outlined example"
        >
          <button
            type="button"
            className="btn btn-outline-primary fs-12 text-secondary bg-color-light-shade text-decoration-underline border-color-typo-secondary border-end-0 px-12 py-6"
          >
            Delete
          </button>
          <button
            type="button"
            className="btn fs-12 text-color-labels text-start border-color-typo-secondary border-start-0 px-12 pe-4 py-6"
          >
            TemplateFile.pdf
          </button>
        </div>
      </div>
      <div className="w-100 h-100 d-flex flex-column justify-content-center px-4">
        <div className="d-flex align-items-center">
          <span
            className="rounded-circle text-secondary bg-color-badge d-flex justify-content-center align-items-center me-10"
            style={{ width: "32px", height: "32px", minWidth: "32px" }}
          >
            3
          </span>
          <h3 className="fs-14 fw-600 text-black mb-0">
            Preview & Confirm PKO data
          </h3>
        </div>
        <button
          type="button"
          className="btn p-0 fs-14 fw-600 text-secondary text-start mt-3 ms-4 invisible"
        >
          Preview
        </button>
      </div>
    </div>
  );
};

export default PKOManagerUploadStepper;
