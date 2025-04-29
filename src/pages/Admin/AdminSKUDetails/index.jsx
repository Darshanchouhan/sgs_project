import React from "react";
import "../../../styles/style.scss";
import HeaderAdmin from "../AdminDashboard/DashboardHeader";
import DashboardSidebar from "../AdminDashboard/DashboardSidebar";
import SKUDetailsSubHeaderStrip from "./SKUDetailsSubHeaderStrip";
import SKUDetailsInfoBox from "./SKUDetailsInfoBox";
import SKUDetailsSKUComponents from "./SKUDetailsSKUComponents";
import SKUDetailsPrimaryPackagingDetails from "./SKUDetailsPrimaryPackagingDetails";


const AdminSKUDetails = () => {

    return (
        <div>
            {/* Navbar */}
            <HeaderAdmin />
            <div className="d-flex">
                <DashboardSidebar />
                <div className="w-100 h-100 bg-color-light-gray-shade">
                    <SKUDetailsSubHeaderStrip />
                    {/* Main Section */}
                    <div className="container-fluid px-20 px-md-4 pt-30 container-height d-flex flex-column">
                        <SKUDetailsInfoBox />
                        <div className="row h-100">
                            {/* Primary Packaging Details */}
                            <SKUDetailsPrimaryPackagingDetails />
                            {/* Sku Components Section */}
                            <SKUDetailsSKUComponents />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSKUDetails;
