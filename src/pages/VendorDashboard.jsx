import React, { useEffect, useState, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import "./../styles/style.css";
import axiosInstance from "../services/axiosInstance";
import { VendorContext } from "./VendorContext"; // Import Vendor Context
import ModalLoad from "./ModalLoad";
import Header from "../components/Header";
import Pko_Chart from "./Pko_Chart";
import ProgressLoader from "./ProgressLoader";

const VendorDashboard = () => {
  const [vendorData, setVendorData] = useState(null); // State to hold vendor data
  const [loading, setLoading] = useState(true); // Loading indicator
  const [pkoData, setPkoData] = useState(null); // State to hold PKO data
  const [selectedPkoId, setSelectedPkoId] = useState(""); // State for selected PKO ID
  const { skuStatuses, updateSkuStatus } = useContext(VendorContext);
  const [selectedSkuStatus, setSelectedSkuStatus] = useState("All");
  const [loadCount, setLoadCount] = useState(0); // State to track page load count
  const [isModalVisible, setIsModalVisible] = useState(true); // Modal visibility state
  const navigate = useNavigate();
  const [overallProgress, setOverallProgress] = useState(0); // State for overall progress
  const [activeTab, setActiveTab] = useState("active"); // Default to Active PKOs

  // Function to close the modal
  const closeModal = () => {
    setIsModalVisible(false); // Close the modal
  };

  useEffect(() => {
    // Retrieve the current load count from localStorage (or sessionStorage)
    const currentCount = parseInt(localStorage.getItem("loadCount")) || 0;
    setLoadCount(currentCount);
    if (currentCount > 0) {
      setIsModalVisible(false);
    }

    const fetchData = async () => {
      try {
        const cvsSupplier = localStorage.getItem("cvs_supplier"); // Retrieve 'cvs_supplier' from localStorage
        if (!cvsSupplier) {
          console.error("cvs_supplier not found in localStorage");
          return;
        }
        const response = await axiosInstance.get(`vendors/${cvsSupplier}`);
        const data = response.data;
        setVendorData(data[cvsSupplier]); // Assuming vendor ID is "30542"

        // Check for previously selected PKO ID in localStorage
        const storedPkoId = localStorage.getItem("selectedPkoId");
        const defaultPkoId =
          storedPkoId || data[cvsSupplier]?.pkos[0]?.pko_id || "";

        setSelectedPkoId(defaultPkoId);
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
      if (!selectedPkoId) {
        console.log("No PKO ID selected, skipping fetch.");
        return;
      }

      try {
        console.log("Fetching data for PKO ID:", selectedPkoId);
        const response = await axiosInstance.get("pkos/");
        const data = response.data;

        const pkoDetails = data[selectedPkoId] || null;

        if (pkoDetails) {
          console.log("Fetched PKO Details:", pkoDetails);

          setPkoData(pkoDetails);

          // Calculate the average progress
          const skus = pkoDetails.skus || [];
          console.log("SKUs for this PKO:", skus);

          const totalProgress = skus.reduce(
            (acc, sku) => acc + (sku.sku_progress || 0),
            0,
          );
          console.log("Total Progress of all SKUs:", totalProgress);

          const averageProgress =
            skus.length > 0 ? totalProgress / skus.length : 0;
          console.log("Calculated Average Progress:", averageProgress);

          setOverallProgress(averageProgress);
        } else {
          console.log("No PKO details found for selected PKO ID.");
        }
      } catch (error) {
        console.error("Error fetching PKO data:", error);
      }
    };

    fetchPkoData();
  }, [selectedPkoId]);

  //  Handle PKO Selection Change
  const handlePkoChange = (e) => {
    const selectedId = e.target.value;
    setSelectedPkoId(selectedId);
    // Persist the selected PKO ID to localStorage
    localStorage.setItem("selectedPkoId", selectedId);

    // Find the selected PKO from vendorData.pkos
    const selectedPko = vendorData.pkos.find(
      (pko) => pko.pko_id === selectedId,
    );
    if (selectedPko) {
      setPkoData(selectedPko); // Update pkoData with the selected PKO
    }
  };

  // Handle forward click for SKU
  const handleForwardClick = async (sku) => {
    try {
      const currentStatus = sku.status || "Not Started";

      if (currentStatus === "Completed") {
        console.log("SKU is already completed. No status change needed.");
        // Navigate directly to the SKU page without changing status
        navigate("/skus", {
          state: {
            skuId: sku.sku_id,
            skuDetails: sku,
            pkoData: pkoData || null,
            duedate: pkoData?.duedate || null,
          },
        });
        return;
      }

      console.log("Sending PUT request with status: Draft");

      const response = await axiosInstance.put(
        `/skus/${sku.sku_id}/update_status/`,
        {
          pko_id: selectedPkoId,
          status: "Draft",
        },
      );

      if (response.status === 200) {
        console.log("SKU status updated successfully:", response.data);

        updateSkuStatus(sku.sku_id, "Draft");

        setPkoData((prevPkoData) => {
          const updatedSkus = prevPkoData.skus.map((item) =>
            item.sku_id === sku.sku_id ? { ...item, status: "Draft" } : item,
          );
          return { ...prevPkoData, skus: updatedSkus };
        });

        navigate("/skus", {
          state: {
            skuId: sku.sku_id,
            skuDetails: sku,
            pkoData: pkoData || null,
            duedate: pkoData?.duedate || null,
          },
        });
      } else {
        console.warn(
          "Failed to update SKU status. Status code:",
          response.status,
        );
        alert("Failed to update SKU status. Please try again.");
      }
    } catch (error) {
      console.error("Error during forward action for SKU:", error);
      alert(`Failed to update SKU status: ${error.message}`);
    }
  };

  // const handleForwardClick = async (sku) => {
  //   try {
  //     console.log("Sending PUT request with:", {
  //       pko_id: selectedPkoId,
  //       status: "Draft",
  //     });

  //     const response = await axiosInstance.put(
  //       `/skus/${sku.sku_id}/update_status/`,
  //       {
  //         pko_id: selectedPkoId,
  //         status: "Draft",
  //       },
  //     );

  //     if (response.status === 200) {
  //       console.log("SKU status updated successfully:", response.data);

  //       updateSkuStatus(sku.sku_id, "Draft");

  //       setPkoData((prevPkoData) => {
  //         const updatedSkus = prevPkoData.skus.map((item) =>
  //           item.sku_id === sku.sku_id ? { ...item, status: "Draft" } : item,
  //         );
  //         return { ...prevPkoData, skus: updatedSkus };
  //       });

  //       // Navigate to SKU Page with necessary state
  //       navigate("/skus", {
  //         state: {
  //           skuId: sku.sku_id,
  //           skuDetails: sku,
  //           pkoData: pkoData || null,
  //           duedate: pkoData?.duedate || null,
  //         },
  //       });
  //     } else {
  //       console.warn(
  //         "Failed to update SKU status. Status code:",
  //         response.status,
  //       );
  //       alert("Failed to update SKU status. Please try again.");
  //     }
  //   } catch (error) {
  //     console.error("Error during forward action for SKU:", error);
  //     alert(`Failed to update SKU status: ${error.message}`);
  //   }
  // };

  console.log("Navigating with PKO Data:", pkoData);

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
      <Header></Header>

      {/* Page Header */}

      <div className="py-2 bg-color-light-shade">
        <div className="container-fluid px-5">
          <div className="input-group w-395 h-40 border border-secondary rounded-2 fs-14">
            <label
              className="d-flex align-items-center px-10  bg-white rounded-2 mb-0 border-0 fs-14 text-color-labels"
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
            <div className="card border-0 shadow-1 px-4 py-3 h-100">
              <div className="card-header px-0 py-0 fs-24 fw-600 text-color-typo-primary border-0 bg-transparent">
                {vendorData.supplier_name}
              </div>
              <div className="card-body px-0 pb-0 border-0">
                <div className="row mb-3">
                  <div className="col-5">
                    <span className="fs-14 text-color-labels">
                      CVS Supplier #
                    </span>
                  </div>
                  <div className="col-7 d-flex align-items-center">
                    <span className="fs-14 text-color-labels fw-600">
                      {vendorData.cvs_supplier}
                    </span>
                  </div>
                </div>
                <div className="row mb-2 h-42">
                  <div className="col-5">
                    <span className="fs-14 text-color-labels">
                      Supplier Contact
                    </span>
                  </div>
                  <div className="col-7 d-flex flex-column align-items-start">
                    <span className="fs-14 text-color-labels fw-600">
                      {vendorData.creative_contact_email}
                    </span>
                    <button
                      type="button"
                      className="bg-transparent p-0 border-0 shadow-none fw-700 text-color-draft view-all fs-14"
                      data-bs-toggle="offcanvas"
                      data-bs-target="#offcanvasRight-contact"
                      aria-controls="offcanvasRight-contact"
                    >
                      View All
                    </button>
                  </div>
                </div>
                <div className="d-flex gap-3">
                  {/* Active and Closed PKOs */}
                  <div
                    className="d-flex flex-column p-3 bg-color-light-gray flex-fill cursor-pointer rounded-1 border border-color-dark-border"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#offcanvasRight"
                    aria-controls="offcanvasRight"
                    id="active-pkos"
                    onClick={() => setActiveTab("active")} // Set active tab on click
                  >
                    <div className="d-flex align-items-center justify-content-between">
                      <span className="fs-14 text-color-labels">
                        Active PKOs
                      </span>
                      <img
                        src="/assets/images/arrow-right-forward-blue.svg"
                        alt="Forward"
                      />
                    </div>
                    <p className="fs-24 text-color-typo-primary fw-600 mb-0">
                      {vendorData.pkos
                        .filter(
                          (pko) =>
                            new Date(pko.duedate) > new Date(pko.startdate),
                        )
                        .length.toString()
                        .padStart(2, "0")}
                    </p>
                  </div>
                  <div
                    className="d-flex flex-column p-3 bg-color-light-gray flex-fill cursor-pointer rounded-1 border border-color-dark-border"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#offcanvasRight"
                    aria-controls="offcanvasRight"
                    id="closed-pkos"
                    onClick={() => setActiveTab("closed")} // Set closed tab on click
                  >
                    <div className="d-flex align-items-center justify-content-between">
                      <span className="fs-14 text-color-labels">
                        Closed PKOs
                      </span>
                      <img
                        src="/assets/images/arrow-right-forward-blue.svg"
                        alt="Forward"
                      />
                    </div>
                    <p className="fs-24 text-color-typo-primary fw-600 mb-0">
                      {vendorData.pkos
                        .filter(
                          (pko) =>
                            new Date(pko.duedate) < new Date(pko.startdate),
                        )
                        .length.toString()
                        .padStart(2, "0")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* PKO Status */}
          <div className="col-12 col-md-4">
            <div className="d-flex gap-3 h-100 px-4 py-3 shadow-1">
              <div className="d-flex flex-column flex-fill border-end pe-2">
                <h6 className="text-color-typo-primary fw-600 mb-3">
                  PKO Status
                </h6>
                <span
                  className={`fw-600 px-12 py-2 text-nowrap d-flex align-items-center w-114
        ${
          new Date(pkoData?.duedate) >= new Date(pkoData?.startdate)
            ? "  rounded-pill color-active-bg text-color-completed" // Green text for Active
            : " rounded-pill bg-color-padding-label rounded-pill text-secondary fw-600" // Red pill for Closed
        }`}
                >
                  <span
                    className={`circle me-2 
      ${
        new Date(pkoData?.duedate) >= new Date(pkoData?.startdate)
          ? "bg-color-completed" // Green circle for Active
          : "" // Gray circle for Closed
      }`}
                  ></span>
                  {new Date(pkoData?.duedate) >= new Date(pkoData?.startdate)
                    ? "Active"
                    : "Closed"}
                </span>
                <div className="d-flex flex-column h-100 align-items-start justify-content-end">
                  <div className="d-flex flex-column p-3 mt-12 bg-color-light-gray text-nowrap rounded-1 border border-color-dark-border">
                    <span className="text-color-labels">
                      Due Date <span className="fs-12">(mm/dd/yyyy)</span>
                    </span>
                    <p className="fs-24 text-color-typo-primary fw-600 mb-0">
                      {pkoData?.duedate
                        ? new Date(pkoData.duedate).toLocaleDateString(
                            "en-US",
                            {
                              month: "2-digit",
                              day: "2-digit",
                              year: "numeric",
                            },
                          )
                        : "N/A"}
                    </p>
                  </div>
                  {/* <div className="d-flex align-items-center bg-color-light-gray p-3 mt-12">
                    <span className="text-color-labels fs-12 fw-600 text-nowrap">
                      Due Date:
                    </span>
                    <span
                      className="text-color-labels fs-14 fw-600 ms-2"
                      style={{ lineHeight: "1" }}
                    >
                      (
                      {pkoData?.duedate
                        ? new Date(pkoData.duedate).toLocaleDateString(
                            "en-US",
                            {
                              month: "2-digit",
                              day: "2-digit",
                              year: "numeric",
                            },
                          )
                        : "mm/dd/yyyy"}
                      )
                    </span>
                  </div> */}
                </div>
              </div>
              <div className="d-flex  justify-content-center align-items-center flex-column flex-fill">
                <h6 className="text-color-typo-primary fw-600 mb-40">
                  Overall Progress
                </h6>
                <div className=" d-flex align-items-center h-100">
                  {/* <ProgressLoader
                    percentage={0}
                    size={130}
                    isVendorPage={true}
                  />{" "} */}
                  {console.log(
                    "Rendering ProgressLoader with percentage:",
                    Math.round(overallProgress),
                  )}

                  <ProgressLoader
                    percentage={Math.round(overallProgress)} // Display calculated average progress
                    size={130}
                    isVendorPage={true}
                  />
                  {/* Default size */}
                </div>

                <div className="graph h-100"></div>
              </div>
            </div>
          </div>

          {/* SKU Status */}
          <div className="col-12 col-md-4">
            <div className="card h-100 border-0 shadow-1 px-4 py-3 d-flex flex-column">
              <div className="card-header px-0 py-0 text-color-typo-primary fw-600 border-0 bg-transparent">
                SKU Status
              </div>

              <div className="card-body pb-0 border-0 px-0 d-flex flex-column align-items-start">
                <div className="d-flex align-items-center w-100 h-100 gap-3">
                  <div className="graph w-60 h-100">
                    <div className="mt-3">
                      <Pko_Chart
                        labels={["Not Started", "Draft", "Completed"]}
                        data={[
                          skuData.filter((sku) => sku.status === "Not Started")
                            .length,
                          skuData.filter((sku) => sku.status === "Draft")
                            .length,
                          skuData.filter((sku) => sku.status === "Completed")
                            .length,
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
                              (sku) => sku.status === "Not Started",
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
                            skuData.filter((sku) => sku.status === "Draft")
                              .length
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
                            skuData.filter((sku) => sku.status === "Completed")
                              .length
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
            <h6 className="fs-20 fw-600 text-color-typo-primary pe-4">
              PKO Project ID: {vendorData.pkos[0]?.pko_id || "N/A"}
            </h6>
            <div className="d-flex align-items-center ps-4 border-start border-color-labels">
              <label className="fs-14 color-typo-primary me-2 mb-0 text-nowrap">
                SKU Status
              </label>
              <select
                className="fs-14 sku-status px-12 border border-secondary text-secondary rounded-2 h-44 w-165 fw-600 form-select form-list"
                aria-label="SKU Status Filter"
                value={selectedSkuStatus}
                onChange={(e) => setSelectedSkuStatus(e.target.value)}
              >
                <option value="All">All SKUs ({skuData.length})</option>
                <option value="Not Started">Not Started</option>
                <option value="Draft">Draft</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table Section */}

        <div className="table-container-pko-tbl mt-3">
          <table className="table table-bordered fs-14">
            <thead>
              <tr>
                <th className="h-52 align-middle">SKU ID</th>

                <th className="h-52 align-middle">Description</th>

                <th className="h-52 align-middle">Category</th>

                <th className="h-52 align-middle">Brand</th>

                <th className="h-52 align-middle">UPC #</th>

                <th className="h-52 align-middle">Size</th>
                <th className="h-52 align-middle">Status</th>

                <th className="h-52 align-middle">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pkoData?.skus && pkoData.skus.length > 0 ? (
                pkoData.skus
                  .filter((sku) => {
                    // Filter based on selectedSkuStatus
                    if (selectedSkuStatus === "All") return true;
                    const status = sku.status || "Not Started";
                    return status === selectedSkuStatus;
                  })
                  .sort((a, b) => {
                    // Optional: Sort by SKU ID or any other property to maintain a consistent order
                    return a.sku_id.localeCompare(b.sku_id); // Sort by SKU ID (string comparison)
                  })
                  .map((sku) => {
                    const status = sku.status || "Not Started"; // Fetch updated status
                    return (
                      <tr key={sku.sku_id}>
                        <td className="align-middle">{sku.sku_id}</td>
                        <td className="align-middle">{sku.description}</td>
                        <td className="align-middle">
                          {pkoData.category || "N/A"}
                        </td>
                        <td className="align-middle">{sku.brand}</td>
                        <td className="align-middle">{sku.upc}</td>
                        <td className="align-middle">{sku.size}</td>
                        <td className="align-middle">
                          <span
                            className={`fw-600 text-nowrap px-12 py-2 d-inline-block rounded-pill ${
                              status === "Completed"
                                ? "bg-color-completed text-white"
                                : status === "Draft"
                                  ? "bg-color-draft text-white"
                                  : "bg-color-light-border text-color-typo-secondary"
                            }`}
                          >
                            {status}
                          </span>
                        </td>
                        <td className="align-middle text-center">
                          <button
                            className="btn p-0 border-0 shadow-none"
                            onClick={() => handleForwardClick(sku)}
                          >
                            <img
                              src="/assets/images/forward-arrow-img.png"
                              alt="Forward"
                            />
                          </button>
                        </td>
                      </tr>
                    );
                  })
              ) : (
                <tr>
                  <td colSpan="9" className="text-center">
                    No SKUs available for the selected PKO.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
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
                className={`nav-link px-0 pb-18 me-5 text-color-typo-primary bg-transparent border-0 border-bottom border-bottom-3 ${
                  activeTab === "active" ? "active" : ""
                }`}
                type="button"
                onClick={() => setActiveTab("active")}
              >
                Active PKOs
              </button>
              <button
                className={`nav-link px-0 pb-18 text-color-typo-primary bg-transparent border-0 border-bottom border-bottom-3 ${
                  activeTab === "closed" ? "active" : ""
                }`}
                type="button"
                onClick={() => setActiveTab("closed")}
              >
                Closed PKOs
              </button>
            </div>
          </nav>
          <div className="tab-content mt-4" id="nav-tabContent">
            {/* Active PKOs Table */}
            <div
              className={`tab-pane fade ${activeTab === "active" ? "show active" : ""}`}
              id="nav-home"
              role="tabpanel"
              aria-labelledby="nav-home-tab"
              tabIndex="0"
            >
              <div className="active-pko-tbl">
                <table className="table table-bordered fs-14">
                  <thead>
                    <tr>
                      <th className="text-color-typo-primary opacity-90">
                        Project ID
                      </th>
                      <th className="text-color-typo-primary opacity-90">
                        Business Unit
                      </th>
                      <th className="text-color-typo-primary opacity-90">
                        SKUs Assigned
                      </th>
                      <th className="text-color-typo-primary opacity-90">
                        Start Date
                      </th>
                      <th className="text-color-typo-primary opacity-90">
                        Due Date
                      </th>
                      <th className="text-color-typo-primary opacity-90">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {vendorData.pkos
                      .filter(
                        (pko) =>
                          new Date(pko.duedate) >= new Date(pko.startdate),
                      )
                      .map((pko) => {
                        const pkoSkus = pkoData?.skus || []; // Get SKUs for this PKO
                        return (
                          <tr key={pko.pko_id}>
                            <td>{pko.pko_id}</td>
                            <td>{pko.businessunit || "N/A"}</td>
                            <td>{pkoSkus.length || 0}</td>{" "}
                            {/* Correct SKU count */}
                            <td>
                              {pko.startdate
                                ? new Date(pko.startdate).toLocaleDateString(
                                    "en-GB",
                                  )
                                : "N/A"}
                            </td>
                            <td>
                              {pko.duedate
                                ? new Date(pko.duedate).toLocaleDateString(
                                    "en-GB",
                                  )
                                : "N/A"}
                            </td>
                            <td>Active</td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Closed PKOs Table */}
            <div
              className={`tab-pane fade ${activeTab === "closed" ? "show active" : ""}`}
              id="nav-profile"
              role="tabpanel"
              aria-labelledby="nav-profile-tab"
              tabIndex="0"
            >
              <div className="active-pko-tbl">
                <table className="table table-bordered fs-14">
                  <thead>
                    <tr>
                      <th className="text-color-typo-primary opacity-90">
                        Project ID
                      </th>
                      <th className="text-color-typo-primary opacity-90">
                        Business Unit
                      </th>
                      <th className="text-color-typo-primary opacity-90">
                        SKUs Assigned
                      </th>
                      <th className="text-color-typo-primary opacity-90">
                        Start Date
                      </th>
                      <th className="text-color-typo-primary opacity-90">
                        Due Date
                      </th>
                      <th className="text-color-typo-primary opacity-90">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {vendorData.pkos
                      .filter(
                        (pko) =>
                          new Date(pko.duedate) < new Date(pko.startdate),
                      )
                      .map((pko) => {
                        const pkoSkus = pkoData?.skus || []; // Get SKUs for this PKO
                        return (
                          <tr key={pko.pko_id}>
                            <td>{pko.pko_id}</td>
                            <td>{pko.businessunit || "N/A"}</td>
                            <td>{pkoSkus.length || 0}</td>{" "}
                            {/* Correct SKU count */}
                            <td>
                              {pko.startdate
                                ? new Date(pko.startdate).toLocaleDateString(
                                    "en-GB",
                                  )
                                : "N/A"}
                            </td>
                            <td>
                              {pko.duedate
                                ? new Date(pko.duedate).toLocaleDateString(
                                    "en-GB",
                                  )
                                : "N/A"}
                            </td>
                            <td>Closed</td>
                          </tr>
                        );
                      })}
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
          <h2 className="fs-24 fw-600 text-color-typo-primary mb-0">
            Contacts
          </h2>
          <div className="contact-tbl mt-4">
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
                  ),
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pass loadCount to the ModalLoad component */}
      <ModalLoad
        count={loadCount}
        isVisible={isModalVisible}
        closeModal={closeModal}
      />
    </div>
  );
};

export default VendorDashboard;
