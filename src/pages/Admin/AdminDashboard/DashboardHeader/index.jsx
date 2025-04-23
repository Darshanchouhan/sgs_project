import React, { useState } from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import NotificationToast from "../../../../pages/NotificationToast";
import SentReminderModal from "./SentReminderModal";

const HeaderAdmin = () => {

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
                            >
                                <img src="/assets/images/sent-reminders-icon.svg" alt="sent-reminders-icon" />
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
                                    <NotificationToast handleCloseToast={handleHideToast} />
                                )}


                            </div>
                        </li>
                        <li className="nav-item d-flex align-items-center ps-3 border-start">
                            <button
                                type="button"
                                className="btn p-0 border-none bg-transparent"
                            >
                                <img src="/assets/images/comment-icon.svg" alt="comment-icon" />
                            </button>
                        </li>
                    </ul>
                </div>
            </div>

            <SentReminderModal />
        </nav>
    );
};

export default HeaderAdmin;
