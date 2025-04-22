import React, { useState } from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import ModalLoad from "../pages/ModalLoad";
import useAuthentication from "../hooks/useAuthentication";

const Header = () => {
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility state
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

  const [showToast, setShowToast] = useState(false);

  const handleShowToast = () => {
    setShowToast(true);
  };

  const handleHideToast = () => {
    setShowToast(false);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-secondary py-10 font-britanica">
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
                  <div id="notificationToast" className="toast notificationToast" role="alert" aria-live="assertive" aria-atomic="true">
                    <div className="toast-header p-3">
                        <h2 className="fs-16 fw-600 text-color-typo-primary me-auto mb-0">Notifications <span>(2)</span></h2>
                        <button 
                          type="button" 
                          className="btn-close shadow-none" 
                          data-bs-dismiss="toast" 
                          aria-label="Close"
                          onClick={handleHideToast}
                        >
                        </button>
                    </div>
                    <div className="toast-body p-0">
                      <div>
                        <div className="px-3 py-1 bg-color-light-border"><h3 className="fs-12 fw-600 text-color-not-started text-uppercase mb-0">TODAY</h3></div>
                        <ul className="list-unstyled m-0">
                          <li className="ps-28 pe-2 py-12 border-bottom position-relative">
                            <span className="new-notification-indicator w-8 h-8 rounded-circle bg-color-responce-pending"></span>
                            <h4 className="fs-14 fw-600 text-color-labels mb-2"><span className="text-color-typo-primary">John Doe</span> Could you please provide clarification on the details for the Material Type field?</h4>
                            <div className="d-flex align-items-center justify-content-between">
                              <span class="fs-10 fw-600 px-2 py-1 rounded-pill" style={{color: "#155DC9", backgroundColor: "#E0ECFF"}}>PKO ID | PRJ 1188</span>
                              <p className="fs-10 fw-600 text-color-typo-secondary mb-0">2h ago</p>
                            </div>
                          </li>
                          <li className="ps-28 pe-2 py-12 border-bottom position-relative">
                            <span className="new-notification-indicator w-8 h-8 rounded-circle bg-color-responce-pending"></span>
                            <h4 className="fs-14 fw-600 text-color-labels mb-2"><span className="text-color-typo-primary">Vincent Noa</span> Please submit data related to all PKOs before 15 April, 2025.</h4>
                            <div className="d-flex align-items-center justify-content-between">
                              <span className="fs-10 fw-600 text-color-typo-primary"><img src="/assets/images/error-alert-circle.svg" className="me-1" alt="reminder-icon" />Reminder</span>
                              <p className="fs-10 fw-600 text-color-typo-secondary mb-0">5h ago</p>
                            </div>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <div className="px-3 py-1 bg-color-light-border"><h3 className="fs-12 fw-600 text-color-not-started text-uppercase mb-0">YESTERDAY</h3></div>
                        <ul className="list-unstyled m-0">
                          <li className="ps-28 pe-2 py-12 border-bottom position-relative">
                            <h4 className="fs-14 fw-600 text-color-labels mb-2"><span className="text-color-typo-primary">John Doe</span> Could you please provide clarification on the details for the Material Type field?</h4>
                            <div className="d-flex align-items-center justify-content-between">
                              <span class="fs-10 fw-600 px-2 py-1 rounded-pill" style={{color: "#155DC9", backgroundColor: "#E0ECFF"}}>PKO ID | PRJ 1188</span>
                              <p className="fs-10 fw-600 text-color-typo-secondary mb-0">2h ago</p>
                            </div>
                          </li>
                          <li className="ps-28 pe-2 py-12 border-bottom position-relative">
                            <h4 className="fs-14 fw-600 text-color-labels mb-2"><span className="text-color-typo-primary">Vincent Noa</span> Please submit data related to all PKOs before 15 April, 2025.</h4>
                            <div className="d-flex align-items-center justify-content-between">
                              <span className="fs-10 fw-600 text-color-typo-primary"><img src="/assets/images/error-alert-circle.svg" className="me-1" alt="reminder-icon" />Reminder</span>
                              <p className="fs-10 fw-600 text-color-typo-secondary mb-0">5h ago</p>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
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
