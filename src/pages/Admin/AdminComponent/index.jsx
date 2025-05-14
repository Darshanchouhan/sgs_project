import React from "react";
import "../../../styles/style.scss";
import HeaderAdmin from "../AdminDashboard/DashboardHeader";
import DashboardSidebar from "../AdminDashboard/DashboardSidebar";
import ComponentSubHeaderStrip from "./ComponentSubHeaderStrip";
import ComponentSidePanel from "./ComponentSidePanel";
import ComponentForm from "./ComponentForm";
import AdminApproveSKUModal from "../AdminApproveSKUModal";
import AdminRequestChangesModal from "../AdminRequestChangesModal";

const AdminComponentPage = () => {
  return (
    <div>
      {/* Navbar */}
      <HeaderAdmin />
      <div className="d-flex">
        <DashboardSidebar />
        <div className="mainContent-holder w-100 h-100 bg-color-light-gray-shade">
          <ComponentSubHeaderStrip />
          {/* Main Section */}
          <div className="container-fluid px-20 px-md-4 pt-30 container-height d-flex flex-column">
            <div className="row">
              <ComponentSidePanel />
              <ComponentForm />
            </div>
          </div>
        </div>
      </div>

      {/* Approve SKU Modal Popup */}
      <AdminApproveSKUModal />

      {/* Request Changes Modal Popup */}
      <AdminRequestChangesModal />
    </div>
  );
};

export default AdminComponentPage;
