import React from "react";
import "./style.css";
import backActionIcon from "./assets/images/back-action-icon.svg";
import addCommentIcon from "./assets/images/add-comment-icon.svg";

const BreadcrumbHeader = () => {
    return (
        <div className="py-10 bg-color-light-shade">
            <div className="container-fluid px-5">
                <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                        <button type="button" className="btn p-0 border-none bg-transparent me-4">
                            <img src={backActionIcon} alt="icon" />
                        </button>
                        <div className="d-flex flex-column">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb mb-0">
                                    <li className="breadcrumb-item">
                                        <a href="#" className="text-decoration-none text-secondary fw-600 fs-14">
                                            Survey Name
                                        </a>
                                    </li>
                                    <li className="breadcrumb-item">
                                        <a href="#" className="text-decoration-none text-color-typo-secondary fw-600 fs-14">
                                            Sparking Water
                                        </a>
                                    </li>
                                    <li className="breadcrumb-item">
                                        <a href="#" className="text-decoration-none text-color-typo-secondary fw-600 fs-14">
                                            Bottle Cap
                                        </a>
                                    </li>
                                </ol>
                            </nav>
                            <h6 className="fw-600 text-color-typo-primary mb-0 mt-2">Packaging Data Collection Form</h6>
                        </div>
                    </div>
                    <div className="d-flex align-items-center">
                        <button type="button" className="btn p-0 border-none bg-transparent me-4">
                            <img src={addCommentIcon} alt="icon" />
                        </button>
                        <button className="save-button">Save Changes</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BreadcrumbHeader;
