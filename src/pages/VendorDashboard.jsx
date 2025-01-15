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

  // Function to close the modal
  const closeModal = () => {
    setIsModalVisible(false); // Close the modal
  };

  useEffect(() => {
    // Retrieve the current load count from localStorage (or sessionStorage)
    const currentCount = parseInt(localStorage.getItem("loadCount")) || 0;
    setLoadCount(currentCount);

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
        setSelectedPkoId(data[cvsSupplier]?.pkos[0]?.pko_id || "");
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
        const response = await axiosInstance.get("pkos/");
        const data = response.data;
        setPkoData(data[selectedPkoId] || null);
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

    // Find the selected PKO from vendorData.pkos
    const selectedPko = vendorData.pkos.find(
      (pko) => pko.pko_id === selectedId,
    );
    if (selectedPko) {
      setPkoData(selectedPko); // Update pkoData with the selected PKO
    }
  };

  //handle forward click
  // Handle forward click for SKU
  const handleForwardClick = async (sku) => {
    try {
      console.log("Sending PUT request with:", {
        pko_id: selectedPkoId,
        status: "Draft",
      });

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

        // Navigate to SKU Page with necessary state
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

      <div className="py-14 bg-color-light-shade">
        <div className="container-fluid px-5">
          <div className="input-group w-395 h-44 border border-secondary rounded-2 fs-14">
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
                      className="bg-transparent p-0 border-0 shadow-none fw-700 text-color-draft view-all"
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
                    className="d-flex flex-column p-3 bg-color-light-gray flex-fill cursor-pointer"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#offcanvasRight"
                    aria-controls="offcanvasRight"
                    id="closed-pkos"
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
            <div className="d-flex gap-3 h-100 p-4 shadow-1">
              <div className="d-flex flex-column flex-fill border-end">
                <h6 className="text-color-typo-primary fw-600">PKO Status</h6>
                <div className="d-flex flex-column h-100 align-items-start justify-content-end">
                  <img
                    src="/assets/images/active-Indicator.svg"
                    alt="Active Indicator"
                  />
                  <div className="d-flex flex-column p-3 mt-12 bg-color-light-gray text-nowrap">
                    <span className="text-color-labels">
                      Submission Last Date
                    </span>
                    <p className="fs-24 text-color-labels fw-600 mb-0">
                      {pkoData?.duedate
                        ? new Date(pkoData.duedate).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "short",
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
            <div className="card h-100 border-0 shadow-1 py-4 d-flex flex-column px-3">
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
                          skuData.filter(
                            (sku) =>
                              skuStatuses[sku.sku_id] === "Not Started" ||
                              (!skuStatuses[sku.sku_id] &&
                                sku.status === "Not Started"),
                          ).length,
                          skuData.filter(
                            (sku) =>
                              skuStatuses[sku.sku_id] === "Draft" ||
                              (!skuStatuses[sku.sku_id] &&
                                sku.status === "Draft"),
                          ).length,
                          skuData.filter(
                            (sku) =>
                              skuStatuses[sku.sku_id] === "Completed" ||
                              (!skuStatuses[sku.sku_id] &&
                                sku.status === "Completed"),
                          ).length,
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
                              (sku) =>
                                skuStatuses[sku.sku_id] === "Not Started" ||
                                (!skuStatuses[sku.sku_id] &&
                                  sku.status === "Not Started"),
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
                              (sku) =>
                                skuStatuses[sku.sku_id] === "Draft" ||
                                (!skuStatuses[sku.sku_id] &&
                                  sku.status === "Draft"),
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
                              (sku) =>
                                skuStatuses[sku.sku_id] === "Completed" ||
                                (!skuStatuses[sku.sku_id] &&
                                  sku.status === "Completed"),
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

                <th className="h-52 align-middle">Due</th>

                <th className="h-52 align-middle">Status</th>

                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pkoData?.skus && pkoData.skus.length > 0 ? (
                pkoData.skus.map((sku) => {
                  const status =
                    skuStatuses[sku.sku_id] || sku.status || "Not Started"; // Fetch updated status
                  return (
                    <tr key={sku.sku_id}>
                      <td className="align-middle">{sku.sku_id}</td>
                      <td className="align-middle">{sku.description}</td>
                      <td className="align-middle">{sku.category || "N/A"}</td>
                      <td className="align-middle">{sku.brand}</td>
                      <td className="align-middle">{sku.upc}</td>
                      <td className="align-middle">{sku.size}</td>
                      <td className="align-middle">
                        {" "}
                        {sku.duedate
                          ? new Date(sku.duedate).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                          : "N/A"}
                      </td>
                      <td className="align-middle">
                        <span
                          className={`fw-600 text-nowrap px-12 py-2 d-inline-block rounded-pill ${
                            status === "Draft"
                              ? "bg-color-draft text-white"
                              : "bg-color-light-border text-color-typo-secondary"
                          }`}
                        >
                          {status}
                        </span>
                      </td>
                      <td className="align-middle">
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
