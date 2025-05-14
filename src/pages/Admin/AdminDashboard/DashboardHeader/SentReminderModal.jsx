import React from "react";
import { useRef } from "react";

const SentReminderModal = ({ isOpen, onClose, reminderData }) => {
  const backdropRef = useRef(null);

  const handleBackdropClick = (e) => {
    // Only close if user clicked on the backdrop, not inside modal content
    if (e.target === backdropRef.current) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={backdropRef}
      className="modal fade show d-block sent-reminder-modal-popup"
      tabIndex="-1"
      aria-labelledby="sentReminderModalLabel"
      aria-modal="true"
      role="dialog"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={handleBackdropClick}
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
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body px-32 py-0 pb-4">
            <ul className="list-unstyled m-0">
              {reminderData &&
                reminderData?.map((item) => {
                  return (
                    <li className="border-bottom pb-20 mb-20">
                      <div className="d-flex align-items-center mb-10">
                        <h2 className="fs-18 fw-600 text-color-typo-primary mb-0">
                          {item?.created_date}
                        </h2>
                        <span className="mx-1 lh-8">|</span>
                        <h3
                          className="fs-18 fw-600 text-primary mb-0"
                          title={item?.pko_ids}
                        >
                          {item?.pko_ids?.length} PKOs
                        </h3>
                      </div>
                      <p className="fs-16 fw-400 text-color-typo-primary mb-0">
                        {item?.message}
                      </p>
                    </li>
                  );
                })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SentReminderModal;
