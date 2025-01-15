import React, { useEffect, useRef, useContext } from "react";
import { SkuContext } from "./SkuContext";
import Header from "../components/Header";
import Breadcrumb from "./Breadcrumb";
import "./../styles/style.css";
import axiosInstance from "../services/axiosInstance";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { PkgDataContext } from "./Pkg_DataContext"; // Import Context
import Autosave from "./AutoSave";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ProgressLoader from "./ProgressLoader"; // Import ProgressLoader

const PkgDataForm = () => {
  const { pkgData, setPkgData } = useContext(PkgDataContext); // Use Context
  const {
    skuData,
    setSkuData,
    skuDetails,
    setSkuDetails,
    pkoData,
    setPkoData,
  } = useContext(SkuContext);
  const navigate = useNavigate();
  const location = useLocation();
  const sectionRefs = useRef({}); // Store refs for each section
  const {
    componentName,
    pkoId,
    description,
    skuId: passedSkuId,
  } = location.state || {};

  // Fallback to skuData.skuId if not explicitly passed
  const skuId = passedSkuId || skuData?.skuId || "N/A";
  const isFirstLoad = useRef(true);
  const autosavePkgData = async () => {
    if (!skuId || !skuData.componentId || !skuData.componentName || !pkoId) {
      console.warn(
        "Missing SKU ID, Component ID, Component Name, or PKO ID. Autosave skipped.",
      );
      return;
    }

    try {
      const payload = {
        name: skuData.componentName,
        form_status: "Pending", // Autosave keeps it as Pending
        pko_id: pkoId,
        sku_id: skuId,
        responses: {}, // Initialize responses
      };

      //Flatten and map all answered questions
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
                  question_text: question.question_text,
                  response: `${answer}${unit}`.trim(),
                };
              }

              return {
                question_text: question.question_text,
                response: answer,
              };
            })
            .filter((q) => q !== null),
      );

      //Build the `responses` object dynamically
      answeredQuestions.forEach((q) => {
        payload.responses[q.question_text] = q.response;
      });

      console.log("Autosave Payload:", JSON.stringify(payload, null, 2));

      const response = await axiosInstance.put(
        `/sku/${skuId}/components/${skuData.componentId}/`,
        payload,
        {
          headers: { "Content-Type": "application/json" },
        },
      );

      if (response.status === 200) {
        console.log("Autosave successful at", new Date().toLocaleTimeString());
      } else {
        console.warn("Autosave failed with status:", response.status);
      }
    } catch (error) {
      console.error("Autosave failed:", error.message);
    }
  };

  useEffect(() => {
    const calculatePkgFormProgress = () => {
      // Count total mandatory questions
      const totalMandatory = Object.values(pkgData.sections).reduce(
        (total, section) => total + section.filter((q) => q.mandatory).length,
        0,
      );

      // Count answered mandatory questions
      const answeredMandatory = Object.values(pkgData.sections).reduce(
        (total, section) =>
          total +
          section.filter(
            (q) =>
              q.mandatory &&
              pkgData.answers[q.question_id] !== undefined &&
              pkgData.answers[q.question_id] !== "",
          ).length,
        0,
      );

      // Update the state with mandatory question counts
      setPkgData((prev) => ({
        ...prev,
        totalMandatoryCount: totalMandatory,
        mandatoryAnsweredCount: answeredMandatory,
        pkgFormProgress:
          totalMandatory > 0 ? (answeredMandatory / totalMandatory) * 100 : 0,
      }));

      console.log("Total Mandatory:", totalMandatory);
      console.log("Answered Mandatory:", answeredMandatory);
      console.log(
        "Progress Percentage:",
        totalMandatory > 0 ? (answeredMandatory / totalMandatory) * 100 : 0,
      );
    };

    calculatePkgFormProgress();
  }, [pkgData.answers, pkgData.sections, setPkgData]);

  useEffect(() => {
    if (location.state) {
      setSkuDetails((prev) => location.state.skuDetails || prev);
      setPkoData((prev) => location.state.pkoData || prev);

      setSkuData((prev) => ({
        ...prev,
        skuId: location.state.skuId || prev.skuId,
        componentId: location.state.componentId || prev.componentId,
        componentName: location.state.componentName || prev.componentName,
        formStatus: location.state.formStatus || prev.formStatus,
      }));

      // Reset answers when componentId changes
      setPkgData((prev) => ({
        ...prev,
        answers: {}, // Clear previous answers
      }));

      // Populate answers from responses if available
      if (location.state.responses) {
        const answers = {};
        Object.entries(location.state.responses).forEach(
          ([questionText, response]) => {
            const question = Object.values(pkgData.sections)
              .flat()
              .find((q) => q.question_text === questionText);

            if (question) {
              answers[question.question_id] = response;
            }
          },
        );

        console.log("Populated answers for component:", answers);

        setPkgData((prev) => ({
          ...prev,
          answers,
        }));
      }
    }
  }, [location.state, setSkuDetails, setPkoData, setSkuData, setPkgData]);

  useEffect(() => {
    // Ensure both pkgData.sections and location.state.responses are available
    if (
      isFirstLoad.current &&
      location.state?.responses &&
      Object.keys(pkgData.sections).length > 0
    ) {
      setPkgData((prev) => {
        const updatedAnswers = { ...prev.answers }; // Preserve existing answers

        Object.entries(location.state.responses).forEach(
          ([questionText, response]) => {
            const question = Object.values(pkgData.sections)
              .flat()
              .find((q) => q.question_text === questionText);

            if (question) {
              if (
                question.question_type == "Integer + Dropdown" ||
                question.question_type == "Float + Dropdown"
              ) {
                const regex = /^(\d+(\.\d+)?)([a-zA-Z]+)$/;
                const match = response.match(regex);

                if (match) {
                  const value = parseFloat(match[1]); // Extract numeric part (integer or float)
                  const unit = match[3]; // Extract unit part
                  updatedAnswers[question.question_id] = value;
                  updatedAnswers[`${question.question_id}_unit`] = unit;
                }
              } else {
                updatedAnswers[question.question_id] = response;
              }
            } else {
              console.warn(`Question not found for text: ${questionText}`);
            }
          },
        );

        console.log("Mapped Answers from Responses:", updatedAnswers);
        // Mark as loaded to prevent future runs
        isFirstLoad.current = false;
        return {
          ...prev,
          answers: updatedAnswers, // Update answers without clearing existing ones
        };
      });
    }
  }, [pkgData.sections, location.state?.responses, setPkgData]);

  // console.log("Persisted SKU Data:", skuData);
  // console.log("Persisted SKU Details:", skuDetails);
  // console.log("Persisted PKO Data:", pkoData);

  useEffect(() => {
    console.log("Received State in PkgDataForm:", {
      componentName,
      pkoId,
      description,
    });
  }, [componentName, pkoId, description]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("questionnaire/");
        const data = response.data;

        processQuestions(data); // Process the fetched data
      } catch (error) {
        console.error("Error fetching questionnaire data:", error);
      }
    };

    const processQuestions = (data) => {
      const questions = data.components[0].component_questions;
      const questionMap = new Map();

      let totalMandatory = 0;
      let answeredMandatory = 0;

      questions.forEach((q) => {
        questionMap.set(q.question_id, { ...q, children: [] });
        if (q.mandatory) {
          totalMandatory += 1;
          if (pkgData.answers[q.question_id] !== undefined) {
            answeredMandatory += 1;
          }
        }
      });

      questions.forEach((q) => {
        if (q.dependent_question) {
          questionMap.get(q.dependent_question).children.push(q);
        }
      });
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
  }, [pkgData.answers, setPkgData]);

  const handleBackClick = () => navigate("/skus");

  const handleInputChange = (questionId, value) => {
    setPkgData((prev) => ({
      ...prev,
      answers: { ...prev.answers, [questionId]: value },
    }));
  };

  const isAnswerMatch = (fieldDependency, parentAnswer) => {
    if (!fieldDependency) return true; // No dependency, always visible

    const normalizedParentAnswer = parentAnswer?.trim().toLowerCase() || "";
    const conditions = fieldDependency
      .split(/OR/i)
      .map((dep) => dep.trim().toLowerCase());

    return conditions.includes(normalizedParentAnswer);
  };

  const renderField = (question) => {
    const handleChange = (e) =>
      handleInputChange(question.question_id, e.target.value);

    // Render Info Icon only if `instructions` is provided

    // Info Icon with Instructions
    const infoIcon = question.instructions ? (
      <InfoOutlinedIcon
        className="info-icon"
        titleAccess={question.instructions} // Display on hover
      />
    ) : null;

    // eslint-disable-next-line default-case
    switch (question.question_type) {
      case "Varchar":
        return (
          <div className="input-group align-items-center">
            <input
              maxLength="100"
              className="h-42 text-secondary w-320 "
              type="text"
              value={pkgData.answers[question.question_id] || ""}
              placeholder={question.placeholder || "Enter value"}
              onChange={handleChange}
            />
            {infoIcon}
          </div>
        );

      case "Single Select Radio Button":
        return (
          <div className="align-items-center me-2">
            {["Yes", "No"].map((option) => (
              <label key={option} className="me-3">
                <input
                  type="radio"
                  className="me-2"
                  name={question.question_id}
                  value={option}
                  checked={pkgData.answers[question.question_id] === option}
                  onChange={handleChange}
                />
                {option}
              </label>
            ))}
            {infoIcon}
          </div>
        );

      case "Dropdown":
        return (
          <div className="input-group align-items-center select-arrow-pos">
            <select
              className="w-320 me-2"
              value={pkgData.answers[question.question_id] || ""}
              onChange={handleChange}
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
            {infoIcon}
          </div>
        );

      case "Float + Dropdown":
        return (
          <div className="input-group align-items-center">
            <input
              className="h-42 text-secondary w-130 "
              type="number"
              step="1"
              value={pkgData.answers[question.question_id] || ""}
              placeholder={question.placeholder || "Enter value"}
              onChange={handleChange}
              onKeyDown={(e) => {
                if (
                  !/^\d$/.test(e.key) &&
                  e.key !== "Backspace" &&
                  e.key !== "Delete" &&
                  e.key !== "ArrowLeft" &&
                  e.key !== "ArrowRight"
                ) {
                  e.preventDefault();
                }
              }}
            />
            <select
              className="bg-color-light-shade form-list w-70"
              value={pkgData.answers[`${question.question_id}_unit`] || ""}
              onChange={(e) =>
                handleInputChange(
                  `${question.question_id}_unit`,
                  e.target.value,
                )
              }
            >
              {question.dropdown_options.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {infoIcon}
          </div>
        );

      case "Integer + Dropdown":
        return (
          <div className="input-group align-items-center">
            <input
              className="h-42 text-secondary w-130 "
              type="number"
              step="1"
              value={pkgData.answers[question.question_id] || ""}
              placeholder={question.placeholder || "Enter value"}
              onChange={handleChange}
              onKeyDown={(e) => {
                if (
                  !/^\d$/.test(e.key) &&
                  e.key !== "Backspace" &&
                  e.key !== "Delete" &&
                  e.key !== "ArrowLeft" &&
                  e.key !== "ArrowRight"
                ) {
                  e.preventDefault();
                }
              }}
            />
            <select
              className="bg-color-light-shade form-list w-70"
              value={pkgData.answers[`${question.question_id}_unit`] || ""}
              onChange={(e) =>
                handleInputChange(
                  `${question.question_id}_unit`,
                  e.target.value,
                )
              }
            >
              {question.dropdown_options.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {infoIcon}
          </div>
        );

      case "Integer":
        return (
          <div className="input-group align-items-center">
            <input
              className="h-42 text-secondary w-130 "
              type="number"
              step="1"
              value={pkgData.answers[question.question_id] || ""}
              placeholder={question.placeholder || "Enter value"}
              onChange={handleChange}
              onKeyDown={(e) => {
                if (
                  !/^\d$/.test(e.key) &&
                  e.key !== "Backspace" &&
                  e.key !== "Delete" &&
                  e.key !== "ArrowLeft" &&
                  e.key !== "ArrowRight"
                ) {
                  e.preventDefault();
                }
              }}
            />
            {infoIcon}
          </div>
        );

      case "Float":
        return (
          <div className="input-group align-items-center">
            <input
              className="h-42 text-secondary w-130 "
              type="number"
              step="1"
              value={pkgData.answers[question.question_id] || ""}
              placeholder={question.placeholder || "Enter value"}
              onChange={handleChange}
              onKeyDown={(e) => {
                if (
                  !/^\d$/.test(e.key) &&
                  e.key !== "Backspace" &&
                  e.key !== "Delete" &&
                  e.key !== "ArrowLeft" &&
                  e.key !== "ArrowRight"
                ) {
                  e.preventDefault();
                }
              }}
            />
            {infoIcon}
          </div>
        );
      default:
        return null;
    }
  };

  const renderQuestions = (questions) => {
    return questions.map((question) => {
      const parentAnswer = pkgData.answers[question.dependent_question];
      const isDependentVisible = isAnswerMatch(
        question.field_dependency,
        parentAnswer,
      );

      if (question.dependent_question && !isDependentVisible) {
        return null;
      }

      return (
        <div className="form-group mt-4" key={question.question_id}>
          <label>
            {question.mandatory
              ? `${question.question_text} *`
              : question.question_text}
          </label>
          {renderField(question)}
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
            <div className="form-fields">{renderQuestions(questions)}</div>
          </div>
        )
      );
    });
  };
  const handleSave = async () => {
    if (!skuId || !skuData.componentId || !skuData.componentName || !pkoId) {
      console.error("Missing SKU ID, Component ID, Component Name, or PKO ID.");
      alert("Cannot save data. Missing necessary information.");
      return;
    }

    try {
      const payload = {
        name: skuData.componentName,
        form_status: "Pending",
        pko_id: pkoId,
        sku_id: skuId,
        responses: {}, // Initialize responses
      };

      // 📝 Flatten and map all answered questions
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
                  question_text: question.question_text,
                  response: `${answer}${unit}`.trim(),
                };
              }

              return {
                question_text: question.question_text,
                response: answer,
              };
            })
            .filter((q) => q !== null),
      );

      // Build the `responses` object dynamically
      answeredQuestions.forEach((q) => {
        payload.responses[q.question_text] = q.response;
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
        console.log("Save Response:", response.data);
        alert("Component data saved successfully!");
      } else {
        console.warn("Unexpected response status:", response.status);
        alert("Failed to save component data. Please try again.");
      }
    } catch (error) {
      console.error("Error saving component data:", error);
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
      <Breadcrumb
        onBackClick={handleBackClick}
        onSaveClick={handleSave}
        pkoId={pkoId || "N/A"} // Pass PKO ID
        description={description || "N/A"} // Pass Description
        componentName={componentName || "Default Component"}
      />
      <Autosave
        saveFunction={autosavePkgData}
        dependencies={[pkgData.answers]}
      />
      <div className="container-fluid px-5 py-58">
        <div className="row">
          <div className="col-12 col-md-3">
            <div className="p-4 bg-color-light-gray position-sticky top-0">
              <span className="fs-12 fw-600 text-color-typo-secondary">
                Complete all sections for this component
              </span>
              {Object.keys(pkgData.sections).map((section) => (
                <p
                  key={section}
                  className={`fs-14 fw-600 cursor-pointer ${
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
                  percentage={Math.round(progressPercentage)}
                  size={24}
                />
                <span className="progress-percentage-text ms-2">
                  {Math.round(progressPercentage)}% completed
                </span>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-9">{renderSections()}</div>
        </div>
      </div>

      {/* Footer with Previous and Next buttons */}
      <div className="footer d-flex justify-content-between mt-4">
        {/* Previous Button */}
        <button
          onClick={() => {
            const sectionKeys = Object.keys(pkgData.sections);
            const currentIndex = sectionKeys.indexOf(pkgData.activeSection);
            if (currentIndex > 0) {
              const previousSection = sectionKeys[currentIndex - 1];
              setPkgData((prev) => ({
                ...prev,
                activeSection: previousSection,
              }));
              sectionRefs.current[previousSection]?.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }
          }}
          className={`btn btn-outline-secondary ${
            Object.keys(pkgData.sections).indexOf(pkgData.activeSection) === 0
              ? "invisible"
              : ""
          }`}
        >
          <FaArrowLeft /> Previous
        </button>

        {/* Next Button */}
        <button
          onClick={() => {
            const sectionKeys = Object.keys(pkgData.sections);
            const currentIndex = sectionKeys.indexOf(pkgData.activeSection);
            if (currentIndex < sectionKeys.length - 1) {
              const nextSection = sectionKeys[currentIndex + 1];
              setPkgData((prev) => ({ ...prev, activeSection: nextSection }));
              sectionRefs.current[nextSection]?.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }
          }}
          className={`btn btn-primary ${
            Object.keys(pkgData.sections).indexOf(pkgData.activeSection) ===
            Object.keys(pkgData.sections).length - 1
              ? "invisible"
              : ""
          }`}
        >
          Next <FaArrowRight />
        </button>
      </div>
    </div>
  );
};

export default PkgDataForm;
