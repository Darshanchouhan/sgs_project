import React from "react";
import "../../styles/style.css";

const NotificationToast = ({
  handleCloseToast,
  reminders = [],
  onMarkAsSeen,
}) => {
  const formatHeaderDate = (isoString) => {
    const date = new Date(isoString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const formatTimeAgo = (isoString) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 60) {
      return diffMinutes <= 1 ? "Just now" : `${diffMinutes}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return diffDays === 1 ? "1 day ago" : `${diffDays} days ago`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
    } else {
      const months = Math.floor(diffDays / 30);
      return months === 1 ? "1 month ago" : `${months} months ago`;
    }
  };

  const getDateLabel = (isoString) => {
    const date = new Date(isoString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const isSameDay = (d1, d2) =>
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear();

    if (isSameDay(date, today)) return "Today";
    if (isSameDay(date, yesterday)) return "Yesterday";
    return formatHeaderDate(isoString);
  };

  const groupedReminders = reminders.reduce((acc, reminder) => {
    const label = getDateLabel(reminder.created_date);
    if (!acc[label]) acc[label] = [];
    acc[label].push(reminder);
    return acc;
  }, {});

  const sortedGroupKeys = Object.keys(groupedReminders).sort((a, b) => {
    const parseLabelToDate = (label) => {
      if (label === "Today") return new Date();
      if (label === "Yesterday") {
        const d = new Date();
        d.setDate(d.getDate() - 1);
        return d;
      }
      return new Date(label);
    };
    return parseLabelToDate(b) - parseLabelToDate(a);
  });

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
        <ul className="list-unstyled m-0">
          {sortedGroupKeys.map((label) => (
            <div key={label}>
              <div className="px-3 py-1 bg-color-light-border">
                <h3 className="fs-12 fw-600 text-color-not-started text-uppercase mb-0">
                  {label}
                </h3>
              </div>
              {groupedReminders[label].map((reminder) => (
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
                        style={{
                          color: "#155DC9",
                          backgroundColor: "#E0ECFF",
                        }}
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
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default NotificationToast;
