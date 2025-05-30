import React, { useState, useEffect } from "react";
import axiosInstance from "../../services/axiosInstance";

const VendorCommentPanel = ({
  dropdownData = {},
  initialSelectedPkoId = "",
  initialFilterPkoId = "",
}) => {
  const [selectedPkoId, setSelectedPkoId] = useState(initialSelectedPkoId);
  const [hasUserChangedPko, setHasUserChangedPko] = useState(false);
  const [selectedSkuId, setSelectedSkuId] = useState("");
  const [selectedComponent, setSelectedComponent] = useState("");
  const [componentList, setComponentList] = useState([]);
  const [filterPkoId, setFilterPkoId] = useState(initialFilterPkoId);
  const [hasUserChangedFilterPko, setHasUserChangedFilterPko] = useState(false);

  const [filterSkuId, setFilterSkuId] = useState("");
  const { pkos = [], skus = [] } = dropdownData;
  const filteredSkus = skus.filter((sku) => sku.pko_id === selectedPkoId);
  const filteredSkusForFilter = skus.filter(
    (sku) => sku.pko_id === filterPkoId,
  );

  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    // Set from parent unless user manually changed
    if (!hasUserChangedPko) {
      setSelectedPkoId(initialSelectedPkoId);
    }
  }, [initialSelectedPkoId, hasUserChangedPko]);

  useEffect(() => {
    if (!hasUserChangedFilterPko) {
      setFilterPkoId(initialFilterPkoId);
    }
  }, [initialFilterPkoId, hasUserChangedFilterPko]);

  // Reset when PKO changes
  useEffect(() => {
    setSelectedSkuId("");
    setSelectedComponent("");
    setComponentList([]);
  }, [selectedPkoId]);

  // Fetch components on SKU selection
  useEffect(() => {
    const fetchComponents = async () => {
      if (!selectedSkuId || !selectedPkoId) return;
      try {
        const res = await axiosInstance.get(
          `/skus/${selectedSkuId}/?pko_id=${selectedPkoId}`,
        );
        setComponentList(res.data?.components || []);
      } catch (err) {
        console.error(
          `Failed to load components for SKU ${selectedSkuId} and PKO ${selectedPkoId}`,
        );
        setComponentList([]);
      }
    };

    fetchComponents();
  }, [selectedSkuId, selectedPkoId]);

  useEffect(() => {
    const fetchAllComments = async () => {
      try {
        const pkoRequests = pkos.map((pko) =>
          axiosInstance.get(`/comments/?pko_id=${pko.pko_id}`),
        );

        const skuRequests = skus.map((sku) =>
          axiosInstance.get(
            `/comments/?pko_id=${sku.pko_id}&sku_id=${sku.sku_id}`,
          ),
        );

        const componentRequests = await Promise.all(
          skus.map(async (sku) => {
            const res = await axiosInstance.get(
              `/skus/${sku.sku_id}/?pko_id=${sku.pko_id}`,
            );
            const components = res.data?.components || [];

            return Promise.all(
              components.map((comp) =>
                axiosInstance.get(
                  `/comments/?pko_id=${sku.pko_id}&sku_id=${sku.sku_id}&component_id=${comp.id}`,
                ),
              ),
            );
          }),
        );

        const resolvedPko = await Promise.all(pkoRequests);
        const resolvedSku = await Promise.all(skuRequests);

        const allComments = [
          ...resolvedPko.flatMap((r) => r.data || []),
          ...resolvedSku.flatMap((r) => r.data || []),
          ...componentRequests.flat(2).flatMap((r) => r.data || []),
        ];

        setComments(allComments);
      } catch (err) {
        console.error("Failed to fetch ALL comments", err);
        setComments([]);
      }
    };
    const fetchFilteredComments = async () => {
      try {
        let allComments = [];

        if (filterPkoId && !filterSkuId) {
          // Fetch PKO-level comments
          const pkoLevelRes = await axiosInstance.get(
            `/comments/?pko_id=${filterPkoId}`,
          );
          allComments.push(...(pkoLevelRes.data || []));

          // Fetch all SKUs under this PKO
          const relatedSkus = skus.filter((sku) => sku.pko_id === filterPkoId);

          for (const sku of relatedSkus) {
            // SKU-level comments
            const skuLevelRes = await axiosInstance.get(
              `/comments/?pko_id=${filterPkoId}&sku_id=${sku.sku_id}`,
            );
            allComments.push(...(skuLevelRes.data || []));

            // Component-level comments
            const skuDetailRes = await axiosInstance.get(
              `/skus/${sku.sku_id}/?pko_id=${filterPkoId}`,
            );
            const components = skuDetailRes.data?.components || [];

            const componentRequests = await Promise.all(
              components.map((comp) =>
                axiosInstance.get(
                  `/comments/?pko_id=${filterPkoId}&sku_id=${sku.sku_id}&component_id=${comp.id}`,
                ),
              ),
            );
            allComments.push(
              ...componentRequests.flatMap((res) => res.data || []),
            );
          }
        }

        if (filterPkoId && filterSkuId) {
          // SKU-level comments
          const skuRes = await axiosInstance.get(
            `/comments/?pko_id=${filterPkoId}&sku_id=${filterSkuId}`,
          );
          allComments.push(...(skuRes.data || []));

          // Component-level comments
          const skuDetails = await axiosInstance.get(
            `/skus/${filterSkuId}/?pko_id=${filterPkoId}`,
          );
          const components = skuDetails.data?.components || [];

          const componentRequests = await Promise.all(
            components.map((comp) =>
              axiosInstance.get(
                `/comments/?pko_id=${filterPkoId}&sku_id=${filterSkuId}&component_id=${comp.id}`,
              ),
            ),
          );

          allComments.push(...componentRequests.flatMap((r) => r.data || []));
        }
        //  Deduplicate based on unique comment ID
        const deduplicatedComments = Array.from(
          new Map(allComments.map((comment) => [comment.id, comment])).values(),
        );

        setComments(deduplicatedComments);
      } catch (err) {
        console.error("Failed to fetch FILTERED comments", err);
        setComments([]);
      }
    };

    if (pkos.length && skus.length) {
      if (!filterPkoId && !filterSkuId) {
        fetchAllComments();
      } else {
        fetchFilteredComments();
      }
    }
  }, [filterPkoId, filterSkuId, pkos, skus]);

  const handlePostComment = async () => {
    if (!selectedPkoId || !commentText.trim()) return;

    const payload = {
      pko_id: selectedPkoId,
      message: commentText.trim(),
      sender_type: "vendor",
    };

    if (selectedSkuId) payload.sku_id = selectedSkuId;

    const matchedComponent = componentList.find(
      (comp) => comp.name === selectedComponent,
    );
    if (matchedComponent) payload.component_id = matchedComponent.id;

    try {
      const res = await axiosInstance.post("/comments/", payload);
      console.log("Comment posted successfully:", res?.data);
      setCommentText("");
    } catch (error) {
      console.error(
        "Failed to post comment:",
        error?.response?.data || error.message,
      );
    }
  };

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
            htmlFor="sendCommentTextarea"
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
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            ></textarea>
            <button
              type="button"
              disabled={!selectedPkoId || commentText.trim() === ""}
              onClick={handlePostComment}
              className={`btn border px-4 py-1 fs-14 fw-600 w-mx-content position-absolute top-50 end-0 translate-middle-y me-12
    ${
      !selectedPkoId || commentText.trim() === ""
        ? "bg-color-light-gray-shade text-color-typo-secondary border-color-typo-secondary opacity-50 cursor-not-allowed"
        : "bg-secondary text-white border-secondary"
    }
  `}
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

        <div className="d-flex align-items-center justify-content-between w-100 gap-2">
          {/* PKO Dropdown */}
          <div className="form-floating w-100">
            <select
              className="form-select fs-12 fw-600 text-color-list-item bg-color-light-gray-shade border-0 pe-40"
              id="floatingPkoIdSelect"
              value={selectedPkoId}
              onChange={(e) => {
                setSelectedPkoId(e.target.value);
                setHasUserChangedPko(true); // Mark that user manually changed PKO
              }}
            >
              {/* <option value="">Select PKO</option> */}
              {pkos.map((pko) => (
                <option key={pko.pko_id} value={pko.pko_id}>
                  {pko.pko_id}
                </option>
              ))}
            </select>
            <label
              htmlFor="floatingPkoIdSelect"
              className="fs-10 fw-600 text-color-typo-primary"
            >
              PKO ID
            </label>
          </div>

          {/* SKU Dropdown */}
          <div className="form-floating w-100">
            <select
              className="form-select fs-12 fw-600 text-color-list-item bg-color-light-gray-shade border-0 pe-40"
              id="floatingSkuSelect"
              value={selectedSkuId}
              onChange={(e) => setSelectedSkuId(e.target.value)}
              disabled={!selectedPkoId}
            >
              <option value="">Select SKU</option>
              {filteredSkus.map((sku) => (
                <option key={sku.sku_id} value={sku.sku_id}>
                  {sku.sku_id}
                </option>
              ))}
            </select>
            <label
              htmlFor="floatingSkuSelect"
              className="fs-10 fw-600 text-color-typo-primary"
            >
              SKU
            </label>
          </div>

          {/* Component Dropdown */}
          <div className="form-floating w-100">
            <select
              className="form-select fs-12 fw-600 text-color-list-item bg-color-light-gray-shade border-0 pe-40"
              id="floatingComponentSelect"
              value={selectedComponent}
              onChange={(e) => setSelectedComponent(e.target.value)}
              disabled={!componentList.length}
            >
              <option value="">Select Component</option>
              {componentList.map((comp, idx) => (
                <option key={idx} value={comp.name}>
                  {comp.name}
                </option>
              ))}
            </select>
            <label
              htmlFor="floatingComponentSelect"
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
              {comments.length}
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
                onClick={() => {
                  setFilterPkoId("");
                  setFilterSkuId("");
                }}
              >
                Clear all
              </button>
            </div>
            <div className="d-flex align-items-center justify-content-between">
              {/* PKO Filter Dropdown */}
              <div className="d-flex align-items-center">
                <label className="fs-14 fw-600 text-nowrap me-3 mb-0">
                  PKO ID
                </label>
                <select
                  className="form-select ..."
                  value={filterPkoId}
                  onChange={(e) => {
                    setFilterPkoId(e.target.value);

                    setFilterSkuId(""); // Clear SKU when PKO changes
                    setHasUserChangedFilterPko(true); // mark as user-driven change
                  }}
                >
                  <option value="">Select PKO</option>{" "}
                  {/* This stays at the top */}
                  {pkos.map((pko) => (
                    <option key={pko.pko_id} value={pko.pko_id}>
                      {pko.pko_id}
                    </option>
                  ))}
                </select>
              </div>

              <div className="d-flex align-items-center">
                <label className="fs-14 fw-600 text-nowrap me-3 mb-0">
                  SKU
                </label>
                <select
                  className="form-select ..."
                  value={filterSkuId}
                  onChange={(e) => setFilterSkuId(e.target.value)}
                  disabled={!filterPkoId}
                >
                  <option value="">Select SKU</option>{" "}
                  {/*  Default placeholder */}
                  {filteredSkusForFilter.map((sku) => (
                    <option key={sku.sku_id} value={sku.sku_id}>
                      {sku.sku_id}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="allComments-block p-4">
          {comments.map((comment, idx) => {
            const isUser = comment.user === localStorage.getItem("user_name");
            return (
              <div
                key={idx}
                className="card bg-white rounded-3 border-color-light-gray-shade mb-20"
              >
                <div className="card-header d-flex align-items-center justify-content-between border-0 bg-transparent px-3 pt-12 pb-0">
                  <div className="d-flex align-items-center">
                    <img
                      src={
                        isUser
                          ? "/assets/images/user-chart-profile-icon.svg"
                          : "/assets/images/administrator-icon.svg"
                      }
                      alt="user-icon"
                    />
                    <div className="ms-10">
                      <h3 className="fs-14 fw-600 text-color-typo-primary mb-1">
                        {isUser ? `${comment.user} (You)` : comment.user}
                      </h3>
                      <h4 className="fs-14 fw-400 text-color-typo-secondary mb-0">
                        {new Date(comment.timestamp).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          },
                        )}
                      </h4>
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    {isUser && (
                      <button type="button" className="btn border-0 p-0 ms-3">
                        <img
                          src="/assets/images/delete-icon-blue.svg"
                          alt="delete-icon-blue"
                        />
                      </button>
                    )}
                    <button
                      type="button"
                      className="btn border-0 p-0 d-flex align-items-center ms-3"
                    >
                      <img
                        src="/assets/images/reply-icon.svg"
                        alt="reply-icon"
                      />
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
                    {comment.message}
                  </p>
                </div>

                <div className="card-footer px-3 py-6 border-color-desabled-lite bg-transparent">
                  <div className="row">
                    <div className="col-6">
                      {[
                        { label: "PKO ID", value: comment.pko_id },
                        { label: "SKU", value: comment.sku_id || "-" },
                      ].map(({ label, value }) => (
                        <div className="row gx-2 mb-1" key={label}>
                          <div className="col-4">
                            <span className="fs-12 fw-400 text-color-typo-secondary">
                              {label}
                            </span>
                          </div>
                          <div className="col-8">
                            <span className="fs-12 fw-600 text-color-typo-primary">
                              {value}
                            </span>
                          </div>
                        </div>
                      ))}
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
                            {comment.component_name || "-"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default VendorCommentPanel;
