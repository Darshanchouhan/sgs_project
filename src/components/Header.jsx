import React from "react";

const Header = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-primary py-3">
      <div className="container-fluid px-5">
        {/* Logo and Heading on the left side */}
        <a className="text-decoration-none text-white fs-18" href="#">
          <img
            src="/assets/images/home-icon.svg"
            alt="Logo"
            style={{ height: "40px", marginRight: "10px" }}
          />
          Sustainable Packaging Platform
        </a>

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
          <ul className="navbar-nav ms-auto">
            {/* Example of 3 icons on the right side */}
            <li className="nav-item">
              <button
                type="button"
                className="btn p-0 border-none bg-transparent me-4"
              >
                <img src="/assets/images/help-circle.png" alt="help-circle" />
              </button>
            </li>
            <li className="nav-item">
              <button
                type="button"
                className="btn p-0 border-none bg-transparent me-4"
              >
                <img
                  src="/assets/images/notification-bell.png"
                  alt="notification-bell"
                />
              </button>
            </li>
            <li className="nav-item">
              <button
                type="button"
                className="btn p-0 border-none bg-transparent"
              >
                <img src="/assets/images/user-icon.png" alt="user-icon" />
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
