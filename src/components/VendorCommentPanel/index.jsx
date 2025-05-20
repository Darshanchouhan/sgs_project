import React from "react";

const VendorCommentPanel = () => {
  return (
    <div
      className="offcanvas offcanvas-end bg-white border-start border-secondary"
      tabIndex="-1"
      id="offcanvasVendorCommentPanel"
      aria-labelledby="offcanvasVendorCommentPanelLabel"
    >
      <div className="offcanvas-header flex-column border-bottom border-secondary px-4 pt-20 pb-4">
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        ></button>
        <div className="d-flex flex-column mb-2 w-100">
          <label
            for="sendCommentTextarea"
            className="fs-16 fw-600 text-color-typo-primary mb-12"
          >
            Enter a comment
          </label>
          <div className="position-relative">
            <textarea
              className="form-control px-12 py-2"
              placeholder="Type your comment here.."
              id="sendCommentTextarea"
              style={{ height: "64px" }}
            ></textarea>
            <button
              type="button"
              className="btn text-color-typo-secondary bg-color-light-gray-shade border border-color-typo-secondary px-4 py-1 fs-14 fw-600 w-mx-content position-absolute top-50 end-0 translate-middle-y me-12"
            >
              Comment
              <img
                src="/assets/images/send-comment-icon.svg"
                alt="send-comment-icon"
                className="ms-12"
              />
            </button>
          </div>
        </div>
        <div className="d-flex align-items-center justify-content-between w-100">
          <span className="fs-12 fw-400 text-black text-nowrap">
            Add Comment labels
          </span>
          <div className="form-floating ms-12 w-100">
            <select
              className="form-select fs-12 fw-600 text-color-list-item bg-color-light-gray-shade border-0 pe-40"
              id="floatingPkoIdSelect"
              aria-label="Floating PKO ID select"
            >
              <option selected>PRJ 1188</option>
              <option value="1">One</option>
              <option value="2">Two</option>
              <option value="3">Three</option>
            </select>
            <label
              for="floatingPkoIdSelect"
              className="fs-10 fw-600 text-color-typo-primary"
            >
              PKO ID
            </label>
          </div>
          <div className="form-floating ms-12 w-100">
            <select
              className="form-select fs-12 fw-600 text-color-list-item bg-color-light-gray-shade border-0 pe-40"
              id="floatingSkuSelect"
              aria-label="Floating SKU select"
            >
              <option selected>Select</option>
              <option value="1">One</option>
              <option value="2">Two</option>
              <option value="3">Three</option>
            </select>
            <label
              for="floatingSkuSelect"
              className="fs-10 fw-600 text-color-typo-primary"
            >
              SKU
            </label>
          </div>
          <div className="form-floating ms-12 w-100">
            <select
              className="form-select fs-12 fw-600 text-color-list-item bg-color-light-gray-shade border-0 pe-40"
              id="floatingComponentSelect"
              aria-label="Floating PKO ID select"
            >
              <option selected>Select</option>
              <option value="1">One</option>
              <option value="2">Two</option>
              <option value="3">Three</option>
            </select>
            <label
              for="floatingComponentSelect"
              className="fs-10 fw-600 text-color-typo-primary"
            >
              Component
            </label>
          </div>
        </div>
      </div>
      <div className="offcanvas-body bg-color-light-gray-shade p-0 h-100">
        <div className="p-4 pb-3">
          <h2 className="fs-16 fw-600 mb-0 text-black">
            All Comments
            <span className="badge fs-14 fw-600 rounded-4 px-3 py-6 ms-2 text-secondary bg-color-badge">
              11
            </span>
          </h2>
          <div className="d-flex align-items-center justify-content-between mt-12">
            <span className="fs-12 fw-400 text-color-list-item">
              Showing all comments
            </span>
            <button
              type="button"
              className="btn p-0 border-none bg-transparent"
              data-bs-toggle="collapse"
              data-bs-target="#collapseChooseFilters"
            >
              <img src="/assets/images/filter.svg" alt="filter" />
            </button>
          </div>
        </div>
        <div class="collapse" id="collapseChooseFilters">
          <div class="card card-body bg-color-light-gray-shade-new rounded-0 border-0 border-bottom border-color-black px-4 py-14">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="fs-14 fw-400 text-color-typo-secondary">
                Choose Filters
              </span>
              <button
                type="button"
                className="btn fs-14 fw-600 text-color-draft p-0 border-none bg-transparent"
              >
                Clear all
              </button>
            </div>
            <div class="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <label className="fs-14 fw-600 text-nowrap me-3 mb-0">
                  PKO ID
                </label>
                <select className="fs-14 fw-600 text-color-list-item bg-transparent form-list p-6 pe-40 border-0 border-bottom border-color-black border-2 rounded-0">
                  <option value="PRJ 1188">PRJ 1188</option>
                  <option value="Option 2">Option 2</option>
                  <option value="Option 3">Option 3</option>
                </select>
              </div>
              <div className="d-flex align-items-center">
                <label className="fs-14 fw-600 text-nowrap me-3 mb-0">
                  SKU
                </label>
                <select className="fs-14 fw-600 text-color-list-item bg-transparent form-list p-6 pe-40 border-0 border-bottom border-color-black border-2 rounded-0">
                  <option value="Select">Select</option>
                  <option value="Option 2">Option 2</option>
                  <option value="Option 3">Option 3</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="allComments-block p-4">
          <div className="card bg-white rounded-3 border-color-light-gray-shade mb-20">
            <div className="card-header d-flex align-items-center justify-content-between border-0 bg-transparent px-3 pt-12 pb-0">
              <div className="d-flex align-items-center">
                <img
                  src="/assets/images/administrator-icon.svg"
                  alt="administrator-icon"
                />
                <div className="ms-10">
                  <h3 className="fs-14 fw-600 text-color-typo-primary mb-1">
                    Administrator
                  </h3>
                  <h4 className="fs-14 fw-400 text-color-typo-secondary mb-0">
                    Mar 24, 2025
                  </h4>
                </div>
              </div>
              <div className="d-flex align-items-center">
                <button
                  type="button"
                  className="btn border-0 p-0 d-flex align-items-center ms-3"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseExcessBlock"
                >
                  <img src="/assets/images/reply-icon.svg" alt="reply-icon" />
                </button>
                <button
                  type="button"
                  className="btn border-0 rounded-3 text-color-draft bg-color-light-border fs-14 fw-600 px-12 py-0 ms-1"
                >
                  2
                </button>
                <button
                  type="button"
                  className="btn border-0 p-0 d-flex align-items-center ms-3"
                >
                  <img
                    src="/assets/images/arrow-right-forward-blue-new.svg"
                    alt="arrow-right-forward-blue-new"
                  />
                </button>
              </div>
            </div>
            <div className="card-body px-3 pt-2 pb-14">
              <p className="fs-14 fw-400 text-color-typo-primary mb-0">
                Could you please provide clarification on the details for the
                Material Type field?
              </p>
            </div>
            <div className="card-footer px-3 py-6 border-color-desabled-lite bg-transparent">
              <div className="row">
                <div className="col-6">
                  <div className="row gx-2">
                    <div className="col-4">
                      <span className="fs-12 fw-400 text-color-typo-secondary">
                        PKO ID
                      </span>
                    </div>
                    <div className="col-8">
                      <span className="fs-12 fw-600 text-color-typo-primary">
                        PRJ 1188
                      </span>
                    </div>
                  </div>
                  <div className="row gx-2">
                    <div className="col-4">
                      <span className="fs-12 fw-400 text-color-typo-secondary">
                        SKU
                      </span>
                    </div>
                    <div className="col-8">
                      <span className="fs-12 fw-600 text-color-typo-primary">
                        CVS Ibuprofen 200mg
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="row gx-2">
                    <div className="col-4">
                      <span className="fs-12 fw-400 text-color-typo-secondary">
                        Component
                      </span>
                    </div>
                    <div className="col-8">
                      <span className="fs-12 fw-600 text-color-typo-primary">
                        Box
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="collapse p-3 bg-white border-top border-color-desabled-lite rounded-bottom-3"
              id="collapseExcessBlock"
            >
              {/* Replies Block */}
              <div className="repliesBlock mb-3 pb-3 border-bottom position-relative">
                <button
                  type="button"
                  className="btn text-color-draft bg-transparent border-0 p-0 fs-12 fw-600"
                >
                  Hide Replies (2)
                </button>
                <div className="repliedBox ms-2 ps-20 pt-20">
                  <div className="d-flex align-items-center position-relative">
                    <img
                      src="/assets/images/user-chart-profile-icon.svg"
                      alt="user-chart-profile-icon"
                    />
                    <div className="ms-10">
                      <h3 className="fs-14 fw-600 text-color-typo-primary mb-1">
                        Elvira Mosley (You)
                      </h3>
                      <h4 className="fs-14 fw-400 text-color-typo-secondary mb-0">
                        Mar 25, 2025
                      </h4>
                    </div>
                  </div>
                  <p className="fs-14 fw-400 text-color-typo-primary mt-2 mb-0">
                    It refers to the specific materials used in the packaging
                    i.e.,plastic & cardboard.
                  </p>
                </div>
                <div className="repliedBox ms-2 ps-20 pt-20">
                  <div className="d-flex align-items-center position-relative">
                    <img
                      src="/assets/images/administrator-icon.svg"
                      alt="administrator-icon"
                    />
                    <div className="ms-10">
                      <h3 className="fs-14 fw-600 text-color-typo-primary mb-1">
                        Administrator
                      </h3>
                      <h4 className="fs-14 fw-400 text-color-typo-secondary mb-0">
                        Apr 1, 2025
                      </h4>
                    </div>
                  </div>
                  <p className="fs-14 fw-400 text-color-typo-primary mt-2 mb-0">
                    Yes, that is correct.
                  </p>
                </div>
              </div>
              {/* Enter Reply Block */}
              <div className="enterReplyBlock text-end">
                <textarea
                  className="form-control px-12 py-2"
                  placeholder="Enter a reply.."
                  id="enterReplyTextarea"
                  style={{ height: "64px" }}
                ></textarea>
                <button
                  type="button"
                  className="btn text-primary bg-transparent border-0 p-0 fs-14 fw-600 mt-10 ms-auto"
                >
                  Reply
                  <img
                    src="/assets/images/send-reply-icon.svg"
                    alt="send-reply-icon"
                    className="ms-2"
                  />
                </button>
              </div>
            </div>
          </div>
          <div className="card bg-white rounded-3 border-color-light-gray-shade mb-20">
            <div className="card-header d-flex align-items-center justify-content-between border-0 bg-transparent px-3 pt-12 pb-0">
              <div className="d-flex align-items-center">
                <img
                  src="/assets/images/user-chart-profile-icon.svg"
                  alt="user-chart-profile-icon"
                />
                <div className="ms-10">
                  <h3 className="fs-14 fw-600 text-color-typo-primary mb-1">
                    Elvira Mosley (You)
                  </h3>
                  <h4 className="fs-14 fw-400 text-color-typo-secondary mb-0">
                    Apr 1, 2025
                  </h4>
                </div>
              </div>
              <div className="d-flex align-items-center">
                <button type="button" className="btn border-0 p-0 ms-3">
                  <img
                    src="/assets/images/delete-icon-blue.svg"
                    alt="delete-icon-blue"
                  />
                </button>
                <button
                  type="button"
                  className="btn border-0 p-0 d-flex align-items-center ms-3"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseExcessBlock"
                >
                  <img src="/assets/images/reply-icon.svg" alt="reply-icon" />
                </button>
                <button
                  type="button"
                  className="btn border-0 p-0 d-flex align-items-center ms-3"
                >
                  <img
                    src="/assets/images/arrow-right-forward-blue-new.svg"
                    alt="arrow-right-forward-blue-new"
                  />
                </button>
              </div>
            </div>
            <div className="card-body px-3 pt-2 pb-14">
              <p className="fs-14 fw-400 text-color-typo-primary mb-0">
                Could you please provide clarification on the details for the
                Material Type field?
              </p>
            </div>
            <div className="card-footer px-3 py-6 border-color-desabled-lite bg-transparent">
              <div className="row">
                <div className="col-6">
                  <div className="row gx-2">
                    <div className="col-4">
                      <span className="fs-12 fw-400 text-color-typo-secondary">
                        PKO ID
                      </span>
                    </div>
                    <div className="col-8">
                      <span className="fs-12 fw-600 text-color-typo-primary">
                        PRJ 1188
                      </span>
                    </div>
                  </div>
                  <div className="row gx-2">
                    <div className="col-4">
                      <span className="fs-12 fw-400 text-color-typo-secondary">
                        SKU
                      </span>
                    </div>
                    <div className="col-8">
                      <span className="fs-12 fw-600 text-color-typo-primary">
                        CVS Ibuprofen 200mg
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="row gx-2">
                    <div className="col-4">
                      <span className="fs-12 fw-400 text-color-typo-secondary">
                        Component
                      </span>
                    </div>
                    <div className="col-8">
                      <span className="fs-12 fw-600 text-color-typo-primary">
                        Box
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="collapse p-3 bg-white border-top border-color-desabled-lite rounded-bottom-3"
              id="collapseExcessBlock"
            >
              Same Structure here..
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorCommentPanel;
