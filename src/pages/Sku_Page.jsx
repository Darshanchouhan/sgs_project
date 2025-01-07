import React, { useContext, useEffect, useState } from "react";
import Header from "../components/Header";
import "./../styles/style.css";
import axiosInstance from "../services/axiosInstance";
import { SkuContext } from "./SkuContext"; // Import Context
import SkuProduct_Img from "./SkuProduct_Img";
import { useLocation, useNavigate } from "react-router-dom";
import Autosave from "./AutoSave";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Offcanvas } from "bootstrap";
import { VendorContext } from "./VendorContext";

const Sku_Page = () => {
  const {
    skuData,
    setSkuData,
    skuDetails,
    setSkuDetails,
    pkoData,
    setPkoData,
  } = useContext(SkuContext); // Use Context
  const { updateSkuStatus } = useContext(VendorContext);

  const navigate = useNavigate();
  const location = useLocation();
  const [questions, setQuestions] = useState([]); // Store questions from API
  const [isSubmitting, setIsSubmitting] = useState(false); // Submission state
  const skuId = location.state?.skuId || skuData?.skuId; // Retrieve SKU ID from navigation
  const [submissionLastDate, setSubmissionLastDate] = useState("N/A");
  const pkoId = location.state?.pkoData?.pko_id || pkoData?.pko_id || "N/A";

  useEffect(() => {
    if (location.state?.skuDetails) setSkuDetails(location.state.skuDetails);
    if (location.state?.pkoData) setPkoData(location.state.pkoData);
  }, [location.state, setSkuDetails, setPkoData]);

  // useEffect(() => {
  //   if (location.state?.skuDetails) {
  //     setSkuDetails((prev) => prev || location.state.skuDetails);
  //   }
  //   if (location.state?.pkoData) {
  //     setPkoData((prev) => prev || location.state.pkoData);
  //   }
  //   if (location.state?.skuData) {
  //     setSkuData((prev) => prev || location.state.skuData);
  //   }
  // }, [location.state, setSkuDetails, setPkoData, setSkuData]);

  useEffect(() => {
    const duedate = location.state?.duedate || pkoData?.duedate || null;

    if (duedate) {
      setSubmissionLastDate(
        new Date(duedate).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
      );
    }
  }, [location.state, pkoData]);

  useEffect(() => {
    // Avoid overwriting the state on reload
    if (!skuData.components.length && !skuDetails) {
      setSkuData((prev) => prev);
      setSkuDetails((prev) => prev);
      setPkoData((prev) => prev);
    }
  }, []);

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

  console.log("pkoData in skupage:", pkoData);

  //fetch SKU Details
  useEffect(() => {
    const fetchSkuDetails = async () => {
      if (!skuId || !pkoId) {
        console.log(
          "SKU ID or PKO ID is missing. Skipping fetch.",
          skuId,
          pkoId,
        );
        console.warn(
          "SKU ID or PKO ID is missing. Skipping fetch.",
          skuId,
          pkoId,
        );
        return;
      }

      try {
        const response = await axiosInstance.get(
          `/skus/${skuId}/?pko_id=${pkoId}`,
        );
        const data = response.data;

        console.log("Fetched SKU Details:", data);

        // Update SKU and PKO details
        setSkuDetails(data);
        setSkuData((prev) => ({
          ...prev,
          dimensionsAndWeights: data.primary_packaging_details || {},
          components: data.components || [],
          description: data.description || "",
        }));
      } catch (error) {
        console.error("Error fetching SKU details:", error);
      }
    };

    fetchSkuDetails();
  }, [skuId, pkoId, setSkuDetails, setSkuData]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axiosInstance.get("questionnaire/");
        const data = response.data;
        setQuestions(data.primary_packaging_questions || []);
      } catch (error) {
        console.error("Error fetching questionnaire data:", error);
      }
    };

    fetchQuestions();
  }, []);

  const saveSkuData = async () => {
    if (!skuId || !pkoId) {
      console.error("SKU ID or PKO ID is missing");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        pko_id: pkoId,
        sku_id: skuId,
        description: skuDetails?.description || "",
        primary_packaging_details: { ...skuData.dimensionsAndWeights },
        components: skuData.components.map((comp, index) => ({
          id: comp.id || null,
          sku: skuId,
          name: comp.name || `Component_${index + 1}`,
          form_status: comp.formStatus || "Pending",
          responses: comp.responses || {},
        })),
      };

      console.log("Submitting SKU Data:", payload);

      await axiosInstance.put(`/skus/${skuId}/`, payload, {
        headers: { "Content-Type": "application/json" },
      });

      updateSkuStatus(skuId, "Draft");

      alert("SKU data saved successfully in Draft mode!");
      navigate("/vendordashboard");
    } catch (error) {
      console.error("Error saving SKU data:", error);
      alert("Failed to save SKU data. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Autosave function (No alerts, no user navigation)
  const autosaveSkuData = async () => {
    if (!skuId) {
      console.error("SKU ID is missing");
      return;
    }

    try {
      const payload = {
        sku_id: skuId,
        description: skuDetails?.description || "",
        primary_packaging_details: { ...skuData.dimensionsAndWeights },
        components: skuData.components.map((comp, index) => ({
          id: comp.id || null,
          name: comp.name || `Component_${index + 1}`,
          form_status: comp.formStatus || "Pending",
          responses: comp.responses || {},
        })),
      };

      await axiosInstance.put(`/skus/${skuId}/`, payload, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("Autosave successful at", new Date().toLocaleTimeString());
    } catch (error) {
      console.error("Autosave failed:", error);
    }
  };

  // Handle Input Change (Primary Packaging Details)
  const handleInputChange = (field, value) => {
    setSkuData((prev) => ({
      ...prev,
      dimensionsAndWeights: {
        ...prev.dimensionsAndWeights,
        [field]: value,
      },
    }));
  };

  // Define the back action
  const handleBackClick = () => {
    navigate("/vendordashboard"); // Navigate to Vendor Dashboard
  };

  // Handle adding a component
  const handleAddComponent = async () => {
    if (skuData.newComponent.trim()) {
      try {
        const payload = {
          pko_id: pkoId,
          name: skuData.newComponent,
          form_status: "Pending",
        };

        if (!skuId) {
          console.error("SKU ID is missing. Cannot add a component.");
          return;
        }

        const response = await axiosInstance.post(
          `/sku/${skuId}/components/`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        setSkuData((prev) => ({
          ...prev,
          skuId, // Ensure skuId is set in the context
          components: [
            ...prev.components,
            {
              id: response.data?.id || null,
              name: skuData.newComponent,
              formStatus: response.data?.form_status || "",
            },
          ],
          newComponent: "",
        }));

        console.log("Component added successfully:", response.data);
        alert("Component added successfully!");
      } catch (error) {
        console.error("Error adding component:", error);
        alert("Failed to add component. Please try again.");
      }
    } else {
      alert("Component name cannot be empty!");
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

  // Handle forward action for a component
  // const handleForwardClick = async (index) => {
  //   if (!skuId || !pkoId) {
  //     console.error("SKU ID or PKO ID is missing. Cannot fetch component details.");
  //     return;
  //   }

  //   try {
  //     // Fetch all components for the SKU
  //     const response = await axiosInstance.get(`/sku/${skuId}/components/?pko_id=${pkoId}`, {
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });

  //     if (response.status === 200) {
  //       const components = response.data; // Expecting an array of component objects

  //       console.log("Fetched Components:", components);

  //       const selectedComponent = components[index];
  //       if (selectedComponent) {
  //         // Pass skuId along with other state
  //         navigate("/component", {
  //           state: {
  //             skuId, // Explicitly passing skuId
  //             componentId: selectedComponent.id,
  //             componentName: selectedComponent.name,
  //             formStatus: selectedComponent.form_status,
  //             responses: selectedComponent.responses,
  //             pkoId: pkoData?.pko_id || "N/A",
  //             description: skuDetails?.description || "Description Not Available",
  //           },
  //         });
  //       } else {
  //         console.warn("Selected component not found in API response.");
  //       }
  //     } else {
  //       console.error("Failed to fetch components. Status:", response.status);
  //       alert("Failed to fetch component details. Please try again.");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching component details:", error);
  //     alert("An error occurred while fetching component details.");
  //   }
  // };

  const handleForwardClick = async (index) => {
    if (!skuId || !pkoId) {
      console.error(
        "SKU ID or PKO ID is missing. Cannot fetch component details.",
      );
      return;
    }

    try {
      // Fetch specific component details including responses
      const response = await axiosInstance.get(
        `/sku/${skuId}/components/?pko_id=${pkoId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (response.status === 200) {
        const components = response.data; // Expecting an array of component objects

        console.log("Fetched Components:", components);

        const selectedComponent = components[index];
        if (selectedComponent) {
          // Fetch component details for responses
          const componentResponse = await axiosInstance.get(
            `/sku/${skuId}/components/${selectedComponent.id}?pko_id=${pkoId}`,
            {
              headers: {
                "Content-Type": "application/json",
              },
            },
          );

          const componentData = componentResponse.data;
          console.log(
            "Fetched Component Details with Responses:",
            componentData,
          );

          // Navigate to PkgDataForm with all necessary data
          navigate("/component", {
            state: {
              skuId, // Pass SKU ID
              componentId: selectedComponent.id,
              componentName: selectedComponent.name,
              formStatus: selectedComponent.form_status,
              responses: componentData.responses || {}, // Pass fetched responses
              pkoId: pkoData?.pko_id || "N/A",
              description:
                skuDetails?.description || "Description Not Available",
              skuDetails,
              pkoData,
            },
          });
        } else {
          console.warn("Selected component not found in API response.");
        }
      } else {
        console.error("Failed to fetch components. Status:", response.status);
        alert("Failed to fetch component details. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching component details:", error);
      alert("An error occurred while fetching component details.");
    }
  };

  const handleAddProductImageClick = () => {
    // Show Offcanvas manually via Bootstrap API
    const offcanvasElement = document.getElementById("offcanvasRight-image");
    if (offcanvasElement) {
      const offcanvas = new Offcanvas(offcanvasElement);
      offcanvas.show();
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
              onChange={(e) =>
                handleInputChange(question.question_id, e.target.value)
              }
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
                onChange={(e) =>
                  handleInputChange(question.question_id, e.target.value)
                }
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
                    e.target.value,
                  )
                }
              >
                <option value="">unit</option>
                {/* Filter out 'unit' explicitly */}
                {question.dropdown_options
                  ?.filter(
                    (option) =>
                      option.trim().toLowerCase() !== "unit" &&
                      option.trim() !== "",
                  )
                  .map((option, index) => (
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
      <Header></Header>
      {/* Breadcrumb (Directly integrated here) */}
      <div className="py-10 bg-color-light-shade">
        <div className="container-fluid px-5">
          <div className="d-flex align-items-center justify-content-between">
            {/* Back Button and Component Name */}
            <div className="d-flex align-items-center">
              <button
                type="button"
                className="btn p-0 border-none bg-transparent me-4"
                onClick={handleBackClick}
              >
                <img src="/assets/images/back-action-icon.svg" alt="icon" />
              </button>
              <div className="d-flex flex-column">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item">
                      <a
                        href="#"
                        className="text-decoration-none text-secondary fw-600 fs-14"
                      >
                        PKO Project ID: {pkoId}
                      </a>
                    </li>
                  </ol>
                </nav>
                <h6 className="fw-600 text-color-typo-primary mb-0 mt-2">
                  {skuDetails?.description || "Description Not Available"}
                </h6>
              </div>
            </div>

            {/* Submission Last Date or Save Button */}
            <div className="d-flex align-items-center">
              <p className="text-color-black fst-italic mb-0 opacity-70">
                Submission Last Date: {submissionLastDate}
              </p>

              <button className="save-button" onClick={saveSkuData}>
                Save & Validate
              </button>
            </div>
          </div>
        </div>
      </div>
      <Autosave saveFunction={autosaveSkuData} dependencies={[skuData]} />
      <div className="container-fluid px-5 d-flex flex-column container-height">
        {/* Header Section */}
        <div className="d-flex align-items-center justify-content-between py-3">
          <div className="d-flex align-items-center">
            <h6 className="fs-18 text-color-black mb-0">
              PKO Project ID: {pkoId}
            </h6>
            <img
              src="/assets/images/active-Indicator.svg"
              alt="Active Indicator"
              className="ms-12"
            />
          </div>
          {/* <p className="text-color-black fst-italic mb-0 opacity-70">
            Submission Last Date: {pkoData?.submissionlastdate || "N/A"}
          </p> */}
        </div>

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
              <div className="d-flex align-items-center mt-4 col-3 justify-content-end">
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
                      src="/assets/images/BoxImg.png"
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
                            <td>{component.form_status}</td>
                            <td>
                              <span>
                                {0}{" "}
                                <img
                                  src="/assets/images/image-pic.png"
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
                                src="/assets/images/forward-arrow-img.png"
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
                            src="/assets/images/plus-add_blue.png"
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
                            src="/assets/images/clear-cross-cancel.png"
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
