import React from "react";
import "../../../styles/style.scss";
import HeaderAdmin from "../AdminDashboard/DashboardHeader";
import DashboardSidebar from "../AdminDashboard/DashboardSidebar";
import PKOManagerUploadStepper from "../AdminPKOManagerPreview/PKOManagerUploadStepper";
import PKOManagerMainTable from "../AdminPKOManagerPreview/PKOManagerMainTable";


const AdminPKOManagerUploadSuccessful = () => {
    return (
        <div>
            {/* Navbar */}
            <HeaderAdmin />
            <div className="d-flex">
                <DashboardSidebar />
                <div className="mainContent-holder w-100 h-100 bg-color-light-gray-shade">
                    {/* Main Section */}
                    <div className="container-fluid px-20 px-md-4 pt-30 container-height d-flex flex-column">
                        <h2 className="fs-24 fw-600 text-black mb-3">PKO Manager</h2>
                        <PKOManagerUploadStepper />
                        <div className="card bg-white w-100 h-100 rounded-3 border-color-desabled-lite d-flex flex-column justify-content-between px-4 pt-32 pb-4">
                            <div className="card-body p-0">
                                <div className="d-flex align-items-center mb-4">
                                    <h3 className="fs-14 fw-600 text-black mb-0">PKO Manager Database</h3>
                                </div>
                                <PKOManagerMainTable />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default AdminPKOManagerUploadSuccessful;
