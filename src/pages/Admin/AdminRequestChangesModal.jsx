import { useRef } from "react";

const AdminRequestChangesModal = ({isRequestOpen, onRequestClose, RequestChanges}) => {

    const backdropRef = useRef(null);
  
    const handleBackdropClick = (e) => {
      // Only close if user clicked on the backdrop, not inside modal content
      if (e.target === backdropRef.current) {
        onRequestClose();
      }
    };
  
    if (!isRequestOpen) return null;

  return (
    <div
      className="modal fade show d-block request-changes-modal-popup"
      tabIndex="-1"
      aria-labelledby="requestChangesModalLabel"
      aria-modal="true"
      role="dialog"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={handleBackdropClick}
    >
      <div className="modal-dialog modal-md modal-dialog-centered p-0 bg-transparent shadow-none">
        <div className="modal-content">
          <div className="modal-body text-center px-5 py-5">
            <h5 className="fs-22 fw-600 mb-0">
              Are you sure you want the supplier to make further changes to this
              SKU form?
            </h5>
          </div>
          <div className="modal-footer justify-content-center px-4 pt-0 pb-5 border-0">
            <button
              type="button"
              className="btn btn-primary px-4 py-12 fs-14 fw-600"
              onClick={RequestChanges}
            >
              Request Changes
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary px-4 py-12 fs-14 fw-600"
              data-bs-dismiss="modal"
              onClick={onRequestClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRequestChangesModal;
