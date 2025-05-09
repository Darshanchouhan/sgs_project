import Pko_Chart from "../../../Pko_Chart";

const DashboardPKOSummary = (props) => {
  const { pkoIncomingData, pkopProgressSummaryIncomingData } = props;
  return (
    <div className="col-12 col-md-6 mb-3 mb-md-0">
      <div className="card border-0 rounded-3 shadow-1 px-4 py-3 h-100">
        <div className="card-header fs-18 px-0 py-0 text-color-typo-primary fw-600 border-0 bg-transparent">
          PKO Summary
        </div>
        <div className="card-body pt-2 pb-0 border-0 px-0 d-flex align-items-center justify-content-between">
          <div className="w-30">
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
          <div className="d-flex align-items-center justify-content-between w-60 h-100 gap-4">
            <div className="position-relative w-180 h-180">
              <Pko_Chart
                labels={["Not Started", "In Progress", "Approved"]}
                data={[
                  pkopProgressSummaryIncomingData?.["not_started"],
                  pkopProgressSummaryIncomingData?.["in_progress"],
                  pkopProgressSummaryIncomingData?.["completed"],
                ]}
                chartName={"PKOs"}
              />
            </div>
            <ul className="list-unstyled w-100 mb-0">
              <li className="d-flex align-items-center justify-content-between mb-3">
                <div className="d-flex align-items-center gap-2">
                  <span className="status-dot not-started"></span>
                  <p className="fs-12 text-color-typo-primary mb-0">
                    Not Started
                  </p>
                </div>
                <span className="fs-12 fw-700">
                  {pkopProgressSummaryIncomingData?.["not_started"]}
                </span>
              </li>
              <li className="d-flex align-items-center justify-content-between mb-3">
                <div className="d-flex align-items-center gap-2">
                  <span className="status-dot in-progress"></span>
                  <p className="fs-12 text-color-typo-primary mb-0">
                    In Progress
                  </p>
                </div>
                <span className="fs-12 fw-700">
                  {pkopProgressSummaryIncomingData?.["in_progress"]}
                </span>
              </li>
              <li className="d-flex align-items-center justify-content-between mb-3">
                <div className="d-flex align-items-center gap-2">
                  <span className="status-dot completed"></span>
                  <p className="fs-12 text-color-typo-primary mb-0">Approved</p>
                </div>
                <span className="fs-12 fw-700">
                  {pkopProgressSummaryIncomingData?.["completed"]}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPKOSummary;
