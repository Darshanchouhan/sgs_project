import React, { useState, useEffect } from "react";

const SkuValidation = ({
  validationIssues = [],
  show,
  onClose,
  onProceed,
  components = [],
  componentValidationIssues = [],
  imagesFromDB = [], // Receive images from the parent component
}) => {
  const [isProceedEnabled, setIsProceedEnabled] = useState(false);
  const [additionalMessage, setAdditionalMessage] = useState("");
  const noImagesAttached = imagesFromDB.length === 0;

  useEffect(() => {
    console.log("Validation Check: Images from DB:", imagesFromDB);

    // Only disable proceed button if images are missing
    if (
      validationIssues.length === 0 &&
      componentValidationIssues.length === 0 &&
      imagesFromDB.length > 0 //  Correctly check if images exist
    ) {
      setAdditionalMessage("No issues found. You may proceed to submission!");
      console.log("no  validation issue enable prceed to submission button");
      setIsProceedEnabled(true);
    } else {
      console.log(
        "issue in proceed to enable",
        validationIssues.length,
        componentValidationIssues.length,
        imagesFromDB.length,
      );
      if (validationIssues.length === 0 && imagesFromDB.length > 0) {
        if (componentValidationIssues.length === 0) {
          setAdditionalMessage("");
          setIsProceedEnabled(true);
        } else {
          //if we want to set any message for component range kind of issue set here
          setAdditionalMessage(
            "Some values are out of the expected range. You can still proceed with submission.",
          );
          setIsProceedEnabled(true);
        }
      } else {
        console.log("validation issue enable prceed to submission button");
        setAdditionalMessage("");
        setIsProceedEnabled(false);
      }
    }
  }, [validationIssues, componentValidationIssues, imagesFromDB]);

  if (!show) return null; // Hide modal when not active

  return (
    <div className="modal-overlay analysisModal ">
      <div className="modal-dialog p-0 modal-dialog-scrollable">
        <div className="modal-content h-100">
          <div className="modal-header flex-column align-items-center border-0 px-40">
            <h1 className="modal-title fs-22 fw-600 text-color-typo-primary mb-1">
              {validationIssues.length +
                componentValidationIssues.length +
                (noImagesAttached ? 1 : 0)}{" "}
              issue(s) found
            </h1>

            <p className="fs-14 fw-400 text-color-labels mb-0">
              Please resolve the following issues before submission.
            </p>
          </div>
          <div className="modal-body px-40 py-0 myScroller">
            <table className="table table-bordered analysisTable fs-14 fw-400 text-color-typo-primary mb-0">
              <thead>
                <tr>
                  <th scope="col" className="text-nowrap p-12 fw-600">
                    Where
                  </th>
                  <th scope="col" className="text-nowrap p-12 fw-600">
                    Component Name
                  </th>
                  <th scope="col" className="text-nowrap p-12 fw-600">
                    Issue Found
                  </th>
                </tr>
              </thead>
              <tbody>
                {validationIssues.length > 0 &&
                  validationIssues.map((issue, index) => (
                    <tr key={`sku-${index}`}>
                      <td className="p-12">SKU Form</td>
                      <td className="p-12">N/A</td>
                      <td className="p-12">{issue.issue}</td>
                    </tr>
                  ))}
                {componentValidationIssues.length > 0 &&
                  componentValidationIssues.map((issue, index) => (
                    <tr key={`component-${index}`}>
                      <td className="p-12">Component Form</td>
                      <td className="p-12">
                        {issue.component || "Unnamed Component"}
                      </td>
                      <td className="p-12">{issue.issue}</td>
                    </tr>
                  ))}
                {/* New Validation Issue: No Image Uploaded */}
                {noImagesAttached && (
                  <tr>
                    <td className="p-12">Add/View Image</td>
                    <td className="p-12">N/A</td>
                    <td className="p-12">No image uploaded on SKU Page.</td>
                  </tr>
                )}

                {/* Success Message: No Issues Left */}
                {additionalMessage && (
                  <tr>
                    <td
                      colSpan="3"
                      className="text-center p-12 fw-600 text-success"
                    >
                      {additionalMessage}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="modal-footer justify-content-center border-0 px-40">
            <button
              type="button"
              className="btn btn-outline-secondary rounded-pill fs-14 fw-600 px-4 py-12 m-0 mx-2 my-0"
              onClick={onClose}
            >
              Back to Data Collection Form
            </button>
            <button
              type="button"
              // className="save-button btn btn-primary rounded-pill fs-14 fw-600 px-4 py-12 m-0 mx-2 my-0"
              className={`save-button px-4 py-12 fs-14 fw-600 border-0 ${
                isProceedEnabled ? "bg-secondary text-white" : "btn btn-primary"
              } rounded-pill m-0 mx-2 my-0`}
              onClick={onProceed}
              disabled={!isProceedEnabled} // Button is only enabled when no issues
            >
              Proceed to Submission
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkuValidation;
