import React, { useContext, useEffect, useState } from "react";
import Header from "../components/Header";
import "./../styles/style.css";
import axiosInstance from "../services/axiosInstance";
import { SkuContext } from "./SkuContext"; // Import Context
import SkuProduct_Img from "./SkuProduct_Img";
import { useLocation, useNavigate } from "react-router-dom";
import Autosave from "./AutoSave";
import Tooltip from "./Tooltip"; // Import Tooltip component
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Offcanvas } from "bootstrap";
import { VendorContext } from "./VendorContext";
import Dimen_ImageOverlay from "./Dimen_ImageOverlay"; // Import Overlay Component

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
  const [productImageCount, setProductImageCount] = useState(0); // Track product image count
  const [imagesFromDB, setImagesFromDB] = useState([]); // Images fetched from database
  const [imagesToUpload, setImagesToUpload] = useState([]); // Images to upload
  const [loadingImages, setLoadingImages] = useState(false);
  const [dimensionUnit, setDimensionUnit] = useState("Unit"); // Default unit for dimensions
  const [weightUnit, setWeightUnit] = useState("Unit"); // Default unit for weights
  const [mandatoryProgress, setMandatoryProgress] = useState(0);
  const [componentProgressAverage, setComponentProgressAverage] = useState(0); // Average progress
  const [isOverlayVisible, setOverlayVisible] = useState(false);
  const [activeTooltipId, setActiveTooltipId] = useState(null); // State to track the active tooltip ID

  const handleInstructionClick = () => {
    setOverlayVisible(true); // Show the overlay
  };

  const handleOverlayClose = () => {
    setOverlayVisible(false); // Hide the overlay
  };

  useEffect(() => {
    console.log("isOverlayVisible:", isOverlayVisible); // Debug log for state changes
  }, [isOverlayVisible]);

  const handleProductImageCountUpdate = (count) => {
    setProductImageCount(count);
  };

  const handleValidateAndSubmit = () => {
    alert(
      "Please ensure at least 1 component is added, and all mandatory questions in component forms are answered before submission.",
    );
  };

  const handleAddProductImageClick = async () => {
    const offcanvasElement = document.getElementById("offcanvasRight-image");
    if (offcanvasElement) {
      try {
        // console.log("Fetching images for SKU ID:", skuId, "and PKO ID:", pkoId);
        setLoadingImages(true);

        const response = await axiosInstance.get(
          `skus/${skuId}/images/?pko_id=${pkoId}`,
        );

        if (response.data && response.data.images) {
          setImagesFromDB(response.data.images);
          console.log("Images fetched from DB:", response.data.images);
        } else {
          console.warn("No images found in the database for this SKU.");
          setImagesFromDB([]);
        }
      } catch (error) {
        console.error("Error fetching images:", error);
      } finally {
        setLoadingImages(false);
        const offcanvas = new Offcanvas(offcanvasElement);
        offcanvas.show();
      }
    }
  };

  const refreshAddProductImage = async () => {
    try {
      // console.log("Fetching images for SKU ID:", skuId, "and PKO ID:", pkoId);

      const response = await axiosInstance.get(
        `skus/${skuId}/images/?pko_id=${pkoId}`,
      );

      if (response.data && response.data.images) {
        setImagesFromDB(response.data.images);
        console.log("Images fetched from DB:", response.data.images);
      } else {
        // console.warn("No images found in the database for this SKU.");
        setImagesFromDB([]);
      }
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  // const handleUploadImages = async () => {
  //   // if (imagesToUpload.length > 0 && skuId && pkoId) {
  //     try {
  //       const formData = new FormData();
  //       imagesToUpload.forEach((image) => {
  //         formData.append("images", image);
  //       });
  //       formData.append("pko_id", pkoId);

  //       await axiosInstance.post(
  //         `skus/${skuId}/upload-images/`,
  //         formData,
  //         { headers: { "Content-Type": "multipart/form-data" } },
  //       );
  //       handleAddProductImageClick();
  //       alert("Images uploaded successfully!");
  //     } catch (error) {
  //       console.error("Error uploading images:", error);
  //       alert("Failed to upload images. Please try again.");
  //     }
  // // }
  // };

  useEffect(() => {
    if (location.state?.skuDetails) setSkuDetails(location.state.skuDetails);
    if (location.state?.pkoData) setPkoData(location.state.pkoData);
  }, [location.state, setSkuDetails, setPkoData]);

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
    const totalMandatory = questions.filter((q) => q.mandatory).length;

    const answeredMandatory = questions.filter(
      (q) =>
        q.mandatory &&
        skuData.dimensionsAndWeights[q.question_id] !== undefined &&
        skuData.dimensionsAndWeights[q.question_id] !== "",
    ).length;

    // Calculate progress as 10% of answered mandatory questions
    const progress =
      totalMandatory > 0
        ? (answeredMandatory / totalMandatory) * 100 // 10% of answered mandatory
        : 0;

    setMandatoryProgress(progress);
  }, [questions, skuData.dimensionsAndWeights]);

  useEffect(() => {
    // Check if no components exist and reset the state to show the box image
    if (skuData.components.length === 0) {
      setSkuData((prev) => ({
        ...prev,
        showTable: false, // Do not show the table initially
        showInput: false, // Hide the input field
      }));
    }
  }, [skuData.components]);

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

  // console.log("pkoData in skupage:", pkoData);

  //fetch SKU Details
  useEffect(() => {
    const fetchSkuDetails = async () => {
      if (!skuId || !pkoId) {
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

        // console.log("Fetched SKU Details:", data);

        // Update SKU and PKO details
        setSkuDetails(data);
        setSkuData((prev) => ({
          ...prev,
          dimensionsAndWeights: data.primary_packaging_details || {},
          components: data.components || [],
          description: data.description || "",
        }));
        // Set shared state for units
        const { height_unit, width_unit, depth_unit, netWeight_unit } =
          data.primary_packaging_details || {};
        if (height_unit || width_unit || depth_unit) {
          setDimensionUnit(height_unit || width_unit || depth_unit || "Unit");
        }
        if (netWeight_unit) {
          setWeightUnit(netWeight_unit);
        }
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

  // Match dependent question visibility based on parent's answer and field dependency
  const isAnswerMatch = (fieldDependency, parentAnswer) => {
    if (!fieldDependency) return true; // No dependency, always visible

    const normalizedParentAnswer = parentAnswer?.trim().toLowerCase() || "";
    const conditions = fieldDependency
      .split(/OR/i)
      .map((dep) => dep.trim().toLowerCase());

    return conditions.includes(normalizedParentAnswer);
  };

  useEffect(() => {
    const fetchComponentDetails = async () => {
      if (!skuId || !pkoId) {
        console.warn("SKU ID or PKO ID is missing. Skipping fetch.");
        return;
      }

      try {
        const response = await axiosInstance.get(
          `/sku/${skuId}/components/?pko_id=${pkoId}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        if (response.status === 200) {
          const components = response.data; // Array of components

          // Extract `component_progress` values
          const progressValues =
            components.length > 0
              ? components.map((component) => component.component_progress || 0)
              : 0;

          // Calculate the average progress
          const averageProgress =
            progressValues != 0
              ? progressValues.reduce((sum, progress) => sum + progress, 0) /
                progressValues.length
              : 0;

          // Update the state with the average
          setComponentProgressAverage(averageProgress);

          console.log("Average Component Progress:", averageProgress);
        } else {
          console.error(
            "Failed to fetch component details. Status:",
            response.status,
          );
        }
      } catch (error) {
        console.error("Error fetching component details:", error);
      }
    };

    fetchComponentDetails();
  }, [skuId, pkoId]);

  //Save the response
  const saveSkuData = async () => {
    if (!skuId || !pkoId) {
      console.error("SKU ID or PKO ID is missing");
      return;
    }
    const combinedProgress = Math.round(
      (Math.round(mandatoryProgress * 10) +
        parseFloat((componentProgressAverage * 90).toFixed(2))) /
        100,
    );

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
        sku_progress: combinedProgress,
      };

      // console.log("Submitting SKU Data:", payload);

      await axiosInstance.put(`/skus/${skuId}/`, payload, {
        headers: { "Content-Type": "application/json" },
      });
      alert("SKU data saved successfully in Draft mode!");

      updateSkuStatus(skuId, "Draft");
      // Upload Images after saving SKU data
      // await handleUploadImages();

      // navigate("/vendordashboard");
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
    // Validate the newComponent input
    if (!skuData.newComponent.trim()) {
      alert("Component name cannot be empty!");
      return; // Exit early without modifying the state
    }

    try {
      const payload = {
        pko_id: pkoId,
        name: skuData.newComponent,
        form_status: "Pending",
      };

      if (!skuId) {
        console.error("SKU ID is missing. Cannot add a component.");
        return; // Exit early without modifying the state
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

      // Update the components list in the state
      setSkuData((prev) => ({
        ...prev,
        components: [
          ...prev.components,
          {
            id: response.data?.id || null,
            name: skuData.newComponent,
            formStatus: response.data?.form_status || "",
          },
        ],
        newComponent: "", // Clear the input field
        showInput: false, // Hide input field after adding the component
        isCancelDisabled: false, // Enable the cancel button for subsequent adds
      }));

      alert("Component added successfully!");
    } catch (error) {
      console.error("Error adding component:", error);
      alert("Failed to add component. Please try again.");
    }
  };

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
    const handleChange = (e) => {
      let value = e.target.value.trim();

      if (question.question_type === "Integer") {
        if (/^\d*$/.test(value)) {
          handleInputChange(question.question_id, value);
        }
      } else if (question.question_type === "Float + Dropdown") {
        if (/^\d*\.?\d*$/.test(value)) {
          handleInputChange(question.question_id, value);
        }
      } else {
        handleInputChange(question.question_id, value);
      }
    };

    const handleKeyDown = (e) => {
      const allowedKeys = [
        "Backspace",
        "ArrowLeft",
        "ArrowRight",
        "Delete",
        "Tab",
      ];
      if (
        e.key === "-" ||
        (!allowedKeys.includes(e.key) && !/^\d$/.test(e.key))
      ) {
        e.preventDefault();
      }
    };

    // Check if the question is related to height, width, or depth
    const showOverlayForDimension = /height|width|depth/i.test(
      question.question_text,
    );

    switch (question.question_type) {
      case "Varchar":
        return (
          <div className="d-flex align-items-center gap-2">
            <input
              type="text" // Allow any text input
              className="form-control fs-14 px-12 border border-color-typo-secondary rounded-2 h-44"
              placeholder={question.placeholder || "Enter Value"}
              value={skuData.dimensionsAndWeights[question.question_id] || ""}
              onChange={(e) =>
                handleInputChange(question.question_id, e.target.value)
              }
            />
            {question.instructions && (
              <Tooltip
                id={question.question_id}
                instructions={question.instructions}
                activeTooltipId={activeTooltipId}
                setActiveTooltipId={setActiveTooltipId}
              />
            )}
          </div>
        );
      case "Integer":
        return (
          <div className="d-flex align-items-center gap-2">
            <input
              type="text" // Keep text to control input handling
              className="form-control fs-14 px-12 border border-color-typo-secondary rounded-2 h-44"
              placeholder={question.placeholder || "Enter Value"}
              value={skuData.dimensionsAndWeights[question.question_id] || ""}
              // onChange={(e) => {
              //   const value = e.target.value;
              //   // Validate input to allow only digits
              //   if (/^\d*$/.test(value)) {
              //     handleChange(e); // Update state only if valid
              //   }
              // }}
              onChange={handleChange}
              onKeyDown={handleKeyDown} // Restrict invalid key presses
            />
            {question.instructions && (
              <Tooltip
                id={question.question_id}
                instructions={question.instructions}
                activeTooltipId={activeTooltipId}
                setActiveTooltipId={setActiveTooltipId}
              />
            )}
          </div>
        );

      case "Float + Dropdown": {
        const isDimension = /height|width|depth/i.test(question.question_text); // Check for dimension-related questions
        const isWeight = /weight/i.test(question.question_text); // Check for weight-related questions

        return (
          <div className="d-flex align-items-center gap-2">
            <div className="d-flex align-items-center border border-color-typo-secondary rounded-2">
              {/* Input Field */}
              <input
                type="number"
                step="any"
                className="form-control border-0 rounded-2 px-2"
                placeholder={question.placeholder || "Enter Value"}
                style={{ flex: 2 }}
                value={skuData.dimensionsAndWeights[question.question_id] || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  // Allow only numbers, decimal points, and empty input
                  if (/^\d*\.?\d*$/.test(value)) {
                    handleInputChange(question.question_id, value);
                  }
                }}
                onKeyDown={(e) => {
                  // Allow digits, one dot, and navigation keys
                  if (
                    !/^\d$/.test(e.key) && // Allow digits
                    e.key !== "." && // Allow one dot
                    e.key !== "Backspace" &&
                    e.key !== "Delete" &&
                    e.key !== "ArrowLeft" &&
                    e.key !== "ArrowRight"
                  ) {
                    e.preventDefault();
                  }
                  // Prevent more than one dot
                  if (e.key === "." && e.target.value.includes(".")) {
                    e.preventDefault();
                  }
                }}
              />

              {/* Unit Dropdown */}
              <select
                className="form-select background-position border-0 bg-color-light-shade text-color-typo-primary px-12 w-72 fw-400"
                value={
                  isDimension ? dimensionUnit : isWeight ? weightUnit : "Unit"
                } // Use shared state
                onChange={(e) => {
                  const newUnit = e.target.value;

                  if (isDimension) {
                    setDimensionUnit(newUnit); // Update dimension unit
                    // Update all dimension-related questions
                    setSkuData((prev) => ({
                      ...prev,
                      dimensionsAndWeights: {
                        ...prev.dimensionsAndWeights,
                        height_unit: newUnit,
                        width_unit: newUnit,
                        depth_unit: newUnit,
                      },
                    }));
                  } else if (isWeight) {
                    setWeightUnit(newUnit); // Update weight unit
                    // Update all weight-related questions
                    setSkuData((prev) => ({
                      ...prev,
                      dimensionsAndWeights: {
                        ...prev.dimensionsAndWeights,
                        netWeight_unit: newUnit,
                        tareWeight_unit: newUnit,
                        grossWeight_unit: newUnit,
                      },
                    }));
                  }
                  // Update the specific question's unit
                  handleInputChange(`${question.question_id}_unit`, newUnit);
                }}
              >
                <option value="Unit">Unit</option>
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
            {/* Instruction/Overlay Icon */}
            {showOverlayForDimension ? (
              <>
                <InfoOutlinedIcon
                  className="info-icon"
                  onClick={handleInstructionClick} // Open overlay for dimensions
                />
                {isOverlayVisible && (
                  <Dimen_ImageOverlay onClose={handleOverlayClose} />
                )}
              </>
            ) : (
              question.instructions && (
                <Tooltip
                  id={question.question_id}
                  instructions={question.instructions}
                  activeTooltipId={activeTooltipId}
                  setActiveTooltipId={setActiveTooltipId}
                />
              )
            )}
          </div>
        );
      }

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
              <Tooltip
                id={question.question_id}
                instructions={question.instructions}
                activeTooltipId={activeTooltipId}
                setActiveTooltipId={setActiveTooltipId}
              />
            )}
          </div>
        );

      default:
        return null;
    }
  };
  // const renderFollowUpQuestions = (followUps) => {
  //   return followUps.map((followUp) => (
  //     <div
  //       key={followUp.question_id}
  //       className={`col-12 ${
  //         followUp.question_type === "Float + Dropdown" ? "col-md-6" : "col-12"
  //       } mb-3`}
  //     >
  //       <label className="fs-14 text-color-typo-primary mb-2 d-block">
  //         {followUp.question_text}
  //       </label>
  //       {renderField(followUp)}
  //     </div>
  //   ));
  // };

  // Render Questions with Dependent Logic
  const renderQuestions = (questions) => {
    return questions.map((question) => {
      const parentAnswer =
        skuData.dimensionsAndWeights[question.dependent_question];
      const isDependentVisible = isAnswerMatch(
        question.field_dependency,
        parentAnswer,
      );

      if (question.dependent_question && !isDependentVisible) {
        return null;
      }
      return (
        <div
          key={question.question_id}
          className={`col-12 ${
            question.question_type === "Float + Dropdown" ||
            question.question_type === "Dropdown"
              ? "col-md-6"
              : "col-12"
          } mb-3`}
        >
          <label className="fs-14 text-color-typo-primary mb-2 d-block">
            {question.question_text}
            {question.mandatory && <span> *</span>}
          </label>
          {renderField(question)}
        </div>
      );
    });
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

              <button
                className="save-button text-white bg-secondary ms-4 me-12 fs-14 fw-600 border-0 px-4 py-12"
                onClick={saveSkuData}
              >
                Save as Draft
              </button>

              <button
                className="save-button px-4 py-12 fs-14 fw-600 border-0"
                onClick={handleValidateAndSubmit}
              >
                Validate & Submit
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
          </div>
        </div>

        {/* SKU Details */}
        <div className="px-28 py-20 border border-color-disabled-lite bg-color-light-gray">
          <div className="row">
            <div className="col-12 d-flex align-items-center">
              <div className=" sku-details-box col-12">
                {dynamicFields.map((field, index) => (
                  <div key={index} className="d-flex flex-column">
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
              {/* <div className="d-flex align-items-center  col-3 justify-content-end">
                <div className="d-flex align-items-center mb-4">
                  <p className="fs-14 fw-600 text-color-typo-primary mb-0">
                  {productImageCount} <span>images uploaded</span> {" "}
                  <span
                      className="ps-12 text-color-draft text-decoration-underline cursor-pointer"
                      data-bs-toggle="offcanvas"
                      data-bs-target="#offcanvasRight-image"
                      aria-controls="offcanvasRight-image"
                    >
                      View
                    </span>
                  </p>
                  <button
                    className="bg-transparent shadow-none border-0 fs-14 d-flex py-0  fw-600 text-secondary px-0"
                    onClick={handleAddProductImageClick}

                 >
                    View/+ Add images
                  </button>
                </div>
              </div> */}
            </div>
          </div>
        </div>
        <SkuProduct_Img
          skuId={skuId} // Pass skuId
          pkoId={pkoId}
          updateProductImageCount={handleProductImageCountUpdate}
          setImagesToUpload={setImagesToUpload}
          imagesFromDB={imagesFromDB}
          loadingImages={loadingImages}
          refreshAddProductImage={refreshAddProductImage}
        />

        {/* Details Section */}
        <div className="py-4 h-100">
          <div className="row h-100">
            {/* Primary Packaging Details */}
            <div className="col-12 col-md-5">
              <div
                className="card bg-color-light-gray border border-color-light-border rounded-3 p-4 h-100 small-arrow"
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

                {/* <div className="row">
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

                    </React.Fragment>
                  ))}
                </div> */}
                <div className="row">{renderQuestions(questions)}</div>
              </div>
            </div>

            {/* Sku Components Section */}
            <div className="col-12 col-md-7">
              <div
                className="card bg-color-light-gray border border-color-light-border rounded-3 p-4 h-100"
                style={{ maxHeight: "400px", overflowY: "auto" }}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <h6 className="fs-22 fw-600 text-color-black mb-0">
                    SKU Components
                  </h6>
                  {/* Add SKU Component Button */}
                  {skuData.components.length > 0 && (
                    <div className="d-flex gap-3">
                      {/* Add Product Images Button */}
                      <button
                        className="btn btn-outline-primary"
                        onClick={handleAddProductImageClick}
                      >
                        Add/View Images
                      </button>
                      <SkuProduct_Img
                        updateProductImageCount={() => {}}
                        setImagesToUpload={setImagesToUpload}
                        imagesFromDB={imagesFromDB}
                      />
                      {/* Add SKU Components Button */}
                      <button
                        className="btn btn-outline-primary"
                        data-target="addSkuComponentBlock"
                        onClick={(event) => {
                          // Prevent the default behavior
                          event.preventDefault();

                          // Get the target section from the data-target attribute
                          const targetId =
                            event.target.getAttribute("data-target");

                          // Find the element by ID and scroll to it
                          setTimeout(() => {
                            const targetElement =
                              document.getElementById(targetId);

                            if (targetElement) {
                              // Scroll to the target element with smooth scrolling
                              targetElement.scrollIntoView({
                                behavior: "smooth",
                                block: "start", // Align to the top of the section
                              });
                            }
                          }, 100); // Add a small delay (e.g., 100ms) to allow for rendering

                          setSkuData((prev) => ({
                            ...prev,
                            showInput: true,
                            isCancelDisabled: false,
                          }));
                        }}
                      >
                        + Add SKU Components
                      </button>
                    </div>
                  )}
                </div>
                {/* Case 1: No Components Exist */}
                {skuData.components.length === 0 && !skuData.showTable ? (
                  <div className="noComponentsAdded-block text-center m-auto">
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
                        setSkuData((prev) => ({
                          ...prev,
                          showTable: true,
                          showInput: true, // Allow the input field to appear
                          isCancelDisabled: true, // Disable the cancel button for the first addition
                        }))
                      }
                    >
                      + Add SKU Components
                    </button>
                  </div>
                ) : (
                  /* Case 2: Components Exist or Table is Shown */
                  <div>
                    {/* Components Table */}
                    <table className="table fs-14 w-100 bg-transparent table-striped component-tbl mt-4">
                      <thead>
                        <tr>
                          <th scope="col">Component Name</th>
                          <th className="text-center" scope="col">
                            Form Status
                          </th>
                          <th className="text-center" scope="col">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {skuData.components.map((component, index) => (
                          <tr key={index}>
                            <td className="align-middle">{component.name}</td>
                            {/* <td className="text-center align-middle">
                              <span className="d-inline-flex align-items-center bg-color-padding-label py-2 px-12 rounded-pill text-secondary fw-600">
                                <span className="circle me-2"></span>
                                {component.form_status || "Pending"}
                              </span>
                            </td> */}
                            <td className="text-center align-middle">
                              <span
                                className={`d-inline-flex align-items-center py-2 px-12 rounded-pill fw-600 ${
                                  component.form_status === "Completed"
                                    ? "color-active-bg text-color-completed" // ApplyCompleted class
                                    : "bg-color-padding-label text-secondary" // Default class for Pending
                                }`}
                              >
                                <span
                                  className={`circle me-2 ${
                                    component.form_status === "Completed"
                                      ? "bg-color-completed"
                                      : ""
                                  }`}
                                ></span>
                                {component.form_status || "Pending"}
                              </span>
                            </td>
                            <td className="text-center align-middle">
                              {/* <span>
                                {0}{" "}
                                <img
                                  src="/assets/images/image-pic.png"
                                  alt="Image"
                                  style={{
                                    width: "16px",
                                    marginRight: "8px",
                                    cursor: "pointer",
                                  }}
                                  onClick={handleAddProductImageClick}
                                />
                              </span> */}
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

                    {/* Add Component Input Section */}
                    {skuData.showInput && (
                      <div
                        className="d-flex align-items-center gap-3 mt-3"
                        id="addSkuComponentBlock"
                      >
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
                            !skuData.isCancelDisabled
                              ? () =>
                                  setSkuData((prev) => ({
                                    ...prev,
                                    showInput: false,
                                    newComponent: "",
                                  }))
                              : null
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
