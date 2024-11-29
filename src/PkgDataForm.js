import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import Navbar from "./Navbar";
import BreadcrumbHeader from "./Breadcrumb";
import "./style.css";
import questionnaireData from "./questionnarire_repsonse_latest.json";
import { ReactComponent as CircleLoader } from './assets/images/circle-load.svg';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';  // Importing arrow icons

const PkgDataForm = () => {
  const [sections, setSections] = useState({});
  const [answers, setAnswers] = useState({}); // Store answers for all questions
  const [mandatoryAnsweredCount, setMandatoryAnsweredCount] = useState(0); // Track answered mandatory questions
  const [totalMandatoryCount, setTotalMandatoryCount] = useState(0); // Track total mandatory questions
  const sectionRefs = useRef({}); // Store refs for each section
  const [activeSection, setActiveSection] = useState("Component Information"); // Active section tracking

  useEffect(() => {
    const processQuestions = () => {
      const questions = questionnaireData.components[0].component_questions;
      const questionMap = new Map();

      let totalMandatory = 0;
      let answeredMandatory = 0;

      // Build question map with children
      questions.forEach((q) => {
        questionMap.set(q.question_id, { ...q, children: [] });

        if (q.mandatory) {
          totalMandatory += 1;
          if (answers[q.question_id] !== undefined) {
            answeredMandatory += 1; // If the question is answered
          }
        }
      });

      // Assign children to their respective parents
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

      setSections(groupedSections);
      setTotalMandatoryCount(totalMandatory); // Set the total count of mandatory questions
      setMandatoryAnsweredCount(answeredMandatory); // Set the initial count of answered mandatory questions
    };

    processQuestions();
  }, [answers]); // Re-run whenever answers change

  // Handle Previous section
  const handlePreviousSection = () => {
    const sectionKeys = Object.keys(sections);
    const currentIndex = sectionKeys.indexOf(activeSection);
    if (currentIndex > 0) {
      const newActiveSection = sectionKeys[currentIndex - 1];
      setActiveSection(newActiveSection);
      scrollToSection(newActiveSection);  // Scroll to the previous section
    }
  };

  // Handle Next section
  const handleNextSection = () => {
    const sectionKeys = Object.keys(sections);
    const currentIndex = sectionKeys.indexOf(activeSection);
    if (currentIndex < sectionKeys.length - 1) {
      const newActiveSection = sectionKeys[currentIndex + 1];
      setActiveSection(newActiveSection);
      scrollToSection(newActiveSection);  // Scroll to the next section
    }
  };

  // Handle Section click to navigate
  const handleSectionClick = (section) => {
    setActiveSection(section);
    scrollToSection(section);  // Scroll to the clicked section
  };

  // Scroll to the active section
  const scrollToSection = (section) => {
    // Ensure the section ref exists before scrolling
    if (sectionRefs.current[section] && sectionRefs.current[section].current) {
      sectionRefs.current[section].current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // Helper function to normalize text for case-insensitive comparison
  const normalizeText = (text) => {
    return text ? text.trim().toLowerCase() : "";
  };

  // Check if the parent's answer matches the field_dependency
  const isAnswerMatch = (fieldDependency, parentAnswer) => {
    if (!fieldDependency) return true; // No dependency, always visible

    const normalizedParentAnswer = normalizeText(parentAnswer);
    const conditions = fieldDependency
      .split(/OR/i)
      .map((dep) => normalizeText(dep.trim()));
    return conditions.includes(normalizedParentAnswer);
  };

  // Handle input change for answers
  const handleInputChange = (questionId, value) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: value, // Persist answers
    }));
  };

  const renderField = (question) => {
    const handleChange = (e) =>
      handleInputChange(question.question_id, e.target.value);

    const placeholderText = question.placeholder || "Enter value"; // Default if placeholder is not provided

    switch (question.question_type) {
      case "Varchar":
        return (
          <textarea
            maxLength="100"
            className="w-320"
            rows="6"
            value={answers[question.question_id] || ""}
            placeholder={placeholderText}
            onChange={handleChange}
          />
        );
      case "Single Select Radio Button":
        return (
          <div onChange={handleChange}>
            <label className="me-3">
              <input
                type="radio"
                name={question.question_id}
                value="Yes"
                checked={answers[question.question_id] === "Yes"}
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                name={question.question_id}
                value="No"
                checked={answers[question.question_id] === "No"}
              />
              No
            </label>
          </div>
        );
      case "Float + Dropdown":
      case "Integer + Dropdown":
        return (
          <div className="input-group">
            <input
              className="h-44 text-secondary w-130"
              type={question.question_type === "Float + Dropdown" ? "number" : "text"}
              value={answers[question.question_id] || ""}
              placeholder={placeholderText}
              onChange={handleChange}
            />
            <select
              onChange={handleChange}
              className="bg-color-light-shade form-list w-70"
              value={answers[question.question_id] || ""}
            >
              {question.dropdown_options.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        );
      case "Dropdown":
        return (
          <select
            className="w-320"
            value={answers[question.question_id] || ""}
            onChange={handleChange}
          >
            <option value="">{placeholderText}</option>{" "}
            {/* Use placeholder as the first option */}
            {question.dropdown_options.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      default:
        return (
          <input
            type="text"
            className="w-320"
            value={answers[question.question_id] || ""}
            placeholder={placeholderText}
            onChange={handleChange}
          />
        );
    }
  };

  // Render questions dynamically based on answers and section grouping
  const renderQuestions = (questions) => {
    return questions.map((question) => {
      const parentAnswer = answers[question.dependent_question];
      const isDependentVisible = isAnswerMatch(
        question.field_dependency,
        parentAnswer
      );

      if (question.dependent_question && !isDependentVisible) {
        return null;
      }

      // Check if the question is mandatory and append '*' if true
      const questionLabel = question.mandatory
        ? `${question.question_text} *`
        : question.question_text;

      return (
        <div className="form-group mt-4" key={question.question_id}>
          <label>{questionLabel}</label>
          {renderField(question)}
        </div>
      );
    });
  };

  // Render sections and their corresponding questions
  const renderSections = () => {
    return Object.entries(sections).map(([section, questions]) => {
      if (!sectionRefs.current[section]) {
        sectionRefs.current[section] = React.createRef();
      }

      return (
        section === activeSection && (
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

  // Calculate progress percentage
  const progressPercentage =
    totalMandatoryCount === 0
      ? 0
      : (mandatoryAnsweredCount / totalMandatoryCount) * 100;
  const strokeDashoffset = (1 - progressPercentage / 100) * 219.91; // 219.91 is the circle's circumference

  return (
    <div>
      <Navbar />
      <BreadcrumbHeader />
      <div className="container-fluid px-5 py-58">
        <div className="row">
          <div className="col-12 col-md-3">
            <div className="p-4 bg-color-light-gray position-sticky top-0">
              <span className="fs-12 fw-600 text-color-typo-secondary">
                Complete all sections for this component
              </span>
              {Object.keys(sections).map((section) => (
                <p
                  className={`fs-14 fw-600 cursor-pointer ${section === activeSection ? "text-danger" : ""}`}
                  key={section}
                  onClick={() => handleSectionClick(section)} // Section click handler
                >
                  <div
                    style={{
                      borderLeft: section === activeSection ? "4px solid red" : "none",
                      paddingLeft: "10px",
                    }}
                  >
                    {section}
                  </div>
                </p>
              ))}

              {/* Circular Loader placed inside section container */}
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
      <div className="footer d-flex justify-content-between">
        {/* Previous Button */}
        <button
          onClick={handlePreviousSection}
          className={`footer-button prev-button px-30 rounded-2 py-10 fs-14 bg-white border border-secondary text-secondary ${Object.keys(sections).indexOf(activeSection) === 0 ? "invisible" : ""}`}
        >
          <FaArrowLeft />
          Previous
        </button>

        {/* Next Button */}
        <button
          onClick={handleNextSection}
          className={`footer-button next-button px-30 rounded-2 py-10 fs-14 bg-primary text-white ${Object.keys(sections).indexOf(activeSection) === Object.keys(sections).length - 1 ? "invisible" : ""}`}
        >
          Next
          <FaArrowRight />
        </button>
      </div>
    </div>
  );
};

export default PkgDataForm;
