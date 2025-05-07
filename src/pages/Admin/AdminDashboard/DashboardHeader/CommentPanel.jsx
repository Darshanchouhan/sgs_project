import React from "react";

const CommentPanel = () => {
    return (
        <div className="offcanvas offcanvas-end w-25" tabIndex="-1" id="offcanvasCommentPanel" aria-labelledby="offcanvasCommentPanelLabel">
            <div className="offcanvas-header flex-column px-4 pt-4 pb-12">
                <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                <div className="d-flex flex-column mb-40 w-100">
                    <label for="sendCommentTextarea" className="fs-14 fw-400 text-color-typo-primary mb-2">Send a comment</label>
                    <div className="form-floating">
                        <textarea className="form-control px-12 py-2" placeholder="Type your comment here.." id="sendCommentTextarea" style={{ height: '64px'}}></textarea>
                    </div>
                    <button type="button" className="btn btn-secondary px-4 py-2 fs-14 fw-600 mt-2 w-mx-content ms-auto">
                        Comment
                        <img
                        src="/assets/images/log-out-icon.svg"
                        alt="send-icon"
                        className="ms-12"
                        />
                    </button>
                </div>
                <div className="d-flex justify-content-between align-items-center w-100">
                    <div className="d-flex align-items-center">
                        <h2 className="fs-16 fw-600 mb-0 text-black">All Comments</h2>
                    </div>
                    <span>icon</span>
                </div>
            </div>
            <div className="offcanvas-body p-4">
                <div>
                    <p>Showing all comments</p>
                </div>
            </div>
        </div>
    );
};

export default CommentPanel;
