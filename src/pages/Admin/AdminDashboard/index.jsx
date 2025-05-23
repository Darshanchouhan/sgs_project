import React, { useState, useEffect } from "react";
import "../../../styles/style.scss";
import DashboardSidebar from "./DashboardSidebar";
import DashboardSubHeaderStrip from "./DashboardSubHeaderStrip";
import DashboardPKOSummary from "./DashboardPKOSummary";
import DashboardSKUSummary from "./DashboardSKUSummary";
import DashboardPKOStatusAndTable from "./DashboardPKOStatusAndTable";
import axiosInstance from "../../../services/axiosInstance";
import HeaderAdmin from "./DashboardHeader";

export const dateStatusCheck = (date) => {
  const dateComing = new Date(date);
  const todayDate = new Date();

  // Normalize both dates to remove time for accurate comparison
  dateComing.setHours(0, 0, 0, 0);
  todayDate.setHours(0, 0, 0, 0);

  if (dateComing < todayDate) {
    return "Closed";
  } else {
    return "Active";
  }
};

const AdminDashboard = () => {
  const [dasboardAPIData, setDasboardAPIData] = useState();
  const [loading, setLoading] = useState(true);

  const dasboardAPICall = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("pko-dashboard/");
      const data = response.data;

      setDasboardAPIData(data); // Process the fetched data
      setLoading(false);
    } catch (error) {
      console.error("Error fetching questionnaire data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    dasboardAPICall();
  }, []);
  return (
    <>
      {/* Navbar */}
      <HeaderAdmin />
      {loading && (
        <div className="loader">
          <div className="loaderOverlay d-flex align-items-center justify-content-center bg-secondary rounded-4">
            <img
              src="/assets/images/loading_gif.gif"
              alt="Loading..."
              width="120px"
              height="120px"
            />
          </div>
        </div>
      )}
      <div className="d-flex">
        <DashboardSidebar />
        <div className="mainContent-holder w-100 h-100 bg-color-light-gray-shade">
          {/* Page Sub Header */}
          <DashboardSubHeaderStrip />
          {/* Main Section */}
          <div className="container-fluid px-20 px-md-4 pt-30 admin-dashboard-container-height d-flex flex-column">
            <div className="row h-100">
              {/* PKO Summary */}
              <DashboardPKOSummary
                pkoIncomingData={dasboardAPIData?.pko_details}
                pkopProgressSummaryIncomingData={
                  dasboardAPIData?.all_pko_progress
                }
              />

              {/* SKU Summary */}
              <DashboardSKUSummary
                skuIncomingData={dasboardAPIData?.sku_summary}
              />
            </div>

            {/* SKO Status & Table Section */}
            <DashboardPKOStatusAndTable
              tablepkoData={dasboardAPIData?.pko_details}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
