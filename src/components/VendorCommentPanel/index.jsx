import React, { useState, useEffect } from "react";
import axiosInstance from "../../services/axiosInstance";

const VendorCommentPanel = ({
  dropdownData = {},
  initialSelectedPkoId = "",
  initialFilterPkoId = "",
  initialSelectedSkuId = "", // For “Add Comment” section
  initialFilterSkuId = "", // For “Filter” section
  initialSelectedComponentName = "",
}) => {
  // Loader state, same style as AdminCommentPanel
  const [loader, setLoader] = useState({
    loadingCommentCall: false,
    loadingSubmit: false,
  });

  const [selectedPkoId, setSelectedPkoId] = useState(initialSelectedPkoId);
  const [hasUserChangedPko, setHasUserChangedPko] = useState(false);
  const [selectedSkuId, setSelectedSkuId] = useState(initialSelectedSkuId);
  const [componentList, setComponentList] = useState([]);
  const [filterPkoId, setFilterPkoId] = useState(initialFilterPkoId);
  const [hasUserChangedFilterPko, setHasUserChangedFilterPko] = useState(false);
  const [filterSkuId, setFilterSkuId] = useState(initialFilterSkuId);
  const { pkos = [], skus = [] } = dropdownData;
  const filteredSkus = skus.filter((sku) => sku.pko_id === selectedPkoId);
  const filteredSkusForFilter = skus.filter(
    (sku) => sku.pko_id === filterPkoId,
  );
  const [selectedComponent, setSelectedComponent] = useState(
    initialSelectedComponentName,
  );
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [openReplyFor, setOpenReplyFor] = useState(null);
  const [replyTextByComment, setReplyTextByComment] = useState({});
  const [collapsedReplies, setCollapsedReplies] = useState({});

  // Reset everything when the offcanvas closes
  useEffect(() => {
    const offcanvasEl = document.getElementById("offcanvasVendorCommentPanel");
    if (!offcanvasEl) return;

    const onHidden = () => {
      setSelectedPkoId(initialSelectedPkoId);
      setSelectedSkuId(initialSelectedSkuId);
      setFilterPkoId(initialFilterPkoId);
      setFilterSkuId(initialFilterSkuId);
      setSelectedComponent(initialSelectedComponentName);
      //to collapse reply
      setOpenReplyFor(null);
    };

    offcanvasEl.addEventListener("hidden.bs.offcanvas", onHidden);
    return () => {
      offcanvasEl.removeEventListener("hidden.bs.offcanvas", onHidden);
    };
  }, [
    initialSelectedPkoId,
    initialFilterPkoId,
    initialSelectedSkuId,
    initialFilterSkuId,
    initialSelectedComponentName,
  ]);

  // Sync from parent unless user manually changed
  useEffect(() => {
    if (!hasUserChangedPko) {
      setSelectedPkoId(initialSelectedPkoId);
      setSelectedSkuId(initialSelectedSkuId);
    }
  }, [initialSelectedPkoId, hasUserChangedPko]);

  useEffect(() => {
    if (!hasUserChangedFilterPko) {
      setFilterPkoId(initialFilterPkoId);
      setFilterSkuId(initialFilterSkuId);
    }
  }, [initialFilterPkoId, hasUserChangedFilterPko]);

  useEffect(() => {
    if (initialSelectedComponentName) {
      setSelectedComponent(initialSelectedComponentName);
    }
  }, [initialSelectedComponentName]);

  // Whenever PKO changes, clear SKU & component list
  useEffect(() => {
    setSelectedSkuId("");
    setSelectedComponent("");
    setComponentList([]);
  }, [selectedPkoId]);

  // Fetch components when SKU changes
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
          err,
        );
        setComponentList([]);
      }
    };
    fetchComponents();
  }, [selectedSkuId, selectedPkoId]);

  // Whenever filters or dropdown data change, re-fetch comments
  useEffect(() => {
    if (pkos.length && skus.length) {
      if (!filterPkoId && !filterSkuId) {
        fetchAllComments();
      } else {
        fetchFilteredComments();
      }
    }
  }, [filterPkoId, filterSkuId, pkos, skus]);

  //mark “vendor_seen” on admin comments ──
  const markCommentsAsSeen = async (allComments) => {
    const unseenIds = allComments
      .filter((c) => !c.vendor_seen && c.sender_type === "admin")
      .map((c) => c.id);
    if (!unseenIds.length) return;
    try {
      await axiosInstance.patch("/comments/", { comment_ids: unseenIds });
      console.log("Marked as seen:", unseenIds);
    } catch (err) {
      console.error("Failed to mark comments as seen", err);
    }
  };

  //fetchAllComments, wrapped in loader.loadingCommentCall
  const fetchAllComments = async () => {
    setLoader((prev) => ({ ...prev, loadingCommentCall: true }));
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
      await markCommentsAsSeen(allComments);
    } catch (err) {
      console.error("Failed to fetch ALL comments", err);
      setComments([]);
    } finally {
      setLoader((prev) => ({ ...prev, loadingCommentCall: false }));
    }
  };

  //fetchFilteredComments, wrapped in loader.loadingCommentCall ──
  const fetchFilteredComments = async () => {
    setLoader((prev) => ({ ...prev, loadingCommentCall: true }));
    try {
      let allComments = [];

      if (filterPkoId && !filterSkuId) {
        const pkoLevelRes = await axiosInstance.get(
          `/comments/?pko_id=${filterPkoId}`,
        );
        allComments.push(...(pkoLevelRes.data || []));

        const relatedSkus = skus.filter((sku) => sku.pko_id === filterPkoId);
        for (const sku of relatedSkus) {
          const skuLevelRes = await axiosInstance.get(
            `/comments/?pko_id=${filterPkoId}&sku_id=${sku.sku_id}`,
          );
          allComments.push(...(skuLevelRes.data || []));

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
          allComments.push(...componentRequests.flatMap((r) => r.data || []));
        }
      }

      if (filterPkoId && filterSkuId) {
        const skuRes = await axiosInstance.get(
          `/comments/?pko_id=${filterPkoId}&sku_id=${filterSkuId}`,
        );
        allComments.push(...(skuRes.data || []));

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

      // Deduplicate by comment id, then sort by timestamp desc
      const deduplicated = Array.from(
        new Map(allComments.map((c) => [c.id, c])).values(),
      );
      deduplicated.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp),
      );

      setComments(deduplicated);
      await markCommentsAsSeen(allComments);
    } catch (err) {
      console.error("Failed to fetch FILTERED comments", err);
      setComments([]);
    } finally {
      setLoader((prev) => ({ ...prev, loadingCommentCall: false }));
    }
  };

  // which fetch to call after any post/delete/reply:
  const refreshComments = async () => {
    if (!filterPkoId && !filterSkuId) {
      await fetchAllComments();
    } else {
      await fetchFilteredComments();
    }
  };

  //  handlePostComment wrapped in loadingSubmit
  const handlePostComment = async () => {
    if (!selectedPkoId || !commentText.trim()) return;
    setLoader((prev) => ({ ...prev, loadingSubmit: true }));

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
      await axiosInstance.post("/comments/", payload);
      setCommentText("");
      await refreshComments();
    } catch (err) {
      console.error(
        "Failed to post comment:",
        err?.response?.data || err.message,
      );
    } finally {
      setLoader((prev) => ({ ...prev, loadingSubmit: false }));
    }
  };

  // handlePostReply wrapped in loadingSubmit
  const handlePostReply = async (commentId) => {
    const reply = (replyTextByComment[commentId] || "").trim();
    if (!reply) return;
    setLoader((prev) => ({ ...prev, loadingSubmit: true }));

    const payload = {
      parent_id: commentId,
      message: reply,
      sender_type: "vendor",
    };
    try {
      await axiosInstance.post("/comments/", payload);
      setReplyTextByComment((prev) => ({ ...prev, [commentId]: "" }));
      setOpenReplyFor(commentId); // Keep it open after refresh
      await refreshComments();
    } catch (err) {
      console.error(
        "Failed to post reply:",
        err?.response?.data || err.message,
      );
    } finally {
      setLoader((prev) => ({ ...prev, loadingSubmit: false }));
    }
  };

  //  handleDeleteComment wrapped in loadingSubmit ──
  const handleDeleteComment = async (commentId) => {
    setLoader((prev) => ({ ...prev, loadingSubmit: true }));
    try {
      await axiosInstance.delete("/comments/", {
        data: { comment_id: commentId },
      });
      await refreshComments();
    } catch (err) {
      console.error(
        "Failed to delete comment:",
        err?.response?.data || err.message,
      );
    } finally {
      setLoader((prev) => ({ ...prev, loadingSubmit: false }));
    }
  };

  // Format “Administrator” vs. vendor’s display name
  const getDisplayUserInfo = (user = "", senderType = "") => {
    const currentUser = localStorage.getItem("user_name");
    if (senderType === "admin") {
      return {
        name: "Administrator",
        icon: "/assets/images/administrator-icon.svg",
      };
    }
    const namePart = (user || "").split("@")[0];
    const formattedName = namePart
      .split(".")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
    const isCurrentUser = user === currentUser;
    return {
      name: isCurrentUser ? `${formattedName} (You)` : formattedName,
      icon: "/assets/images/user-chart-profile-icon.svg",
    };
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
          <div>
            <textarea
              className="form-control px-12 py-2"
              placeholder="Type your comment here.."
              id="sendCommentTextarea"
              style={{ height: "64px" }}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            ></textarea>
          </div>
        </div>

        <div className="d-flex align-items-center justify-content-between w-100 gap-2">
          {/* “Add Comment labels” bar: PKO, SKU, Component (if fixed) */}
          <div>
            <label className="fs-12 fw-600 text-color-typo-primary">
              Add Comment labels{" "}
            </label>
          </div>

          {/* PKO Label */}
          <div className="fs-12 fw-600 w-100 h-100 text-color-list-item bg-color-light-gray-shade border-0 p-6 rounded-2">
            <label className="fs-12 fw-600 text-color-typo-primary">
              PKO ID
            </label>
            <span className="fs-14 d-block fw-600 text-color-draft">
              {selectedPkoId}
            </span>
          </div>

          {/* SKU Label or dropdown */}
          {initialSelectedSkuId ? (
            <div className="fs-12 w-100 h-100 fw-600 text-color-list-item bg-color-light-gray-shade border-0 p-6 rounded-2">
              <label className="fs-12 fw-600 text-color-typo-primary">
                SKU
              </label>
              <span className="fs-14 fw-600 d-block text-color-draft">
                {initialSelectedSkuId}
              </span>
            </div>
          ) : (
            <div className="form-floating w-100 h-100">
              <select
                className="form-select fs-12 fw-600 text-color-list-item bg-color-light-gray-shade border-0 pe-40"
                id="floatingSkuSelect"
                value={selectedSkuId}
                onChange={(e) => {
                  setSelectedSkuId(e.target.value);
                  setHasUserChangedPko(true);
                }}
                disabled={!selectedPkoId}
              >
                <option value="">Select</option>
                {filteredSkus.map((sku) => (
                  <option key={sku.sku_id} value={sku.sku_id}>
                    {sku.sku_id}
                  </option>
                ))}
              </select>
              <label
                htmlFor="floatingSkuSelect"
                className="fs-12 fw-600 text-color-typo-primary"
              >
                SKU
              </label>
            </div>
          )}

          {/* Component Label or dropdown */}
          {initialSelectedComponentName ? (
            <div className="fs-12 w-100 h-100 fw-600 text-color-list-item bg-color-light-gray-shade border-0 p-6 rounded-2">
              <label className="fs-12 fw-600 text-color-typo-primary">
                Component
              </label>
              <span className="fs-14 fw-600 text-color-draft">
                {initialSelectedComponentName}
              </span>
            </div>
          ) : (
            <div className="form-floating w-100 h-100">
              <select
                className="form-select fs-12 fw-600 text-color-list-item bg-color-light-gray-shade border-0 pe-40"
                id="floatingComponentSelect"
                value={selectedComponent}
                onChange={(e) => setSelectedComponent(e.target.value)}
                disabled={!componentList.length}
              >
                <option value="">Select</option>
                {componentList.map((comp, idx) => (
                  <option key={idx} value={comp.name}>
                    {comp.name}
                  </option>
                ))}
              </select>
              <label
                htmlFor="floatingComponentSelect"
                className="fs-12 fw-600 text-color-typo-primary"
              >
                Component
              </label>
            </div>
          )}
          <button
            type="button"
            disabled={!selectedPkoId || commentText.trim() === ""}
            onClick={handlePostComment}
            className={`btn border px-4 py-1 fs-14 fw-600 w-mx-content text-nowrap ms-4
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

        {/* ── If any loader flag is true, show the overlay ── */}
        {(loader.loadingCommentCall || loader.loadingSubmit) && (
          <div className="loader">
            <div className="loaderOverlay d-flex align-items-center justify-content-center bg-secondary rounded-4">
              <img
                src="/assets/images/loading_gif.gif"
                alt="Loading..."
                width="120px"
                height="120px"
              />
            </div>
          </div>
        )}

        {/* ── Only show the comments block when not loading ── */}
        {!(loader.loadingCommentCall || loader.loadingSubmit) && (
          <>
            <div className="collapse" id="collapseChooseFilters">
              <div className="card card-body bg-color-light-gray-shade-new rounded-0 border-0 border-bottom border-color-black px-4 py-14">
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
                      className="form-select"
                      value={filterPkoId}
                      onChange={(e) => {
                        setFilterPkoId(e.target.value);
                        setFilterSkuId("");
                        setHasUserChangedFilterPko(true);
                      }}
                    >
                      <option value="">Select PKO</option>
                      {pkos.map((pko) => (
                        <option key={pko.pko_id} value={pko.pko_id}>
                          {pko.pko_id}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* SKU Filter Dropdown */}
                  <div className="d-flex align-items-center">
                    <label className="fs-14 fw-600 text-nowrap me-3 mb-0">
                      SKU
                    </label>
                    <select
                      className="form-select"
                      value={filterSkuId}
                      onChange={(e) => {
                        setFilterSkuId(e.target.value);
                        setHasUserChangedFilterPko(true);
                      }}
                    >
                      <option value="">Select SKU</option>
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
                const { name, icon } = getDisplayUserInfo(
                  comment.user,
                  comment.sender_type,
                );
                return (
                  <div
                    key={idx}
                    className="card bg-white rounded-3 border-color-light-gray-shade mb-20"
                  >
                    <div className="card-header d-flex align-items-center justify-content-between border-0 bg-transparent px-3 pt-12 pb-0">
                      <div className="d-flex align-items-center">
                        <img src={icon} alt="user-icon" />
                        <div className="ms-10">
                          <h3 className="fs-14 fw-600 text-color-typo-primary mb-1">
                            {name}
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
                        <button
                          type="button"
                          className="btn border-0 p-0 "
                          onClick={() => handleDeleteComment(comment.id)}
                        >
                          <img
                            src="/assets/images/delete-icon-blue.svg"
                            alt="delete-icon-blue"
                          />
                        </button>
                        <button
                          type="button"
                          className="btn border-0 p-0 d-flex align-items-center ms-3"
                          onClick={() =>
                            setOpenReplyFor(
                              openReplyFor === comment.id ? null : comment.id,
                            )
                          }
                        >
                          <img
                            src="/assets/images/reply-icon.svg"
                            alt="reply-icon"
                          />
                        </button>
                        {comment.replies?.length > 0 && (
                          <button
                            type="button"
                            className="btn border-0 rounded-3 text-color-draft bg-color-light-border fs-14 fw-600 px-12 py-0 ms-1"
                            onClick={() =>
                              setOpenReplyFor(
                                openReplyFor === comment.id ? null : comment.id,
                              )
                            }
                          >
                            {comment.replies.length}
                          </button>
                        )}
                        <button
                          type="button"
                          className="btn border-0 p-0 d-flex align-items-center ms-3"
                          onClick={() =>
                            setOpenReplyFor(
                              openReplyFor === comment.id ? null : comment.id,
                            )
                          }
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

                    {/* Replies section */}
                    {openReplyFor === comment.id && (
                      <div className="repliesBlock ms-3 ps-3 border-start mt-3">
                        {comment.replies?.length > 0 && (
                          <button
                            type="button"
                            className="btn text-color-draft bg-transparent border-0 p-0 fs-12 fw-600 mb-2"
                            onClick={() =>
                              setCollapsedReplies((prev) => ({
                                ...prev,
                                [comment.id]: !prev[comment.id],
                              }))
                            }
                          >
                            {collapsedReplies[comment.id]
                              ? `Show Replies (${comment.replies.length})`
                              : `Hide Replies (${comment.replies.length})`}
                          </button>
                        )}

                        {!collapsedReplies[comment.id] &&
                          comment.replies?.map((reply) => {
                            const { name, icon } = getDisplayUserInfo(
                              reply.user,
                              reply.sender_type,
                            );
                            return (
                              <div
                                key={reply.id}
                                className="repliedBox ms-2 ps-20 pt-20"
                              >
                                <div className="d-flex align-items-center position-relative">
                                  <img src={icon} alt="user-icon" />
                                  <div className="ms-10">
                                    <h3 className="fs-14 fw-600 text-color-typo-primary mb-1">
                                      {name}
                                    </h3>
                                    <h4 className="fs-14 fw-400 text-color-typo-secondary mb-0">
                                      {new Date(
                                        reply.timestamp,
                                      ).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                      })}
                                    </h4>
                                  </div>
                                </div>
                                <p className="fs-14 fw-400 text-color-typo-primary mt-2 mb-0 ms-5">
                                  {reply.message}
                                </p>
                              </div>
                            );
                          })}

                        {/* Reply input */}
                        <div className="border-top bg-white px-3 py-3">
                          <textarea
                            className="form-control fs-14 text-color-typo-primary"
                            placeholder="Enter a reply.."
                            style={{ height: "64px" }}
                            value={replyTextByComment[comment.id] || ""}
                            onChange={(e) =>
                              setReplyTextByComment((prev) => ({
                                ...prev,
                                [comment.id]: e.target.value,
                              }))
                            }
                          ></textarea>
                          <div className="d-flex justify-content-end mt-2">
                            <button
                              className="btn text-primary bg-transparent border-0 p-0 fs-14 fw-600 d-flex align-items-center"
                              onClick={() => handlePostReply(comment.id)}
                              disabled={!replyTextByComment[comment.id]?.trim()}
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
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VendorCommentPanel;
