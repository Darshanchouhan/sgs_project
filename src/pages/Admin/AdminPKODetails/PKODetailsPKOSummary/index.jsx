import ProgressLoader from "../../../ProgressLoader";
import Pko_Chart from "../../../Pko_Chart";

const PKODetailsPKOSummary = ({ pkoDataIncoming }) => {
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
                  {pkoDataIncoming?.supplier?.name}
                </span>
              </li>
              <li className="d-flex align-items-center mb-3">
                <p className="fs-14 text-color-labels mb-0 w-50">Supplier ID</p>
                <span className="fs-14 fw-600 text-color-typo-primary">
                  {pkoDataIncoming?.supplier?.id}
                </span>
              </li>
              <li className="d-flex align-items-center mb-3">
                <p className="fs-14 text-color-labels mb-0 w-50">
                  Supplier Contact
                </p>
                <span className="fs-14 fw-600 text-color-typo-primary">
                  {pkoDataIncoming?.supplier?.contact_email}
                </span>
              </li>
              <li className="d-flex align-items-center mb-3">
                <p className="fs-14 text-color-labels mb-0 w-50">Start Date</p>
                <span className="fs-14 fw-600 text-color-typo-primary">
                  {pkoDataIncoming?.start_date}
                </span>
              </li>
              <li className="d-flex align-items-center mb-3">
                <p className="fs-14 text-color-labels mb-0 w-50">Due Date</p>
                <span className="fs-14 fw-600 text-color-typo-primary">
                  {pkoDataIncoming?.due_date} ({pkoDataIncoming?.days_left})
                </span>
              </li>
            </ul>
          </div>
          <div className="col-12 col-md-6 d-flex align-items-center">
            <div className="d-flex align-items-center justify-content-between w-100">
              <div className="overall-progress-block text-center pe-115 border-end">
                <h3 className="fs-16 fw-600 text-color-typo-primary mb-3">
                  PKO Progress
                </h3>
                <div className="position-relative w-130 h-130">
                  <ProgressLoader
                    percentage={
                      pkoDataIncoming?.pko_progress
                        ? Math.round(pkoDataIncoming?.pko_progress)
                        : 0
                    } // Display calculated average progress
                    size={130}
                    isVendorPage={true}
                  />
                </div>
              </div>
              <div className="w-50">
                <h3 className="fs-16 fw-600 text-color-typo-primary mb-3">
                  SKU Progress
                </h3>
                <div className="d-flex align-items-center justify-content-between h-100 gap-4">
                  <div className="position-relative w-130 h-130">
                    <Pko_Chart
                      labels={["Not Started", "Draft", "In Review", "Approved"]}
                      data={[
                        pkoDataIncoming?.sku_progress?.not_started,
                        pkoDataIncoming?.sku_progress?.draft,
                        pkoDataIncoming?.sku_progress?.in_review,
                        pkoDataIncoming?.sku_progress?.completed,
                      ]}
                      chartName={"SKU"}
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
                      <span className="fs-12 fw-700">
                        {pkoDataIncoming?.sku_progress?.not_started}
                      </span>
                    </li>
                    <li className="d-flex align-items-center justify-content-between mb-12">
                      <div className="d-flex align-items-center gap-2">
                        <span className="status-dot draft"></span>
                        <p className="fs-12 text-color-typo-primary mb-0">
                          Draft
                        </p>
                      </div>
                      <span className="fs-12 fw-700">
                        {pkoDataIncoming?.sku_progress?.draft}
                      </span>
                    </li>
                    <li className="d-flex align-items-center justify-content-between mb-12">
                      <div className="d-flex align-items-center gap-2">
                        <span className="status-dot in-review"></span>
                        <p className="fs-12 text-color-typo-primary mb-0">
                          In Review
                        </p>
                      </div>
                      <span className="fs-12 fw-700">
                        {pkoDataIncoming?.sku_progress?.in_review}
                      </span>
                    </li>
                    <li className="d-flex align-items-center justify-content-between mb-12">
                      <div className="d-flex align-items-center gap-2">
                        <span className="status-dot completed"></span>
                        <p className="fs-12 text-color-typo-primary mb-0">
                          Approved
                        </p>
                      </div>
                      <span className="fs-12 fw-700">
                        {pkoDataIncoming?.sku_progress?.completed}
                      </span>
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
