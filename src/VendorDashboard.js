import React, { useEffect, useState,useContext  } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import "./style.css";
import { VendorContext } from "./VendorContext"; // Import Vendor Context
import addActiveIndicator from "./assets/images/active-Indicator.svg";
import addFilter from "./assets/images/filter.svg";
import addSearch from "./assets/images/search.svg";
import forwardArrowIcon from "./assets/images/forward-arrow-img.png";
import ModalLoad from "./ModalLoad";
import Navbar from "./Navbar";
import Pko_Chart from "./Pko_Chart";
import ProgressLoader from "./ProgressLoader";

const VendorDashboard = () => {
  const [vendorData, setVendorData] = useState(null); // State to hold vendor data
  const [loading, setLoading] = useState(true); // Loading indicator
  const [pkoData, setPkoData] = useState(null); // State to hold PKO data
  const [selectedPkoId, setSelectedPkoId] = useState(""); // State for selected PKO ID
  const { skuStatuses, updateSkuStatus } = useContext(VendorContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://demo.gramener.com/api/vendors/");
        if (!response.ok) {
          throw new Error("Failed to fetch vendor data");
        }
        const data = await response.json();
        setVendorData(data["30542"]); // Assuming vendor ID is "30542"
        setSelectedPkoId(data["30542"]?.pkos[0]?.pko_id || "");
      } catch (error) {
        console.error("Error fetching vendor data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch PKO Data Based on Selected PKO ID
  useEffect(() => {
    const fetchPkoData = async () => {
      if (!selectedPkoId) return;
      try {
        const response = await fetch("https://demo.gramener.com/api/pkos/");
        if (!response.ok) {
          throw new Error("Failed to fetch PKO data");
        }
        const data = await response.json();
        setPkoData(data[selectedPkoId] || null);
      } catch (error) {
        console.error("Error fetching PKO data:", error);
      }
    };

    fetchPkoData();
  }, [selectedPkoId]);

  //  Handle PKO Selection Change
  const handlePkoChange = (e) => {
    setSelectedPkoId(e.target.value);
  };

 // Handle SKU Navigation and Status Update
const handleForwardClick = (sku) => {
  // Update the SKU status in the context
  updateSkuStatus(sku.sku_id, "Draft"); 

  // Update SKU Data state to ensure it reflects locally
  setPkoData((prevPkoData) => {
    const updatedSkus = prevPkoData.skus.map((item) =>
      item.sku_id === sku.sku_id ? { ...item, status: "Draft" } : item
    );
    return { ...prevPkoData, skus: updatedSkus };
  });

  navigate("/sku_page", {
    state: {
      skuId: sku.sku_id,
      skuDetails: null, // Clear stale SKU Details
      pkoData: pkoData || null,
    },
  });
};




 


  //loading state
  if (loading) {
    return <div className="text-center py-5">Loading...</div>;
  }
  //no data state
  if (!vendorData) {
    return <div className="text-center py-5">No data available</div>;
  }

  const skuData = pkoData?.skus || []; // Ensure no errors if SKUs are missing
  // const selectedPko = vendorData.pkos[0] || {};

  return (
    <div>
      {/* Navbar */}
      <Navbar />

      {/* Page Header */}

      <div className="py-14 bg-color-light-shade">
        <div className="container-fluid px-5">
          <div className="input-group w-395 h-44 border border-secondary rounded-2 fs-14">
            <label
              className="input-group-text bg-white mb-0 border-0 fs-14 text-color-labels"
              htmlFor="inputGroupSelect01"
            >
              PKO Project ID
            </label>
            <select
              className="form-select border-start border-color-labels border-0 fs-14 fw-600 text-secondary"
              id="inputGroupSelect01"
              value={selectedPkoId}
              onChange={handlePkoChange}
            >
              {vendorData.pkos.map((pko, index) => (
                <option key={index} value={pko.pko_id}>
                  {pko.pko_id}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Section */}
      <div className="container-fluid ps-4 pe-5 pt-30 container-height d-flex flex-column">
        <div className="row">
          {/* Supplier Card */}
          <div className="col-12 col-md-4">
            <div className="card border-0 shadow-1 p-4 h-100">
              <div className="card-header py-0 fs-24 fw-600 text-color-black border-0 bg-transparent">
                {vendorData.supplier_name}
              </div>
              <div className="card-body pb-0 border-0">
                <div className="row mb-3">
                  <div className="col-4">
                    <span className="fs-14 text-color-labels">
                      CVS Supplier #
                    </span>
                  </div>
                  <div className="col-8 d-flex align-items-center">
                    <span className="fs-14 text-color-labels fw-600">
                      {vendorData.cvs_supplier}
                    </span>
                  </div>
                </div>
                <div className="row">
                  <div className="col-4">
                    <span className="fs-14 text-color-labels">
                      Supplier Contact
                    </span>
                  </div>
                  <div className="col-8 d-flex flex-column align-items-start">
                    <span className="fs-14 text-color-labels fw-600">
                      {vendorData.creative_contact_email}
                    </span>
                    <button
                      type="button"
                      className="btn p-0 border-0 shadow-none fw-700 text-color-draft view-all"
                      data-bs-toggle="offcanvas"
                      data-bs-target="#offcanvasRight-contact"
                      aria-controls="offcanvasRight-contact"
                    >
                      view all
                    </button>
                  </div>
                </div>
                <div className="d-flex gap-3">
                  {/* Active and Closed PKOs */}
                  <div
                    className="d-flex flex-column p-3 bg-color-light-gray flex-fill cursor-pointer"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#offcanvasRight"
                    aria-controls="offcanvasRight"
                    id="active-pkos"
                  >
                    <span className="fs-14 text-color-labels">Active PKOs</span>
                    <p className="fs-24 text-color-draft fw-600 mb-0">
      {
        pkoData?.skus?.filter(
          (sku) => new Date(pkoData.duedate) >= new Date(pkoData.startdate)
        ).length || 0
      }
    </p>
                  </div>
                  <div
                    className="d-flex flex-column p-3 bg-color-light-gray flex-fill cursor-pointer"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#offcanvasRight"
                    aria-controls="offcanvasRight"
                    id="closed-pkos"
                  >
                    <span className="fs-14 text-color-labels">Closed PKOs</span>
                    <p className="fs-24 text-color-completed fw-600 mb-0">
      {
        pkoData?.skus?.filter(
          (sku) => new Date(pkoData.duedate) < new Date(pkoData.startdate)
        ).length || 0
      }
    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* PKO Status */}
          <div className="col-12 col-md-4">
            <div className="d-flex gap-3 h-100 p-4 shadow-1">
              <div className="d-flex flex-column flex-fill">
                <h6 className="text-color-typo-primary fw-600">PKO Status</h6>
                <div className="d-flex flex-column h-100 align-items-start justify-content-end">
                  <img src={addActiveIndicator} alt="Active Indicator" />
                  <div className="d-flex flex-column p-3 bg-color-light-gray text-nowrap">
                    <span className="text-color-labels">
                      Submission Last Date
                    </span>
                    <p className="fs-24 text-color-labels fw-600 mb-0">
                      5 Dec, 2024
                    </p>
                  </div>
                </div>
              </div>
              <div className="d-flex border-start ps-4 flex-wrap flex-fill">
                <h6 className="text-color-typo-primary fw-600 mb-0">
                  Overall Progress
                </h6>
                <div className=" d-flex align-items-center h-100">
                  <ProgressLoader
                    percentage={0}
                    size={130}
                    isVendorPage={true}
                  />{" "}
                  {/* Default size */}
                </div>

                <div className="graph h-100"></div>
              </div>
            </div>
          </div>

          {/* SKU Status */}
          <div className="col-12 col-md-4">
            <div className="card h-100 border-0 shadow-1 py-4 d-flex flex-column">
              <div className="card-header py-0 text-color-typo-primary fw-600 border-0 bg-transparent">
                SKU Status
              </div>

              <div className="card-body pb-0 border-0 px-0 d-flex flex-column align-items-start">
                <div className="d-flex align-items-center w-100 h-100 gap-3">
                  <div className="graph w-60 h-100">
                  <div className="mt-3">
                  <Pko_Chart
  labels={["Not Started", "Draft", "Completed"]}
  data={[
    skuData.filter((sku) => skuStatuses[sku.sku_id] === "Not Started" || (!skuStatuses[sku.sku_id] && sku.status === "Not Started")).length,
    skuData.filter((sku) => skuStatuses[sku.sku_id] === "Draft" || (!skuStatuses[sku.sku_id] && sku.status === "Draft")).length,
    skuData.filter((sku) => skuStatuses[sku.sku_id] === "Completed" || (!skuStatuses[sku.sku_id] && sku.status === "Completed")).length,
  ]}
/>

                    </div>
                  </div>
                  <div className="status-labels w-40">
                    <ul className="list-unstyled">
                      <li className="d-flex  align-items-center justify-content-between mb-3">
                        <div className="d-flex align-items-center gap-2">
                          <span className="status-dot not-started"></span>
                          <p className="fs-12 text-color-typo-primary mb-0">
                            Not Started
                          </p>
                        </div>
                        {/* Dynamically display the count of "Not Started" SKUs */}
                       {/* Dynamically display the count of "Not Started" SKUs */}
<span className="fs-12 fw-700">
  {
    skuData.filter(
      (sku) => skuStatuses[sku.sku_id] === "Not Started" || (!skuStatuses[sku.sku_id] && sku.status === "Not Started")
    ).length
  }
</span>
                      </li>
                      <li className="d-flex align-items-center justify-content-between mb-3">
                        <div className="d-flex align-items-center gap-2">
                          <span className="status-dot draft"></span>
                          <p className="fs-12 text-color-typo-primary mb-0">
                            Draft
                          </p>
                        </div>
                        {/* Dynamically display the count of "Draft" SKUs */}
<span className="fs-12 fw-700">
  {
    skuData.filter(
      (sku) => skuStatuses[sku.sku_id] === "Draft" || (!skuStatuses[sku.sku_id] && sku.status === "Draft")
    ).length
  }
</span>
                      </li>
                      <li className="d-flex align-items-center justify-content-between mb-3">
                        <div className="d-flex align-items-center gap-2">
                          <span className="status-dot completed"></span>
                          <p className="fs-12 text-color-typo-primary mb-0">
                            Completed
                          </p>
                        </div>
                        {/* Dynamically display the count of "Completed" SKUs */}
<span className="fs-12 fw-700">
  {
    skuData.filter(
      (sku) => skuStatuses[sku.sku_id] === "Completed" || (!skuStatuses[sku.sku_id] && sku.status === "Completed")
    ).length
  }
</span>
                      </li>
                    </ul>
                    {/* Donut Chart Below SKU Status */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Table */}
        <div className="d-flex align-items-center justify-content-between mt-30">
          <div className="d-flex align-items-center">
            <h6 className="fs-20 fw-600 text-color-black pe-4">
              PKO Project ID: {vendorData.pkos[0]?.pko_id || "N/A"}
            </h6>
            <div className="d-flex align-items-center ps-4 border-start border-color-labels">
              <label className="fs-14 color-typo-primary me-2 text-nowrap">
                SKU Status
              </label>
              <select
                className="fs-14 sku-status px-12 border border-secondary text-secondary rounded-2 h-44 w-165 fw-600 form-select form-list"
                aria-label="Default select example"
              >
                {/* Dynamically display the total number of SKUs */}
                <option selected>All SKUs ({skuData.length})</option>
                {/* Dynamically generate options for each SKU ID */}
                {skuData.map((sku) => (
                  <option key={sku.sku_id} value={sku.sku_id}>
                    {sku.sku_id}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="d-flex align-items-center gap-4">
            <button type="button" className="bg-transparent border-0 px-0">
              <img src={addSearch} alt="search" />
            </button>
            <button type="button" className="bg-transparent border-0 px-0">
              <img src={addFilter} alt="filter" />
            </button>
          </div>
        </div>

        {/* Table Section */}

        <div className="table-container-pko mt-3">
          <table className="table table-bordered fs-14">
            <thead>
              <tr>
                <th>SKU ID</th>

                <th>Description</th>

                <th>Category</th>

                <th>Brand</th>

                <th>UPC #</th>

                <th>Size</th>

                <th>Due</th>

                <th>Status</th>

                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {skuData.map((sku) => (
                <tr key={sku.sku_id}>
                  <td>{sku.sku_id}</td>

                  <td>{sku.description}</td>

                  <td>{pkoData?.category}</td>

                  <td>{sku.brand}</td>

                  <td>{sku.upc}</td>

                  <td>{sku.size}</td>

                  <td>{sku.duedate}</td>
                  

                  <td>
                  <span
                    className={`fw-600 text-nowrap px-12 py-2 rounded-pill ${
                      skuStatuses[sku.sku_id] === "Draft"
                        ? "bg-color-draft text-white"
                        : "bg-color-light-border text-color-typo-secondary"
                    }`}
                  >
                    {skuStatuses[sku.sku_id] || sku.status}
                  </span>
                  </td>
  
                  <td>
                  <button
                    className="btn p-0 border-0 shadow-none"
                    onClick={() => handleForwardClick(sku)}
                  >
                    <img src={forwardArrowIcon} alt="Forward" />
                  </button>
                </td>

                  {/* <td className="h-51 px-12 align-middle d-flex align-items-center justify-content-between">
                    <button
                      className="btn p-0 border-0 shadow-none"
                      onClick={() => handleForwardClick(sku)} // Navigate on click
                    >
                      <img src={forwardArrowIcon} alt="Forward" />
                    </button>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Offcanvas for Active and Closed PKOs */}
     {/* Offcanvas for Active and Closed PKOs */}
<div className="offcanvas offcanvas-end" id="offcanvasRight">
  <div className="offcanvas-header">
    <button
      type="button"
      className="btn-close"
      data-bs-dismiss="offcanvas"
    ></button>
  </div>
  <div className="offcanvas-body">
    <nav>
      <div
        className="nav nav-tabs border-bottom border-3"
        id="nav-tab"
        role="tablist"
      >
        <button
          className="nav-link pb-20 text-color-typo-primary bg-transparent border-0 active"
          id="nav-home-tab"
          data-bs-toggle="tab"
          data-bs-target="#nav-home"
          type="button"
          role="tab"
          aria-controls="nav-home"
          aria-selected="true"
        >
          Active PKOs
        </button>
        <button
          className="nav-link pb-20 text-color-typo-primary bg-transparent border-0"
          id="nav-profile-tab"
          data-bs-toggle="tab"
          data-bs-target="#nav-profile"
          type="button"
          role="tab"
          aria-controls="nav-profile"
          aria-selected="false"
        >
          Closed PKOs
        </button>
      </div>
    </nav>
    <div className="tab-content mt-4" id="nav-tabContent">
      {/* Active PKOs Table */}
      <div
        className="tab-pane fade show active"
        id="nav-home"
        role="tabpanel"
        aria-labelledby="nav-home-tab"
        tabIndex="0"
      >
        <div className="active-pko-tbl">
          <table className="table table-bordered fs-14">
            <thead>
              <tr>
                <th className="text-color-typo-primary opacity-90">Project ID</th>
                <th className="text-color-typo-primary opacity-90">Business Unit</th>
                <th className="text-color-typo-primary opacity-90">SKUs Assigned</th>
                <th className="text-color-typo-primary opacity-90">Start Date</th>
                <th className="text-color-typo-primary opacity-90">Due Date</th>
                <th className="text-color-typo-primary opacity-90">Status</th>
              </tr>
            </thead>
            <tbody>
              {pkoData && (
                <tr>
                  {/* Project ID */}
                  <td className="h-51 px-12 align-middle">{selectedPkoId || "N/A"}</td>
                  
                  {/* Business Unit */}
                  <td className="h-51 px-12 align-middle">
                    {pkoData.businessunit || "N/A"}
                  </td>
                  
                  {/* SKUs Assigned */}
                  <td className="h-51 px-12 align-middle">
                    {pkoData.skus?.length || 0}
                  </td>
                  
                  {/* Start Date */}
                  <td className="h-51 px-12 align-middle">
                    {pkoData.startdate || "N/A"}
                  </td>
                  
                  {/* Due Date */}
                  <td className="h-51 px-12 align-middle">
                    {pkoData.duedate || "N/A"}
                  </td>
                  
                  {/* Status */}
                  <td className="h-51 px-12 align-middle">
                    {new Date(pkoData.duedate) < new Date(pkoData.startdate)
                      ? "Closed"
                      : "Active"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Closed PKOs Table */}
      <div
        className="tab-pane fade"
        id="nav-profile"
        role="tabpanel"
        aria-labelledby="nav-profile-tab"
        tabIndex="0"
      >
        <div className="active-pko-tbl">
          <table className="table table-bordered fs-14">
            <thead>
              <tr>
                <th className="text-color-typo-primary opacity-90">Project ID</th>
                <th className="text-color-typo-primary opacity-90">Business Unit</th>
                <th className="text-color-typo-primary opacity-90">SKUs Assigned</th>
                <th className="text-color-typo-primary opacity-90">Start Date</th>
                <th className="text-color-typo-primary opacity-90">Due Date</th>
                <th className="text-color-typo-primary opacity-90">Status</th>
              </tr>
            </thead>
            <tbody>
              {pkoData &&
                new Date(pkoData.duedate) < new Date(pkoData.startdate) && (
                  <tr>
                    {/* Project ID */}
                    <td className="h-51 px-12 align-middle">{selectedPkoId || "N/A"}</td>
                    
                    {/* Business Unit */}
                    <td className="h-51 px-12 align-middle">
                      {pkoData.businessunit || "N/A"}
                    </td>
                    
                    {/* SKUs Assigned */}
                    <td className="h-51 px-12 align-middle">
                      {pkoData.skus?.length || 0}
                    </td>
                    
                    {/* Start Date */}
                    <td className="h-51 px-12 align-middle">
                      {pkoData.startdate || "N/A"}
                    </td>
                    
                    {/* Due Date */}
                    <td className="h-51 px-12 align-middle">
                      {pkoData.duedate || "N/A"}
                    </td>
                    
                    {/* Status */}
                    <td className="h-51 px-12 align-middle">Closed</td>
                  </tr>
                )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</div>


      {/* Offcanvas for Contacts */}
      <div
        className="offcanvas  offcanvas-end width-80 bg-color-light-shade"
        tabIndex="-1"
        id="offcanvasRight-contact"
        aria-labelledby="offcanvasRight-contactLabel"
      >
        <div className="offcanvas-header">
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          <div className="contact-tbl">
            <table className="table table-bordered fs-14">
              <thead>
                <tr>
                  <th className="text-color-typo-primary opacity-90">
                    Contact of
                  </th>
                  <th className="text-color-typo-primary opacity-90">Name</th>
                  <th className="text-color-typo-primary opacity-90"> Email</th>
                  <th className="text-color-typo-primary opacity-90">Number</th>
                </tr>
              </thead>
              <tbody>
                {["supplier_creative", "supplier_qa", "broker"].map(
                  (contactType, index) => (
                    <tr key={index}>
                      <td>{vendorData.supplier_name}</td>
                      <td>{vendorData[`${contactType}_contact_name`]}</td>
                      <td>{vendorData[`${contactType}_contact_email`]}</td>
                      <td>{vendorData[`${contactType}_contact_phone`]}</td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ModalLoad />
    </div>
  );
};


export default VendorDashboard;
