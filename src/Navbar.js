import React from "react";
import "./style.css";
import homeIcon from "./assets/images/home-icon.svg";
import helpCircle from "./assets/images/help-circle.png";
import notificationBell from "./assets/images/notification-bell.png";
import userIcon from "./assets/images/user-icon.png";

const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-primary py-3">
            <div className="container-fluid px-5">
                <a className="text-decoration-none text-white fs-18" href="#">
                    <img src={homeIcon} alt="Logo" style={{ height: "40px", marginRight: "10px" }} />
                    Sustainable Packaging Platform
                </a>
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
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <button type="button" className="btn p-0 border-none bg-transparent me-4">
                                <img src={helpCircle} alt="help-circle" />
                            </button>
                        </li>
                        <li className="nav-item">
                            <button type="button" className="btn p-0 border-none bg-transparent me-4">
                                <img src={notificationBell} alt="notification-bell" />
                            </button>
                        </li>
                        <li className="nav-item">
                            <button type="button" className="btn p-0 border-none bg-transparent">
                                <img src={userIcon} alt="user-icon" />
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
