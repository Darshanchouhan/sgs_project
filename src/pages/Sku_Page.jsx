import { useContext, useEffect, useState, useRef } from "react";
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
import SkuValidation from "./SkuValidation";
import Dimen_ImageOverlay from "./Dimen_ImageOverlay"; // Import Overlay Component
import Importdata from "./ImportData";
import VendorCommentPanel from "../components/VendorCommentPanel";

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

  const stateIcomingFromLastPage = JSON.parse(
    localStorage.getItem("sku_page_state"),
  );
  const stateIncomingComponentPage = JSON.parse(
    localStorage.getItem("component_page_state"),
  );

  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const [questions, setQuestions] = useState([]); // Store questions from API
  const [questionsComponent, setQuestionsComponent] = useState([]); // Store questions from API
  const [componentsData, setComponentsData] = useState([]); // Store questions from API
  const skuId = stateIcomingFromLastPage?.skuId || skuData?.skuId; // Retrieve SKU ID from navigation
  const [submissionLastDate, setSubmissionLastDate] = useState("N/A");
  const pkoId =
    stateIcomingFromLastPage?.pkoData?.pko_id || pkoData?.pko_id || "N/A";
  const [productImageCount, setProductImageCount] = useState(0); // Track product image count
  const [imagesFromDB, setImagesFromDB] = useState([]); // Images fetched from database
  const [imagesToUpload, setImagesToUpload] = useState([]); // Images to upload
  const [loadingImages, setLoadingImages] = useState(false);
  const [mandatoryProgress, setMandatoryProgress] = useState(0);
  const [componentProgressAverage, setComponentProgressAverage] = useState(0); // Average progress
  const [isOverlayVisible, setOverlayVisible] = useState(false);
  const [activeTooltipId, setActiveTooltipId] = useState(null); // State to track the active tooltip ID
  const [validationIssues, setValidationIssues] = useState([]); // Store validation errors
  const [proceedToEnable, setProceedToEnable] = useState([]); // Store validation errors
  const [showValidationModal, setShowValidationModal] = useState(false); // Modal visibility
  const [componentValidationIssues, setComponentValidationIssues] = useState(
    [],
  );
  const [selectedComponentType, setSelectedComponentType] = useState("");
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [componentToDelete, setComponentToDelete] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null); // Track which component is being edited
  const [editedComponentName, setEditedComponentName] = useState(""); // Store the edited name
  const [dropdownListComing, setDropdownListComing] = useState([]); // Store the dropdown list
  const dropdownRef = useRef(null); // Create a ref for the dropdown
  const encodedPkoId = encodeURIComponent(pkoId);
  const [commentDropdownData, setCommentDropdownData] = useState({
    pkos: [],
    skus: [],
    componentsBySku: {}, // { sku_id: [component1, component2] }
  });

  const [activeComponentId, setActiveComponentId] = useState(null);
  const skuPageState = JSON.parse(
    localStorage.getItem("sku_page_state") || "{}",
  );
  const isPkoClosed = skuPageState?.isPkoClosed;
  const isFormLocked =
    isPkoClosed || ["Inreview", "Approved"].includes(skuDetails?.status);

  const handleComponentTypeChange = (e) => {
    setSelectedComponentType(e.target.value);
  };

  const handleInstructionClick = () => {
    setOverlayVisible(true); // Show the overlay
  };
  const handleOverlayClose = () => {
    setOverlayVisible(false); // Hide the overlay
  };

  // Function to handle clicks outside the dropdown
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setOpenDropdownIndex(null); // Close the dropdown if clicked outside
    }
  };

  // add dropdown list call

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(`component-type-options/`);
        setDropdownListComing(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Add event listener for clicks outside
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchAndValidateComponentData = async () => {
    let issues = [];
    try {
      const components = componentsData || [];
      console.log("Fetched Components:", components);

      for (let component of components) {
        console.log("Fetching details for :", component.id);
        const componentResponse = component["responses"];
        console.log(
          "Fetching details for component:",
          component.id,
          componentResponse,
          component,
        );

        // Apply validation rules from PkgDataForm
        const componentIssues = validateComponentResponses(
          component,
          componentResponse,
        );
        console.log(
          "Component Issues for",
          component.name,
          ":",
          componentIssues,
        );

        if (componentIssues.length > 0) {
          issues = [...issues, ...componentIssues];
        }
      }
    } catch (error) {
      console.error("Error fetching component details:", error);
    }
    console.log("Final Component Validation Issues:", issues);
    return issues;
  };

  // const isAnswerMatchForComponent = (fieldDependency, parentAnswers) => {
  //   if (!fieldDependency || parentAnswers.length === 0) return true; // No dependency, always visible

  //   // Normalize fieldDependency into an array of conditions
  //   const conditions = fieldDependency
  //     .split(" OR ") // Split conditions by "OR"
  //     .map((condition) => condition.trim().toLowerCase());

  //   // Check for exact matches only
  //   return conditions.some((condition) =>
  //     parentAnswers.some(
  //       (parentAnswer) =>
  //         (parentAnswer || "").trim().toLowerCase() === condition,
  //     ),
  //   );
  // };

  const isAnswerMatchForComponent = (
    dependentQuestionObj,
    answers,
    questionsList = [],
  ) => {
    // Handle legacy string-based dependency logic
    if (typeof dependentQuestionObj === "string") {
      const conditions = dependentQuestionObj
        .split(" OR")
        .map((c) => c.trim().toLowerCase());

      const parentAnswers = Object.values(answers).map((a) =>
        String(a || "")
          .toLowerCase()
          .trim(),
      );

      return conditions.some((condition) => parentAnswers.includes(condition));
    }

    // If dependency object is not valid
    if (!dependentQuestionObj || typeof dependentQuestionObj !== "object") {
      return true;
    }

    const resolveQuestionId = (id) => {
      // Check if this is actually a sequence_id → resolve to question_id
      const found = questionsList.find((q) => q.sequence_id === id);
      return found?.question_id || id; // fallback to id if not found
    };

    const { main_dependency, and_condition } = dependentQuestionObj;

    const mainQId = resolveQuestionId(main_dependency?.question_id);
    const mainAnswer = answers[`${mainQId}`];
    const mainConditionMet = Array.isArray(main_dependency?.expected_values)
      ? main_dependency.expected_values.includes(mainAnswer)
      : false;

    let andConditionMet = true;
    if (and_condition?.question_id !== undefined) {
      const andQId = resolveQuestionId(and_condition.question_id);
      const andAnswer = answers[`${andQId}`];
      andConditionMet = andAnswer === and_condition.expected_value;
    }

    return mainConditionMet && andConditionMet;
  };

  const validateComponentResponses = (component, responses) => {
    let issues = [];

    // Prepare response map
    const responseMap = {};
    Object.entries(responses).forEach(([key, value]) => {
      const parts = key.split("||");
      const qid = parts[1];
      if (qid) responseMap[qid] = value;
    });

    const selectedComponentType = component.component_type;

    // Filter questions for this component type
    const relevantQuestions = questionsComponent.filter(
      (q) =>
        !q.component_type ||
        q.component_type.toLowerCase() === selectedComponentType?.toLowerCase(),
    );

    //  MAIN VALIDATION LOOP
    relevantQuestions.forEach((question) => {
      const isVisible =
        !question.dependent_question ||
        isAnswerMatchForComponent(
          question.dependent_question,
          responseMap,
          questionsComponent,
        );

      if (!isVisible) return;

      const response = responseMap[question.question_id?.toString()] ?? "";

      //  MANDATORY CHECK
      if (
        question.mandatory &&
        (!response || response.toString().trim() === "")
      ) {
        issues.push({
          where: "Component Form",
          component: component.name,
          issue: `Please provide response for all mandatory fields - ${question.question_text}`,
        });
      }

      // RANGE VALIDATION same as Component Page
      if (
        question.validationdependency === "Y" &&
        question.validation_dropdown &&
        response !== "" &&
        response !== undefined
      ) {
        let selectedUnit = responseMap[`${question.question_id}_unit`] ?? "";
        let enteredValue = parseFloat(response);

        // If unit missing, set default
        if (!selectedUnit && question.dropdown_options?.length > 0) {
          selectedUnit = question.dropdown_options[0];
        }

        if (selectedComponentType && selectedUnit && !isNaN(enteredValue)) {
          const validationRules = question.validation_dropdown.filter(
            (rule) =>
              rule.name?.toLowerCase() ===
                selectedComponentType?.toLowerCase() &&
              rule.unit?.toLowerCase() === selectedUnit?.toLowerCase(),
          );

          if (validationRules.length > 0) {
            const rule = validationRules[0];
            let issue = null;

            if (
              rule.min_weight !== undefined &&
              rule.max_weight !== undefined &&
              (enteredValue < rule.min_weight || enteredValue > rule.max_weight)
            ) {
              issue = `${question.question_text} Weight should be between ${rule.min_weight} and ${rule.max_weight} ${selectedUnit}`;
            } else if (
              rule.min_length !== undefined &&
              rule.max_length !== undefined &&
              (enteredValue < rule.min_length || enteredValue > rule.max_length)
            ) {
              issue = `${question.question_text} Length should be between ${rule.min_length} and ${rule.max_length} ${selectedUnit}`;
            } else if (
              rule.min_width !== undefined &&
              rule.max_width !== undefined &&
              (enteredValue < rule.min_width || enteredValue > rule.max_width)
            ) {
              issue = `${question.question_text} Width should be between ${rule.min_width} and ${rule.max_width} ${selectedUnit}`;
            } else if (
              rule.min_depth !== undefined &&
              rule.max_depth !== undefined &&
              (enteredValue < rule.min_depth || enteredValue > rule.max_depth)
            ) {
              issue = `${question.question_text} Depth should be between ${rule.min_depth} and ${rule.max_depth} ${selectedUnit}`;
            }

            if (issue) {
              issues.push({
                where: "Component Form",
                component: component.name,
                issue,
              });
            }
          }
        }
      }
    });

    console.log(" Final Component validation:", issues);
    return issues;
  };

  // Function to validate everything before submission
  const handleValidateAndSubmit = async () => {
    try {
      const skuIssues = validateSkuData();
      const componentIssues = await fetchAndValidateComponentData();

      setValidationIssues(skuIssues);
      setComponentValidationIssues(componentIssues);
      console.log("SKU Issues:", skuIssues);
      console.log("Component Issues:", componentIssues);

      // Check if at least one component is added
      if (skuData.components.length === 0) {
        alert(
          "Please ensure at least 1 component is added, and all mandatory questions in component forms are answered before submission",
        );
        return;
      }

      // Check if any component is still in Pending status
      const hasPendingComponent = skuData.components.some(
        (component) => component.form_status !== "Completed",
      );

      if (hasPendingComponent) {
        alert(
          "Please ensure at least 1 component is added, and all mandatory questions in component forms are answered before submission",
        );
        return;
      }

      const noImagesAttached = !imagesFromDB || imagesFromDB.length === 0;
      console.log("No images attached?", noImagesAttached, imagesFromDB);

      // If there are validation issues, show the validation modal
      if (
        skuIssues.length > 0 ||
        componentIssues.length > 0 ||
        noImagesAttached
      ) {
        // setProceedToEnable(true)
        setShowValidationModal(true);
        console.log("Showing validation modal");
      } else {
        proceedToSubmission();
      }
    } catch (error) {
      console.error("Error validating components:", error);
      alert("An error occurred while validating components. Please try again.");
    }
  };

  // Validate SKU Form fields
  const validateSkuData = () => {
    let issues = [];

    questions.forEach((question) => {
      // Check if the value is 0 for numeric fields
      if (
        (question.question_type === "Integer" ||
          question.question_type === "Float + Dropdown") &&
        skuData.dimensionsAndWeights[question.question_id] === "0"
      ) {
        issues.push({
          issue: `${question.question_text} should be greater than zero.`,
        });
      }
      //check mandatory fields
      if (
        question.mandatory &&
        (!skuData.dimensionsAndWeights[question.question_id] ||
          skuData.dimensionsAndWeights[question.question_id] === "")
      ) {
        issues.push({
          issue: `Please provide a response for the following mandatory field-'${question.question_text}'.`,
        });
      }
    });

    return issues;
  };

  const handleImportFromSku = async (
    sourceSkuId,
    sourcePkoId,
    componentName,
    activeComponentId,
  ) => {
    try {
      const checkResponse = await axiosInstance.get(
        `/skus/${sourceSkuId}/?pko_id=${encodeURIComponent(sourcePkoId)}`,
      );

      const sourceData = checkResponse.data;

      const hasPackagingDetails =
        sourceData?.primary_packaging_details &&
        Object.keys(sourceData.primary_packaging_details).length > 0;

      const hasComponents =
        sourceData?.components && sourceData.components.length > 0;

      if (!hasPackagingDetails && !hasComponents) {
        alert("No data is filled for the selected SKU. Please choose another.");
        return;
      }

      // Build payload conditionally based on whether componentName is present
      const isComponentImport = !!componentName;

      const payload = {
        source_sku_id: sourceSkuId,
        source_pko_id: sourcePkoId,
        target_pko_id: pkoId,
        target_sku_ids: [skuId],
      };

      if (isComponentImport) {
        payload.component_names = [componentName];
        payload.target_component_id = activeComponentId;
      }

      console.log("Sending import payload:", payload);

      const response = await axiosInstance.post("/copy-components/", payload);

      if (response.status === 201) {
        alert("Data imported successfully!");
        window.location.reload(); // Trigger full refresh
      } else {
        alert("Failed to import data. Please try again.");
      }
    } catch (error) {
      console.error("Error while importing data:", error.response || error);
      alert("Error importing data. Please check console.");
    }
  };

  const handleImportComponentData = async (
    sourceSkuId,
    sourcePkoId,
    sourceComponentName,
    targetComponentId,
  ) => {
    try {
      if (
        !sourceSkuId ||
        !sourcePkoId ||
        !sourceComponentName ||
        !targetComponentId
      ) {
        console.error("Missing required parameters for component import.");
        alert("Please ensure all required fields are selected.");
        return;
      }
      const payload = {
        source_sku_id: sourceSkuId,
        source_pko_id: sourcePkoId,
        target_sku_id: skuId,
        target_pko_id: pkoId,
        source_component_name: sourceComponentName,
        target_component_name: skuData.components.find(
          (comp) => comp.id === targetComponentId,
        )?.name,
      };

      console.log("Sending component import payload:", payload);

      const response = await axiosInstance.post(
        "/copy-component-data/",
        payload,
      );

      if (response.status === 200 || response.status === 201) {
        alert("Component data imported successfully!");
        window.location.reload();
      } else {
        alert("Failed to import component data. Please try again.");
      }
    } catch (error) {
      console.error("Error importing component data:", error.response || error);
      alert("Error importing component data. Please check console.");
    }
  };

  useEffect(() => {
    if (stateIncomingComponentPage?.responses) {
      const answers = {};

      Object.entries(stateIncomingComponentPage?.responses).forEach(
        ([questionText, response]) => {
          // Find the matching question based on text and ID
          const question = questions.find(
            (q) =>
              questionText.startsWith(q.question_text) &&
              questionText.endsWith(`||${q.question_id}`),
          );

          if (question) {
            // If the field contains both value and unit, split them
            if (
              question.question_type.includes("Dropdown") ||
              question.question_type.includes("Float")
            ) {
              const match = response.match(/^(\d+(\.\d+)?)([a-zA-Z]+)$/);
              if (match) {
                answers[question.question_id] = parseFloat(match[1]); // Extract value
                answers[`${question.question_id}_unit`] = match[3]; // Extract unit
              } else {
                answers[question.question_id] = response;
              }
            } else {
              answers[question.question_id] = response;
            }
          }
        },
      );

      // Update SKU state with formatted answers
      setSkuData((prev) => ({
        ...prev,
        dimensionsAndWeights: answers,
      }));

      console.log("Populated answers from DB:", answers);
    }
  }, [questions, setSkuData]);

  useEffect(() => {
    console.log("isOverlayVisible:", isOverlayVisible); // Debug log for state changes
  }, [isOverlayVisible]);

  const handleProductImageCountUpdate = (count) => {
    setProductImageCount(count);
  };

  const proceedToSubmission = async () => {
    try {
      setHasSubmitted(true); // Set submission flag
      await saveSkuData(false, false); // Call save function first
      // Update SKU Status in Database**
      await axiosInstance.put(`/skus/${skuId}/update_status/`, {
        pko_id: pkoId,
        status: "Inreview",
      });

      const cvsSupplier = localStorage.getItem("cvs_supplier");
      await axiosInstance.post("/notifications/", {
        status_change: "DraftToInreview",
        skuid: skuId,
        pkoid: pkoId,
        cvs_supplier: cvsSupplier,
      });
      console.log("Notification created for Draft to InReview");

      // Update Local State**
      updateSkuStatus(skuId, "Inreview"); // Update VendorContext state

      setPkoData((prevPkoData) => ({
        ...prevPkoData,
        skus: prevPkoData.skus.map((sku) =>
          sku.sku_id === skuId ? { ...sku, status: "Inreview" } : sku,
        ),
      }));

      alert("Form submitted successfully!"); // Show success message
      setShowValidationModal(false); // Close modal after submission
      navigate("/vendordashboard"); // Redirect if needed
    } catch (error) {
      setHasSubmitted(false); // Reset submission flag on error
      console.error("Error during submission:", error);
      alert("An error occurred while submitting. Please try again.");
    }
  };

  const handleAddProductImageClick = async () => {
    const offcanvasElement = document.getElementById("offcanvasRight-image");
    if (offcanvasElement) {
      setLoading(true);
      try {
        // console.log("Fetching images for SKU ID:", skuId, "and PKO ID:", pkoId);
        setLoadingImages(true);

        const response = await axiosInstance.get(
          `skus/${skuId}/images/?pko_id=${encodedPkoId}`,
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
        setLoading(false);
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
        `skus/${skuId}/images/?pko_id=${encodedPkoId}`,
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
    }
  };
  // Ensure images are fetched when the SKU page is loaded
  useEffect(() => {
    refreshAddProductImage();
  }, []); // Runs only once when the component mounts

  useEffect(() => {
    if (stateIcomingFromLastPage?.skuDetails)
      setSkuDetails(stateIcomingFromLastPage?.skuDetails);
    if (stateIcomingFromLastPage?.pkoData)
      setPkoData(stateIcomingFromLastPage?.pkoData);
  }, []);

  useEffect(() => {
    const duedate =
      stateIcomingFromLastPage?.duedate || pkoData?.duedate || null;

    if (duedate) {
      setSubmissionLastDate(
        new Date(duedate).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
      );
    }
  }, [pkoData]);

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

  // Retrieve pkoData and skuDetails from stateIcomingFromLastPage or fallback to context
  useEffect(() => {
    if (stateIcomingFromLastPage) {
      if (stateIcomingFromLastPage?.skuDetails) {
        setSkuDetails(stateIcomingFromLastPage?.skuDetails);
      }
      if (stateIcomingFromLastPage?.pkoData) {
        setPkoData(stateIcomingFromLastPage?.pkoData);
      }
    }
  }, []);

  // console.log("pkoData in skupage:", pkoData);
  // Fetch the questionnaire
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axiosInstance.get("questionnaire/");
        const data = response.data;
        setQuestions(data.primary_packaging_questions || []);
        setQuestionsComponent(data.components[0].component_questions || []);
      } catch (error) {
        console.error("Error fetching questionnaire data:", error);
      }
    };

    fetchQuestions();
  }, []);

  //fetch SKU Details
  useEffect(() => {
    if (questions.length > 0) {
      const fetchSkuDetails = async () => {
        if (!skuId || !pkoId) {
          console.warn("SKU ID or PKO ID is missing. Skipping fetch.");
          return;
        }
        // setLoading(true);
        try {
          const response = await axiosInstance.get(
            `/skus/${skuId}/?pko_id=${encodedPkoId}`,
          );
          const data = response.data;

          const components = data.components;

          // set the Component Data
          setComponentsData(components);

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

          // Prevent overwriting status if already submitted
          if (hasSubmitted && data.status === "Draft") {
            console.log(
              "Skipping status update since form is already submitted.",
            );
            return;
          }

          if (data.primary_packaging_details) {
            const answers = {};

            Object.entries(data.primary_packaging_details).forEach(
              ([questionText, response]) => {
                // Find the matching question using text and ID
                const question = questions.find(
                  (q) =>
                    questionText.startsWith(q.question_text) &&
                    questionText.endsWith(`||${q.question_id}`),
                );

                if (question) {
                  // If the field contains both value and unit, extract them
                  if (
                    question.question_type.includes("Dropdown") ||
                    question.question_type.includes("Float")
                  ) {
                    const match = response.match(/^(\d+(\.\d+)?)([a-zA-Z]+)$/);
                    if (match) {
                      answers[question.question_id] = parseFloat(match[1]); // Extract value
                      answers[`${question.question_id}_unit`] = match[3]; // Extract unit
                    } else {
                      answers[question.question_id] = response;
                    }
                  } else {
                    answers[question.question_id] = response;
                  }
                }
              },
            );

            // Set the SKU data properly
            setSkuData((prev) => ({
              ...prev,
              dimensionsAndWeights: answers,
              components: data.components || [],
            }));

            console.log("Populated answers from DB:", answers);
          }
        } catch (error) {
          console.error("Error fetching SKU details:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchSkuDetails();
    }
  }, [skuId, pkoId, questions, setSkuData]);

  // Match dependent question visibility based on parent's answer and field dependency
  const isAnswerMatch = (fieldDependency, parentAnswer) => {
    if (!fieldDependency) return true; // No dependency, always visible

    const normalizedParentAnswer = parentAnswer?.trim().toLowerCase() || "";
    const conditions = fieldDependency
      .split(/OR/i)
      .map((dep) => dep.trim().toLowerCase());

    return conditions.includes(normalizedParentAnswer);
  };

  //Save the Response
  const saveSkuData = async (
    isDraft = true,
    showAlert = true,
    isBackClick = false,
  ) => {
    if (isFormLocked && !isBackClick) {
      console.warn("PKO is closed. Save skipped.");
      return;
    }

    if (!skuId || !pkoId) {
      console.error("SKU ID or PKO ID is missing");
      return;
    }
    // Don't save as draft if already submitted
    if (isDraft && hasSubmitted) {
      return;
    }
    const combinedProgress = Math.round(
      (Math.round(mandatoryProgress * 10) +
        parseFloat((componentProgressAverage * 90).toFixed(2))) /
        100,
    );
    // setIsSubmitting(true);
    try {
      const payload = {
        pko_id: pkoId,
        sku_id: skuId,
        description: skuDetails?.description || "",
        primary_packaging_details: {},
        components: skuData.components.map((comp, index) => ({
          id: comp.id || null,
          sku: skuId,
          name: comp.name || `Component_${index + 1}`,
          form_status: comp.form_status || "Pending",
          responses: comp.responses || {},
        })),
        sku_progress: combinedProgress,
        // status: isDraft ? "Draft" : "Completed", // Include status in payload
      };
      console.log("statuscheck", skuDetails?.status);
      if (isBackClick) {
        if (skuDetails?.status === "Approved") {
          payload["status"] = "Approved";
        } else if (skuDetails?.status === "Inreview") {
          payload["status"] = "Inreview";
        }
      } else {
        payload["status"] = "Draft";
      }

      questions.forEach((question) => {
        const answer = skuData.dimensionsAndWeights[question.question_id];
        let unit =
          skuData.dimensionsAndWeights[`${question.question_id}_unit`] || "";

        if (answer !== undefined && answer !== "") {
          payload.primary_packaging_details[
            `${question.question_text}||${question.question_id}`
          ] = `${answer}${unit}`.trim();
        }
      });

      await axiosInstance.put(`/skus/${skuId}/`, payload, {
        headers: { "Content-Type": "application/json" },
      });
      try {
        const response = await axiosInstance.get("pkos/");
        const allPkoData = response.data;
        const currentPko = allPkoData[pkoId];

        if (!currentPko) {
          console.warn("No matching PKO found for ID:", pkoId);
          return;
        }

        const skus = currentPko.skus || [];
        const progressValues = skus
          .map((sku) => sku.sku_progress)
          .filter((p) => typeof p === "number");

        const total = progressValues.reduce((sum, val) => sum + val, 0);
        const overallProgress =
          progressValues.length > 0
            ? Math.round(total / progressValues.length)
            : 0;

        // await axiosInstance.put(`/update-pko-progress/`, {
        //   pko_id: pkoId,
        //   pko_progress: overallProgress,
        // });
        // console.log("PKO progress updated:", overallProgress);
        const res = await axiosInstance.put(`/update-pko-progress/`, {
          pko_id: pkoId,
          pko_progress: overallProgress,
        });
        console.log(
          "PKO progress updated:",
          res.data.message || overallProgress,
        );
      } catch (error) {
        console.error("Error updating PKO progress:", error);
      }

      // Show alert only when saving as a draft, not during submission
      if (isDraft && showAlert) {
        alert("SKU data saved successfully in Draft mode!");
      }
      updateSkuStatus(skuId, isDraft ? "Draft" : "Completed");
      // Upload Images after saving SKU data
      // await handleUploadImages();

      // navigate("/vendordashboard");
    } catch (error) {
      console.error("Error saving SKU data:", error);
      alert("Failed to save SKU data. Please try again.");
    }
  };

  // Autosave function (No alerts, no user navigation)
  const autosaveSkuData = async () => {
    if (hasSubmitted) {
      // Skip autosave if the form has been submitted
      return;
    }
    await saveSkuData(true, false);
  };

  const handleInputChange = (field, value) => {
    setSkuData((prev) => ({
      ...prev,
      dimensionsAndWeights: {
        ...prev.dimensionsAndWeights,
        [field]: value === "" ? "" : value, // Ensure 0 is not treated as empty
      },
    }));
  };

  // Define the back action
  const handleBackClick = async () => {
    setLoading(true);
    await saveSkuData(false, false, true);
    navigate("/vendordashboard"); // Navigate to Vendor Dashboard
  };

  // Handle adding a component
  const handleAddComponent = async () => {
    // Validate the newComponent input
    if (!skuData.newComponent.trim()) {
      alert("Component name cannot be empty!");
      return; // Exit early without modifying the state
    }

    if (selectedComponentType === "") {
      alert("Component type cannot be empty!");
      return; // Exit early without modifying the state
    }

    try {
      const payload = {
        pko_id: pkoId,
        name: skuData.newComponent,
        form_status: "Pending",
        component_type: selectedComponentType,
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
            component_type: selectedComponentType,
          },
        ],
        newComponent: "", // Clear the input field
        showInput: false, // Hide input field after adding the component
        isCancelDisabled: false, // Enable the cancel button for subsequent adds
      }));

      // Reset selected component type
      setSelectedComponentType("");

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
    setLoading(true); // Show loader immediately

    try {
      // Call saveSkuData before proceeding
      await saveSkuData(false, false, true);

      // Fetch specific component details including responses
      const response = await axiosInstance.get(
        `/sku/${skuId}/components/?pko_id=${encodedPkoId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (response.status === 200) {
        const components = response.data; // Expecting an array of component objects

        if (components[index]) {
          const componentData = components[index];

          localStorage.setItem(
            "component_page_state",
            JSON.stringify({
              skuId,
              componentId: componentData.id,
              componentName: componentData.name,
              formStatus: componentData.form_status,
              component_type: componentData.component_type,
              responses: componentData.responses || {},
              pkoId: pkoData?.pko_id || "N/A",
              description:
                skuDetails?.description || "Description Not Available",
              skuDetails,
              pkoData,
            }),
          );

          // Navigate to PkgDataForm with all necessary data
          navigate("/component");
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

  const handleDeleteComponent = async () => {
    if (!componentToDelete) return;

    try {
      await axiosInstance.delete(
        `/sku/${skuId}/components/${componentToDelete.id}/`,
        {
          data: { pko_id: pkoId }, //pass pko_id
        },
      );
      // Update the state to remove the deleted component
      setSkuData((prev) => ({
        ...prev,
        components: prev.components.filter(
          (comp) => comp.id !== componentToDelete.id,
        ),
      }));

      alert(`Component "${componentToDelete.name}" deleted successfully!`);
    } catch (error) {
      console.error("Error deleting component:", error);
      alert("Failed to delete component. Please try again.");
    } finally {
      setShowDeletePopup(false); // Close the popup after deletion
      setComponentToDelete(null); // Reset the component to delete
      setOpenDropdownIndex(null); // Close the dropdown
    }
  };

  const handleEditComponent = (index) => {
    setEditingIndex(index);
    setEditedComponentName(skuData.components[index].name);
    setOpenDropdownIndex(null); // Close the dropdown
  };

  const handleSaveEdit = async (index) => {
    // if (isFormLocked) {
    //   alert("This PKO is closed. You cannot edit or submit any form.");
    //   return;
    // }
    const updatedComponents = [...skuData.components];
    updatedComponents[index].name = editedComponentName;

    try {
      // Update the component name in the backend
      await axiosInstance.put(
        `/sku/${skuId}/components/${updatedComponents[index].id}/`,
        {
          name: editedComponentName,
          pko_id: pkoId,
        },
      );

      setSkuData((prev) => ({
        ...prev,
        components: updatedComponents,
      }));

      setEditingIndex(null); // Exit editing mode
      setOpenDropdownIndex(null); // Close the dropdown
      alert("Component name updated successfully!");
    } catch (error) {
      console.error("Error updating component name:", error);
      alert("Failed to update component name. Please try again.");
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditedComponentName("");
    setOpenDropdownIndex(null); // Close the dropdown
  };

  const renderDeleteConfirmation = () => {
    if (!showDeletePopup || !componentToDelete) return null;

    return (
      <div
        className="modal d-block show fade"
        id="deleteModal"
        tabIndex="-1"
        aria-labelledby="deleteModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-md modal-dialog-centered p-0">
          <div className="modal-content">
            <div className="modal-body text-center px-4 py-5">
              <h5 className="fs-22 fw-600 mb-0">
                Are you sure you want to delete the component{" "}
                {componentToDelete.name}?
              </h5>
            </div>
            <div className="modal-footer justify-content-center px-4 pt-0 pb-5 border-0">
              <button
                type="button"
                className="btn btn-outline-secondary px-4 py-12 fs-14 fw-600"
                onClick={() => {
                  setShowDeletePopup(false);
                  setOpenDropdownIndex(null);
                }}
              >
                No
              </button>
              <button
                type="button"
                className="btn btn-primary px-4 py-12 fs-14 fw-600"
                onClick={handleDeleteComponent}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const dynamicFields = [
    { label: "Description", value: skuDetails?.description || "N/A" },
    { label: "Subcategory", value: pkoData?.subcategory || "N/A" },
    { label: "SKU ID", value: skuDetails?.sku_id || "N/A" },
    { label: "Brand", value: skuDetails?.brand || "N/A" },
    { label: "UPC#", value: skuDetails?.upc || "N/A" },
    { label: "Segment", value: pkoData?.segment || "N/A" },
    { label: "Business Unit", value: pkoData?.businessunit || "N/A" },
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
        "a", // Allow 'a' for select all (Command + A)
        "c", // Allow 'c' for copy (Command + C)
        "v", // Allow 'v' for paste (Command + V)
        "x", // Allow 'x' for cut (Command + X)
      ];
      // Check if the key is a meta key (Command on Mac, Ctrl on Windows)
      const isMetaKey = e.metaKey || e.ctrlKey;

      // Allow copy, paste, and cut commands
      if (
        isMetaKey &&
        (e.key === "c" || e.key === "v" || e.key === "x" || e.key === "a")
      ) {
        return; // Allow the default behavior for these key combinations
      }

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
              tabIndex={0} // Make the input focusable
              disabled={isFormLocked}
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
              onChange={handleChange}
              onWheel={(e) => e.target.blur()}
              onKeyDown={handleKeyDown} // Restrict invalid key presses
              tabIndex={0} // Make the input focusable
              disabled={isFormLocked}
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

        const synchronizeUnits = (newUnit, groupType) => {
          const unitFields =
            groupType === "dimension"
              ? ["height", "width", "depth"]
              : ["netWeight", "tareWeight", "grossWeight"];

          setSkuData((prev) => {
            const updatedDimensionsAndWeights = {
              ...prev.dimensionsAndWeights,
            };

            unitFields.forEach((field) => {
              // Normalize field: Convert to lowercase and replace camelCase with spaces
              const normalizedField = field
                .replace(/([a-z])([A-Z])/g, "$1 $2")
                .toLowerCase();

              // Find the question where normalized field matches normalized question_text
              const question = questions.find((q) => {
                // Normalize the question text: Convert to lowercase and remove spaces
                const normalizedQuestionText = q.question_text
                  .toLowerCase()
                  .replace(/\s+/g, " ")
                  .trim();
                return normalizedQuestionText.includes(normalizedField);
              });

              if (question) {
                updatedDimensionsAndWeights[`${question.question_id}_unit`] =
                  newUnit;
              }
            });

            return {
              ...prev,
              dimensionsAndWeights: updatedDimensionsAndWeights,
            };
          });
        };

        if (
          !skuData.dimensionsAndWeights[`${question.question_id}_unit`] &&
          question.dropdown_options.length > 0
        ) {
          const defaultUnit = question.dropdown_options[0];
          setSkuData((prev) => ({
            ...prev,
            dimensionsAndWeights: {
              ...prev.dimensionsAndWeights,
              [`${question.question_id}_unit`]: defaultUnit,
            },
          }));
        }

        return (
          <div className="d-flex align-items-center gap-2">
            <div className="d-flex align-items-center border border-color-typo-secondary rounded-2 ">
              {/* Input Field */}
              <input
                type="number"
                step="any"
                className="form-control border-0 rounded-2 px-2"
                placeholder={question.placeholder || "Enter Value"}
                style={{ flex: 2 }}
                value={skuData.dimensionsAndWeights[question.question_id] ?? ""}
                onWheel={(e) => e.target.blur()}
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
                    e.key !== "ArrowRight" &&
                    e.key !== "Tab" &&
                    !(e.ctrlKey || e.metaKey) // Allow Ctrl (Windows) / Cmd
                  ) {
                    e.preventDefault();
                  }
                  // Prevent more than one dot
                  if (e.key === "." && e.target.value.includes(".")) {
                    e.preventDefault();
                  }
                  if (e.key === "Tab" && !e.shiftKey) {
                    // Remove preventDefault() so Tab works naturally
                    document
                      .getElementById(`dropdown-${question.question_id}`)
                      ?.focus();
                  }
                }}
                onPaste={(e) => {
                  // Prevent pasting non-numeric values
                  const pasteData = e.clipboardData.getData("text");
                  if (!/^\d*\.?\d*$/.test(pasteData)) {
                    e.preventDefault();
                  }
                }}
                tabIndex={0} // Make the input focusable
                disabled={isFormLocked}
              />

              {/* Unit Dropdown */}
              <select
                className="form-select background-position border-0 bg-color-light-shade text-color-typo-primary px-12 w-72 fw-400"
                value={
                  skuData.dimensionsAndWeights[
                    `${question.question_id}_unit`
                  ] || question.dropdown_options[0] // Ensure default unit selection
                }
                disabled={isFormLocked}
                onChange={(e) => {
                  const newUnit = e.target.value;

                  if (isDimension) {
                    synchronizeUnits(newUnit, "dimension"); // Synchronize dimension units
                    // setDimensionUnit(newUnit); // Update dimension unit
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
                    synchronizeUnits(newUnit, "weight"); // Synchronize weight units
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
                tabIndex={0} // Make the dropdown focusable
                onFocus={() => console.log("Dropdown focused!")} // Debugging: Check if focus works
              >
                {question.dropdown_options.map((option, index) => (
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
              tabIndex={0} // Make the dropdown focusable
              disabled={isFormLocked}
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

      case "No Input Required":
        return (
          <div className="d-flex align-items-center gap-2">
            <span className="fs-14 text-color-typo-primary">
              {question.question_text}
            </span>
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
            question.question_type === "Dropdown" ||
            question.question_type === "No Input Required"
              ? "col-md-6"
              : "col-12"
          } mb-3`}
        >
          {question.question_type !== "No Input Required" && (
            <label className="fs-14 text-color-typo-primary mb-2 d-block">
              {question.question_text}
              {question.mandatory && <span> *</span>}
            </label>
          )}
          {renderField(question)}
        </div>
      );
    });
  };
  return (
    <>
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
              <p className="text-color-typo-primary fst-italic mb-0 opacity-70">
                Submission Last Date: {submissionLastDate}
              </p>

              <button
                className={`save-button ms-4 me-12 fs-14 fw-600 border-0 px-4 py-12 ${
                  isFormLocked
                    ? "bg-secondary text-white opacity-50 cursor-not-allowed"
                    : "bg-secondary text-white"
                }`}
                onClick={!isFormLocked ? saveSkuData : undefined}
                disabled={isFormLocked}
              >
                Save as Draft
              </button>

              <button
                className={`save-button px-4 py-12 fs-14 fw-600 border-0 ${
                  skuData.components.length > 0 &&
                  skuData.components.every(
                    (comp) => comp.form_status === "Completed",
                  )
                    ? "bg-secondary text-white"
                    : ""
                } ${isFormLocked ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={!isFormLocked ? handleValidateAndSubmit : undefined}
                disabled={isFormLocked}
              >
                Validate & Submit
              </button>
              <button
                type="button"
                className="btn p-0 border-none bg-transparent ps-3 border-start"
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
            <SkuValidation
              validationIssues={validationIssues}
              componentValidationIssues={componentValidationIssues} // Component form issues
              components={skuData.components} // List of added components
              show={showValidationModal}
              onClose={() => setShowValidationModal(false)}
              onProceed={proceedToSubmission} // This function submits the SKU
              imagesFromDB={imagesFromDB}
            />
          </div>
        </div>
      </div>
      {!isFormLocked && (
        <Autosave saveFunction={autosaveSkuData} dependencies={[skuData]} />
      )}
      <div className="d-flex align-items-center justify-content-end px-40 mt-2">
        {!isFormLocked && (
          <button
            type="button"
            className="btn text-primary bg-transparent fs-14 fw-600 p-0 d-flex align-items-center"
            data-bs-toggle="modal"
            data-bs-target="#importSkuDataModal"
          >
            <img
              src="/assets/images/import-icon.svg"
              className="me-2"
              alt="import-icon"
            />
            Import data from other SKUs
          </button>
        )}
      </div>

      <Importdata
        title="Import data from other SKUs"
        chooseComponentDrop={false}
        openModal="importSkuDataModal"
        infoTxt="This action will import primary packaging details and all component form data into the current SKU form."
        popoverTitle="All existing responses filled for this SKU will be overwritten."
        popoverConfirmTxt="Are you sure you want to proceed?"
        popoverInfoIcon="/assets/images/error-alert-triangle-icon.svg"
        onConfirmImport={handleImportFromSku} // Pass confirm handler
        currentPkoId={pkoId}
      />
      <Importdata
        title="Import component data"
        chooseComponentDrop
        openModal="importComponentDataModal"
        infoTxt="This action will import compnent data into the current component form."
        popoverTitle="All existing responses for this component will be overwritten."
        popoverConfirmTxt="Are you sure you want to proceed?"
        popoverInfoIcon="/assets/images/error-alert-triangle-icon.svg"
        onConfirmImport={(sku, pko, componentName) =>
          handleImportComponentData(sku, pko, componentName, activeComponentId)
        }
        currentPkoId={pkoId}
      />
      <div className="container-fluid px-5 d-flex flex-column container-height">
        {/* Header Section */}
        <div className="d-flex align-items-center justify-content-between py-3">
          <div className="d-flex align-items-center">
            <h6 className="fs-18 text-color-typo-primary mb-0 me-3">
              PKO Project ID: {pkoId}
            </h6>

            <span
              className={`fs-14 fw-600 px-2 py-6 text-nowrap d-flex align-items-center w-114
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
                  <h6 className="fs-22 fw-600 text-color-typo-primary">
                    Primary Packaging Details
                  </h6>
                  {/* <img src={addPackagePlusIcon} alt="Package Plus Icon" /> */}
                </div>
                <p className="fs-14 text-color-labels mb-30">
                  Provide all relevant primary packaging details for the SKU
                </p>

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
                  <h6 className="fs-22 fw-600 text-color-typo-primary mb-0">
                    SKU Components
                  </h6>
                  {/* Add SKU Component Button */}
                  {skuData.components.length > 0 && (
                    <div className="d-flex gap-3">
                      {/* Add Product Images Button */}
                      <button
                        className="btn btn-outline-primary"
                        onClick={handleAddProductImageClick}
                        disabled={isFormLocked} //disable if PKO is closed
                      >
                        + Add/View Images
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
                        disabled={isFormLocked} //disable if PKO is closed
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
                    <table className="table table-bordered fs-14 w-100 bg-transparent table-striped component-tbl mt-4">
                      <thead>
                        <tr>
                          <th scope="col">Component Type</th>
                          <th scope="col">Component Name</th>
                          <th className="text-center w-25" scope="col">
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
                            <td className="text-start align-middle">
                              {component?.component_type || "Not Available"}
                            </td>
                            <td className="align-middle">
                              {" "}
                              {editingIndex === index ? (
                                <input
                                  type="text"
                                  value={editedComponentName}
                                  onChange={(e) =>
                                    setEditedComponentName(e.target.value)
                                  }
                                  className="form-control"
                                />
                              ) : (
                                component.name
                              )}
                            </td>
                            <td className="text-start align-middle">
                              <span
                                className={`fs-14 d-inline-flex align-items-center py-6 px-2 rounded-pill fw-600 ${
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
                              {editingIndex === index ? (
                                <>
                                  <button
                                    className="btn btn-success btn-sm me-2"
                                    onClick={() => handleSaveEdit(index)}
                                  >
                                    Save
                                  </button>
                                  <button
                                    className="btn btn-secondary btn-sm"
                                    onClick={handleCancelEdit}
                                  >
                                    Cancel
                                  </button>
                                </>
                              ) : (
                                <>
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
                                  <span>
                                    {" "}
                                    <img
                                      src="/assets/images/action-icon-img.png"
                                      alt="Action"
                                      className="ms-2"
                                      style={{
                                        cursor: "pointer",
                                        width: "24px",
                                        height: "24px",
                                      }}
                                      onClick={() =>
                                        setOpenDropdownIndex(
                                          openDropdownIndex === index
                                            ? null
                                            : index,
                                        )
                                      }
                                    />
                                  </span>
                                  {openDropdownIndex === index && (
                                    <div
                                      className="dropdown-menu show"
                                      ref={dropdownRef} // Attach ref to the dropdown
                                    >
                                      <button
                                        className="dropdown-item"
                                        onClick={() =>
                                          handleEditComponent(index)
                                        }
                                        disabled={isFormLocked} //disable if PKO is closed
                                      >
                                        <img
                                          src="/assets/images/Edit.svg"
                                          alt="edit"
                                          className="me-2"
                                          style={{
                                            width: "16px",
                                            height: "16px",
                                          }}
                                        />
                                        Edit
                                      </button>
                                      <button
                                        type="button"
                                        className="dropdown-item"
                                        data-bs-toggle="modal"
                                        data-bs-target="#importComponentDataModal"
                                        onClick={() => {
                                          setActiveComponentId(component.id); //  Set the component ID to be replaced
                                        }}
                                        disabled={isFormLocked} //disable if PKO is closed
                                      >
                                        <img
                                          src="/assets/images/import-icon-black.svg"
                                          alt="import"
                                          className="me-2"
                                          style={{
                                            width: "16px",
                                            height: "16px",
                                          }}
                                        />
                                        Import Data
                                      </button>
                                      <button
                                        className="dropdown-item"
                                        onClick={() => {
                                          setComponentToDelete(component);
                                          setShowDeletePopup(true);
                                        }}
                                        disabled={isFormLocked} //disable if PKO is closed
                                      >
                                        <img
                                          src="/assets/images/delete-bin.svg"
                                          alt="delete"
                                          className="me-2"
                                          style={{
                                            width: "16px",
                                            height: "16px",
                                          }}
                                        />
                                        Delete
                                      </button>
                                    </div>
                                  )}
                                </>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {renderDeleteConfirmation()}

                    {/* Add Component Input Section */}
                    {skuData.showInput && (
                      <div
                        className="d-flex align-items-center gap-3 mt-3"
                        id="addSkuComponentBlock"
                      >
                        <select
                          className="form-select border border-color-typo-secondary rounded-2 h-44 px-12 fs-14 w-25"
                          id="dropdown"
                          value={selectedComponentType}
                          onChange={handleComponentTypeChange}
                          disabled={isFormLocked} //disable if PKO is closed
                        >
                          <option value="" disabled>
                            Component Type
                          </option>
                          {dropdownListComing &&
                            dropdownListComing?.options?.map((item) => {
                              return <option value={`${item}`}>{item}</option>;
                            })}
                        </select>
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
                          disabled={isFormLocked} //disable if PKO is closed
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
      {/* <VendorCommentPanel
              dropdownData={commentDropdownData}
              initialSelectedPkoId={pkoId}
              initialFilterPkoId={skuId}
            /> */}
      <VendorCommentPanel
        dropdownData={commentDropdownData}
        initialSelectedPkoId={pkoId}
        initialSelectedSkuId={skuId}
        initialFilterPkoId={pkoId}
        initialFilterSkuId={skuId}
      />
    </>
  );
};

export default Sku_Page;
