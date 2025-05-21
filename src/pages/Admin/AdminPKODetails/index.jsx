import React, { useEffect } from "react";
import "../../../styles/style.scss";
import HeaderAdmin from "../AdminDashboard/DashboardHeader";
import DashboardSidebar from "../AdminDashboard/DashboardSidebar";
import PKODetailsSubHeaderStrip from "./PKODetailsSubHeaderStrip";
import PKODetailsPKOSummary from "./PKODetailsPKOSummary";
import PKODetailsSKUStatusAndTable from "./PKODetailsSKUStatusAndTable";
import axiosInstance from "../../../services/axiosInstance";
import { useParams } from "react-router-dom"; // Import useParams to get URL parameters

const AdminPKODetails = () => {
  const [pkoDataIncoming, setPkoDataIncoming] = React.useState({});
  const [loading, setLoading] = React.useState(true);

  const { pkoId } = useParams(); // Assuming you are using react-router-dom for routing

  const getPKODetails = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `pko-dashboard-skulist/${pkoId}/`,
      );
      const PkoData = response.data;
      setPkoDataIncoming(PkoData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching PKO details:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getPKODetails();
  }, [pkoId]);

  return (
    <div>
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
          <PKODetailsSubHeaderStrip pkoStatus={pkoDataIncoming?.due_date} />
          {/* Main Section */}
          <div className="container-fluid px-20 px-md-4 pt-30 admin-container-height d-flex flex-column">
            <PKODetailsPKOSummary pkoDataIncoming={pkoDataIncoming} />
            <PKODetailsSKUStatusAndTable
              skuDataIncoming={pkoDataIncoming?.skus}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPKODetails;
