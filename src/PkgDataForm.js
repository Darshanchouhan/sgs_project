import React, { useEffect, useRef, useContext } from "react";
import Navbar from "./Navbar";
import Breadcrumb from "./Breadcrumb";
import "./style.css";
import { ReactComponent as CircleLoader } from "./assets/images/circle-load.svg";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { PkgDataContext } from "./Pkg_DataContext"; // Import Context
import Autosave from "./AutoSave";

const PkgDataForm = () => {
  const { pkgData, setPkgData } = useContext(PkgDataContext); // Use Context
  const navigate = useNavigate();
  const location = useLocation();
  const { componentName } = location.state || {}; // Retrieve the component name

  const sectionRefs = useRef({}); // Store refs for each section

  const savePkgData = async () => {
    // Save the package data to the backend
    console.log("Autosaving Package Data:", pkgData.answers);
    await fetch("https://demo.gramener.com/api/package/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pkgData.answers),
    });
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://demo.gramener.com/api/questionnaire/");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();

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

  const handleBackClick = () => navigate("/sku_page");

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
    const handleChange = (e) => handleInputChange(question.question_id, e.target.value);

    const placeholderText = question.placeholder || "Enter value";

    switch (question.question_type) {
      case "Varchar":
        return (
          <input
            maxLength="100"
            className="h-44 text-secondary w-320"
            type="text"
            value={pkgData.answers[question.question_id] || ""}
            placeholder={placeholderText}
            onChange={handleChange}
          />
        );
      case "Single Select Radio Button":
        return (
          <div>
            {["Yes", "No"].map((option) => (
              <label key={option} className="me-3">
                <input
                  type="radio"
                  name={question.question_id}
                  value={option}
                  checked={pkgData.answers[question.question_id] === option}
                  onChange={handleChange}
                />
                {option}
              </label>
            ))}
          </div>
        );
      case "Dropdown":
        return (
          <select
            className="w-320"
            value={pkgData.answers[question.question_id] || ""}
            onChange={handleChange}
          >
            <option value="">{placeholderText}</option>
            {question.dropdown_options.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
     
         case "Float + Dropdown":
        return (
          <div className="input-group">
            <input
              className="h-44 text-secondary w-130"
              type="number"
              step="1"
              value={pkgData.answers[question.question_id] || ""}
              placeholder={placeholderText}
              onChange={handleChange}
            />
            <select
              className="form-list border-0 bg-color-light-shade w-70"
              value={pkgData.answers[`${question.question_id}_unit`] || ""}
              onChange={(e) =>
                handleInputChange(`${question.question_id}_unit`, e.target.value)
              }
            >
              {question.dropdown_options.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        );
        case "Integer + Dropdown":
          return (
            <div className="input-group">
              <input
                className="h-44 text-secondary w-130"
                type="number"
                step="1"
                value={pkgData.answers[question.question_id] || ""}
                placeholder={placeholderText}
                onChange={handleChange}
              />
              <select
                className="bg-color-light-shade form-list w-70"
                value={pkgData.answers[`${question.question_id}_unit`] || ""}
                onChange={(e) =>
                  handleInputChange(`${question.question_id}_unit`, e.target.value)
                }
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
            <input
              className="h-44 text-secondary w-130"
              type="number"
              step="1"
              value={pkgData.answers[question.question_id] || ""}
              placeholder={placeholderText}
              onChange={handleChange}
            />
          );
      // default:
      //   return (
      //     <input
      //       type="text"
      //       className="h-44 text-secondary w-320"
      //       value={pkgData.answers[question.question_id] || ""}
      //       placeholder={placeholderText}
      //       onChange={handleChange}
      //     />
      //   );
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
            {question.mandatory ? `${question.question_text} *` : question.question_text}
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
    try {
      
      // Convert the sections object to an array of questions
      const answeredQuestions = Object.values(pkgData.sections).flatMap((section) =>
        section.map((question) => {
          // Check if the question has an answer (ignoring unanswered questions)
          const answer = pkgData.answers[question.question_id];
          if (answer === undefined || answer === "") return null;
          
       // Return the question formatted correctly if it has an answer
          return {
            question_id: question.question_id,
            question_text: question.question_text,
            question_type: question.question_type,
            response: answer,
            unit: question.unit || null,
          };
        }).filter((q) => q !== null) // Filter out null (unanswered questions)
      );
//if no questions are answered, notify the user and return
      if (answeredQuestions.length === 0) {
        alert("No questions have been answered.");
        return;
      }

      const requestBody = { questions: answeredQuestions };
      console.log("formatted question is):", answeredQuestions);

      console.log(
        "Request Body (Data to be sent to the server):",
        JSON.stringify(requestBody, null, 2)
      );
//make the post request to save the answers
      const response = await fetch(
        "https://demo.gramener.com/api/component/2/questionnaire/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        }
      );

      if (response.ok) {
        alert("Data saved successfully!");
      } else {
        alert("Failed to save data.");
      }
    } catch (error) {
      console.error("Error saving data:", error);
      alert("An error occurred while saving.");
    }
  };
  const progressPercentage =
    pkgData.totalMandatoryCount === 0
      ? 0
      : (pkgData.mandatoryAnsweredCount / pkgData.totalMandatoryCount) * 100;

      return (
        <div>
          <Navbar />
          <Breadcrumb
            onBackClick={handleBackClick}
            onSaveClick={handleSave}
            componentName={componentName || "Default Component"}
          />
          <Autosave saveFunction={savePkgData} dependencies={[pkgData.answers]} />
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
                  <div className="circle-loader-container mt-4">
                    <CircleLoader
                      className="circle-loader"
                      width="24"
                      height="24"
                      style={{ transform: "rotate(-90deg)" }}
                    />
                    <span className="percentage-text ml-3">
                      {Math.round(progressPercentage)}% Completed
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
                  setPkgData((prev) => ({ ...prev, activeSection: previousSection }));
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
