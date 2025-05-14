import React from "react";
import "./../styles/style.css";

const NotificationToast = ({ handleCloseToast }) => {
  return (
    <div
      id="notificationToast"
      className="toast notificationToast"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div className="toast-header p-3">
        <h2 className="fs-16 fw-600 text-color-typo-primary me-auto mb-0">
          Notifications <span>(2)</span>
        </h2>
        <button
          type="button"
          className="btn-close shadow-none"
          data-bs-dismiss="toast"
          aria-label="Close"
          onClick={handleCloseToast}
        ></button>
      </div>
      <div className="toast-body p-0">
        <div>
          <div className="px-3 py-1 bg-color-light-border">
            <h3 className="fs-12 fw-600 text-color-not-started text-uppercase mb-0">
              TODAY
            </h3>
          </div>
          <ul className="list-unstyled m-0">
            <li className="ps-28 pe-2 py-12 border-bottom position-relative">
              <span className="new-notification-indicator w-8 h-8 rounded-circle bg-color-responce-pending"></span>
              <h4 className="fs-14 fw-600 text-color-labels mb-2">
                <span className="text-color-typo-primary">John Doe</span> Could
                you please provide clarification on the details for the Material
                Type field?
              </h4>
              <div className="d-flex align-items-center justify-content-between">
                <span
                  className="fs-10 fw-600 px-2 py-1 rounded-pill"
                  style={{ color: "#155DC9", backgroundColor: "#E0ECFF" }}
                >
                  PKO ID | PRJ 1188
                </span>
                <p className="fs-10 fw-600 text-color-typo-secondary mb-0">
                  2h ago
                </p>
              </div>
            </li>
            <li className="ps-28 pe-2 py-12 border-bottom position-relative">
              <span className="new-notification-indicator w-8 h-8 rounded-circle bg-color-responce-pending"></span>
              <h4 className="fs-14 fw-600 text-color-labels mb-2">
                <span className="text-color-typo-primary">Vincent Noa</span>{" "}
                Please submit data related to all PKOs before 15 April, 2025.
              </h4>
              <div className="d-flex align-items-center justify-content-between">
                <span className="fs-10 fw-600 text-color-typo-primary">
                  <img
                    src="/assets/images/error-alert-circle.svg"
                    className="me-1"
                    alt="reminder-icon"
                  />
                  Reminder
                </span>
                <p className="fs-10 fw-600 text-color-typo-secondary mb-0">
                  5h ago
                </p>
              </div>
            </li>
          </ul>
        </div>
        <div>
          <div className="px-3 py-1 bg-color-light-border">
            <h3 className="fs-12 fw-600 text-color-not-started text-uppercase mb-0">
              YESTERDAY
            </h3>
          </div>
          <ul className="list-unstyled m-0">
            <li className="ps-28 pe-2 py-12 border-bottom position-relative">
              <h4 className="fs-14 fw-600 text-color-labels mb-2">
                <span className="text-color-typo-primary">John Doe</span> Could
                you please provide clarification on the details for the Material
                Type field?
              </h4>
              <div className="d-flex align-items-center justify-content-between">
                <span
                  className="fs-10 fw-600 px-2 py-1 rounded-pill"
                  style={{ color: "#155DC9", backgroundColor: "#E0ECFF" }}
                >
                  PKO ID | PRJ 1188
                </span>
                <p className="fs-10 fw-600 text-color-typo-secondary mb-0">
                  2h ago
                </p>
              </div>
            </li>
            <li className="ps-28 pe-2 py-12 border-bottom position-relative">
              <h4 className="fs-14 fw-600 text-color-labels mb-2">
                <span className="text-color-typo-primary">Vincent Noa</span>{" "}
                Please submit data related to all PKOs before 15 April, 2025.
              </h4>
              <div className="d-flex align-items-center justify-content-between">
                <span className="fs-10 fw-600 text-color-typo-primary">
                  <img
                    src="/assets/images/error-alert-circle.svg"
                    className="me-1"
                    alt="reminder-icon"
                  />
                  Reminder
                </span>
                <p className="fs-10 fw-600 text-color-typo-secondary mb-0">
                  5h ago
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NotificationToast;
