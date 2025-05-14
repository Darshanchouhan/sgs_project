import React from "react";
import "../../../styles/style.scss";
import HeaderAdmin from "../AdminDashboard/DashboardHeader";
import DashboardSidebar from "../AdminDashboard/DashboardSidebar";
import PKOManagerMainTable from "./PKOManagerMainTable";
import PKOManagerUploadStepper from "./PKOManagerUploadStepper";

const AdminPKOManagerPreview = () => {
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
                  <span
                    className="rounded-circle text-secondary bg-color-badge d-flex justify-content-center align-items-center me-10"
                    style={{ width: "32px", height: "32px", minWidth: "32px" }}
                  >
                    3
                  </span>
                  <h3 className="fs-14 fw-600 text-black mb-0">
                    Preview & Confirm PKO data
                  </h3>
                </div>
                <PKOManagerMainTable />
              </div>
              <div className="card-footer p-0 border-0 bg-transparent d-flex justify-content-end">
                <button
                  type="button"
                  className="btn btn-outline-primary fs-14 fw-600 px-4 py-10 rounded-1 me-3"
                >
                  Cancel Upload
                </button>
                <button className="btn btn-primary fs-14 fw-600 px-4 py-10 rounded-1">
                  Confirm Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPKOManagerPreview;
