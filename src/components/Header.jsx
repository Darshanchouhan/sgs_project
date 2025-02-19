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

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-primary py-10 font-britanica">
      <div className="container-fluid px-5">
        {/* Logo and Heading on the left side */}
        <Link
          to="/vendordashboard"
          className="text-decoration-none text-uppercase text-white fs-18 fw-600 ls-30"
        >
          <img
            src="/assets/images/cvs-logo.svg"
            alt="Logo"
            style={{
              height: "26px",
              marginRight: "24px",
              paddingRight: "24px",
              borderRight: "1px solid #c2c2c2",
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
            <li className="nav-item me-10">
              <button
                type="button"
                className="btn p-0 border-none bg-transparent"
                onClick={openModal} // Open modal on click
              >
                <img src="/assets/images/help-circle.png" alt="help-circle" />
              </button>
            </li>
            <li className="nav-item me-10 d-flex align-items-center d-none">
              <button
                type="button"
                className="btn p-0 border-none bg-transparent"
              >
                <img
                  src="/assets/images/notification-bell.png"
                  alt="notification-bell"
                />
              </button>
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
