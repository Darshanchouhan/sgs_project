const AdminApproveSKUModal = () => {
    return (
        <div
            className="modal fade approve-sku-modal-popup"
            id="approveSKUModal"
            tabIndex="-1"
            aria-labelledby="approveSKUModalLabel"
            aria-hidden="true"
        >
            <div className="modal-dialog modal-md modal-dialog-centered p-0 bg-transparent shadow-none">
                <div className="modal-content">
                    <div className="modal-body text-center px-5 pt-5 pb-32">
                        <h5 className="fs-22 fw-600 mb-0">
                            Are you sure you want to approve this SKU form?
                        </h5>
                    </div>
                    <div className="modal-footer justify-content-center px-4 pt-0 pb-5 border-0">
                        <button
                            type="button"
                            className="btn btn-primary px-4 py-12 fs-14 fw-600"
                        >
                            Yes, Approve
                        </button>
                        <button
                            type="button"
                            className="btn btn-outline-secondary px-4 py-12 fs-14 fw-600"
                            data-bs-dismiss="modal"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminApproveSKUModal;