import { useState, useEffect } from "react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import axiosInstance from "../../../../services/axiosInstance";
import Tooltip from "../../../Tooltip";
import Dimen_ImageOverlay from "../../../Dimen_ImageOverlay"


const SKUDetailsPrimaryPackagingDetails = ({skuDetailsPrimaryPackageDetailData}) => {
  
  const [questions, setQuestions] = useState([]); // Store questions from API
  const [skuData,setSkuData] = useState({});
  const [activeTooltipId, setActiveTooltipId] = useState(null); // State to track the active tooltip ID
  const [questionAvailable,setQuestionAvailable] = useState([]);
  const [isOverlayVisible, setOverlayVisible] = useState(false);

  const handleInstructionClick = () => {
    setOverlayVisible(true); // Show the overlay
  };
  const handleOverlayClose = () => {
    setOverlayVisible(false); // Hide the overlay
  };

  // Fetch the questionnaire
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

  useEffect(()=>{
    if (skuDetailsPrimaryPackageDetailData && questions?.length>0) {

      // Create Question List filled in Vendor
      setQuestionAvailable(Object?.keys(skuDetailsPrimaryPackageDetailData)?.map((item)=>{
        return item?.split("||")[0];
      }));
  
      // Creating answer with ID
      const answers = {};

      Object?.entries(skuDetailsPrimaryPackageDetailData)?.forEach(
        ([questionText, response]) => {

          // Find the matching question using text and ID
          const question = questions?.find(
            (q) =>
              questionText?.startsWith(q.question_text) &&
              questionText?.endsWith(`||${q.question_id}`),
          );

          if (question) {
            // If the field contains both value and unit, extract them
            if (
              question?.question_type?.includes("Dropdown") ||
              question?.question_type?.includes("Float")
            ) {
              const match = response?.match(/^(\d+(\.\d+)?)([a-zA-Z]+)$/);
              if (match) {
                answers[question?.question_id] = parseFloat(match[1]); // Extract value
                answers[`${question?.question_id}_unit`] = match[3]; // Extract unit
              } else {
                answers[question?.question_id] = response;
              }
            } else {
              answers[question?.question_id] = response;
            }
          }
        },
      );

      // Set the SKU data properly
      setSkuData((prev) => ({
        ...prev,
        dimensionsAndWeights: answers,
      }));
    }

  },[skuDetailsPrimaryPackageDetailData, questions])

   // Match dependent question visibility based on parent's answer and field dependency
   const isAnswerMatch = (fieldDependency, parentAnswer) => {
    if (!fieldDependency) return true; // No dependency, always visible

    const normalizedParentAnswer = parentAnswer?.trim()?.toLowerCase() || "";
    const conditions = fieldDependency
      ?.split(/OR/i)
      ?.map((dep) => dep?.trim()?.toLowerCase());

    return conditions?.includes(normalizedParentAnswer);
  };

  const renderField = (question) => {

    // Check if the question is related to height, width, or depth
    const showOverlayForDimension = /height|width|depth/i.test(
      question?.question_text,
    );

    switch (question?.question_type) {
      case "Varchar":
        return (
          <div className="d-flex align-items-center gap-2">
            <input
              type="text" // Allow any text input
              className="form-control fs-14 px-12 border border-color-typo-secondary rounded-2 h-44"
              placeholder={question?.placeholder || "Enter Value"}
              value={skuData?.dimensionsAndWeights?.[question?.question_id] || ""}
              tabIndex={0} // Make the input focusable
              disabled
            />
            {question?.instructions && (
              <Tooltip
                id={question?.question_id}
                instructions={question?.instructions}
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
              placeholder={question?.placeholder || "Enter Value"}
              value={skuData?.dimensionsAndWeights?.[question?.question_id] || ""}
              tabIndex={0} // Make the input focusable
              disabled
            />
            {question?.instructions && (
              <Tooltip
                id={question?.question_id}
                instructions={question?.instructions}
                activeTooltipId={activeTooltipId}
                setActiveTooltipId={setActiveTooltipId}
              />
            )}
          </div>
        );

      case "Float + Dropdown": {

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
                value={skuData?.dimensionsAndWeights?.[question.question_id] ?? ""}
                tabIndex={0} // Make the input focusable
                disabled
              />

              {/* Unit Dropdown */}
              <select
                className="form-select background-position border-0 bg-color-light-shade text-color-typo-primary px-12 w-72 fw-400"
                value={
                  skuData.dimensionsAndWeights?.[
                    `${question?.question_id}_unit`
                  ] || question?.dropdown_options?.[0] // Ensure default unit selection
                }
                tabIndex={0} // Make the dropdown focusable 
                disabled
              >
                {question?.dropdown_options?.map((option, index) => (
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
              value={skuData?.dimensionsAndWeights?.[question?.question_id] || ""}
              disabled
              tabIndex={0} // Make the dropdown focusable
            >
              <option value="">
                {question?.placeholder || "Select an option"}
              </option>
              {question?.dropdown_options?.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {question?.instructions && (
              <Tooltip
                id={question?.question_id}
                instructions={question?.instructions}
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
    return questions?.map((question) => {
      const parentAnswer =
        skuData?.dimensionsAndWeights?.[question?.dependent_question];
      const isDependentVisible = isAnswerMatch(
        question?.field_dependency,
        parentAnswer,
      );

      if (question?.dependent_question && !isDependentVisible) {
        return null;
      }

      if(questionAvailable.includes(question?.question_text)){
      return (
        <div
          key={question?.question_id}
          className={`col-12 ${
            question?.question_type === "Float + Dropdown" ||
            question?.question_type === "Dropdown" ||
            question?.question_type === "No Input Required"
              ? "col-md-6"
              : "col-12"
          } mb-3`}
        >
          {question?.question_type !== "No Input Required" && (
            <label className="fs-14 text-color-typo-primary mb-2 d-block">
              {question?.question_text}
              {question?.mandatory && <span> *</span>}
            </label>
          )}
          {renderField(question)}
        </div>
      );
    }
    else{
      return;
    }
    });
  };

  useEffect(()=>{
   if(questions?.length > 0){
    renderQuestions(questions)
   }
  },[questions])

  return (
    <div className="col-12 col-md-5">
      <div
        className="card bg-white border border-color-light-border rounded-3 p-4 h-100 small-arrow"
        style={{ maxHeight: "400px", overflowY: "auto" }}
      >
        <div className="d-flex align-items-center justify-content-between">
          <h6 className="fs-22 fw-600 text-color-typo-primary">
            Primary Packaging Details
          </h6>
        </div>
        <p className="fs-14 text-color-labels mb-30">
          Primary packaging details of this SKU
        </p>
        <div className="row">{renderQuestions(questions)}</div>
      </div>
    </div>
  );
};

export default SKUDetailsPrimaryPackagingDetails;
