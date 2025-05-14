import ProgressLoader from "../../../ProgressLoader";

const DashboardPKOSummary = (props) => {
  const { pkoIncomingData, pkopProgressSummaryIncomingData } = props;
  return (
    <div className="col-12 col-md-6 mb-3 mb-md-0">
      <div className="card border-0 rounded-3 shadow-1 px-4 py-3 h-100">
        <div className="d-flex align-items-center justify-content-center w-100 h-100 gap-4">
          <div className="w-60 ms-22">
            <div className="w-100 card-header fs-18 px-0 py-0 text-color-typo-primary fw-600 border-0 bg-transparent">
              PKO Summary
            </div>
          </div>
          <div className="w-60 d-flex align-items-center justify-content-center">
            <div className="w-60 card-header fs-18 px-0 py-0 text-color-typo-primary fw-600 border-0 bg-transparent">
              All PKO Progress
            </div>
          </div>
        </div>
        <div className="card-body pt-2 pb-0 border-0 px-0 d-flex align-items-center justify-content-between">
          <div className="w-50 ms-22">
            <ul className="list-unstyled w-100 mb-0">
              <li className="d-flex align-items-center justify-content-between mb-3">
                <p className="fs-14 text-color-typo-primary mb-0">Active</p>
                <span className="fs-16 fw-600">
                  {pkoIncomingData?.["active_pkos"]}
                </span>
              </li>
              <li className="d-flex align-items-center justify-content-between mb-3">
                <p className="fs-14 text-color-typo-primary mb-0">Closed</p>
                <span className="fs-16 fw-600">
                  {pkoIncomingData?.["closed_pkos"]}
                </span>
              </li>
              <li className="d-flex align-items-center justify-content-between mb-3 border-top pt-1">
                <p className="fs-14 text-color-typo-primary mb-0">Total PKOs</p>
                <span className="fs-16 fw-600">
                  {pkoIncomingData?.["total_pkos"]}
                </span>
              </li>
            </ul>
          </div>
          <div className="d-flex align-items-center justify-content-center w-60 h-100 gap-4">
            <div className="position-relative w-150 h-180">
              <ProgressLoader
                percentage={
                  pkopProgressSummaryIncomingData
                    ? Math.round(
                        Number(
                          pkopProgressSummaryIncomingData?.replace("%", ""),
                        ),
                      )
                    : 0
                } // Display calculated average progress
                size={150}
                isVendorPage={true}
                isVendorInsideTextRequired={true}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPKOSummary;
