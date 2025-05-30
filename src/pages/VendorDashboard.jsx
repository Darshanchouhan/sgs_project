import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import "./../styles/style.css";
import axiosInstance from "../services/axiosInstance";
import ModalLoad from "./ModalLoad";
import Header from "../components/Header";
import Pko_Chart from "./Pko_Chart";
import ProgressLoader from "./ProgressLoader";
import VendorCommentPanel from "../components/VendorCommentPanel";

const VendorDashboard = () => {
  const [vendorData, setVendorData] = useState(null); // State to hold vendor data
  const [loading, setLoading] = useState(true); // Loading indicator
  const [pkoData, setPkoData] = useState(null); // State to hold PKO data
  const [selectedPkoId, setSelectedPkoId] = useState(""); // State for selected PKO ID
  const [selectedSkuStatus, setSelectedSkuStatus] = useState("All");
  const [loadCount, setLoadCount] = useState(0); // State to track page load count
  const [isModalVisible, setIsModalVisible] = useState(true); // Modal visibility state
  const navigate = useNavigate();
  const [overallProgress, setOverallProgress] = useState(0); // State for overall progress
  const [activeTab, setActiveTab] = useState("active"); // Default to Active PKOs
  const [commentDropdownData, setCommentDropdownData] = useState({
    pkos: [],
    skus: [],
    componentsBySku: {}, // { sku_id: [component1, component2] }
  });

  useEffect(() => {
    const preloadCommentDropdownData = async () => {
      try {
        const supplierId = localStorage.getItem("cvs_supplier");
        const vendorRes = await axiosInstance.get(`vendors/${supplierId}`);
        const vendor = vendorRes.data?.[supplierId];
        const pkos = vendor?.pkos || [];

        const pkoRes = await axiosInstance.get("pkos/");
        const pkoMap = pkoRes.data;

        const allSkus = [];

        pkos.forEach((pko) => {
          const pkoDetails = pkoMap[pko.pko_id];
          if (pkoDetails?.skus?.length) {
            pkoDetails.skus.forEach((sku) =>
              allSkus.push({ ...sku, pko_id: pko.pko_id }),
            );
          }
        });

        setCommentDropdownData({
          pkos,
          skus: allSkus,
          componentsBySku: {}, // Now unused
        });
      } catch (err) {
        console.error("Error loading dropdown data for comment panel", err);
      }
    };

    preloadCommentDropdownData();
  }, []);

  const closeModal = () => {
    localStorage.setItem("loadCount", 1);
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
        // const defaultPkoId =
        //   storedPkoId || data[cvsSupplier]?.pkos[0]?.pko_id || "";
        const pkos = data[cvsSupplier]?.pkos || [];
        const sortedByDueDate = pkos
          .filter((pko) => !!pko.duedate)
          .sort((a, b) => new Date(b.duedate) - new Date(a.duedate));

        const defaultPkoId = storedPkoId || sortedByDueDate[0]?.pko_id || "";

        setSelectedPkoId(defaultPkoId);
      } catch (error) {
        console.error("Error fetching vendor data:", error);
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

          setPkoData({
            ...pkoDetails,
            skus: (pkoDetails.skus || []).sort((a, b) =>
              a.sku_id.localeCompare(b.sku_id),
            ),
          });

          try {
            const progressRes = await axiosInstance.get(
              `/update-pko-progress/?pko_id=${selectedPkoId}`,
            );
            const fetchedProgress = progressRes?.data?.pko_progress || 0;
            setOverallProgress(fetchedProgress);
          } catch (progressErr) {
            console.error("Error fetching PKO progress:", progressErr);
            setOverallProgress(0);
          }
        } else {
          console.log("No PKO details found for selected PKO ID.");
        }
      } catch (error) {
        console.error("Error fetching PKO data:", error);
      } finally {
        setLoading(false);
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

  useEffect(() => {
    const preloadReminders = async () => {
      try {
        const supplierId = localStorage.getItem("cvs_supplier");
        const [reminderRes, notificationRes] = await Promise.all([
          axiosInstance.get(`/reminders/?cvs_supplier=${supplierId}`),
          axiosInstance.get(`/notifications/?cvs_supplier=${supplierId}`),
        ]);

        const reminders = (reminderRes.data || []).map((item) => ({
          ...item,
          type: "reminder",
        }));

        const notifications = (notificationRes.data || [])
          .filter((n) =>
            ["InreviewToApproved", "InreviewToDraft"].includes(n.status_change),
          )
          .map((item) => ({
            ...item,
            type: "notification",
          }));

        const combined = [...reminders, ...notifications].sort(
          (a, b) => new Date(b.created_date) - new Date(a.created_date),
        );

        localStorage.setItem("vendor_notifications", JSON.stringify(combined));
      } catch (err) {
        console.error("Error preloading reminders/notifications", err);
      }
    };

    preloadReminders();
  }, []);

  // Handle forward click for SKU
  const handleForwardClick = async (sku) => {
    try {
      const currentStatus = sku.status || "Not Started";
      const isClosed = !isActive(pkoData?.duedate); // Use your existing helper

      //  If already Draft, Inreview or Approved → only navigate
      if (currentStatus !== "Not Started") {
        localStorage.setItem(
          "sku_page_state",
          JSON.stringify({
            skuId: sku.sku_id,
            skuDetails: sku,
            pkoData: pkoData || null,
            duedate: pkoData?.duedate || null,
            isPkoClosed: isClosed,
            isFormLocked:
              isClosed || ["Inreview", "Approved"].includes(currentStatus),
          }),
        );
        navigate("/skus");
        return;
      }

      // If Not Started → send notification + change status to Draft
      const cvsSupplier = localStorage.getItem("cvs_supplier");
      await axiosInstance.post("/notifications/", {
        status_change: "NotStartedToDraft",
        skuid: sku.sku_id,
        pkoid: selectedPkoId,
        cvs_supplier: cvsSupplier,
      });
      console.log("Notification created");

      const response = await axiosInstance.put(
        `/skus/${sku.sku_id}/update_status/`,
        {
          pko_id: selectedPkoId,
          status: "Draft",
        },
      );

      if (response.status === 200) {
        setPkoData((prevPkoData) => {
          const updatedSkus = prevPkoData.skus.map((item) =>
            item.sku_id === sku.sku_id ? { ...item, status: "Draft" } : item,
          );
          return { ...prevPkoData, skus: updatedSkus };
        });
        console.log("SKU status updated to Draft");
      }

      // After update → navigate
      localStorage.setItem(
        "sku_page_state",
        JSON.stringify({
          skuId: sku.sku_id,
          skuDetails: sku,
          pkoData: pkoData || null,
          duedate: pkoData?.duedate || null,
        }),
      );
      navigate("/skus");
    } catch (error) {
      console.error("Error during forward action for SKU:", error);
      alert(`Failed to process forward action: ${error.message}`);
    }
  };

  const skuData = pkoData?.skus || []; // Ensure no errors if SKUs are missing

  const isActive = (duedate) => {
    if (!duedate) return false;
    const due = new Date(duedate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Optional: normalize to ignore time
    return due >= today;
  };

  return (
    <div>
      {/* Navbar */}
      <Header></Header>
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
      {/* Page Header */}
      <div className="py-2 bg-color-light-shade">
        <div className="container-fluid d-flex justify-content-between align-items-center px-20 px-md-5">
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
              {vendorData?.pkos?.map((pko, index) => (
                <option key={index} value={pko.pko_id}>
                  {pko.pko_id}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            className="btn p-0 border-none bg-transparent"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasVendorCommentPanel"
            aria-controls="offcanvasVendorCommentPanel"
          >
            <img
              src="/assets/images/vendor-comment-icon.svg"
              alt="vendor-comment-icon"
            />
          </button>
        </div>
      </div>

      {/* Main Section */}
      <div className="container-fluid px-20 px-md-4 pt-30 container-height d-flex flex-column">
        <div className="row">
          {/* Supplier Card */}
          <div className="col-12 col-md-6 col-xl-4 mb-3 mb-xl-0">
            <div className="card border-0 shadow-1 px-4 py-3 h-100">
              <div className="card-header px-0 py-0 fs-24 fw-600 text-color-typo-primary border-0 bg-transparent">
                {vendorData?.supplier_name}
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
                      {vendorData?.cvs_supplier}
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
                      {vendorData?.creative_contact_email}
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
                      {vendorData?.pkos
                        .filter((pko) => isActive(pko.duedate))

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
                      {vendorData?.pkos
                        .filter((pko) => !isActive(pko.duedate))
                        .length.toString()
                        .padStart(2, "0")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* PKO Status */}
          <div className="col-12 col-md-6 col-xl-4 mb-3 mb-xl-0">
            <div className="d-flex gap-3 h-100 px-4 py-3 shadow-1">
              <div className="d-flex flex-column flex-fill border-end pe-2">
                <h6 className="text-color-typo-primary fw-600 mb-3">
                  PKO Status
                </h6>
                <span
                  className={`fw-600 px-12 py-2 text-nowrap d-flex align-items-center w-114
    ${
      isActive(pkoData?.duedate)
        ? "rounded-pill color-active-bg text-color-completed"
        : "rounded-pill bg-color-padding-label text-secondary fw-600"
    }`}
                >
                  <span
                    className={`circle me-2 ${isActive(pkoData?.duedate) ? "bg-color-completed" : ""}`}
                  ></span>
                  {isActive(pkoData?.duedate) ? "Active" : "Closed"}
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
                </div>
              </div>
              <div className="d-flex  justify-content-center align-items-center flex-column flex-fill">
                <h6 className="text-color-typo-primary fw-600 mb-40">
                  Overall Progress
                </h6>
                <div className=" d-flex align-items-center h-100">
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
          <div className="col-12 col-md-6 col-xl-4 mb-3 mb-xl-0">
            <div className="card h-100 border-0 shadow-1 px-4 py-3 d-flex flex-column">
              <div className="card-header px-0 py-0 text-color-typo-primary fw-600 border-0 bg-transparent">
                SKU Status
              </div>

              <div className="card-body pb-0 border-0 px-0 d-flex flex-column align-items-start">
                <div className="d-flex align-items-center w-100 h-100 gap-3">
                  <div className="graph w-60 h-100">
                    <div className="mt-3">
                      <Pko_Chart
                        labels={[
                          "Not Started",
                          "Draft",
                          "In Review",
                          "Approved",
                        ]}
                        data={[
                          skuData.filter((sku) => sku.status === "Not Started")
                            .length,
                          skuData.filter((sku) => sku.status === "Draft")
                            .length,
                          skuData.filter((sku) => sku.status === "Inreview")
                            .length,
                          skuData.filter((sku) => sku.status === "Approved")
                            .length,
                        ]}
                        chartName={"SKUs"}
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
                          <span className="status-dot in-review"></span>
                          <p className="fs-12 text-color-typo-primary mb-0">
                            In Review
                          </p>
                        </div>
                        {/* Dynamically display the count of "Completed" SKUs */}
                        <span className="fs-12 fw-700">
                          {
                            skuData.filter((sku) => sku.status === "Inreview")
                              .length
                          }
                        </span>
                      </li>
                      <li className="d-flex align-items-center justify-content-between mb-3">
                        <div className="d-flex align-items-center gap-2">
                          <span className="status-dot completed"></span>
                          <p className="fs-12 text-color-typo-primary mb-0">
                            Approved
                          </p>
                        </div>
                        <span className="fs-12 fw-700">
                          {
                            skuData.filter((sku) => sku.status === "Approved")
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
              PKO Project ID: {selectedPkoId || "N/A"}
            </h6>
            <div className="d-flex align-items-center ps-4 border-start border-color-labels">
              <label className="fs-14 color-typo-primary me-2 mb-0 text-nowrap">
                SKU Status
              </label>
              <select
                className="fs-14 sku-status px-12 border border-secondary text-secondary rounded-2 h-40 w-165 fw-600 form-select form-list"
                aria-label="SKU Status Filter"
                value={selectedSkuStatus}
                onChange={(e) => setSelectedSkuStatus(e.target.value)}
              >
                <option value="All">All SKUs ({skuData.length})</option>
                <option value="Not Started">Not Started</option>
                <option value="Draft">Draft</option>
                <option value="Inreview">In Review</option>
                <option value="Approved">Approved</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table Section */}

        <div className="table-container-pko-tbl mt-3 table-responsive mainScrollable-table">
          <table className="table table-bordered table-striped fs-14">
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
                  .sort((a, b) => a.sku_id.localeCompare(b.sku_id))
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
                              status === "Inreview"
                                ? "in-review-sku-status-pill text-white"
                                : status === "Approved"
                                  ? "bg-color-completed text-white"
                                  : status === "Draft"
                                    ? "bg-color-draft text-white"
                                    : "bg-color-light-border text-color-typo-secondary"
                            }`}
                          >
                            {status === "Inreview" ? "In Review" : status}
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
                    {vendorData?.pkos.filter((pko) => isActive(pko.duedate))
                      .length > 0 ? (
                      vendorData?.pkos
                        .filter((pko) => isActive(pko.duedate))
                        .map((pko) => {
                          const pkoSkus = pkoData?.skus || [];
                          return (
                            <tr key={pko.pko_id}>
                              <td>{pko.pko_id}</td>
                              <td>{pko.businessunit || "N/A"}</td>
                              <td>{pkoSkus.length || 0}</td>
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
                        })
                    ) : (
                      <tr>
                        <td colSpan="6">
                          <div
                            className="alert alert-info text-center p-4 m-0"
                            role="alert"
                          >
                            <i className="bi bi-info-circle me-2"></i>
                            There are currently no active PKOs to display.
                          </div>
                        </td>
                      </tr>
                    )}
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
                {vendorData?.pkos.filter((pko) => !isActive(pko.duedate))
                  .length > 0 ? (
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
                      {vendorData?.pkos
                        .filter((pko) => !isActive(pko.duedate))
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
                ) : (
                  // Message box when no closed PKOs exist
                  <div
                    className="alert alert-info text-center p-4 m-3"
                    role="alert"
                  >
                    <i className="bi bi-info-circle me-2"></i>
                    There are currently no closed PKOs to display.
                  </div>
                )}
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
                {["supplier_creative", "supplier_qa", "broker"]
                  .filter((contactType) => {
                    const name = vendorData?.[`${contactType}_contact_name`];
                    const email = vendorData?.[`${contactType}_contact_email`];
                    return name && email; // Only include contacts with both name and email
                  })
                  .map((contactType, index) => (
                    <tr key={index}>
                      <td>{vendorData?.supplier_name}</td>
                      <td>{vendorData?.[`${contactType}_contact_name`]}</td>
                      <td>{vendorData?.[`${contactType}_contact_email`]}</td>
                      <td>{vendorData?.[`${contactType}_contact_phone`]}</td>
                    </tr>
                  ))}
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

      <VendorCommentPanel
        dropdownData={commentDropdownData}
        initialSelectedPkoId={selectedPkoId}
        initialFilterPkoId={selectedPkoId}
      />
    </div>
  );
};

export default VendorDashboard;
