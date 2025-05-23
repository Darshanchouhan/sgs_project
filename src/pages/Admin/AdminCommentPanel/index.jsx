import React from "react";

const AdminCommentPanel = () => {
  return (
    <div
      className="offcanvas offcanvas-end border-start border-secondary"
      tabIndex="-1"
      id="offcanvasAdminCommentPanel"
      aria-labelledby="offcanvasAdminCommentPanelLabel"
    >
      <div className="offcanvas-header flex-column border-bottom border-secondary px-4 pt-4 pb-3">
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        ></button>
        <div className="d-flex flex-column mb-28 w-100">
          <label
            for="sendCommentTextareaAdmin"
            className="fs-14 fw-600 text-color-typo-primary mb-2"
          >
            Send a comment
          </label>
          <div className="position-relative">
            <textarea
              className="form-control p-12 mb-2"
              placeholder="Type your comment here.."
              id="sendCommentTextareaAdmin"
              style={{ height: "124px" }}
            ></textarea>
            <div className="d-flex align-items-center justify-content-between ms-12 mb-20 position-absolute start-0 bottom-0">
              <div className="d-flex align-items-center me-5">
                <label className="fs-14 fw-600 text-nowrap me-3 mb-0">PKO ID</label>
                <select
                  className="fs-14 fw-600 text-color-list-item bg-transparent form-list p-6 pe-40 border-0 border-bottom border-color-black border-2 rounded-0 w-180"
                >
                  <option value="PRJ 1188">PRJ 1188</option>
                  <option value="Option 2">Option 2</option>
                  <option value="Option 3">Option 3</option>
                </select>
              </div>
              <div className="d-flex align-items-center me-5">
                <label className="fs-14 fw-600 text-nowrap me-3 mb-0">SKU</label>
                <select
                  className="fs-14 fw-600 text-color-list-item bg-transparent form-list p-6 pe-40 border-0 border-bottom border-color-black border-2 rounded-0 w-180"
                >
                  <option value="Select">Select</option>
                  <option value="Option 2">Option 2</option>
                  <option value="Option 3">Option 3</option>
                </select>
              </div>
              <div className="d-flex align-items-center">
                <label className="fs-14 fw-600 text-nowrap me-3 mb-0">Component</label>
                <select
                  className="fs-14 fw-600 text-color-list-item bg-transparent form-list p-6 pe-40 border-0 border-bottom border-color-black border-2 rounded-0 w-180"
                >
                  <option value="Select">Select</option>
                  <option value="Option 2">Option 2</option>
                  <option value="Option 3">Option 3</option>
                </select>
              </div>
            </div>
          </div>
          <button
            type="button"
            className="btn text-color-typo-secondary bg-color-light-gray-shade border border-color-typo-secondary px-4 py-1 fs-14 fw-600 w-mx-content ms-auto"
          >
            Comment
            <img
              src="/assets/images/send-comment-icon.svg"
              alt="send-comment-icon"
              className="ms-12"
            />
          </button>
        </div>
        <div className="d-flex justify-content-between align-items-center w-100">
          <h2 className="fs-16 fw-600 mb-0 text-black">
            All Comments
            <span className="badge fs-14 fw-600 rounded-4 px-3 py-6 ms-2 text-secondary bg-color-badge">48</span>
          </h2>
          <button
            type="button"
            className="btn p-0 border-none bg-transparent lh-16 position-relative"
            data-bs-toggle="collapse"
            data-bs-target="#collapseChooseFiltersAdmin"
          >
            <img
              src="/assets/images/filter.svg"
              alt="filter"
            />
            <span className="position-absolute top-0 start-100 translate-middle p-1 bg-color-draft rounded-circle">
              <span className="visually-hidden">New alerts</span>
            </span>
          </button>
        </div>
      </div>
      <div className="collapse px-4 py-3 bg-color-light-gray-shade-new border-bottom border-color-black" id="collapseChooseFiltersAdmin">
        <p className="fs-12 fw-600 text-color-list-item mb-3">Select Filters</p>
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center me-5">
              <label className="fs-14 fw-600 text-nowrap me-3 mb-0">PKO ID</label>
              <select
                className="fs-14 fw-600 text-color-list-item bg-transparent form-list p-6 pe-40 border-0 border-bottom border-color-black border-2 rounded-0 w-180"
              >
                <option value="PRJ 1188">PRJ 1188</option>
                <option value="Option 2">Option 2</option>
                <option value="Option 3">Option 3</option>
              </select>
            </div>
            <div className="d-flex align-items-center me-5">
              <label className="fs-14 fw-600 text-nowrap me-3 mb-0">Supplier</label>
              <select
                className="fs-14 fw-600 text-color-list-item bg-transparent form-list p-6 pe-40 border-0 border-bottom border-color-black border-2 rounded-0 w-180"
              >
                <option value="Select">Select</option>
                <option value="Option 2">Option 2</option>
                <option value="Option 3">Option 3</option>
              </select>
            </div>
            <div className="d-flex align-items-center">
              <label className="fs-14 fw-600 text-nowrap me-3 mb-0">SKU ID</label>
              <select
                className="fs-14 fw-600 text-color-list-item bg-transparent form-list p-6 pe-40 border-0 border-bottom border-color-black border-2 rounded-0 w-180"
              >
                <option value="Select">Select</option>
                <option value="Option 2">Option 2</option>
                <option value="Option 3">Option 3</option>
              </select>
            </div>
          </div>
          <button
            type="button"
            className="btn fs-14 fw-600 text-color-draft p-0 border-none bg-transparent"
          >
            Clear filter
          </button>
        </div>
      </div>
      <div className="offcanvas-body px-4 py-3">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <p className="fs-12 fw-400 text-color-list-item mb-0">Showing all comments</p>
          <button
            type="button"
            className="btn fs-14 fw-600 text-color-draft p-0 border-none bg-transparent"
          >
            Clear filter
          </button>
        </div>
        <div className="mb-2 table-responsive AdminCommentPanelMainTable-holder">
          <table className="table table-bordered fs-14 fw-400 text-color-typo-primary mb-0">
            <thead className="sticky-top">
              <tr>
                <th scope="col" className="p-12 fw-600 bg-color-drag-drop-box text-nowrap">
                  <div className="d-flex align-items-center justify-content-between">
                    Name
                    <img
                      className="cursor-pointer"
                      src="/assets/images/Filter_icon.svg"
                      alt="sorting-icon"
                    />
                  </div>
                </th>
                <th scope="col" className="p-12 fw-600 bg-color-drag-drop-box text-nowrap">
                  Comment
                </th>
                <th scope="col" className="p-12 fw-600 bg-color-drag-drop-box text-nowrap">
                  <div className="d-flex align-items-center justify-content-between">
                    Last Active
                    <img
                      className="cursor-pointer"
                      src="/assets/images/Filter_icon.svg"
                      alt="sorting-icon"
                    />
                  </div>
                </th>
                <th scope="col" className="p-12 fw-600 bg-color-drag-drop-box text-nowrap">
                  <div className="d-flex align-items-center justify-content-between">
                    PKO ID
                    <img
                      className="cursor-pointer"
                      src="/assets/images/Filter_icon.svg"
                      alt="sorting-icon"
                    />
                  </div>
                </th>
                <th scope="col" className="p-12 fw-600 bg-color-drag-drop-box text-nowrap">
                  <div className="d-flex align-items-center justify-content-between">
                    SKU ID
                    <img
                      className="cursor-pointer"
                      src="/assets/images/Filter_icon.svg"
                      alt="sorting-icon"
                    />
                  </div>
                </th>
                <th scope="col" className="p-12 fw-600 bg-color-drag-drop-box text-nowrap">
                  
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-12 py-2 align-middle fw-600 text-nowrap"><span className="w-8 h-8 rounded-circle bg-color-draft d-inline-block me-10"></span>Ezekiel Taylor</td>
                <td className="px-12 py-2 align-middle">
                  Does component size mean we mean dimensions in L x W x H?
                  <p className="fs-12 fw-600 mb-0">16 May, 2025</p>
                </td>
                <td className="px-12 py-2 align-middle text-end">16/5/2025</td>
                <td className="px-12 py-2 align-middle">
                  PRJ1188
                  <p className="mb-0">(Perrigo Com...)</p>
                </td>
                <td className="px-12 py-2 align-middle">
                  1234567
                  <p className="mb-0">(Box)</p>
                </td>
                <td className="px-12 py-2 align-middle">
                  <button
                    type="button"
                    className="btn p-0 pe-35 border-none bg-transparent form-list position-relative"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseRepliesAdmin"
                  >
                    <div className="d-inline-block position-relative">
                      <img
                        src="/assets/images/replies-count-icon-admin.svg"
                        alt="replies-count-icon-admin"
                      />
                      <span className="fs-12 fw-600 text-white position-absolute top-50 start-50 translate-middle pb-1">2</span>
                    </div>
                  </button>
                </td>
              </tr>
              {/* All Replies Block Admin Start Here */}
              <tr className="collapse" id="collapseRepliesAdmin">
                <td className="px-12 py-2 align-middle fw-600 bg-color-light-gray-shade">Administrator</td>
                <td className="px-12 py-2 align-middle bg-color-light-gray-shade">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      Reply shown here
                      <p className="fs-12 fw-600 mb-0">16 May, 2025</p>
                    </div>
                    <button
                      type="button"
                      className="btn p-0 border-none bg-transparent"
                    >
                      <img
                        src="/assets/images/delete-icon-blue.svg"
                        alt="delete-icon-blue"
                        className="w-16"
                      />
                    </button>
                  </div>
                </td>
                <td className="px-12 py-2 bg-color-light-gray-shade" rowSpan={2}></td>
                <td className="px-12 py-2 bg-color-light-gray-shade" rowSpan={2}>
                  <p className="fw-600 mb-0">Supplier:</p>
                  Perrigo Company
                </td>
                <td className="px-12 py-2 bg-color-light-gray-shade" rowSpan={2}>
                  <p className="fw-600 mb-0">Component:</p>
                  Box
                </td>
                <td className="px-12 py-2 bg-color-light-gray-shade" rowSpan={2}>2 replies</td>
              </tr>
              <tr className="collapse" id="collapseRepliesAdmin">
                <td className="px-12 py-2 align-middle fw-600 bg-color-light-gray-shade">Ezekiel Taylor</td>
                <td className="px-12 py-2 align-middle bg-color-light-gray-shade">
                  <div className="d-flex align-items-center justify-content-between mb-4">
                    <div>
                      Reply 2 shown here
                      <p className="fs-12 fw-600 mb-0">16 May, 2025</p>
                    </div>
                    <button
                      type="button"
                      className="btn p-0 border-0 bg-transparent"
                    >
                      <img
                        src="/assets/images/delete-icon-disabled.svg"
                        alt="delete-icon-disabled"
                        className="w-16"
                      />
                    </button>
                  </div>
                  <button
                    type="button"
                    className="btn p-0 fs-12 fw-600 text-color-draft border-none bg-transparent d-flex align-items-center"
                  >
                    <img
                      src="/assets/images/reply-icon.svg"
                      alt="reply-icon"
                      className="me-6"
                    />
                    Reply
                  </button>
                </td>
              </tr>
              <tr className="collapse" id="collapseRepliesAdmin">
                <td className="px-12 py-2 align-middle bg-color-light-gray-shade"></td>
                <td className="px-12 py-2 pe-0 align-middle bg-color-light-gray-shade border-end-0" colSpan={3}>
                  <textarea
                    className="form-control px-12 py-2 border-color-typo-secondary"
                    placeholder="Type your Reply here.."
                    id="replyCommentTextareaAdmin"
                    style={{ height: "82px" }}
                  ></textarea>
                </td>
                <td className="px-12 py-2 align-middle bg-color-light-gray-shade border-start-0" colSpan={2}>
                  <div className="d-flex align-items-center">
                    <button
                      type="button"
                      className="btn p-0 fs-14 fw-600 text-color-draft border-none bg-transparent d-flex align-items-center me-3"
                    >
                      <img
                        src="/assets/images/send-reply-admin-icon.svg"
                        alt="send-reply-admin-icon"
                        className="me-1"
                      />
                      Send
                    </button>
                    <button
                      type="button"
                      className="btn p-0 fs-14 fw-600 text-color-responce-pending border-none bg-transparent d-flex align-items-center"
                    >
                      <img
                        src="/assets/images/close-icon-red-new.svg"
                        alt="close-icon-red-new"
                        className="me-1"
                      />
                      Cancel
                    </button>
                  </div>
                </td>
              </tr>
              {/* All Replies Block Admin End Here */}
              <tr>
                <td className="px-12 py-2 align-middle fw-600 text-nowrap"><span className="w-8 h-8 rounded-circle bg-color-draft d-inline-block me-10"></span>Maria Torff</td>
                <td className="px-12 py-2 align-middle">
                  Could you please provide clarification on the details for the Material
                  <p className="fs-12 fw-600 mb-0">16 May, 2025</p>
                </td>
                <td className="px-12 py-2 align-middle text-end">16/5/2025</td>
                <td className="px-12 py-2 align-middle">
                  PRJ1188
                  <p className="mb-0">(Perrigo Com...)</p>
                </td>
                <td className="px-12 py-2 align-middle">
                  1234567
                  <p className="mb-0">(Box)</p>
                </td>
                <td className="px-12 py-2 align-middle">
                  <button
                    type="button"
                    className="btn p-0 pe-35 border-none bg-transparent form-list position-relative"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseRepliesAdmin"
                  >
                    <div className="d-inline-block position-relative">
                      <img
                        src="/assets/images/replies-count-icon-admin.svg"
                        alt="replies-count-icon-admin"
                      />
                      <span className="fs-12 fw-600 text-white position-absolute top-50 start-50 translate-middle pb-1">0</span>
                    </div>
                  </button>
                </td>
              </tr>
              <tr>
                <td className="px-12 py-2 align-middle fw-600 text-nowrap">Ezekiel Taylor</td>
                <td className="px-12 py-2 align-middle">
                  Does component size mean we mean dimensions in L x W x H?
                  <p className="fs-12 fw-600 mb-0">16 May, 2025</p>
                </td>
                <td className="px-12 py-2 align-middle text-end">16/5/2025</td>
                <td className="px-12 py-2 align-middle">
                  PRJ1188
                  <p className="mb-0">(Perrigo Com...)</p>
                </td>
                <td className="px-12 py-2 align-middle">
                  1234567
                  <p className="mb-0">(Box)</p>
                </td>
                <td className="px-12 py-2 align-middle">
                  <button
                    type="button"
                    className="btn p-0 pe-35 border-none bg-transparent form-list position-relative"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseRepliesAdmin"
                  >
                    <div className="d-inline-block position-relative">
                      <img
                        src="/assets/images/replies-count-icon-admin.svg"
                        alt="replies-count-icon-admin"
                      />
                      <span className="fs-12 fw-600 text-white position-absolute top-50 start-50 translate-middle pb-1">2</span>
                    </div>
                  </button>
                </td>
              </tr>
              <tr>
                <td className="px-12 py-2 align-middle fw-600 text-nowrap">Ezekiel Taylor</td>
                <td className="px-12 py-2 align-middle">
                  Does component size mean we mean dimensions in L x W x H?
                  <p className="fs-12 fw-600 mb-0">16 May, 2025</p>
                </td>
                <td className="px-12 py-2 align-middle text-end">16/5/2025</td>
                <td className="px-12 py-2 align-middle">
                  PRJ1188
                  <p className="mb-0">(Perrigo Com...)</p>
                </td>
                <td className="px-12 py-2 align-middle">
                  1234567
                  <p className="mb-0">(Box)</p>
                </td>
                <td className="px-12 py-2 align-middle">
                  <button
                    type="button"
                    className="btn p-0 pe-35 border-none bg-transparent form-list position-relative"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseRepliesAdmin"
                  >
                    <div className="d-inline-block position-relative">
                      <img
                        src="/assets/images/replies-count-icon-admin.svg"
                        alt="replies-count-icon-admin"
                      />
                      <span className="fs-12 fw-600 text-white position-absolute top-50 start-50 translate-middle pb-1">2</span>
                    </div>
                  </button>
                </td>
              </tr>
              <tr>
                <td className="px-12 py-2 align-middle fw-600 text-nowrap">Ezekiel Taylor</td>
                <td className="px-12 py-2 align-middle">
                  Does component size mean we mean dimensions in L x W x H?
                  <p className="fs-12 fw-600 mb-0">16 May, 2025</p>
                </td>
                <td className="px-12 py-2 align-middle text-end">16/5/2025</td>
                <td className="px-12 py-2 align-middle">
                  PRJ1188
                  <p className="mb-0">(Perrigo Com...)</p>
                </td>
                <td className="px-12 py-2 align-middle">
                  1234567
                  <p className="mb-0">(Box)</p>
                </td>
                <td className="px-12 py-2 align-middle">
                  <button
                    type="button"
                    className="btn p-0 pe-35 border-none bg-transparent form-list position-relative"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseRepliesAdmin"
                  >
                    <div className="d-inline-block position-relative">
                      <img
                        src="/assets/images/replies-count-icon-admin.svg"
                        alt="replies-count-icon-admin"
                      />
                      <span className="fs-12 fw-600 text-white position-absolute top-50 start-50 translate-middle pb-1">2</span>
                    </div>
                  </button>
                </td>
              </tr>
              <tr>
                <td className="px-12 py-2 align-middle fw-600 text-nowrap">Ezekiel Taylor</td>
                <td className="px-12 py-2 align-middle">
                  Does component size mean we mean dimensions in L x W x H?
                  <p className="fs-12 fw-600 mb-0">16 May, 2025</p>
                </td>
                <td className="px-12 py-2 align-middle text-end">16/5/2025</td>
                <td className="px-12 py-2 align-middle">
                  PRJ1188
                  <p className="mb-0">(Perrigo Com...)</p>
                </td>
                <td className="px-12 py-2 align-middle">
                  1234567
                  <p className="mb-0">(Box)</p>
                </td>
                <td className="px-12 py-2 align-middle">
                  <button
                    type="button"
                    className="btn p-0 pe-35 border-none bg-transparent form-list position-relative"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseRepliesAdmin"
                  >
                    <div className="d-inline-block position-relative">
                      <img
                        src="/assets/images/replies-count-icon-admin.svg"
                        alt="replies-count-icon-admin"
                      />
                      <span className="fs-12 fw-600 text-white position-absolute top-50 start-50 translate-middle pb-1">2</span>
                    </div>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminCommentPanel;
