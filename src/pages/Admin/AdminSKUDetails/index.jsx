import React, { useEffect } from "react";
import "../../../styles/style.scss";
import HeaderAdmin from "../AdminDashboard/DashboardHeader";
import DashboardSidebar from "../AdminDashboard/DashboardSidebar";
import SKUDetailsSubHeaderStrip from "./SKUDetailsSubHeaderStrip";
import SKUDetailsInfoBox from "./SKUDetailsInfoBox";
import SKUDetailsSKUComponents from "./SKUDetailsSKUComponents";
import SKUDetailsPrimaryPackagingDetails from "./SKUDetailsPrimaryPackagingDetails";
import axiosInstance from "../../../services/axiosInstance";
import { useParams } from "react-router-dom"; // Import useParams to get URL parameters

const AdminSKUDetails = () => {
  const [apiCallAgain, setApiCallAgain] = React.useState(1);
  const [skuDataIncoming, setSkuDataIncoming] = React.useState({});
  const [loading, setLoading] = React.useState(true);

  const { pkoId, skuId } = useParams(); // Assuming you are using react-router-dom for routing

  const getSKUDetails = async () => {
    try {
      const response = await axiosInstance.get(
        `skus/${skuId}/?pko_id=${pkoId}`,
      );
      const PkoData = response.data;
      setSkuDataIncoming(PkoData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching PKO details:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getSKUDetails();
  }, [pkoId, skuId, apiCallAgain]);

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
          <SKUDetailsSubHeaderStrip
            descriptionIncoming={skuDataIncoming?.description}
            statusIncoming={skuDataIncoming?.status}
            submitted_date={skuDataIncoming?.updated_date}
            cvsSupplierId={skuDataIncoming?.cvs_supplier}
            setApiCallAgain={setApiCallAgain}
          />
          {/* Main Section */}
          <div className="container-fluid px-20 px-md-4 pt-30 admin-container-height d-flex flex-column">
            <SKUDetailsInfoBox skuDataIncoming={skuDataIncoming} />
            <div className="row h-100">
              {/* Primary Packaging Details */}
              <SKUDetailsPrimaryPackagingDetails
                skuDetailsPrimaryPackageDetailData={
                  skuDataIncoming?.primary_packaging_details
                }
              />
              {/* Sku Components Section */}
              <SKUDetailsSKUComponents
                skuComponentDataIncoming={skuDataIncoming?.components}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSKUDetails;
