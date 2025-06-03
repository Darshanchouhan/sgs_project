import React, { useEffect, useRef, useContext, useState } from "react";
import { SkuContext } from "./SkuContext";
import Header from "../components/Header";
import Breadcrumb from "./Breadcrumb";
import "./../styles/style.css";
import axiosInstance from "../services/axiosInstance";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { PkgDataContext } from "./Pkg_DataContext"; // Import Context
import Autosave from "./AutoSave";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ProgressLoader from "./ProgressLoader"; // Import ProgressLoader
import Compo_ImageOverlay from "./Compo_ImageOverlay";
import Tooltip from "./Tooltip"; // Import Tooltip component
import ValidationModal from "./Validation";

const PkgDataForm = () => {
  const stateIncomingComponentPage = JSON.parse(
    localStorage.getItem("component_page_state"),
  );
  const { pkgData, setPkgData } = useContext(PkgDataContext); // Use Context
  const { skuData, setSkuData, setSkuDetails, setPkoData, skuDetails } =
    useContext(SkuContext);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const sectionRefs = useRef({}); // Store refs for each section
  const [isFormFilled, setIsFormFilled] = useState(false); // Track if the form is filled
  const {
    componentName,
    pkoId,
    description,
    skuId: passedSkuId,
  } = stateIncomingComponentPage || {};
  const [isOverlayVisible, setOverlayVisible] = useState(false);
  const [overlayImage, setOverlayImage] = useState(null);
  const [activeTooltipId, setActiveTooltipId] = useState(null); // State to track the active tooltip ID
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [unansweredQuestions, setUnansweredQuestions] = useState([]);
  const [isPreviousValidation, setIsPreviousValidation] = useState(false);
  const [persistentValidationErrors, setPersistentValidationErrors] = useState(
    [],
  );
  const skuPageState = JSON.parse(
    localStorage.getItem("sku_page_state") || "{}",
  );

  const isPkoClosed = skuPageState?.isPkoClosed;
  const isFormLocked =
    isPkoClosed || ["Inreview", "Approved"].includes(skuDetails?.status);

  const [isFullValidation, setIsFullValidation] = useState(false); // Step 1: Create a flag

  console.log(skuData, description);

  const handleNextClick = () => {
    if (isFormLocked) {
      const sectionKeys = Object.keys(pkgData.sections);
      const currentIndex = sectionKeys.indexOf(pkgData.activeSection);
      if (currentIndex < sectionKeys.length - 1) {
        const nextSectionKey = sectionKeys[currentIndex + 1];
        setPkgData((prev) => ({ ...prev, activeSection: nextSectionKey }));
        sectionRefs.current[nextSectionKey]?.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
      return;
    }

    setIsPreviousValidation(false);
    const sectionKeys = Object.keys(pkgData.sections);
    const currentIndex = sectionKeys.indexOf(pkgData.activeSection);
    const validationResults = validateCurrentSection();
    setUnansweredQuestions(validationResults);
    if (validationResults.length > 0) {
      setShowValidationModal(true);
    } else if (currentIndex < sectionKeys.length - 1) {
      const nextSectionKey = sectionKeys[currentIndex + 1];
      setPkgData((prev) => ({ ...prev, activeSection: nextSectionKey }));
      sectionRefs.current[nextSectionKey]?.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const handlePreviousClick = () => {
    if (isFormLocked) {
      proceedToPreviousSection();
      return;
    }

    setIsPreviousValidation(true); // Indicate this is a Previous operation
    const validationResults = validateCurrentSection(); // Validate current section
    setUnansweredQuestions(validationResults); // Update unanswered questions state

    if (validationResults.length > 0) {
      // Show the validation modal if there are unanswered questions
      setShowValidationModal(true);
    } else {
      // If no validation issues, proceed to the previous section
      proceedToPreviousSection();
    }
  };

  const checkImagePath = (path) => {
    const pattern = /^\/assets\/images\/[\w-]+\.(png|jpg|jpeg|gif|bmp)$/;
    return pattern.test(path);
  };

  const handleInfoClick = (questionText) => {
    const bottleJarFields = ["T", "E", "H", "S", "I"];
    const componentFields = [
      "Component Length (outside)",
      "Component Width (outside)",
      "Component Depth (outside)",
    ];

    if (bottleJarFields.includes(questionText)) {
      setOverlayImage("/assets/images/component_bottle.png"); // Bottle image
      setOverlayVisible(true);
    } else if (componentFields.includes(questionText)) {
      setOverlayImage("/assets/images/component_dimension.png"); // Component image
      setOverlayVisible(true);
    }
  };

  const handleProceedToNextSection = () => {
    const sectionKeys = Object.keys(pkgData.sections); // Get all section keys
    const currentIndex = sectionKeys.indexOf(pkgData.activeSection); // Get the index of the current section

    if (currentIndex < sectionKeys.length - 1) {
      const nextSectionKey = sectionKeys[currentIndex + 1]; // Determine the next section key
      setPkgData((prev) => ({ ...prev, activeSection: nextSectionKey })); // Update the active section
      //Update persistent errors with unanswered questions
      setPersistentValidationErrors(
        unansweredQuestions.map((q) => q.question_id),
      );

      // Scroll to the next section
      sectionRefs.current[nextSectionKey]?.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      setShowValidationModal(false); // Close the modal
    }
  };

  const proceedToPreviousSection = () => {
    const sectionKeys = Object.keys(pkgData.sections);
    const currentIndex = sectionKeys.indexOf(pkgData.activeSection);

    if (currentIndex > 0) {
      const previousSection = sectionKeys[currentIndex - 1];

      // Validate current section before proceeding
      const validationResults = validateCurrentSection();

      // Update persistent errors with current section's validation results
      setPersistentValidationErrors((prev) => {
        const currentSectionErrors = validationResults.map(
          (q) => q.question_id,
        );
        return [...new Set([...prev, ...currentSectionErrors])];
      });

      // Set the active section to the previous section
      setPkgData((prev) => ({
        ...prev,
        activeSection: previousSection,
      }));

      // Scroll to the previous section
      sectionRefs.current[previousSection]?.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      setShowValidationModal(false);
    }
  };

  const handleSaveDraft = async () => {
    if (isFormLocked) {
      alert("This PKO is closed. You cannot edit or submit any form.");
      return;
    }
    try {
      setIsPreviousValidation(false);

      // Step 1: Fetch old component progress before saving
      const oldComponentProgressRes = await axiosInstance.get(
        `/sku/${skuId}/components/${skuData.componentId}/?pko_id=${pkoId}`,
      );
      const oldProgress = oldComponentProgressRes.data?.component_progress || 0;

      // Step 2: Save updated component
      await handleSave();

      // Step 3: Fetch new component progress after save
      const newComponentProgressRes = await axiosInstance.get(
        `/sku/${skuId}/components/${skuData.componentId}/?pko_id=${pkoId}`,
      );
      const newProgress = newComponentProgressRes.data?.component_progress || 0;

      // Step 4: Update SKU progress using delta logic
      await updateSkuProgress(oldProgress, newProgress);

      // Step 5: Update PKO progress
      await updatePkoProgress();
    } catch (error) {
      console.error(" Error in handleSaveDraft:", error);
    }
  };

  const handleBackSavePkoProgress = async () => {
    try {
      // Step 1: Fetch old component progress before saving
      const oldComponentProgressRes = await axiosInstance.get(
        `/sku/${skuId}/components/${skuData.componentId}/?pko_id=${pkoId}`,
      );
      const oldProgress = oldComponentProgressRes.data?.component_progress || 0;

      // Step 2: Save updated component
      await handleSave(false);

      // Step 3: Fetch new component progress after save
      const newComponentProgressRes = await axiosInstance.get(
        `/sku/${skuId}/components/${skuData.componentId}/?pko_id=${pkoId}`,
      );
      const newProgress = newComponentProgressRes.data?.component_progress || 0;

      // Step 4: Update SKU progress using delta logic
      await updateSkuProgress(oldProgress, newProgress);

      // Step 5: Update PKO progress
      await updatePkoProgress();
    } catch (error) {
      console.error(" Error in handleSaveDraft:", error);
    }
  };

  const validateAllSections = () => {
    const allUnansweredQuestions = [];

    // Loop through all sections
    Object.entries(pkgData.sections).forEach(([sectionName, questions]) => {
      questions.forEach((question) => {
        const isAnswered =
          pkgData.answers[question.question_id] !== undefined &&
          pkgData.answers[question.question_id] !== "";

        // Check if the question is visible
        const isVisible = isAnswerMatch(
          question.dependent_question,
          pkgData.answers,
          Object.values(pkgData.sections).flat(),
        );

        if (isVisible) {
          if (question.mandatory && !isAnswered) {
            allUnansweredQuestions.push({
              section: sectionName,
              question_id: question.question_id,
              fieldName: question.question_text,
              issue: "Please provide response for all the mandatory fields",
            });
          }

          // Validation for fields with "validationdependency": "Y"
          if (
            question.validationdependency === "Y" &&
            question.validation_dropdown &&
            isAnswered
          ) {
            let selectedUnit = pkgData.answers[`${question.question_id}_unit`];
            const enteredValue = parseFloat(
              pkgData.answers[question.question_id],
            );

            // Get the selected "Component Type"
            const componentTypeQuestion = Object.values(pkgData.sections)
              .flat()
              .find((q) => q.question_text === "Component Type");

            const componentTypeQuestionId = componentTypeQuestion?.question_id;
            const selectedComponentType =
              pkgData.answers[componentTypeQuestionId];

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
                  (enteredValue < rule.min_weight ||
                    enteredValue > rule.max_weight)
                ) {
                  issue = `Weight should be between ${rule.min_weight} and ${rule.max_weight} ${selectedUnit}`;
                } else if (
                  rule.min_length !== undefined &&
                  rule.max_length !== undefined &&
                  (enteredValue < rule.min_length ||
                    enteredValue > rule.max_length)
                ) {
                  issue = `Length should be between ${rule.min_length} and ${rule.max_length} ${selectedUnit}`;
                } else if (
                  rule.min_width !== undefined &&
                  rule.max_width !== undefined &&
                  (enteredValue < rule.min_width ||
                    enteredValue > rule.max_width)
                ) {
                  issue = `Width should be between ${rule.min_width} and ${rule.max_width} ${selectedUnit}`;
                } else if (
                  rule.min_depth !== undefined &&
                  rule.max_depth !== undefined &&
                  (enteredValue < rule.min_depth ||
                    enteredValue > rule.max_depth)
                ) {
                  issue = `Depth should be between ${rule.min_depth} and ${rule.max_depth} ${selectedUnit}`;
                }

                if (issue) {
                  allUnansweredQuestions.push({
                    section: sectionName,
                    question_id: question.question_id,
                    fieldName: question.question_text,
                    issue: `${question.question_text} ${issue}`,
                  });
                }
              }
            }
          }
        }
      });
    });
    console.log("all unanswerd question", allUnansweredQuestions);
    return allUnansweredQuestions;
  };

  const handleBackToCurrentSection = () => {
    setShowValidationModal(false); // Close the modal
    setIsFullValidation(false); // Reset the flag
    setIsPreviousValidation(false); // Reset Previous validation flag
  };

  const validateCurrentSection = () => {
    const unansweredQuestions = [];
    const errorIds = [];

    // Get the selected "Component Type"
    const componentTypeQuestion = Object.values(pkgData.sections)
      .flat()
      .find((q) => q.question_text === "Component Type");

    const componentTypeQuestionId = componentTypeQuestion?.question_id;
    const selectedComponentType = pkgData.answers[componentTypeQuestionId];

    console.log("Selected Component Type:", selectedComponentType);

    // Get all active questions
    const activeSectionQuestions =
      pkgData.sections[pkgData.activeSection] || [];

    activeSectionQuestions.forEach((question) => {
      const isAnswered =
        pkgData.answers[question.question_id] !== undefined &&
        pkgData.answers[question.question_id] !== "";

      // Check if the question is visible
      const isVisible = isAnswerMatch(
        question.dependent_question,
        pkgData.answers,
        Object.values(pkgData.sections).flat(),
      );

      if (isVisible) {
        if (question.mandatory && !isAnswered) {
          unansweredQuestions.push({
            question_id: question.question_id,
            fieldName: question.question_text,
            issue: "Please provide response for all the mandatory fields",
          });
          errorIds.push(question.question_id); // Add question ID to error list
        }

        // **Validation for all fields with "validationdependency": "Y"**
        if (
          question.validationdependency === "Y" &&
          question.validation_dropdown
        ) {
          let selectedUnit = pkgData.answers[`${question.question_id}_unit`];

          const enteredValue = parseFloat(
            pkgData.answers[question.question_id],
          );

          console.log("Checking validation for:", question.question_text);
          console.log(
            "Entered Value:",
            enteredValue,
            "Selected Unit:",
            selectedUnit,
            "package data naswer:",
            pkgData.answers,
          );

          // Assign Default Unit if Missing
          if (!selectedUnit && question.dropdown_options?.length > 0) {
            selectedUnit = question.dropdown_options[0]; // Set the first unit as default
            // setPkgData((prev) => ({
            //   ...prev,
            //   answers: {
            //     ...prev.answers,
            //     [`${question.question_id}_unit`]: selectedUnit, // Save to answers
            //   },
            // }));
            // console.log(
            //   `Auto-selected default unit "${selectedUnit}" for ${question.question_text}`
            // );
          }

          if (selectedComponentType && selectedUnit && !isNaN(enteredValue)) {
            const validationRules = question.validation_dropdown.filter(
              (rule) =>
                rule.name?.toLowerCase() ===
                  selectedComponentType?.toLowerCase() &&
                rule.unit?.toLowerCase() === selectedUnit?.toLowerCase(),
            );
            console.log(
              "validation rules",
              selectedUnit,
              validationRules,
              question.dropdown_options[0],
            );
            if (validationRules.length > 0) {
              console.log(
                "Validation Rules Found for:",
                question.question_text,
                validationRules[0],
              );

              const rule = validationRules[0];
              let issue = null;

              if (
                rule.min_weight !== undefined &&
                rule.max_weight !== undefined &&
                (enteredValue < rule.min_weight ||
                  enteredValue > rule.max_weight)
              ) {
                issue = `Weight should be between ${rule.min_weight} and ${rule.max_weight} ${selectedUnit}`;
              } else if (
                rule.min_length !== undefined &&
                rule.max_length !== undefined &&
                (enteredValue < rule.min_length ||
                  enteredValue > rule.max_length)
              ) {
                issue = `Length should be between ${rule.min_length} and ${rule.max_length} ${selectedUnit}`;
              } else if (
                rule.min_width !== undefined &&
                rule.max_width !== undefined &&
                (enteredValue < rule.min_width || enteredValue > rule.max_width)
              ) {
                issue = `Width should be between ${rule.min_width} and ${rule.max_width} ${selectedUnit}`;
              } else if (
                rule.min_depth !== undefined &&
                rule.max_depth !== undefined &&
                (enteredValue < rule.min_depth || enteredValue > rule.max_depth)
              ) {
                issue = `Depth should be between ${rule.min_depth} and ${rule.max_depth} ${selectedUnit}`;
              }

              if (issue) {
                unansweredQuestions.push({
                  question_id: question.question_id,
                  fieldName: question.question_text,
                  issue: `${question.question_text} ${issue}`,
                });
                errorIds.push(question.question_id); // Add question ID to error list
              }
            } else {
              console.log(
                "No matching validation rule found for",
                question.question_text,
              );
            }
          }
        }
      }
    });
    // Update persistent errors
    setPersistentValidationErrors((prev) => [
      ...new Set([...prev, ...errorIds]),
    ]);

    console.log("Final Validation Issues:", unansweredQuestions);
    return unansweredQuestions;
  };

  useEffect(() => {
    if (showValidationModal) {
      // Step 3: Check the flag before validating the current section
      if (!isFullValidation) {
        setUnansweredQuestions(validateCurrentSection()); // Update modal dynamically
      }
    }
  }, [pkgData.answers, showValidationModal, isFullValidation]);

  // Fallback to skuData.skuId if not explicitly passed
  const skuId = passedSkuId || skuData?.skuId || "N/A";
  // const isFirstLoad = useRef(true);

  const autosavePkgData = async () => {
    await handleSave(false); // Call handleSave with showAlert = false
  };

  // Dynamically recalculate progress whenever answers or visibility changes
  useEffect(() => {
    const calculatePkgFormProgress = () => {
      let totalMandatory = 0;
      let answeredMandatory = 0;

      Object.values(pkgData.sections)
        .flat()
        .forEach((question) => {
          const isVisible = isAnswerMatch(
            question.dependent_question,
            pkgData.answers,
            Object.values(pkgData.sections).flat(),
          );

          if (isVisible && question.mandatory) {
            console.log(
              "question visible",
              question.question_id,
              question.question_text,
            );
            totalMandatory++;
            if (
              pkgData.answers[question.question_id] !== undefined &&
              pkgData.answers[question.question_id] !== ""
            ) {
              answeredMandatory++;
              console.log(
                "question anser available",
                question.questionId,
                question.question_text,
                pkgData.answers[question.question_id],
              );
            }
          }
        });
      console.log(
        "answer and question progress logic 3",
        answeredMandatory,
        totalMandatory,
        pkgData.answers,
      );
      const progressPercentage =
        totalMandatory > 0 ? (answeredMandatory / totalMandatory) * 100 : 0;

      setPkgData((prev) => ({
        ...prev,
        totalMandatoryCount: totalMandatory,
        mandatoryAnsweredCount: answeredMandatory,
        pkgFormProgress: progressPercentage,
      }));
    };

    calculatePkgFormProgress();
  }, [pkgData.answers, pkgData.sections, setPkgData]);

  useEffect(() => {
    if (stateIncomingComponentPage) {
      setSkuDetails((prev) => stateIncomingComponentPage?.skuDetails || prev);
      setPkoData((prev) => stateIncomingComponentPage?.pkoData || prev);

      setSkuData((prev) => ({
        ...prev,
        skuId: stateIncomingComponentPage?.skuId || prev.skuId,
        componentId:
          stateIncomingComponentPage?.componentId || prev.componentId,
        componentName:
          stateIncomingComponentPage?.componentName || prev.componentName,
        formStatus: stateIncomingComponentPage?.formStatus || prev.formStatus,
      }));

      // Reset answers when componentId changes
      setPkgData((prev) => ({
        ...prev,
        answers: {}, // Clear previous answers
        activeSection: "Component Information", // Reset to default section
      }));
    }
  }, [setSkuDetails, setPkoData, setSkuData, setPkgData]);

  useEffect(() => {
    if (pkgData.sections && stateIncomingComponentPage?.responses) {
      console.log(
        stateIncomingComponentPage?.responses,
        "stateIncomingComponentPage?.responses",
      );
      const answers = {};
      if (Object.keys(stateIncomingComponentPage?.responses).length > 0) {
        Object.entries(stateIncomingComponentPage?.responses).forEach(
          ([questionText, response]) => {
            const question = Object.values(pkgData.sections)
              .flat()
              .find(
                (q) =>
                  q.question_text === questionText.split("||")[0] &&
                  q.question_id == questionText.split("||")[1],
              );

            if (question) {
              // Extract numeric value and unit if present
              if (
                question.question_type === "Integer + Dropdown" ||
                question.question_type === "Float + Dropdown"
              ) {
                const regex = /^(\d+(\.\d+)?)([a-zA-Z]+)$/; // Match number and unit
                const match = response.match(regex);

                if (match) {
                  const value = parseFloat(match[1]); // Extract numeric part (integer or float)
                  const unit = match[3]; // Extract unit part

                  answers[question.question_id] = value;
                  answers[`${question.question_id}_unit`] = unit;
                } else {
                  answers[question.question_id] = response;
                }
              } else {
                answers[question.question_id] = response;
              }
            }
          },
        );
      } else {
        answers[24] = stateIncomingComponentPage?.component_type;
      }

      setPkgData((prev) => ({
        ...prev,
        answers,
      }));
    }
  }, [pkgData.sections, setPkgData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("questionnaire/");
        const data = response.data;

        processQuestions(data); // Process the fetched data
      } catch (error) {
        console.error("Error fetching questionnaire data:", error);
      } finally {
        setLoading(false);
      }
    };

    const processQuestions = (data) => {
      const questions = data.components[0].component_questions;
      const questionMap = new Map();

      let totalMandatory = 0;
      let answeredMandatory = 0;
      //populate the questionMap with initial questions
      questions.forEach((q) => {
        if (!q.question_id) {
          console.warn(`Question without an ID found:`, q);
        } else {
          questionMap.set(q.question_id, { ...q, children: [] });
        }
      });
      // Add child questions to their respective parents
      questions.forEach((q) => {
        if (q.dependent_question) {
          const dependentQuestions = Array.isArray(q.dependent_question)
            ? q.dependent_question
            : [q.dependent_question];

          dependentQuestions.forEach((parentId) => {
            if (questionMap.has(parentId)) {
              questionMap.get(parentId).children.push(q);
            } else {
              console.warn(
                `Parent question with ID ${parentId} not found for question ${q.question_id}.`,
              );
            }
          });
        }
      });
      console.log(
        "calcuate progess anser and total question",
        answeredMandatory,
        totalMandatory,
      );
      // Group questions into sections
      const groupedSections = {};
      Array.from(questionMap.values()).forEach((question) => {
        const section = question.section || "Uncategorized";
        if (!groupedSections[section]) {
          groupedSections[section] = [];
        }
        groupedSections[section].push(question);
      });

      setPkgData((prev) => ({
        ...prev,
        sections: groupedSections,
        totalMandatoryCount: totalMandatory,
        mandatoryAnsweredCount: answeredMandatory,
      }));
    };

    fetchData();
  }, []);

  console.log(" SKU ID used in updateSkuProgress:", skuId);

  const updateSkuProgress = async (oldProgress, newProgress) => {
    try {
      if (!skuId || skuId === "N/A") {
        console.warn(" Invalid SKU ID. Skipping updateSkuProgress.");
        return;
      }

      const res = await axiosInstance.get(`/skus/${skuId}/?pko_id=${pkoId}`);
      const data = res.data;
      const totalComponents = (data.components || []).length;
      const oldSkuProgress = data.sku_progress || 0;

      if (totalComponents === 0) {
        console.warn("⚠️ No components found. Cannot update SKU progress.");
        return;
      }

      const delta = ((newProgress - oldProgress) * 0.9) / totalComponents;
      let updatedSkuProgress = Math.round(oldSkuProgress + delta);
      updatedSkuProgress = Math.max(0, Math.min(100, updatedSkuProgress)); // Clamp to 0–100

      await axiosInstance.put(`/skus/${skuId}/`, {
        sku_id: skuId,
        pko_id: pkoId,
        sku_progress: updatedSkuProgress,
      });

      //  Fix: Update status separately
      // await updateSkuStatus(
      //   skuId,
      //   updatedSkuProgress === 100 ? "Completed" : "Draft"
      // );

      console.log(
        " SKU progress updated incrementally to:",
        updatedSkuProgress,
      );
    } catch (error) {
      console.error("Error updating SKU progress:", error);
    }
  };

  const updatePkoProgress = async () => {
    if (!pkoId) {
      console.warn("Cannot update PKO progress: Missing pkoId.");
      return;
    }

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

      const res = await axiosInstance.put(`/update-pko-progress/`, {
        pko_id: pkoId,
        pko_progress: overallProgress,
      });

      console.log("PKO progress updated:", res.data.message || overallProgress);
    } catch (error) {
      console.error("Error updating PKO progress:", error);
    }
  };

  const handleBackClick = async () => {
    setLoading(true); // Show loader immediately
    await handleBackSavePkoProgress(); // Call save function with false flag to skip alert
    navigate("/skus"); // Navigate back after saving
  };

  const handleBackToSkuClick = async () => {
    if (isFormLocked) {
      // Skip validation completely
      await handleSave(false); // Save data silently
      handleBackClick(); // Navigate back
      return;
    }
    setIsFullValidation(true);
    const allValidationResults = validateAllSections();
    setUnansweredQuestions(allValidationResults);

    if (allValidationResults.length > 0) {
      // Update persistent errors before showing the modal
      setPersistentValidationErrors(
        allValidationResults.map((q) => q.question_id),
      );
      setShowValidationModal(true);
    } else {
      // Call handleSave before navigating back
      await handleSave(false); // Call save function with false flag to skip alert
      handleBackClick(); // Navigate back after saving
    }
  };

  const handleInputChange = (questionId, value) => {
    setPkgData((prev) => {
      const updatedAnswers = { ...prev.answers };

      // Set the new value (allow 0)
      updatedAnswers[questionId] = value === "" ? "" : value;

      // Find the current question
      const currentQuestion = Object.values(pkgData.sections)
        .flat()
        .find((q) => q.question_id === questionId);

      // Default unit setup
      if (
        (currentQuestion?.question_type === "Float + Dropdown" ||
          currentQuestion?.question_type === "Integer + Dropdown") &&
        !updatedAnswers[`${questionId}_unit`]
      ) {
        updatedAnswers[`${questionId}_unit`] =
          currentQuestion.dropdown_options[0];
      }

      //  Update dependent questions: clear answers only if they become invisible
      const allQuestions = Object.values(pkgData.sections).flat();

      allQuestions.forEach((question) => {
        if (question.dependent_question) {
          const isNowVisible = isAnswerMatch(
            question.dependent_question,
            pkgData.answers,
            Object.values(pkgData.sections).flat(),
          );

          // If it depends on this input and becomes hidden => clear its answer
          const dependsOnThisInput = (() => {
            const dep = question.dependent_question;
            if (!dep || typeof dep !== "object") return false;

            const mainMatch = dep.main_dependency?.question_id === questionId;
            const andMatch = dep.and_condition?.question_id === questionId;
            return mainMatch || andMatch;
          })();

          if (dependsOnThisInput && !isNowVisible) {
            delete updatedAnswers[question.question_id];
            delete updatedAnswers[`${question.question_id}_unit`];
          }
        }
      });

      //  Recalculate progress
      let totalMandatory = 0;
      let answeredMandatory = 0;

      allQuestions.forEach((question) => {
        const isVisible = isAnswerMatch(
          question.dependent_question,
          pkgData.answers,
          Object.values(pkgData.sections).flat(),
        );

        if (isVisible && question.mandatory) {
          totalMandatory++;
          const ans = updatedAnswers[question.question_id];
          if (ans !== undefined && ans !== "") {
            answeredMandatory++;
          }
        }
      });

      const progressPercentage =
        totalMandatory > 0 ? (answeredMandatory / totalMandatory) * 100 : 0;

      // Clear persistent errors for this question if answered
      setPersistentValidationErrors((prevErrors) =>
        prevErrors.filter((id) => id !== questionId),
      );

      return {
        ...prev,
        answers: updatedAnswers,
        totalMandatoryCount: totalMandatory,
        mandatoryAnsweredCount: answeredMandatory,
        pkgFormProgress: progressPercentage,
      };
    });
  };

  useEffect(() => {
    const hasAnswers = Object.values(pkgData.answers).some(
      (answer) => answer !== undefined && answer !== "",
    );
    setIsFormFilled(hasAnswers);
  }, [pkgData.answers]);

  // const isAnswerMatch = (dependentQuestionObj, answers) => {
  //   // No dependency → always visible
  //   if (!dependentQuestionObj || typeof dependentQuestionObj !== "object") {
  //     return true;
  //   }

  //   const { main_dependency, and_condition } = dependentQuestionObj;

  //   // Validate presence of main_dependency
  //   if (
  //     !main_dependency?.question_id ||
  //     !Array.isArray(main_dependency.expected_values)
  //   ) {
  //     return false; // if dependency structure is incorrect
  //   }

  //   const mainAnswer = answers[`${main_dependency.question_id}`];
  //   const mainConditionMet =
  //     main_dependency.expected_values.includes(mainAnswer);

  //   let andConditionMet = true;

  //   if (
  //     and_condition?.question_id &&
  //     and_condition?.expected_value !== undefined
  //   ) {
  //     const andAnswer = answers[`${and_condition.question_id}`];
  //     andConditionMet = andAnswer === and_condition.expected_value;
  //   }

  //   // Return only if BOTH match
  //   return mainConditionMet && andConditionMet;
  // };

  //dependentQuestionObj is object that defines the dependency logic (main_dependency and optionally and_condition
  const isAnswerMatch = (dependentQuestionObj, answers, questionsList = []) => {
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

  const renderField = (question) => {
    const handleChange = (e) =>
      handleInputChange(question.question_id, e.target.value);
    const hasError =
      !isFormLocked &&
      persistentValidationErrors.includes(question.question_id);
    // Apply conditional styles based on validation errors
    const inputClass = hasError ? "input-error" : "";

    const isOutsideDimension = /outside/i.test(question.question_text);
    const isInsideDimension = /inside/i.test(question.question_text);

    const synchronizeUnits = (newUnit, groupType) => {
      const unitFields =
        groupType === "outside"
          ? [
              "Component Length (outside)",
              "Component Width (outside)",
              "Component Depth (outside)",
            ]
          : [
              "Component Length (inside)",
              "Component Width (inside)",
              "Component Depth (inside)",
            ];

      setPkgData((prev) => {
        const updatedAnswers = { ...prev.answers };

        unitFields.forEach((field) => {
          const question = Object.values(pkgData.sections)
            .flat()
            .find((q) => q.question_text === field);

          if (question) {
            updatedAnswers[`${question.question_id}_unit`] = newUnit;
          }
        });

        return { ...prev, answers: updatedAnswers };
      });
    };

    // eslint-disable-next-line default-case
    switch (question.question_type) {
      case "Varchar":
        return (
          <div className="input-group align-items-center">
            <input
              maxLength="100"
              className={`h-42 w-100 ${inputClass}`}
              type="text"
              value={pkgData.answers[question.question_id] || ""}
              placeholder={question.placeholder || "Enter value"}
              onChange={handleChange}
              tabIndex={0} // Make the input focusable
              disabled={isFormLocked}
            />
          </div>
        );

      case "Single Select Radio Button":
        return (
          <div className="align-items-center me-2">
            {["Yes", "No"].map((option) => (
              <label key={option} className="me-3">
                <input
                  type="radio"
                  className={`me-2 ${inputClass}`}
                  name={question.question_id}
                  value={option}
                  checked={pkgData.answers[question.question_id] === option}
                  onChange={handleChange}
                  disabled={isFormLocked}
                />
                {option}
              </label>
            ))}
          </div>
        );

      case "Dropdown":
        return (
          <div className="input-group align-items-center select-arrow-pos">
            <select
              className={`w-100 ${inputClass}`}
              value={pkgData.answers[question.question_id] || ""}
              onChange={handleChange}
              tabIndex={0} // Make focusable
              disabled={isFormLocked}
            >
              <option value="">Select an option</option>
              {question.dropdown_options
                .filter((option) => option !== "Component")
                .map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
            </select>
          </div>
        );

      case "Float + Dropdown":
        return (
          <div className="input-group align-items-center">
            {/* Input for the float value */}
            <input
              className={`h-42 w-75 ${inputClass}`}
              type="text" // Use text to allow decimal inputs
              value={pkgData.answers[question.question_id] ?? ""}
              placeholder={question.placeholder || "Enter value"}
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
                  !(e.ctrlKey || e.metaKey)
                ) {
                  e.preventDefault();
                }
                // Prevent more than one dot
                if (e.key === "." && e.target.value.includes(".")) {
                  e.preventDefault();
                }
              }}
              onPaste={(e) => {
                // Prevent pasting non-numeric values
                const pasteData = e.clipboardData.getData("text");
                if (!/^\d*\.?\d*$/.test(pasteData)) {
                  e.preventDefault();
                }
              }}
              tabIndex={0} // Make focusable
              disabled={isFormLocked}
            />

            {/* Dropdown for the unit selection */}
            <select
              className="bg-color-light-shade form-list w-25"
              value={
                pkgData.answers[`${question.question_id}_unit`] ||
                question.dropdown_options[0] // Ensure default unit selection
              }
              onChange={(e) => {
                const newUnit = e.target.value;
                handleInputChange(`${question.question_id}_unit`, newUnit);

                // Synchronize units for dimensions if necessary
                if (isOutsideDimension) {
                  synchronizeUnits(newUnit, "outside");
                } else if (isInsideDimension) {
                  synchronizeUnits(newUnit, "inside");
                }
              }}
              tabIndex={0} // Make focusable
              disabled={isFormLocked}
            >
              {question.dropdown_options.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>

            {/* Overlay for specific questions */}
            {isOverlayVisible && overlayImage && (
              <Compo_ImageOverlay
                onClose={() => setOverlayVisible(false)}
                imagePath={overlayImage}
              />
            )}
          </div>
        );

      case "Integer + Dropdown":
        return (
          <div className="input-group align-items-center">
            <input
              className={`h-42 w-75 ${inputClass}`}
              type="number"
              onWheel={(e) => e.target.blur()}
              step="1"
              value={pkgData.answers[question.question_id] ?? ""}
              placeholder={question.placeholder || "Enter value"}
              onChange={handleChange}
              onKeyDown={(e) => {
                if (
                  !/^\d$/.test(e.key) &&
                  e.key !== "Backspace" &&
                  e.key !== "Delete" &&
                  e.key !== "ArrowLeft" &&
                  e.key !== "ArrowRight" &&
                  e.key !== "Tab" &&
                  !(e.ctrlKey || e.metaKey)
                ) {
                  e.preventDefault();
                }
              }}
              onPaste={(e) => {
                // Prevent pasting non-numeric values
                const pasteData = e.clipboardData.getData("text");
                if (!/^\d*\.?\d*$/.test(pasteData)) {
                  e.preventDefault();
                }
              }}
              tabIndex={0} // Make focusable
              disabled={isFormLocked}
            />
            <select
              className="bg-color-light-shade form-list w-25"
              value={pkgData.answers[`${question.question_id}_unit`] || ""}
              onChange={(e) => {
                const newUnit = e.target.value;

                handleInputChange(`${question.question_id}_unit`, newUnit);

                if (isOutsideDimension) {
                  synchronizeUnits(newUnit, "outside");
                } else if (isInsideDimension) {
                  synchronizeUnits(newUnit, "inside");
                }
              }}
              tabIndex={0} // Make focusable
              disabled={isFormLocked}
            >
              {question.dropdown_options.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        );

      case "Integer":
        return (
          <div className="input-group align-items-center">
            <input
              className={`h-42 w-100 ${inputClass}`}
              type="number"
              step="1"
              value={pkgData.answers[question.question_id] ?? ""}
              placeholder={question.placeholder || "Enter value"}
              onChange={handleChange}
              onWheel={(e) => e.target.blur()}
              onKeyDown={(e) => {
                if (
                  !/^\d$/.test(e.key) &&
                  e.key !== "Backspace" &&
                  e.key !== "Delete" &&
                  e.key !== "ArrowLeft" &&
                  e.key !== "ArrowRight" &&
                  e.key !== "Tab" &&
                  !(e.ctrlKey || e.metaKey)
                ) {
                  e.preventDefault();
                }
              }}
              onPaste={(e) => {
                // Prevent pasting non-numeric values
                const pasteData = e.clipboardData.getData("text");
                if (!/^\d*\.?\d*$/.test(pasteData)) {
                  e.preventDefault();
                }
              }}
              tabIndex={0} // Make focusable
              disabled={isFormLocked}
            />
          </div>
        );

      case "Float":
        return (
          <div className="input-group align-items-center">
            <input
              className={`h-42 w-100 ${inputClass}`}
              type="text" // Use text to allow decimal inputs
              value={pkgData.answers[question.question_id] ?? ""}
              placeholder={question.placeholder || "Enter value"}
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
                  !(e.ctrlKey || e.metaKey)
                ) {
                  e.preventDefault();
                }
                // Prevent more than one dot
                if (e.key === "." && e.target.value.includes(".")) {
                  e.preventDefault();
                }
              }}
              onPaste={(e) => {
                // Prevent pasting non-numeric values
                const pasteData = e.clipboardData.getData("text");
                if (!/^\d*\.?\d*$/.test(pasteData)) {
                  e.preventDefault();
                }
              }}
              tabIndex={0} // Make focusable
              disabled={isFormLocked}
            />
          </div>
        );

      default:
        return null;
    }
  };

  const renderQuestions = (questions) => {
    console.log(pkgData.sections, "pkgData.sections", pkgData.answers);
    return questions.map((question) => {
      // Collect all parent answers
      const isDependentVisible = isAnswerMatch(
        question.dependent_question,
        pkgData.answers,
        Object.values(pkgData.sections).flat(),
      );
      if (question.dependent_question && !isDependentVisible) {
        return null; // Skip rendering if conditions aren't met
      }
      const hasError =
        !isFormLocked &&
        persistentValidationErrors.includes(question.question_id);
      // Info Icon with Instructions
      const infoIcon = checkImagePath(question.instructions) ? (
        <InfoOutlinedIcon
          className="info-icon"
          titleAccess={question.instructions} // Display on hover
          onClick={() => handleInfoClick(question.question_text)}
        />
      ) : (
        question.instructions && (
          <Tooltip
            id={question.question_id}
            instructions={question.instructions}
            activeTooltipId={activeTooltipId}
            setActiveTooltipId={setActiveTooltipId}
          />
        )
      );

      return (
        <div className="col-12 col-md-6 col-xl-8 col-xxxl-6">
          <div className="form-group mt-4" key={question.question_id}>
            <div className="d-flex justify-content-between align-items-center mb-2 h-26">
              <label className={`mb-0 ${hasError ? "label-error" : ""}`}>
                {question.mandatory ? (
                  <>
                    {question.question_text}{" "}
                    <span className="text-secondary">*</span>
                  </>
                ) : (
                  question.question_text
                )}
              </label>
              <span className="ms-2">{infoIcon}</span>
            </div>
            {renderField(question)}
          </div>
        </div>
      );
    });
  };

  const renderSections = () => {
    return Object.entries(pkgData.sections).map(([section, questions]) => {
      if (!sectionRefs.current[section]) {
        sectionRefs.current[section] = React.createRef();
      }

      return (
        section === pkgData.activeSection && (
          <div
            className="form-section mt-5"
            key={section}
            ref={sectionRefs.current[section]}
          >
            <h6 className="text-color-typo-secondary fw-600 form-heading d-flex align-items-center text-nowrap mb-3">
              {section}
            </h6>
            <div className="form-fields d-block">
              <div className="row flex-column">
                {renderQuestions(questions)}
              </div>
            </div>
          </div>
        )
      );
    });
  };
  const handleSave = async (showAlert = true) => {
    if (isFormLocked && !handleBackClick) {
      console.warn("PKO is closed. Save skipped.");
      return;
    }
    if (!skuId || !skuData.componentId || !skuData.componentName || !pkoId) {
      console.error("Missing SKU ID, Component ID, Component Name, or PKO ID.");
      if (showAlert) alert("Cannot save data. Missing necessary information.");
      return;
    }

    try {
      const isCompleted = pkgData.pkgFormProgress === 100;
      const payload = {
        name: skuData.componentName,
        form_status: isCompleted ? "Completed" : "Pending", // Set "Completed" if 100%
        pko_id: pkoId,
        sku_id: skuId,
        component_progress: Math.round(progressPercentage),
        responses: {}, // Initialize responses
      };

      // Flatten and map all answered questions
      const answeredQuestions = Object.values(pkgData.sections).flatMap(
        (section) =>
          section
            .map((question) => {
              const answer = pkgData.answers[question.question_id];
              const unit =
                pkgData.answers[`${question.question_id}_unit`] || null;

              if (answer === undefined || answer === "") return null;

              // Handle different question types
              if (question.question_type.includes("Dropdown") && unit) {
                return {
                  question_id: question.question_id,
                  question_text: question.question_text,
                  response: `${answer}${unit}`.trim(),
                };
              }

              return {
                question_id: question.question_id,
                question_text: question.question_text,
                response: answer,
              };
            })
            .filter((q) => q !== null),
      );

      // Build the `responses` object dynamically
      answeredQuestions.forEach((q) => {
        payload.responses[q.question_text + "||" + q.question_id] = q.response;
      });

      console.log("Save Payload:", JSON.stringify(payload, null, 2));

      const response = await axiosInstance.put(
        `/sku/${skuId}/components/${skuData.componentId}/`,
        payload,
        {
          headers: { "Content-Type": "application/json" },
        },
      );

      if (response.status === 200) {
        // Clear persistent errors on successful save
        //  setPersistentValidationErrors([]);
        if (pkgData.answers[24] != stateIncomingComponentPage?.component_type) {
          try {
            // Update the component type in the backend
            await axiosInstance.put(
              `/sku/${skuId}/components/${response.data.id}/`,
              {
                component_type: pkgData.answers[24],
                pko_id: pkoId,
              },
            );
          } catch (error) {
            console.error("Error updating component type:", error);
            alert("Failed to update component type. Please try again.");
          }
        }

        console.log("Save Response:", response.data);
        if (showAlert) alert("Component data saved successfully!");

        // Update state for form_status dynamically
        setSkuData((prev) => ({
          ...prev,
          components: prev.components.map((comp) =>
            comp.id === skuData.componentId
              ? { ...comp, form_status: isCompleted ? "Completed" : "Pending" }
              : comp,
          ),
        }));
      } else {
        console.warn("Unexpected response status:", response.status);
        if (showAlert)
          alert("Failed to save component data. Please try again.");
      }
    } catch (error) {
      console.error("Error saving component data:", error);
      if (showAlert)
        alert("An error occurred while saving the component data.");
    }
  };

  const progressPercentage =
    pkgData.totalMandatoryCount === 0
      ? 0
      : (pkgData.mandatoryAnsweredCount / pkgData.totalMandatoryCount) * 100;

  return (
    <div>
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
      <Breadcrumb
        onBackClick={handleBackClick}
        onSaveClick={handleSaveDraft}
        isFormFilled={isFormFilled} // Pass state to Breadcrumb
        pkoId={pkoId || "N/A"} // Pass PKO ID
        skuId={skuId || "N/A"}
        description={description || "N/A"} // Pass Description
        componentName={componentName || "Default Component"}
        isFormLocked={isFormLocked}
      />
      {!isFormLocked && (
        <Autosave
          saveFunction={autosavePkgData}
          dependencies={[pkgData.answers]}
        />
      )}
      <div className="container-fluid px-5 pt-2 pb-100">
        <div className="row">
          <div className="col-12 col-md-3">
            <div className="componentInfo-block py-4 bg-color-light-gray position-sticky top-0">
              <span className="fs-12 fw-600 text-color-typo-secondary d-inline-block px-4 mb-4">
                Complete all sections for this component
              </span>
              {Object.keys(pkgData.sections).map((section) => (
                <p
                  key={section}
                  className={`fs-14 fw-600 cursor-pointer px-4 mb-4 ${
                    section === pkgData.activeSection ? "text-danger" : ""
                  }`}
                  onClick={() =>
                    setPkgData((prev) => ({ ...prev, activeSection: section }))
                  }
                >
                  {section}
                </p>
              ))}

              <div className="progress-loader-container pkgdataform-loader mt-4 d-flex align-items-center">
                <ProgressLoader
                  percentage={Math.round(pkgData.pkgFormProgress)}
                  size={24}
                />
                <span className="progress-percentage-text ms-2">
                  {Math.round(pkgData.pkgFormProgress)}% completed
                </span>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-9">{renderSections()}</div>
        </div>
      </div>
      {/* ValidationModal */}
      {showValidationModal && (
        <ValidationModal
          unansweredQuestions={unansweredQuestions} // Pass the unanswered questions
          onBack={handleBackToCurrentSection}
          onProceed={handleProceedToNextSection}
          onPrevious={proceedToPreviousSection}
          isPreviousValidation={isPreviousValidation}
          isAllSectionsValidation={
            Object.keys(pkgData.sections).indexOf(pkgData.activeSection) ===
            Object.keys(pkgData.sections).length - 1
          } // Set to true for all sections validation
          onBackToSku={handleBackClick}
        />
      )}
      {/* Footer with Previous and Next buttons */}
      <div className="footer d-flex justify-content-between mt-4 bg-color-light-gray px-4 py-10 fixed-bottom w-100">
        {/* Previous Button */}
        <button
          onClick={handlePreviousClick}
          className={`btn btn-outline-secondary ${
            Object.keys(pkgData.sections).indexOf(pkgData.activeSection) === 0
              ? "invisible"
              : ""
          }`}
        >
          <FaArrowLeft /> Previous
        </button>

        {/* Conditional rendering: Show Next button or Back to SKU page button */}
        {Object.keys(pkgData.sections).indexOf(pkgData.activeSection) ===
        Object.keys(pkgData.sections).length - 1 ? (
          <button onClick={handleBackToSkuClick} className="btn btn-primary">
            Back to SKU Page
          </button>
        ) : (
          <button onClick={handleNextClick} className="btn btn-primary">
            Next <FaArrowRight />
          </button>
        )}
      </div>
    </div>
  );
};

export default PkgDataForm;
