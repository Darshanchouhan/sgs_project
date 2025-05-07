import React from "react";
import "../../../styles/style.scss";
import HeaderAdmin from "../AdminDashboard/DashboardHeader";
import DashboardSidebar from "../AdminDashboard/DashboardSidebar";
import PKODetailsSubHeaderStrip from "./PKODetailsSubHeaderStrip";
import PKODetailsPKOSummary from "./PKODetailsPKOSummary";
import PKODetailsSKUStatusAndTable from "./PKODetailsSKUStatusAndTable";

const AdminPKODetails = () => {
  return (
    <div>
      {/* Navbar */}
      <HeaderAdmin />
      <div className="d-flex">
        <DashboardSidebar />
        <div className="mainContent-holder w-100 h-100 bg-color-light-gray-shade">
          <PKODetailsSubHeaderStrip />
          {/* Main Section */}
          <div className="container-fluid px-20 px-md-4 pt-30 admin-container-height d-flex flex-column">
            <PKODetailsPKOSummary />
            <PKODetailsSKUStatusAndTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPKODetails;
