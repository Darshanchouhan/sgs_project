import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import NotificationToast from "../../../../components/notification";
import SentReminderModal from "./SentReminderModal";
import axiosInstance from "../../../../services/axiosInstance";
import AdminCommentPanel from "../../AdminCommentPanel";

const HeaderAdmin = () => {
  const [showToast, setShowToast] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [reminderData, setReminderData] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const notificationAPICall = async () => {
    try {
      const response = await axiosInstance.get("notifications/");
      if (response?.status === 200) {
        setNotifications(response?.data);
      }
    } catch (err) {
      console.log(err, "notification get error");
    }
  };

  useEffect(() => {
    notificationAPICall();
  }, [window.location.pathname]);

  const handleShowToast = () => {
    notificationAPICall();
    setShowToast(true);
  };

  const handleHideToast = () => {
    setShowToast(false);
  };

  const reminderAPICall = async () => {
    try {
      const response = await axiosInstance.get(`/reminders/`);
      if (response?.status === 200) {
        setReminderData(response?.data);
        setIsModalOpen(true);
      }
    } catch (err) {
      console.log(err, "reminder get error");
    }
  };

  const handleModalReminder = () => {
    setReminderData([]);
    reminderAPICall();
  };

  const handleMarkAsSeen = async (reminderId) => {
    try {
      const response = await axiosInstance.patch("/notifications/", {
        ids: [reminderId],
        role: "admin",
      });
      // Refresh notifications after marking as seen
      if (response?.status === 200) {
        notificationAPICall();
      }
    } catch (err) {
      console.error(`Failed to mark reminder ${reminderId} as seen`, err);
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-secondary py-10 font-britanica sticky-top">
        <div className="container-fluid ps-20 pe-35">
          {/* Logo and Heading on the left side */}
          <Link
            to="/admindashboard"
            className="text-decoration-none text-white fs-18 fw-600 ls-30 d-flex align-items-center"
          >
            <img
              src="/assets/images/cvs-logo.svg"
              alt="Logo"
              style={{
                height: "26px",
                marginRight: "24px",
                paddingRight: "24px",
                borderRight: "1px solid rgba(255, 255, 255, 0.5)",
              }}
            />
            Admin Dashboard - AI for Sustainable Packaging Platform
          </Link>

          {/* Navbar toggler for mobile */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Navbar links and icons on the right side */}
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto align-items-center">
              {/* Example of 3 icons on the right side */}
              <li className="nav-item me-3">
                <button
                  type="button"
                  className="btn p-0 border-none bg-transparent"
                  data-bs-toggle="modal"
                  data-bs-target="#sentReminderModal"
                  onClick={handleModalReminder}
                >
                  <img
                    src="/assets/images/sent-reminders-icon.svg"
                    alt="sent-reminders-icon"
                  />
                </button>
              </li>
              <li className="nav-item me-3 d-flex align-items-center">
                <div className="position-relative">
                  <button
                    type="button"
                    className="btn p-0 border-0 bg-transparent"
                    id="notificationToastBtn"
                    onClick={handleShowToast}
                  >
                    <img
                      src="/assets/images/notification-bell.png"
                      alt="notification-bell"
                    />
                  </button>

                  {showToast && (
                    <NotificationToast
                      handleCloseToast={handleHideToast}
                      reminders={notifications}
                      onMarkAsSeen={handleMarkAsSeen}
                      typeOfNotification={"admin"}
                    />
                  )}
                </div>
              </li>
              <li className="nav-item d-flex align-items-center ps-3 border-start">
                <button
                  type="button"
                  className="btn p-0 border-none bg-transparent"
                  data-bs-toggle="offcanvas"
                  data-bs-target="#offcanvasAdminCommentPanel"
                  aria-controls="offcanvasAdminCommentPanel"
                >
                  <img
                    src="/assets/images/admin-comment-icon.svg"
                    alt="admin-comment-icon"
                  />
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      {/* Modal for Sent Reminder */}
      <SentReminderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        reminderData={reminderData}
      />

      <AdminCommentPanel />
    </>
  );
};

export default HeaderAdmin;
