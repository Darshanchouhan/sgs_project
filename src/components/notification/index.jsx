import React from "react";
import "../../styles/style.css";

const NotificationToast = ({
  handleCloseToast,
  reminders = [],
  onMarkAsSeen,
}) => {
  const formatTimeAgo = (isoString) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    return `${hours}h ago`;
  };

  const formatHeaderDate = (isoString) => {
    const date = new Date(isoString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const headerDate =
    reminders.length > 0 ? formatHeaderDate(reminders[0].created_date) : "";

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
          Notifications <span>({reminders.length})</span>
        </h2>
        <button
          type="button"
          className="btn-close shadow-none"
          data-bs-dismiss="toast"
          aria-label="Close"
          onClick={handleCloseToast}
        ></button>
      </div>
      <div
        className="toast-body p-0"
        style={{ maxHeight: "400px", overflowY: "auto" }}
      >
        <div>
          <div className="px-3 py-1 bg-color-light-border">
            <h3 className="fs-12 fw-600 text-color-not-started text-uppercase mb-0">
              {headerDate}
            </h3>
          </div>
          <ul className="list-unstyled m-0">
            {reminders.map((reminder) => (
              <li
                key={reminder.id}
                className="ps-28 pe-2 py-12 border-bottom position-relative cursor-pointer"
                onClick={() =>
                  reminder.status === "Unseen" && onMarkAsSeen(reminder.id)
                }
              >
                {reminder.status === "Unseen" && (
                  <span className="new-notification-indicator w-8 h-8 rounded-circle bg-color-responce-pending"></span>
                )}
                <h4 className="fs-14 fw-600 text-color-labels mb-2">
                  <span className="text-color-typo-primary">
                    {reminder.created_by.first_name}{" "}
                    {reminder.created_by.last_name}
                  </span>{" "}
                  {reminder.message}
                </h4>
                <div className="d-flex align-items-center justify-content-between">
                  <span className="fs-10 fw-600 text-color-typo-primary d-flex align-items-center">
                    <span
                      className="px-2 py-1 rounded-pill me-2"
                      style={{ color: "#155DC9", backgroundColor: "#E0ECFF" }}
                    >
                      PKO ID | {reminder.pko_id}
                    </span>
                    <img
                      src="/assets/images/error-alert-circle.svg"
                      className="me-1"
                      alt="reminder-icon"
                    />
                    Reminder
                  </span>
                  <p className="fs-10 fw-600 text-color-typo-secondary mb-0">
                    {formatTimeAgo(reminder.created_date)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NotificationToast;
