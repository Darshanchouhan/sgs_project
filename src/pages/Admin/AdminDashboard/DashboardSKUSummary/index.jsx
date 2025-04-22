const DashboardSKUSummary = (props) => {
  const {skuIncomingData} = props;
    return (
        <div className="col-12 col-md-6 mb-3 mb-md-0">
              <div className="card border-0 rounded-3 shadow-1 px-4 py-3 h-100">
                  <div className="card-header fs-18 px-0 py-0 text-color-typo-primary fw-600 border-0 bg-transparent">SKU Summary</div>
                  <div className="card-body pt-2 pb-0 border-0 px-0 d-flex align-items-center">
                    <ul className="list-unstyled w-100 mb-0">
                      <li className="d-flex align-items-center justify-content-between gap-4 pb-4 border-bottom mb-4">
                        <div className="w-50 d-flex align-items-center justify-content-between">
                          <p className="fs-16 fw-600 d-flex lh-19 mb-0"><img src="/assets/images/users-icon.svg" alt="users-icon" className="me-3" />Forms<br /> Submitted</p>
                          <span className="fs-16 fw-700">{skuIncomingData?.["forms_submitted"]}</span>
                        </div>
                        <div className="w-50 d-flex align-items-center justify-content-between">
                          <p className="fs-16 fw-600 d-flex lh-19 mb-0"><img src="/assets/images/users-icon.svg" alt="users-icon" className="me-3" />Pending<br /> Submissions</p>
                          <span className="fs-16 fw-700">{skuIncomingData?.["pending_submissions"]}</span>
                        </div>
                      </li>
                      <li className="d-flex align-items-center justify-content-between gap-4">
                        <div className="w-50 d-flex align-items-center justify-content-between">
                          <p className="fs-16 fw-600 d-flex lh-19 mb-0"><img src="/assets/images/file-document-icon.svg" alt="file-icon" className="me-3" />Forms<br /> Approved</p>
                          <span className="fs-16 fw-700">{skuIncomingData?.["forms_approved"]}</span>
                        </div>
                        <div className="w-50 d-flex align-items-center justify-content-between">
                          <p className="fs-16 fw-600 d-flex lh-19 mb-0"><img src="/assets/images/file-document-icon.svg" alt="file-icon" className="me-3" />Pending<br /> Approvals</p>
                          <span className="fs-16 fw-700">{skuIncomingData?.["pending_approvals"]}</span>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
    )
}

export default DashboardSKUSummary;