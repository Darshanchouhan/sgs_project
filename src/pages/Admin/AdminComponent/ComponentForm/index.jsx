import React, { useState, useEffect, useRef } from "react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Tooltip from "../../../Tooltip";
import Compo_ImageOverlay from "../../../Compo_ImageOverlay";

const ComponentForm = ({questionAvailable, skuComponentDataIncoming, groupingSectionData, activeSection}) => {
  const [componentPageData, setComponentPageData] = useState({});
  const [activeTooltipId, setActiveTooltipId] = useState(null); // State to track the active tooltip ID
  const [isOverlayVisible, setOverlayVisible] = useState(false);
  const [overlayImage, setOverlayImage] = useState(null);

  const sectionRefs = useRef({}); // Store refs for each section

  useEffect(() => {
      if (groupingSectionData && skuComponentDataIncoming?.responses) {
        const answers = {};
        if (Object?.keys(skuComponentDataIncoming?.responses)?.length > 0) {
          Object?.entries(skuComponentDataIncoming?.responses)?.forEach(
            ([questionText, response]) => {
              const question = Object?.values(groupingSectionData)
                ?.flat()
                ?.find(
                  (q) =>
                    q?.question_text === questionText?.split("||")[0] &&
                    q?.question_id == questionText?.split("||")[1],
                );
  
              if (question) {
                // Extract numeric value and unit if present
                if (
                  question?.question_type === "Integer + Dropdown" ||
                  question?.question_type === "Float + Dropdown"
                ) {
                  const regex = /^(\d+(\?.\d+)?)([a-zA-Z]+)$/; // Match number and unit
                  const match = response?.match(regex);
  
                  if (match) {
                    const value = parseFloat(match[1]); // Extract numeric part (integer or float)
                    const unit = match[3]; // Extract unit part
  
                    answers[question?.question_id] = value;
                    answers[`${question?.question_id}_unit`] = unit;
                  } else {
                    answers[question?.question_id] = response;
                  }
                } else {
                  answers[question?.question_id] = response;
                }
              }
            },
          );
        } else {
          answers[24] = skuComponentDataIncoming?.component_type;
        }
  
        setComponentPageData((prev)=>{return {...prev, answers:answers}});
      }
    }, [groupingSectionData, skuComponentDataIncoming]);

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

    const isAnswerMatch = (dependentQuestionObj, answers, questionsList = []) => {
    // Handle legacy string-based dependency logic
    if (typeof dependentQuestionObj === "string") {
      const conditions = dependentQuestionObj
        ?.split(" OR")
        ?.map((c) => c?.trim()?.toLowerCase());

      const parentAnswers = Object?.values(answers)?.map((a) =>
        String(a || "")
          ?.toLowerCase()
          ?.trim(),
      );

      return conditions?.some((condition) => parentAnswers?.includes(condition));
    }

    // If dependency object is not valid
    if (!dependentQuestionObj || typeof dependentQuestionObj !== "object") {
      return true;
    }

    const resolveQuestionId = (id) => {
      // Check if this is actually a sequence_id → resolve to question_id
      const found = questionsList?.find((q) => q?.sequence_id === id);
      return found?.question_id || id; // fallback to id if not found
    };

    const { main_dependency, and_condition } = dependentQuestionObj;

    const mainQId = resolveQuestionId(main_dependency?.question_id);
    const mainAnswer = answers?.[`${mainQId}`];
    const mainConditionMet = Array?.isArray(main_dependency?.expected_values)
      ? main_dependency?.expected_values?.includes(mainAnswer)
      : false;

    let andConditionMet = true;
    if (and_condition?.question_id !== undefined) {
      const andQId = resolveQuestionId(and_condition?.question_id);
      const andAnswer = answers[`${andQId}`];
      andConditionMet = andAnswer === and_condition?.expected_value;
    }

    return mainConditionMet && andConditionMet;
  };

  const renderField = (question) => {

    // eslint-disable-next-line default-case
    switch (question.question_type) {
      case "Varchar":
        return (
          <div className="input-group align-items-center adminDisabled-inputs">
            <input
              maxLength="100"
              className={`h-42 w-100`}
              disabled
              type="text"
              value={componentPageData?.answers?.[question.question_id] || ""}
              tabIndex={0} // Make the input focusable
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
                  className={`me-2`}
                  name={question.question_id}
                  value={option}
                  checked={componentPageData?.answers?.[question.question_id] === option}
                />
                {option}
              </label>
            ))}
          </div>
        );

      case "Dropdown":
        return (
          <div className="adminDisabled-inputs input-group align-items-center select-arrow-pos adminDisabled-inputs">
            <select
              className={`w-100`}
              value={componentPageData?.answers?.[question.question_id] || ""}
              tabIndex={0} // Make focusable
              disabled
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
          <div className="adminDisabled-inputs input-group align-items-center">
            {/* Input for the float value */}
            <input
              className={`h-42 w-75 adminDisabled-inputs`}
              type="text" // Use text to allow decimal inputs
              value={componentPageData?.answers?.[question.question_id] ?? ""}
              tabIndex={0} // Make focusable
              disabled
            />

            {/* Dropdown for the unit selection */}
            <select
              className="bg-color-light-shade form-list w-25"
              value={
                componentPageData?.answers?.[`${question.question_id}_unit`] ||
                question.dropdown_options[0] // Ensure default unit selection
              }
              tabIndex={0} // Make focusable
              disabled
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
              className={`h-42 w-75 adminDisabled-inputs`}
              type="number"
              onWheel={(e) => e.target.blur()}
              step="1"
              value={componentPageData?.answers?.[question.question_id] ?? ""}
              tabIndex={0} // Make focusable
              disabled
            />
            <select
              className="adminDisabled-inputs bg-color-light-shade form-list w-25"
              value={componentPageData?.answers?.[`${question.question_id}_unit`] || ""}
              tabIndex={0} // Make focusable
              disabled
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
          <div className="adminDisabled-inputs input-group align-items-center">
            <input
              className={`h-42 w-100`}
              type="number"
              step="1"
              value={componentPageData?.answers?.[question.question_id] ?? ""}
              disabled
            />
          </div>
        );

      case "Float":
        return (
          <div className="adminDisabled-inputs input-group align-items-center">
            <input
              className={`h-42 w-100`}
              type="text" // Use text to allow decimal inputs
              value={componentPageData?.answers?.[question.question_id] ?? ""}
              tabIndex={0} // Make focusable
              disabled
            />
          </div>
        );

      default:
        return null;
    }
  };

  const renderQuestions = (questions) => {
      return questions?.map((question) => {
        // Collect all parent answers
        const isDependentVisible = isAnswerMatch(
          question?.dependent_question,
          componentPageData.answers,
          Object?.values(groupingSectionData)?.flat(),
        );
        if (question?.dependent_question && !isDependentVisible) {
          return null; // Skip rendering if conditions aren't met
        }

        // Info Icon with Instructions
        const infoIcon = checkImagePath(question?.instructions) ? (
          <InfoOutlinedIcon
            className="info-icon"
            titleAccess={question?.instructions} // Display on hover
            onClick={() => handleInfoClick(question?.question_text)}
          />
        ) : (
          question?.instructions && (
            <Tooltip
              id={question?.question_id}
              instructions={question?.instructions}
              activeTooltipId={activeTooltipId}
              setActiveTooltipId={setActiveTooltipId}
            />
          )
        );
  
      if (questionAvailable.includes(question?.question_text)) {
        return (
          <div className="col-12 col-md-6 col-xl-8 col-xxxl-6">
            <div className="form-group mt-4" key={question?.question_id}>
              <div className="d-flex justify-content-between align-items-center mb-2 h-26">
                <label className={`mb-0`}>
                  {question?.mandatory ? (
                    <>
                      {question?.question_text}{" "}
                    </>
                  ) : (
                    question?.question_text
                  )}
                </label>
                <span className="ms-2">{infoIcon}</span>
              </div>
              {renderField(question)}
            </div>
          </div>
        );
      }
      });
    };

  const renderSections = () => {
    return Object?.entries(groupingSectionData)?.map(([section, questions]) => {
      if (!sectionRefs?.current[section]) {
        sectionRefs.current[section] = React.createRef();
      }

      return (
        section === activeSection && (
          <div
            className="form-section"
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

  return (
    <div className="col-12 col-md-9">
      <div className="form-section mt-4 mb-5">
        <div className="col-12">{skuComponentDataIncoming && groupingSectionData && activeSection && renderSections()}</div>
      </div>
    </div>
  );
};

export default ComponentForm;
