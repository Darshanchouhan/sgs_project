import React from "react";
import "../../../styles/style.scss";
import HeaderAdmin from "../AdminDashboard/DashboardHeader";
import DashboardSidebar from "../AdminDashboard/DashboardSidebar";
import PKOManagerTemplateUploadingModal from "./PKOManagerTemplateUploadingModal";

const AdminPKOManager = () => {
    return (
        <div>
            {/* Navbar */}
            <HeaderAdmin />
            <div className="d-flex">
                <DashboardSidebar />
                <div className="mainContent-holder w-100 h-100 bg-color-light-gray-shade">
                    {/* Main Section */}
                    <div className="container-fluid px-20 px-md-4 pt-30 container-height d-flex flex-column">
                        <h2 className="fs-24 fw-600 text-black mb-4">PKO Manager</h2>
                        <div className="card bg-white w-100 h-100 rounded-3 border-color-desabled-lite d-flex justify-content-center align-items-center px-5">
                            <div className="py-3 bg-color-light-shade rounded-3 d-flex align-items-center w-100 h-230">
                                <div className="w-100 h-100 d-flex flex-column justify-content-center px-4">
                                    <div className="d-flex align-items-center">
                                        <span className="rounded-circle text-secondary bg-color-badge d-flex justify-content-center align-items-center me-10" style={{ width: "32px", height: "32px", minWidth: "32px", }}>1</span>
                                        <h3 className="fs-14 fw-600 text-black mb-0">Download the excel template and fill it with relevant PKO-Vendor-SKU data</h3>
                                    </div>
                                    <button type="button" className="btn p-0 fs-12 fw-600 text-secondary text-start mt-3 ms-40 d-flex align-items-center">
                                        <img
                                            src="/assets/images/download-icon.svg"
                                            alt="download-icon"
                                            className="me-2"
                                        />
                                        Download template (.xls)
                                    </button>
                                </div>
                                <div className="w-100 h-100 d-flex flex-column justify-content-center px-4 border-start border-end border-color-desabled-lite">
                                    <div className="d-flex align-items-center">
                                        <span className="rounded-circle text-secondary bg-color-badge d-flex justify-content-center align-items-center me-10" style={{ width: "32px", height: "32px", minWidth: "32px", }}>2</span>
                                        <h3 className="fs-14 fw-600 text-black mb-0">Upload the filled excel template back</h3>
                                    </div>
                                    <button type="button" className="btn p-0 fs-12 fw-600 text-secondary text-start mt-3 ms-40 d-flex align-items-center" data-bs-toggle="modal" data-bs-target="#templateUploadingModal">
                                        <img
                                            src="/assets/images/upload-icon.svg"
                                            alt="upload-icon"
                                            className="me-2"
                                        />
                                        Drag & Drop / Upload template (.xls)
                                    </button>
                                </div>
                                <div className="w-100 h-100 d-flex flex-column justify-content-center px-4">
                                    <div className="d-flex align-items-center">
                                        <span className="rounded-circle text-secondary bg-color-badge d-flex justify-content-center align-items-center me-10" style={{ width: "32px", height: "32px", minWidth: "32px", }}>3</span>
                                        <h3 className="fs-14 fw-600 text-black mb-0">Preview & Confirm PKO data</h3>
                                    </div>
                                    <button type="button" className="btn p-0 fs-14 fw-600 text-secondary text-start mt-3 ms-4 invisible">
                                        Preview
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <PKOManagerTemplateUploadingModal />
        </div>
    );
};

export default AdminPKOManager;
