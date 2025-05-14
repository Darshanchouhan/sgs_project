import React from 'react';

const SentReminderModal = () => {

  return (
    <div
        className="modal fade sent-reminder-modal-popup"
        id="sentReminderModal"
        tabIndex="-1"
        aria-labelledby="sentReminderModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered bg-transparent p-0">
          <div className="modal-content rounded-1">
            <div className="modal-header px-32 py-4 border-0">
              <h1
                className="modal-title fs-16 fw-600 text-color-typo-primary mb-0"
                id="sentReminderModalLabel"
              >
                Sent Reminders
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body px-32 py-0 pb-4">
              <ul className="list-unstyled m-0">
                <li className="border-bottom pb-20 mb-20">
                  <div className="d-flex align-items-center mb-10">
                    <h2 className="fs-18 fw-600 text-color-typo-primary mb-0">06 Apr 2025</h2>
                    <span className="mx-1 lh-8">|</span>
                    <h3 className="fs-18 fw-600 text-primary mb-0">3 PKOs</h3>
                  </div>
                  <p className="fs-16 fw-400 text-color-typo-primary mb-0">The deadline to complete the PKO form is approaching! Please submit your responses soon to ensure your input is included. Thank you!</p>
                </li>
                <li className="border-bottom pb-20 mb-20">
                  <div className="d-flex align-items-center mb-10">
                    <h2 className="fs-18 fw-600 text-color-typo-primary mb-0">06 Apr 2025</h2>
                    <span className="mx-1 lh-8">|</span>
                    <h3 className="fs-18 fw-600 text-primary mb-0">3 PKOs</h3>
                  </div>
                  <p className="fs-16 fw-400 text-color-typo-primary mb-0">The deadline to complete the PKO form is approaching! Please submit your responses soon to ensure your input is included. Thank you!</p>
                </li>
                <li className="border-bottom pb-20 mb-20">
                  <div className="d-flex align-items-center mb-10">
                    <h2 className="fs-18 fw-600 text-color-typo-primary mb-0">06 Apr 2025</h2>
                    <span className="mx-1 lh-8">|</span>
                    <h3 className="fs-18 fw-600 text-primary mb-0">3 PKOs</h3>
                  </div>
                  <p className="fs-16 fw-400 text-color-typo-primary mb-0">The deadline to complete the PKO form is approaching! Please submit your responses soon to ensure your input is included. Thank you!</p>
                </li>
                <li className="border-bottom pb-20 mb-20">
                  <div className="d-flex align-items-center mb-10">
                    <h2 className="fs-18 fw-600 text-color-typo-primary mb-0">06 Apr 2025</h2>
                    <span className="mx-1 lh-8">|</span>
                    <h3 className="fs-18 fw-600 text-primary mb-0">3 PKOs</h3>
                  </div>
                  <p className="fs-16 fw-400 text-color-typo-primary mb-0">The deadline to complete the PKO form is approaching! Please submit your responses soon to ensure your input is included. Thank you!</p>
                </li>
                <li className="border-bottom pb-20 mb-20">
                  <div className="d-flex align-items-center mb-10">
                    <h2 className="fs-18 fw-600 text-color-typo-primary mb-0">06 Apr 2025</h2>
                    <span className="mx-1 lh-8">|</span>
                    <h3 className="fs-18 fw-600 text-primary mb-0">3 PKOs</h3>
                  </div>
                  <p className="fs-16 fw-400 text-color-typo-primary mb-0">The deadline to complete the PKO form is approaching! Please submit your responses soon to ensure your input is included. Thank you!</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
  );
};

export default SentReminderModal;
