const DashboardSubHeaderStrip = () => {
  return (
    <div className="py-3 bg-color-light-shade">
      <div className="container-fluid px-20 px-md-4">
        <div className="d-flex align-items-center justify-content-between">
          <h2 className="fs-16 fw-400 text-color-close-icon-box mb-0">Welcome <span className="fw-600">Michael John,</span></h2>
          <button type="button" className="btn p-0 fs-14 fw-600 text-secondary">
            <img src="/assets/images/download-icon.svg" alt="download-icon" className="me-2" />
            Download
          </button>
        </div>
      </div>
    </div>
  )
}

export default DashboardSubHeaderStrip;