import React, { useContext, useEffect, useState } from "react";
import Navbar from "./Navbar";
import Breadcrumb from "./Breadcrumb";
import "./style.css";
import { SkuContext } from "./SkuContext"; // Import Context
import SkuProduct_Img from "./SkuProduct_Img";
import addActiveIndicator from "./assets/images/active-Indicator.svg";
import addPackagePlusIcon from "./assets/images/package-plus-icon.svg";
import boxImage from "./assets/images/BoxImg.png"; // Importing the box image
import crossIcon from "./assets/images/clear-cross-cancel.png"; // Import cross icon
import plusIcon from "./assets/images/plus-add_blue.png";
import forwardArrowIcon from "./assets/images/forward-arrow-img.png"; // Import forward arrow image
import imageIcon from "./assets/images/image-pic.png";
import { useLocation, useNavigate } from "react-router-dom";
import Autosave from "./AutoSave";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Offcanvas } from "bootstrap";

const Sku_Page = () => {
  const {
    skuData,
    setSkuData,
    skuDetails,
    setSkuDetails,
    pkoData,
    setPkoData,
  } = useContext(SkuContext); // Use Context
  const navigate = useNavigate();
  const location = useLocation();
  const [questions, setQuestions] = useState([]); // Store questions from API

  // Retrieve pkoData and skuDetails from location.state or fallback to context
  useEffect(() => {
    if (location.state) {
      if (location.state.skuDetails) {
        setSkuDetails(location.state.skuDetails);
      }
      if (location.state.pkoData) {
        setPkoData(location.state.pkoData);
      }
    }
  }, [location.state, setSkuDetails, setPkoData]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(
          "https://demo.gramener.com/api/questionnaire/"
        );
        if (!response.ok) throw new Error("Failed to fetch questions");
        const data = await response.json();
        setQuestions(data.primary_packaging_questions || []);
      } catch (error) {
        console.error("Error fetching questionnaire data:", error);
      }
    };

    fetchQuestions();
  }, []);

  const saveSkuData = async () => {
    // Save the SKU data to the backend
    console.log("Autosaving SKU Data:", skuData);
    await fetch("https://demo.gramener.com/api/sku/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(skuData),
    });
  };

  // Define the back action
  const handleBackClick = () => {
    navigate("/"); // Navigate to Vendor Dashboard
  };

  const handleAddProductImageClick = () => {
    // Show Offcanvas manually via Bootstrap API
    const offcanvasElement = document.getElementById("offcanvasRight-image");
    if (offcanvasElement) {
      const offcanvas = new Offcanvas(offcanvasElement);
      offcanvas.show();
    }
  };

  // Handle input change for dimensions and weights
  const handleInputChange = (field, value) => {
    setSkuData((prev) => ({
      ...prev,
      dimensionsAndWeights: {
        ...prev.dimensionsAndWeights,
        [field]: value,
      },
    }));
  };

  // Handle adding a component
  const handleAddComponent = () => {
    if (skuData.newComponent.trim()) {
      setSkuData((prev) => ({
        ...prev,
        components: [
          ...prev.components,
          { name: prev.newComponent, formStatus: "Pending" },
        ],
        newComponent: "",
        showInput: false,
        hasAddedFirstComponent: true,
        isCancelDisabled: false,
      }));
    }
  };

  // Handle cancel action
  const handleCancel = () => {
    setSkuData((prev) => ({
      ...prev,
      newComponent: "",
      showInput: false,
    }));
  };

  // Navigate to PkgDataForm
  const handleForwardClick = (index) => {
    const selectedComponent = skuData.components[index]; // Get the selected component
    if (selectedComponent) {
      navigate("/pkgdataform", {
        state: { componentName: selectedComponent.name },
      });
    }
  };
  const dynamicFields = [
    { label: "Description", value: skuDetails?.description || "N/A" },
    { label: "Subcategory", value: pkoData?.subcategory || "N/A" },
    { label: "SKU ID", value: skuDetails?.sku_id || "N/A" },
    { label: "Brand", value: skuDetails?.brand || "N/A" },
    { label: "UPC#", value: skuDetails?.upc || "N/A" },
    { label: "Segment", value: pkoData?.segment || "N/A" },
    { label: "Business Unit", value: pkoData?.business_unit || "N/A" },
    { label: "Size", value: skuDetails?.size || "N/A" },
    { label: "Category", value: pkoData?.category || "N/A" },
  ];

  const renderField = (question) => {
    const handleChange = (e) =>
      handleInputChange(question.question_id, e.target.value);

    switch (question.question_type) {
      case "Varchar":
      case "Integer":
        return (
          <div className="d-flex align-items-center gap-2">
            <input
              type={question.question_type === "Integer" ? "number" : "text"}
              className="form-control fs-14 px-12 border border-color-typo-secondary rounded-2 h-44"
              placeholder={question.placeholder || "Enter Value"}
              value={skuData.dimensionsAndWeights[question.question_id] || ""}
              onChange={handleChange}
            />
            {question.instructions && (
              <InfoOutlinedIcon
                className="info-icon"
                titleAccess={question.instructions}
              />
            )}
          </div>
        );

      case "Float + Dropdown":
        return (
          <div className="d-flex align-items-center gap-2">
            <div className="d-flex align-items-center border border-color-typo-secondary rounded-2">
              <input
                type="number"
                step="any"
                className="form-control border-0 rounded-0 px-2"
                placeholder={question.placeholder || "Enter Value"}
                style={{ flex: 2 }}
                value={skuData.dimensionsAndWeights[question.question_id] || ""}
                onChange={handleChange}
              />
              <select
                className="form-select background-position border-0 bg-color-light-shade text-color-typo-primary px-2"
                style={{ flex: 1 }}
                value={
                  skuData.dimensionsAndWeights[
                    `${question.question_id}_unit`
                  ] || ""
                }
                onChange={(e) =>
                  handleInputChange(
                    `${question.question_id}_unit`,
                    e.target.value
                  )
                }
              >
                <option value="">unit</option>
                {question.dropdown_options.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            {question.instructions && (
              <InfoOutlinedIcon
                className="info-icon"
                titleAccess={question.instructions}
              />
            )}
          </div>
        );

      case "Dropdown":
        return (
          <div className="d-flex align-items-center gap-2">
            <select
              className="form-select border border-color-typo-secondary rounded-2 h-44 px-12 fs-14"
              value={skuData.dimensionsAndWeights[question.question_id] || ""}
              onChange={handleChange}
            >
              <option value="">
                {question.placeholder || "Select an option"}
              </option>
              {question.dropdown_options.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {question.instructions && (
              <InfoOutlinedIcon
                className="info-icon"
                titleAccess={question.instructions}
              />
            )}
          </div>
        );

      default:
        return null;
    }
  };
  const renderFollowUpQuestions = (followUps) => {
    return followUps.map((followUp) => (
      <div
        key={followUp.question_id}
        className={`col-12 ${
          followUp.question_type === "Float + Dropdown" ? "col-md-6" : "col-12"
        } mb-3`}
      >
        <label className="fs-14 text-color-typo-primary mb-2 d-block">
          {followUp.question_text}
        </label>
        {renderField(followUp)}
      </div>
    ));
  };

  return (
    <>
      <Navbar />
      <Breadcrumb onBackClick={handleBackClick} />
      <Autosave saveFunction={saveSkuData} dependencies={[skuData]} />
      <div className="container-fluid px-5 d-flex flex-column container-height">
        {/* Header Section */}
        <div className="d-flex align-items-center justify-content-between py-3">
          <div className="d-flex align-items-center">
            <h6 className="fs-18 text-color-black mb-0">
              PKO Project ID: {pkoData?.pko_id || "N/A"}
            </h6>
            <img
              src={addActiveIndicator}
              alt="Active Indicator"
              className="ms-12"
            />
          </div>
          <p className="text-color-black fst-italic mb-0 opacity-70">
            Submission Last Date: {pkoData?.submissionlastdate || "N/A"}
          </p>
        </div>

        {/* SKU Details
         <div className="px-28 py-20 border border-color-disabled-lite bg-color-light-gray">
          <div className="row">
            <div className="col-12 col-md-10">
              <div className="d-flex align-items-start gap-70">
              {dynamicFields.map((field, index) => (
                  <div key={index} className="d-flex flex-column mb-30">
                    <p className="text-color-labels fs-14 mb-1">{field.label}</p>
                    <h6 className="fs-16 fw-600 text-color-typo-primary">{field.value}</h6>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div> */}
        {/* SKU Details */}
        <div className="px-28 py-20 border border-color-disabled-lite bg-color-light-gray">
          <div className="row">
            <div className="col-12 d-flex align-items-start">
              <div className=" sku-details-box col-9">
                {dynamicFields.map((field, index) => (
                  <div key={index} className="d-flex flex-column mb-30">
                    <p className="sku-details-label">{field.label}</p>
                    <h6
                      className={`sku-details-value ${
                        field.label === "Description" ? "long-description" : ""
                      }`}
                    >
                      {field.value}
                    </h6>
                  </div>
                ))}
                </div>
                {/* Add Product Images Button */}
                <div className="d-flex align-items-center col-3 justify-content-end">
                  <button
                    className="btn bg-transparent shadow-none fs-14 d-flex py-0  fw-600 text-secondary px-0"
                    onClick={handleAddProductImageClick}
                  >
                    + Add product images
                  </button>
              </div>
            </div>
          </div>
        </div>
        <SkuProduct_Img />

        {/* Details Section */}
        <div className="mt-4 h-100">
          <div className="row h-100">
            {/* Primary Packaging Details */}
            <div className="col-12 col-md-5">
              <div
                className="card bg-color-light-gray border border-color-light-border rounded-3 p-4 h-100"
                style={{ maxHeight: "400px", overflowY: "auto" }}
              >
                <div className="d-flex align-items-center justify-content-between">
                  <h6 className="fs-22 fw-600 text-color-black">
                    Primary Packaging Details
                  </h6>
                  {/* <img src={addPackagePlusIcon} alt="Package Plus Icon" /> */}
                </div>
                <p className="fs-14 text-color-labels mb-30">
                  Provide all relevant primary packaging details for the SKU
                </p>

                <div className="row">
                  {questions.map((question) => (
                    <React.Fragment key={question.question_id}>
                      <div
                        className={`col-12 ${
                          question.question_type === "Float + Dropdown" ||
                          question.question_type === "Dropdown"
                            ? "col-md-6"
                            : "col-12"
                        } mb-3`}
                      >
                        <label className="fs-14 text-color-typo-primary mb-2 d-block">
                          {question.question_text}
                        </label>
                        {renderField(question)}
                      </div>
                      {renderFollowUpQuestions(question.follow_up_questions)}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>

            {/* Components Table Section */}
            <div className="col-12 col-md-7">
              <div className="card bg-color-light-gray border border-color-light-border rounded-3 p-4 h-100">
                <div className="d-flex justify-content-between align-items-center">
                  <h6 className="fs-22 fw-600 text-color-black mb-3">
                    SKU Components
                  </h6>
                  {skuData.hasAddedFirstComponent && (
                    <button
                      className="btn btn-outline-primary"
                      onClick={() =>
                        setSkuData((prev) => ({ ...prev, showInput: true }))
                      }
                    >
                      + Add SKU Components
                    </button>
                  )}
                </div>

                {!skuData.showTable ? (
                  <div className="text-center">
                    <img
                      src={boxImage}
                      alt="Box"
                      className="mb-3"
                      style={{ width: "80px" }}
                    />
                    <p className="fs-14 text-color-labels mb-3">
                      Add components for this product to enter packaging-related
                      information. You can add multiple components.
                    </p>
                    <button
                      className="btn btn-outline-primary"
                      onClick={() =>
                        setSkuData((prev) => ({ ...prev, showTable: true }))
                      }
                    >
                      + Add SKU Components
                    </button>
                  </div>
                ) : (
                  <div>
                    <table className="table fs-14 w-100 ">
                      <thead>
                        <tr>
                          <th scope="col">Component Name</th>
                          <th scope="col">Form Status</th>
                          <th scope="col">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {skuData.components.map((component, index) => (
                          <tr key={index}>
                            <td>{component.name}</td>
                            <td>{component.formStatus}</td>
                            <td>
                              <span>
                                {index}{" "}
                                <img
                                  src={imageIcon}
                                  alt="Imag"
                                  style={{
                                    width: "16px",
                                    marginRight: "8px",
                                    cursor: "pointer",
                                  }}
                                  onClick={handleAddProductImageClick}
                                />
                              </span>
                              <img
                                src={forwardArrowIcon}
                                alt="Forward"
                                className="ms-2"
                                style={{
                                  cursor: "pointer",
                                  width: "24px",
                                  height: "24px",
                                }}
                                onClick={() => handleForwardClick(index)}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {skuData.showInput && (
                      <div className="d-flex align-items-center gap-3">
                        <input
                          type="text"
                          className="form-control border border-color-typo-secondary rounded-2 h-44 w-280"
                          placeholder="Enter Component Name"
                          value={skuData.newComponent}
                          onChange={(e) =>
                            setSkuData((prev) => ({
                              ...prev,
                              newComponent: e.target.value,
                            }))
                          }
                        />
                        <div
                          className="d-flex align-items-center cursor-pointer text-color-primary"
                          onClick={handleAddComponent}
                        >
                          <img
                            src={plusIcon}
                            alt="Add"
                            className="me-2"
                            style={{ width: "16px", height: "16px" }}
                          />
                          <span>Add Component</span>
                        </div>
                        <div
                          className={`d-flex align-items-center cursor-pointer text-color-primary ${
                            skuData.isCancelDisabled
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                          onClick={
                            !skuData.isCancelDisabled ? handleCancel : null
                          }
                        >
                          <img
                            src={crossIcon}
                            alt="Cancel"
                            className="me-2"
                            style={{ width: "16px", height: "16px" }}
                          />
                          <span>Cancel</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sku_Page;
