import React, { useState } from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import ModalLoad from "../pages/ModalLoad";
import useAuthentication from "../hooks/useAuthentication";
import NotificationToast from "../components/notification";
import axiosInstance from "../services/axiosInstance"; // your axios setup

const Header = () => {
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility state
  const [showToast, setShowToast] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const { logoutUserAction } = useAuthentication(); // Using the custom hook

  const handleLogout = () => {
    logoutUserAction(); // Call the logout function from the custom hook
  };

  // Function to open the modal
  const openModal = () => {
    setIsModalVisible(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalVisible(false);
  };

  const handleShowToast = async () => {
    try {
      const supplierId = localStorage.getItem("cvs_supplier") || "56789";
      const res = await axiosInstance.get(
        `/reminders/?cvs_supplier=${supplierId}`,
      );
      const reminders = res.data || [];
      setNotifications(reminders);

      const unseenReminders = reminders.filter((r) => r.status === "Unseen");

      if (unseenReminders.length > 0) {
        await Promise.all(
          unseenReminders.map((r) =>
            axiosInstance.patch(`/reminders/`, { id: r.id, status: "Seen" }),
          ),
        );

        const refreshed = await axiosInstance.get(
          `/reminders/?cvs_supplier=${supplierId}`,
        );
        setNotifications(refreshed.data || []);
      }

      setShowToast(true); // Move here: after data is ready
    } catch (err) {
      console.error("Error handling reminders:", err);
      setNotifications([]);
      setShowToast(true); // Still show it even if there's an error
    }
  };

  const handleHideToast = () => setShowToast(false);

  const handleMarkAsSeen = async (reminderId) => {
    try {
      await axiosInstance.patch("/reminders/", {
        id: reminderId,
        status: "Seen",
      });
      // Refresh notifications after marking as seen
      const supplierId = localStorage.getItem("cvs_supplier") || "56789";
      const res = await axiosInstance.get(
        `/reminders/?cvs_supplier=${supplierId}`,
      );
      setNotifications(res.data || []);
    } catch (err) {
      console.error(`Failed to mark reminder ${reminderId} as seen`, err);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-secondary py-10 font-britanica sticky-top">
      <div className="container-fluid px-20 px-md-5">
        {/* Logo and Heading on the left side */}
        <Link
          to="/vendordashboard"
          className="text-decoration-none text-uppercase text-white fs-18 fw-600 ls-30 d-flex align-items-center"
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
          Smart Packaging Data
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
                onClick={openModal} // Open modal on click
              >
                <img src="/assets/images/help-circle.png" alt="help-circle" />
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
                  />
                )}
              </div>
            </li>
            <li className="nav-item d-flex align-items-center">
              <button
                type="button"
                className="btn p-0 border-none bg-transparent"
              >
                <img src="/assets/images/user-icon.png" alt="user-icon" />
              </button>
              {/* Adding logout span */}
              <span
                onClick={handleLogout}
                className="fs-18 fw-600 logout-span"
                style={{
                  marginLeft: "10px",
                  cursor: "pointer",
                  color: "white", // Custom styles for the logout button
                }}
              >
                Logout
              </span>
            </li>
          </ul>
          {/* ModalLoad Component with count passed as prop */}
          <ModalLoad
            count={0}
            isVisible={isModalVisible}
            closeModal={closeModal}
          />
        </div>
      </div>
    </nav>
  );
};

export default Header;
