import React, { useEffect, useRef, useContext, useState } from "react";
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
import Compo_ImageOverlay from "./Compo_ImageOverlay";
import Tooltip from "./Tooltip"; // Import Tooltip component

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
  const [isFormFilled, setIsFormFilled] = useState(false); // Track if the form is filled
  const {
    componentName,
    pkoId,
    description,
    skuId: passedSkuId,
  } = location.state || {};
  const [isOverlayVisible, setOverlayVisible] = useState(false);
  const [overlayImage, setOverlayImage] = useState(null);
  const [activeTooltipId, setActiveTooltipId] = useState(null); // State to track the active tooltip ID

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

  const handleOverlayClose = () => {
    setOverlayVisible(false); // Close overlay
  };

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

      console.log("Autosave Payload:", JSON.stringify(payload, null, 2));

      const response = await axiosInstance.put(
        `/sku/${skuId}/components/${skuData.componentId}/`,
        payload,
        {
          headers: { "Content-Type": "application/json" },
        },
      );

      if (response.status === 200) {
        console.log(
          "Autosave successful at",
          new Date().toLocaleTimeString(),
          response.data,
        );
      } else {
        console.warn("Autosave failed with status:", response.status);
      }
    } catch (error) {
      console.error("Autosave failed:", error.message);
    }
  };

  // useEffect(() => {
  //   const calculatePkgFormProgress = () => {
  //     // Count total mandatory questions
  //     const totalMandatory = Object.values(pkgData.sections).reduce(
  //       (total, section) => total + section.filter((q) => q.mandatory).length,
  //       0,
  //     );

  //     // Count answered mandatory questions
  //     const answeredMandatory = Object.values(pkgData.sections).reduce(
  //       (total, section) =>
  //         total +
  //         section.filter(
  //           (q) =>
  //             q.mandatory &&
  //             pkgData.answers[q.question_id] !== undefined &&
  //             pkgData.answers[q.question_id] !== "",
  //         ).length,
  //       0,
  //     );

  //     // Update the state with mandatory question counts
  //     setPkgData((prev) => ({
  //       ...prev,
  //       totalMandatoryCount: totalMandatory,
  //       mandatoryAnsweredCount: answeredMandatory,
  //       pkgFormProgress:
  //         totalMandatory > 0 ? (answeredMandatory / totalMandatory) * 100 : 0,
  //     }));

  //     console.log("Total Mandatory:", totalMandatory);
  //     console.log("Answered Mandatory:", answeredMandatory);
  //     console.log(
  //       "Progress Percentage:",
  //       totalMandatory > 0 ? (answeredMandatory / totalMandatory) * 100 : 0,
  //     );
  //   };

  //   calculatePkgFormProgress();
  // }, [pkgData.answers, pkgData.sections, setPkgData]);

  // useEffect(() => {
  //   const calculatePkgFormProgress = () => {
  //     let totalMandatory = 0;
  //     let answeredMandatory = 0;

  //     // Iterate over all questions and their dependencies
  //     Object.values(pkgData.sections).flat().forEach((question) => {
  //       const isVisible = !question.dependent_question || isAnswerMatch(
  //         question.field_dependency,
  //         Array.isArray(question.dependent_question)
  //           ? question.dependent_question.map((qId) => pkgData.answers[qId])
  //           : [pkgData.answers[question.dependent_question]]
  //       );

  //       if (isVisible && question.mandatory) {
  //         totalMandatory++;
  //         if (
  //           pkgData.answers[question.question_id] !== undefined &&
  //           pkgData.answers[question.question_id] !== ""
  //         ) {
  //           answeredMandatory++;
  //         }
  //       }
  //     });

  //     setPkgData((prev) => ({
  //       ...prev,
  //       totalMandatoryCount: totalMandatory,
  //       mandatoryAnsweredCount: answeredMandatory,
  //       pkgFormProgress: totalMandatory
  //         ? (answeredMandatory / totalMandatory) * 100
  //         : 0,
  //     }));
  //   };

  //   calculatePkgFormProgress();
  // }, [pkgData.answers, pkgData.sections]);

  // Dynamically recalculate progress whenever answers or visibility changes
  useEffect(() => {
    const calculatePkgFormProgress = () => {
      let totalMandatory = 0;
      let answeredMandatory = 0;

      Object.values(pkgData.sections)
        .flat()
        .forEach((question) => {
          const isVisible =
            !question.dependent_question ||
            isAnswerMatch(
              question.field_dependency,
              Array.isArray(question.dependent_question)
                ? question.dependent_question.map((qId) => pkgData.answers[qId])
                : [pkgData.answers[question.dependent_question]],
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
              .find(
                (q) =>
                  q.question_text === questionText.split("||")[0] &&
                  q.question_id == questionText.split("||")[1],
              );

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
      //populate the questionMap with initial questions
      questions.forEach((q) => {
        if (!q.question_id) {
          console.warn(`Question without an ID found:`, q);
        } else {
          questionMap.set(q.question_id, { ...q, children: [] });
        }
      });

      // questions.forEach((q) => {
      //   if (q.dependent_question) {
      //     const parentQuestion = questionMap.get(q.dependent_question); //verify if parentQuestion exists before trying to access its children property
      //     if (parentQuestion) {
      //       parentQuestion.children.push(q);
      //     } else {
      //       //warning if the parent question is missing
      //       console.warn(
      //         `Parent question with ID ${q.dependent_question} not found for question ${q.question_id}.`,
      //       );
      //     }
      //   }
      // });

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
  }, [pkgData.answers, setPkgData]);

  const handleBackClick = () => navigate("/skus");

  //   const handleInputChange = (questionId, value) => {
  //     setPkgData((prev) => {
  //       var updatedAnswers = { ...prev.answers };

  //       // If the Material Type question is being updated
  //       // if (questionId === "material_type_question_id") {
  //         // Clear all dependent answers from previous Material Type
  //         const dependentQuestionIds = Object.values(pkgData.sections)
  //           .flat()
  //           .filter((q) => q.dependent_question === questionId)
  //           .map((q) => q.question_id);

  //         dependentQuestionIds.forEach((depQuestionId) => {
  //           delete updatedAnswers[depQuestionId]; // Clear the answers
  //         });
  //       // }
  //        // Update the current question's answer
  //     updatedAnswers[questionId] = value;

  //     return {
  //       ...prev,
  //       answers: updatedAnswers,
  //     };
  //   });
  // };

  // Monitor changes to `pkgData.answers` to determine if the form is filled

  // const handleInputChange = (questionId, value) => {
  //   setPkgData((prev) => {
  //     const updatedAnswers = { ...prev.answers };

  //     // Find and clear answers for all dependent questions
  //     const dependentQuestionIds = Object.values(pkgData.sections)
  //       .flat()
  //       .filter((q) =>
  //         Array.isArray(q.dependent_question)
  //           ? q.dependent_question.includes(questionId)
  //           : q.dependent_question === questionId,
  //       )
  //       .map((q) => q.question_id);

  //     dependentQuestionIds.forEach((depQuestionId) => {
  //       delete updatedAnswers[depQuestionId]; // Clear dependent answers
  //     });

  //     // Update the current question's answer
  //     updatedAnswers[questionId] = value;

  //     return {
  //       ...prev,
  //       answers: updatedAnswers,
  //     };
  //   });
  // };

  const handleInputChange = (questionId, value) => {
    setPkgData((prev) => {
      const updatedAnswers = { ...prev.answers };

      // Find and clear answers for all dependent questions
      const dependentQuestionIds = Object.values(pkgData.sections)
        .flat()
        .filter((q) =>
          Array.isArray(q.dependent_question)
            ? q.dependent_question.includes(questionId)
            : q.dependent_question === questionId,
        )
        .map((q) => q.question_id);

      dependentQuestionIds.forEach((depQuestionId) => {
        delete updatedAnswers[depQuestionId]; // Clear dependent answers
      });

      // Update the current question's answer
      updatedAnswers[questionId] = value;

      // Dynamically calculate visible mandatory counts
      let totalMandatory = 0;
      let answeredMandatory = 0;

      Object.values(pkgData.sections)
        .flat()
        .forEach((question) => {
          // Check if the question is visible
          const isVisible =
            !question.dependent_question ||
            isAnswerMatch(
              question.field_dependency,
              Array.isArray(question.dependent_question)
                ? question.dependent_question.map((qId) => updatedAnswers[qId])
                : [updatedAnswers[question.dependent_question]],
            );

          if (isVisible && question.mandatory) {
            totalMandatory++;
            if (
              updatedAnswers[question.question_id] !== undefined &&
              updatedAnswers[question.question_id] !== ""
            ) {
              answeredMandatory++;
            }
          }
        });

      // Calculate progress percentage
      const progressPercentage =
        totalMandatory > 0 ? (answeredMandatory / totalMandatory) * 100 : 0;
      console.log(
        "answered question",
        answeredMandatory,
        totalMandatory,
        updatedAnswers,
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

  const isAnswerMatch = (fieldDependency, parentAnswers) => {
    if (!fieldDependency || parentAnswers.length === 0) return true; // No dependency, always visible

    // Normalize fieldDependency into an array of conditions
    const conditions = fieldDependency
      .split(" OR ") // Split conditions by "OR"
      .map((condition) => condition.trim().toLowerCase());

    // Check for exact matches only
    return conditions.some((condition) =>
      parentAnswers.some(
        (parentAnswer) =>
          (parentAnswer || "").trim().toLowerCase() === condition,
      ),
    );
  };

  const renderField = (question) => {
    const handleChange = (e) =>
      handleInputChange(question.question_id, e.target.value);

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
              className="h-42  w-100"
              type="text"
              value={pkgData.answers[question.question_id] || ""}
              placeholder={question.placeholder || "Enter value"}
              onChange={handleChange}
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
                  className="me-2"
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
          <div className="input-group align-items-center select-arrow-pos">
            <select
              className="w-100"
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
          </div>
        );

      case "Float + Dropdown":
        return (
          <div className="input-group align-items-center">
            {/* Input for the float value */}
            <input
              className="h-42 w-75"
              type="text" // Use text to allow decimal inputs
              value={pkgData.answers[question.question_id] || ""}
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

            {/* Dropdown for the unit selection */}
            <select
              className="bg-color-light-shade form-list w-25"
              value={pkgData.answers[`${question.question_id}_unit`] || ""}
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
              className="h-42 w-75"
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
              className="h-42  w-100"
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
          </div>
        );

      case "Float":
        return (
          <div className="input-group align-items-center">
            <input
              className="h-42 w-100"
              type="text" // Use text to allow decimal inputs
              value={pkgData.answers[question.question_id] || ""}
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
          </div>
        );

      default:
        return null;
    }
  };

  // const renderQuestions = (questions) => {
  //   return questions.map((question) => {
  //     // Collect answers for all parent questions
  //     const parentAnswers = Array.isArray(question.dependent_question)
  //       ? question.dependent_question.map(
  //           (parentId) => pkgData.answers[parentId] || "",
  //         )
  //       : [pkgData.answers[question.dependent_question] || ""];

  //     // Check if the question is visible based on dependencies
  //     const isDependentVisible = isAnswerMatch(
  //       question.field_dependency,
  //       parentAnswers,
  //     );

  //     if (question.dependent_question && !isDependentVisible) {
  //       return null; // Skip rendering if conditions aren't met
  //     }

  //     return (
  //       <div className="form-group mt-4" key={question.question_id}>
  //         <label>
  //           {question.mandatory
  //             ? `${question.question_text} *`
  //             : question.question_text}
  //         </label>
  //         {renderField(question)}
  //         {/* Recursively render follow-up questions */}
  //         {question.follow_up_questions &&
  //           question.follow_up_questions.length > 0 &&
  //           renderQuestions(question.follow_up_questions)}
  //       </div>
  //     );
  //   });
  // };
  const renderQuestions = (questions) => {
    return questions.map((question) => {
      // Collect all parent answers
      const parentAnswers = Array.isArray(question.dependent_question)
        ? question.dependent_question.map(
            (parentId) => pkgData.answers[parentId] || "",
          )
        : [pkgData.answers[question.dependent_question] || ""];

      // Check if the question is visible based on dependency
      const isDependentVisible = isAnswerMatch(
        question.field_dependency,
        parentAnswers,
      );
      if (question.dependent_question && !isDependentVisible) {
        return null; // Skip rendering if conditions aren't met
      }

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
        <div className="col-12 col-md-6">
          <div className="form-group mt-4" key={question.question_id}>
            <div className="d-flex justify-content-between align-items-center mb-2 h-26">
              <label className="mb-0">
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
            {/* Recursively render follow-up questions */}
            {/* {question.follow_up_questions &&
              question.follow_up_questions.length > 0 &&
              renderQuestions(question.follow_up_questions)} */}
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
  const handleSave = async () => {
    if (!skuId || !skuData.componentId || !skuData.componentName || !pkoId) {
      console.error("Missing SKU ID, Component ID, Component Name, or PKO ID.");
      alert("Cannot save data. Missing necessary information.");
      return;
    }

    try {
      const isCompleted = pkgData.pkgFormProgress === 100;
      const payload = {
        name: skuData.componentName,
        form_status: isCompleted ? "Completed" : "Pending", // ✅ Set "Completed" if 100%
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
        console.log("Save Response:", response.data);
        alert("Component data saved successfully!");

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
        isFormFilled={isFormFilled} // Pass state to Breadcrumb
        pkoId={pkoId || "N/A"} // Pass PKO ID
        skuId={skuId || "N/A"}
        description={description || "N/A"} // Pass Description
        componentName={componentName || "Default Component"}
      />
      <Autosave
        saveFunction={autosavePkgData}
        dependencies={[pkgData.answers]}
      />
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
                {/* <ProgressLoader
                  percentage={Math.round(progressPercentage)}
                  size={24}
                />
                <span className="progress-percentage-text ms-2">
                  {Math.round(progressPercentage)}% completed
                </span> */}

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
      {/* Footer with Previous and Next buttons */}
      <div className="footer d-flex justify-content-between mt-4 bg-color-light-gray px-4 py-10 fixed-bottom w-100">
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
