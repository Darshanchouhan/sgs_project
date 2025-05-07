import {useRef} from 'react';

const SendReminderModal = ({
    selectedPKOIds,
    text,
    handleChange,
    handleSubmitReminder,
    wordCount,
    isOpen,
    onClose,
    setText
  }) => {
    const backdropRef = useRef(null);

  const handleBackdropClick = (e) => {
    // Only close if user clicked on the backdrop, not inside modal content
    if (e.target === backdropRef.current) {
      setText("The PKO submission deadline is approaching! Please ensure you submit your forms before the closing date to have your input counted. Thank you!");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={backdropRef}
      className="modal fade show d-block send-reminder-modal-popup"
      tabIndex="-1"
      aria-labelledby="sendReminderModalLabel"
      aria-modal="true"
      role="dialog"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={handleBackdropClick}
    >
      <div className="modal-dialog modal-dialog-centered bg-transparent p-0">
        <div className="modal-content rounded-1">
          <div className="modal-header px-32 pt-4 pb-20 border-0">
            <h1
              className="modal-title fs-16 fw-600 text-color-typo-primary mb-0"
              id="sendReminderModalLabel"
            >
              Send Reminder
            </h1>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body px-32 py-0">
            <h2 className="fs-16 fw-600 text-primary mb-3">
              {selectedPKOIds?.length} PKOs selected
            </h2>
            <label
              htmlFor="reminderMessageTextarea"
              className="fs-14 fw-400 text-color-typo-primary"
            >
              Your Message
            </label>
            <div className="form-floating">
              <textarea
                className="form-control px-12 py-2"
                placeholder="Leave a comment here"
                id="reminderMessageTextarea"
                value={text}
                onChange={handleChange}
                style={{ height: '130px' }}
              ></textarea>
            </div>
            <div className="text-end pt-2 fs-12">
              You have entered {wordCount(text)} out of 50 words.
            </div>
          </div>
          <div className="modal-footer d-flex align-items-center justify-content-end flex-nowrap px-32 py-4 border-0">
            <button
              type="button"
              className="btn btn-outline-primary fs-14 fw-600 px-4 py-10 rounded-1 me-3"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary fs-14 fw-600 px-4 py-10 rounded-1"
              onClick={() => {
                handleSubmitReminder();
                onClose();
              }}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

  export default SendReminderModal
  