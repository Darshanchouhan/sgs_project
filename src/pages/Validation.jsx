import React from "react";

const ValidationModal = ({
  unansweredQuestions = [],
  onBack,
  onProceed,
  // onSaveDraft,
  onPrevious,
  // showSaveAsDraftButton,
  isPreviousValidation,
}) => {
  return (
    <div
      className="modal fade show d-block analysisModal"
      tabIndex="-1"
      aria-labelledby="validationModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog p-0 modal-dialog-scrollable">
        <div className="modal-content h-100">
          <div className="modal-header flex-column align-items-center border-0 px-40">
            <h1
              className="modal-title fs-22 fw-600 text-color-typo-primary mb-1"
              id="validationModalLabel"
            >
              {unansweredQuestions.length} issues found
            </h1>
            <p className="fs-14 fw-400 text-color-labels mb-0">
              Please resolve the following issues.
            </p>
            {/* <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onBack}
            ></button> */}
          </div>
          <div className="modal-body px-40 py-0 myScroller">
            <table className="table table-bordered analysisTable fs-14 fw-400 text-color-typo-primary mb-0">
              <thead>
                <tr>
                  <th scope="col" className="text-nowrap p-12 fw-600">
                    Field Name
                  </th>
                  <th scope="col" className="text-nowrap p-12 fw-600">
                    Issue found
                  </th>
                </tr>
              </thead>
              <tbody>
                {unansweredQuestions.map((question, index) => (
                  <tr key={index}>
                    <td className="p-12">{question.fieldName}</td>
                    <td className="p-12">
                      <div className="d-flex justify-content-between align-items-center">
                        <p className="mb-0">{question.issue}</p>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="modal-footer justify-content-center border-0 px-40">
            <button
              type="button"
              className="btn btn-outline-secondary rounded-1 fs-14 fw-600 px-3 py-10 m-0 mx-2 my-0"
              onClick={onBack}
            >
              Back to the Current Section
            </button>

            {/* Save as Draft/previous section/next section (conditionally rendered) */}
            {isPreviousValidation ? (
              <button
                type="button"
                className="btn btn-primary rounded-1 fs-14 fw-600 px-3 py-10 m-0 mx-2 my-0"
                onClick={onPrevious}
              >
                Proceed to Previous Section
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-primary rounded-1 fs-14 fw-600 px-3 py-10 m-0 mx-2 my-0"
                onClick={onProceed}
              >
                Proceed to Next Section
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValidationModal;
