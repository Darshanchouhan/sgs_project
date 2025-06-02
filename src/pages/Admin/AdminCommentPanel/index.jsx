import React, { useEffect, useState } from "react";
import axiosInstance from "../../../services/axiosInstance";
import { useParams } from "react-router-dom";
import CommentRowParentMessage from "./CommentRowParentMessage";
import { getLatestTimestampFromSameSender } from "./CommentRowParentMessage";
import {nameFormation } from "./CommentRowParentMessage";

const AdminCommentPanel = () => {
  const [commentGetAPIData, SetCommentGetAPIData] = useState([]);
  const [sortedCommentData, setSortedCommentData] = useState([]);
  const { pkoId, skuId } = useParams();
  const [pkoWholeDataList, setPKOWholeDataList] = useState();
  const [pkoDataList, setPkoDataList] = useState(undefined);
  const [skuDataList, setSkuDataList] = useState(undefined);
  const [componentDataList, setComponentDataList] = useState(undefined);
  const [selectedPkoID, setSelectedPkoID] = useState("Select PKO ID");
  const [selectedSkuID, setSelectedSkuID] = useState("Select SKU ID");
  const [selectedComponentID, setSelectedComponentID] = useState(
    "Select Component ID"
  );
  const [skuFilterDataList, setSkuFilterDataList] = useState([]);
  const [supplierNameFilterDataList, setSupplierNameFilterDataList] = useState(
    []
  );
  const [filterSelectedPkoID, setFilterSelectedPkoID] =
    useState("Select PKO ID");
  const [filterSelectedSkuID, setFilterSelectedSkuID] =
    useState("Select SKU ID");
  const [filterSupplierName, setFilterSupplierName] = useState(
    "Select Supplier Name"
  );
  const [textComment, setTextComment] = useState("");
  const [collapseFilterVal, setCollapseFilterVal] = useState(true);
  const [loader, setLoader] = useState({
    loadingSupplierCommentCall: false,
    loadingCommentCall: false,
    loadingPkoCall: false,
    loadingSkuCall: false,
    loadingSubmit: false,
  });
  const [pkoSortAsc, setPkoSortAsc] = useState(true);
  const [nameSortAsc, setNameSortAsc] = useState(true);
  const [skuSortAsc, setSkuSortAsc] = useState(true);
  const [dateSortAsc, setDateSortAsc] = useState(true);

  useEffect(() => {
    setSortedCommentData(
      commentGetAPIData?.filter((item) => item?.is_deleted === false)?.length >
        0 &&
        commentGetAPIData
          ?.filter((item) => item?.is_deleted === false)
          ?.sort((a, b) => {
            const timeA = new Date(getLatestTimestampFromSameSender(a));
            const timeB = new Date(getLatestTimestampFromSameSender(b));
            return timeB - timeA; // Descending order
          })
    );
  }, [commentGetAPIData]);

  useEffect(() => {
    const offcanvasElement = document.getElementById(
      "offcanvasAdminCommentPanel"
    );

    const handleOffcanvasOpen = async () => {
      // Reset all inputs
      setTextComment("");
      setSelectedSkuID("Select SKU ID");
      setSelectedPkoID("Select PKO ID");
      setSelectedComponentID("Select Component ID");
      setFilterSupplierName("Select Supplier Name");
      apiGetPko();

      if (pkoId) {
        setFilterSelectedPkoID(pkoId);
        setCollapseFilterVal(false);
        apiGetSKU(pkoId, "filterData");
        if (skuId) {
          setFilterSelectedSkuID(skuId);
          setCollapseFilterVal(false);
          await apiGetCallComment(pkoId, skuId);
        } else {
          setFilterSelectedSkuID("Select SKU ID");
          await apiGetCallComment(pkoId);
        }
      } else {
        setFilterSelectedPkoID("Select PKO ID");
        await apiGetCallComment();
      }
    };

    if (offcanvasElement) {
      offcanvasElement.addEventListener(
        "shown.bs.offcanvas",
        handleOffcanvasOpen
      );
    }

    return () => {
      if (offcanvasElement) {
        offcanvasElement.removeEventListener(
          "shown.bs.offcanvas",
          handleOffcanvasOpen
        );
      }
    };
  }, [pkoId, skuId]);

  const apiGetCallComment = async (pko_id, sku_id) => {
    setLoader((prev) => ({ ...prev, loadingCommentCall: true }));
    try {
      const response = await axiosInstance.get(
        `/comments${sku_id ? `/?sku_id=${sku_id}&pko_id=${pko_id}` : pko_id ? `/?pko_id=${pko_id}` : ""}`
      );
      SetCommentGetAPIData(response.data);
      setLoader((prev) => ({ ...prev, loadingCommentCall: false }));
    } catch (err) {
      console.log(err, "error from comment block");
    }
  };

  const apiGetSupplierCallComment = async (cvs_supplier) => {
    setLoader((prev) => ({ ...prev, loadingSupplierCommentCall: true }));
    try {
      const response = await axiosInstance.get(
        `/comments/?cvs_supplier=${cvs_supplier}`
      );
      SetCommentGetAPIData(response.data);
      setLoader((prev) => ({ ...prev, loadingSupplierCommentCall: false }));
    } catch (err) {
      console.log(err, "error from comment block");
    }
  };

  const supplierListGen = (dataIncoming) => {
    // Unique cvs_supplier

    const uniqueCVSSupplierDetails = [];
    const seenIds = new Set();
    dataIncoming?.forEach((item) => {
      const id = item?.cvs_supplier;
      if (id != null && !seenIds.has(id)) {
        seenIds.add(id);
        uniqueCVSSupplierDetails.push({
          cvs_supplier: id,
          supplier_name: item?.supplier_name,
        });
      }
    });
    setSupplierNameFilterDataList(uniqueCVSSupplierDetails);
  };

  const apiGetPko = async () => {
    setLoader((prev) => ({ ...prev, loadingPkoCall: true }));
    try {
      const response = await axiosInstance.get(`/pko-dashboard/`);
      setPkoDataList(response.data?.pko_details?.map((item) => item?.pko_id));
      setPKOWholeDataList(response.data?.pko_details);
      supplierListGen(response.data?.pko_details);
      setLoader((prev) => ({ ...prev, loadingPkoCall: false }));
    } catch (err) {
      console.log(err, "error from comment block");
    }
  };

  const supplierFilterAccToPKO = (pkoIDComing) => {
    pkoWholeDataList &&
      setSupplierNameFilterDataList(
        pkoWholeDataList
          ?.filter((item) => {
            return item.pko_id === pkoIDComing;
          })
          ?.map((item) => {
            return {
              cvs_supplier: item?.cvs_supplier,
              supplier_name: item?.supplier_name,
            };
          })
      );
  };

  const pkoFilterAccToSupplier = (supplierIDComing) => {
    pkoWholeDataList &&
      setPkoDataList(
        pkoWholeDataList
          ?.filter((item) => {
            return item.cvs_supplier === supplierIDComing;
          })
          ?.map((item) => item?.pko_id)
      );
  };

  const defaultFilter = () => {
    setFilterSelectedPkoID("Select PKO ID");
    setFilterSelectedSkuID("Select SKU ID");
    setFilterSupplierName("Select Supplier Name");
    setCollapseFilterVal(true);
  };

  useEffect(() => {
    if (pkoWholeDataList && pkoId) {
      supplierFilterAccToPKO(pkoId);
    }
  }, [pkoId, pkoWholeDataList]);

  const apiGetSKU = async (pko_id, dataType) => {
    setLoader((prev) => ({ ...prev, loadingSkuCall: true }));
    try {
      const response = await axiosInstance.get(
        `/pko-dashboard-skulist/${pko_id}/`
      );
      if (dataType === "filterData") {
        setSkuFilterDataList(response.data?.skus?.map((item) => item?.sku_id));
      } else {
        setSelectedSkuID("Select SKU ID");
        setSelectedComponentID("Select Component ID");
        setSkuDataList(response.data?.skus?.map((item) => item?.sku_id));
      }
      setLoader((prev) => ({ ...prev, loadingSkuCall: false }));
    } catch (err) {
      console.log(err, "error from comment block");
    }
  };

  const apiGetComponent = async (sku_id) => {
    try {
      const response = await axiosInstance.get(
        `/skus/${sku_id}/?pko_id=${selectedPkoID}`
      );
      setComponentDataList(response.data?.components);
      setSelectedComponentID("Select Component ID");
    } catch (err) {
      console.log(err, "error from comment block");
    }
  };

  const handlePKODropdown = (e) => {
    setSelectedPkoID(e.target.value);
    apiGetSKU(e.target.value);
  };

  const handleSkuDropdown = (e) => {
    setSelectedSkuID(e.target.value);
    apiGetComponent(e.target.value);
  };

  const handleComponentDropdown = (e) => {
    setSelectedComponentID(e.target.value);
  };

  const handleCommentText = (e) => {
    setTextComment(e.target.value);
  };

  const handleFilterPkoDropdown = (e) => {
    setFilterSelectedPkoID(e.target.value);
    if (e.target.value === "Select PKO ID") {
      if (filterSupplierName !== "Select Supplier Name") {
        apiGetSupplierCallComment(filterSupplierName);
        supplierListGen(pkoWholeDataList);
      } else {
        apiGetCallComment();
        supplierListGen(pkoWholeDataList);
      }
      setSkuFilterDataList([]);
    } else {
      supplierFilterAccToPKO(e.target.value);
      apiGetSKU(e.target.value, "filterData");
      apiGetCallComment(e.target.value);
    }
  };

  const handleFilterSkuDropdown = (e) => {
    setFilterSelectedSkuID(e.target.value);
    if (e.target.value === "Select SKU ID") {
      apiGetCallComment(filterSelectedPkoID);
    } else {
      apiGetCallComment(filterSelectedPkoID, e.target.value);
    }
  };

  const handleFilterSupplierDropdown = (e) => {
    setFilterSupplierName(e.target.value);
    if (filterSelectedPkoID !== "Select PKO ID") {
      setPkoDataList(pkoWholeDataList?.map((item) => item?.pko_id));
      return;
    } else {
      if (e.target.value === "Select Supplier Name") {
        apiGetCallComment();
        setSkuFilterDataList([]);
        setPkoDataList(pkoWholeDataList?.map((item) => item?.pko_id));
      } else {
        apiGetSupplierCallComment(e.target.value);
        setSkuFilterDataList([]);
        pkoFilterAccToSupplier(e.target.value);
      }
    }
  };

  const handleSubmitComment = async () => {
    setLoader((prev) => ({ ...prev, loadingSubmit: true }));
    try {
      await axiosInstance.post(`/comments/`, {
        pko_id: selectedPkoID === "Select PKO ID" ? "" : selectedPkoID,
        message: textComment,
        sender_type: "admin",
        sku_id: selectedSkuID === "Select SKU ID" ? "" : selectedSkuID,
        component_id:
          selectedComponentID === "Select Component ID"
            ? ""
            : selectedComponentID,
      });
      apiGetCallComment();
      defaultFilter();
      setSelectedPkoID("Select PKO ID");
      setSelectedSkuID("Select SKU ID");
      setSelectedComponentID("Select Component ID");
      setComponentDataList(setComponentDataList);
      setSkuDataList(undefined);
      setTextComment("");
      setLoader((prev) => ({ ...prev, loadingSubmit: false }));
    } catch (err) {
      console.log(err, "error from comment block");
    }
  };

  const handleClearFilter = () => {
    defaultFilter();
    apiGetCallComment();
    setSkuFilterDataList([]);
  };

  const handleCollapseFilter = () => {
    setCollapseFilterVal(!collapseFilterVal);
  };

  const apiCallCommentAfterDeleteAndWritingComment = () => {
    if (
      filterSelectedPkoID !== "Select PKO ID" &&
      filterSelectedSkuID !== "Select SKU ID"
    ) {
      apiGetCallComment(filterSelectedPkoID, filterSelectedSkuID);
    } else if (filterSelectedPkoID !== "Select Component ID") {
      apiGetCallComment(filterSelectedPkoID);
    } else if (filterSupplierName !== "Select Supplier Name") {
      apiGetSupplierCallComment(filterSupplierName);
    } else {
      apiGetCallComment();
    }
  };

  const handleSortPko = () => {
    if (sortedCommentData) {
      const sortedData = [...sortedCommentData].sort((a, b) => {
        return pkoSortAsc
          ? a.pko_id.localeCompare(b.pko_id, undefined, {
              sensitivity: "base",
            })
          : b.pko_id.localeCompare(a.pko_id, undefined, {
              sensitivity: "base",
            })
    });
      setSortedCommentData(sortedData);
      setPkoSortAsc(!pkoSortAsc); // Toggle for next click
    }
  };

  const handleSortSku = () => {
    if (sortedCommentData) {
      const sortedData = [...sortedCommentData].sort((a, b) =>{
        return pkoSortAsc
          ? a.sku_id === null ? "zzz" : a.sku_id.localeCompare(b.sku_id === null ? "zzz" : b.sku_id, undefined, {
              sensitivity: "base",
            })
          : b.sku_id === null ? "zzz" : b.sku_id.localeCompare(a.sku_id === null ? "zzz" : a.sku_id, undefined, {
              sensitivity: "base",
            })
    });
      setSortedCommentData(sortedData);
      setSkuSortAsc(!skuSortAsc); // Toggle for next click
    }
  };

  const handleSortName = () => {
  if (sortedCommentData) {
    const sortedData = [...sortedCommentData].sort((a, b) => {
      const nameA = a.sender_type === "admin" ? "Administrator" : nameFormation(a.user);
      const nameB = b.sender_type === "admin" ? "Administrator" : nameFormation(b.user);
      return nameSortAsc
        ? nameA.localeCompare(nameB, undefined, { sensitivity: "base" })
        : nameB.localeCompare(nameA, undefined, { sensitivity: "base" });
    });
    setSortedCommentData(sortedData);
    setNameSortAsc(!nameSortAsc); // Toggle for next click
  }
};

  const handleSortDate = () => {
    if (sortedCommentData) {
      const sortedData = [...sortedCommentData]?.sort((a, b) => {
        const timeA = new Date(getLatestTimestampFromSameSender(a));
        const timeB = new Date(getLatestTimestampFromSameSender(b));
        return dateSortAsc ? timeB - timeA : timeA - timeB; // Descending order
      });
      setSortedCommentData(sortedData);
      setDateSortAsc(!dateSortAsc); // Toggle for next click
    }
  };

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
              value={textComment}
              onChange={handleCommentText}
            ></textarea>
            <div className="d-flex align-items-center justify-content-between ms-12 mb-20 position-absolute start-0 bottom-0">
              <div className="d-flex align-items-center me-5">
                <label className="fs-14 fw-600 text-nowrap me-3 mb-0">
                  PKO ID
                </label>
                <select
                  className="fs-14 fw-600 text-color-list-item bg-transparent form-list p-6 pe-40 border-0 border-bottom border-color-black border-2 rounded-0 w-180"
                  onChange={handlePKODropdown}
                  value={selectedPkoID}
                >
                  <option disabled value={"Select PKO ID"}>
                    Select PKO ID
                  </option>
                  {pkoDataList?.map((pkoIDIncoming) => {
                    return (
                      <option key={pkoIDIncoming} value={pkoIDIncoming}>
                        {pkoIDIncoming}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="d-flex align-items-center me-5">
                <label className="fs-14 fw-600 text-nowrap me-3 mb-0">
                  SKU
                </label>
                <select
                  className="fs-14 fw-600 text-color-list-item bg-transparent form-list p-6 pe-40 border-0 border-bottom border-color-black border-2 rounded-0 w-180"
                  onChange={handleSkuDropdown}
                  value={selectedSkuID}
                >
                  <option disabled value={"Select SKU ID"}>
                    Select SKU ID
                  </option>
                  {skuDataList?.map((skuIDIncoming) => {
                    return (
                      <option key={skuIDIncoming} value={componentDataList}>
                        {skuIDIncoming}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="d-flex align-items-center">
                <label className="fs-14 fw-600 text-nowrap me-3 mb-0">
                  Component
                </label>
                <select
                  className="fs-14 fw-600 text-color-list-item bg-transparent form-list p-6 pe-40 border-0 border-bottom border-color-black border-2 rounded-0 w-200"
                  onChange={handleComponentDropdown}
                  value={selectedComponentID}
                >
                  <option disabled value={"Select Component ID"}>
                    Select Component ID
                  </option>
                  {componentDataList?.map((componentIncoming) => {
                    return (
                      <option
                        key={componentIncoming?.id}
                        value={componentIncoming?.id}
                      >
                        {componentIncoming?.name}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
          </div>
          <button
            type="button"
            className={`btn border border-color-typo-secondary px-4 py-1 fs-14 fw-600 w-mx-content ms-auto ${textComment?.length === 0 ? "bg-color-light-gray-shade text-color-typo-secondary cursor-not-allowed" : "bg-transparent text-color-draft cursor-pointer"}`}
            onClick={handleSubmitComment}
            disabled={
              textComment?.length === 0 || selectedPkoID === "Select PKO ID"
            }
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
            <span className="badge fs-14 fw-600 rounded-4 px-3 py-6 ms-2 text-secondary bg-color-badge">
              {commentGetAPIData?.length}
            </span>
          </h2>
          <button
            type="button"
            className="btn p-0 border-none bg-transparent lh-16 position-relative"
            onClick={handleCollapseFilter}
          >
            <img src="/assets/images/filter.svg" alt="filter" />
            {(filterSupplierName !== "Select Supplier Name" ||
              filterSelectedPkoID !== "Select PKO ID" ||
              filterSelectedSkuID !== "Select SKU ID") && (
              <span className="position-absolute top-0 start-100 translate-middle p-1 bg-color-draft rounded-circle">
                <span className="visually-hidden">New alerts</span>
              </span>
            )}
          </button>
        </div>
      </div>
      {!collapseFilterVal && (
        <div className="px-4 py-3 bg-color-light-gray-shade-new border-bottom border-color-black">
          <p className="fs-12 fw-600 text-color-list-item mb-3">
            Select Filters
          </p>
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center me-5">
                <label className="fs-14 fw-600 text-nowrap me-3 mb-0">
                  PKO ID
                </label>
                <select
                  className="fs-14 fw-600 text-color-list-item bg-transparent form-list p-6 pe-40 border-0 border-bottom border-color-black border-2 rounded-0 w-180"
                  onChange={handleFilterPkoDropdown}
                  value={filterSelectedPkoID}
                >
                  <option value={"Select PKO ID"}>Select PKO ID</option>
                  {pkoDataList?.map((pkoIDIncoming) => {
                    return (
                      <option key={pkoIDIncoming} value={pkoIDIncoming}>
                        {pkoIDIncoming}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="d-flex align-items-center me-5">
                <label className="fs-14 fw-600 text-nowrap me-3 mb-0">
                  Supplier
                </label>
                <select
                  className="fs-14 fw-600 text-color-list-item bg-transparent form-list p-6 pe-40 border-0 border-bottom border-color-black border-2 rounded-0 w-200"
                  onChange={handleFilterSupplierDropdown}
                  value={filterSupplierName}
                >
                  <option value="Select Supplier Name">
                    Select Supplier Name
                  </option>
                  {supplierNameFilterDataList?.map((item) => {
                    return (
                      <option
                        key={item?.cvs_supplier}
                        value={item?.cvs_supplier}
                      >
                        {item?.supplier_name}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="d-flex align-items-center">
                <label className="fs-14 fw-600 text-nowrap me-3 mb-0">
                  SKU ID
                </label>
                <select
                  className="fs-14 fw-600 text-color-list-item bg-transparent form-list p-6 pe-40 border-0 border-bottom border-color-black border-2 rounded-0 w-180"
                  onChange={handleFilterSkuDropdown}
                  value={filterSelectedSkuID}
                >
                  <option value={"Select SKU ID"}>Select SKU ID</option>
                  {skuFilterDataList?.map((skuIDIncoming) => {
                    return (
                      <option key={skuIDIncoming} value={componentDataList}>
                        {skuIDIncoming}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
            {(filterSupplierName !== "Select Supplier Name" ||
              filterSelectedPkoID !== "Select PKO ID" ||
              filterSelectedSkuID !== "Select SKU ID") && (
              <button
                type="button"
                className="btn fs-14 fw-600 text-color-draft p-0 border-none bg-transparent"
                onClick={handleClearFilter}
              >
                Clear filter
              </button>
            )}
          </div>
        </div>
      )}
      <div className="offcanvas-body px-4 py-3">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <p className="fs-12 fw-400 text-color-list-item mb-0">
            Showing all comments
          </p>
          {(filterSupplierName !== "Select Supplier Name" ||
            filterSelectedPkoID !== "Select PKO ID" ||
            filterSelectedSkuID !== "Select SKU ID") && (
            <button
              type="button"
              className="btn fs-14 fw-600 text-color-draft p-0 border-none bg-transparent"
              onClick={handleClearFilter}
            >
              Clear filter
            </button>
          )}
        </div>
        {loader.loadingSupplierCommentCall ||
        loader.loadingCommentCall ||
        loader.loadingPkoCall ||
        loader.loadingSkuCall ||
        loader.loadingSubmit ? (
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
        ) : (
          <div
            className={`mb-2 table-responsive ${!(filterSupplierName !== "Select Supplier Name" || filterSelectedPkoID !== "Select PKO ID" || filterSelectedSkuID !== "Select SKU ID") ? "AdminCommentPanelMainTable-holder" : "AdminCommentPanelMainTable-holdeFilterOpen"}`}
          >
            <table className="table table-bordered fs-14 fw-400 text-color-typo-primary mb-0">
              <thead className="sticky-top">
                <tr>
                  <th
                    scope="col"
                    className="p-12 fw-600 bg-color-drag-drop-box text-nowrap"
                  >
                    <div className="d-flex align-items-center justify-content-between">
                      Name
                      <img
                        className="cursor-pointer"
                        src="/assets/images/Filter_icon.svg"
                        alt="sorting-icon"
                        onClick={handleSortName}
                      />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="p-12 fw-600 bg-color-drag-drop-box text-nowrap"
                  >
                    Comment
                  </th>
                  <th
                    scope="col"
                    className="p-12 fw-600 bg-color-drag-drop-box text-nowrap"
                  >
                    <div className="d-flex align-items-center justify-content-between">
                      Last Active
                      <img
                        className="cursor-pointer"
                        src="/assets/images/Filter_icon.svg"
                        alt="sorting-icon"
                        onClick={handleSortDate}
                      />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="p-12 fw-600 bg-color-drag-drop-box text-nowrap"
                  >
                    <div className="d-flex align-items-center justify-content-between">
                      PKO ID
                      <img
                        className="cursor-pointer"
                        src="/assets/images/Filter_icon.svg"
                        alt="sorting-icon"
                        onClick={handleSortPko}
                      />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="p-12 fw-600 bg-color-drag-drop-box text-nowrap"
                  >
                    <div className="d-flex align-items-center justify-content-between">
                      SKU ID
                      <img
                        className="cursor-pointer"
                        src="/assets/images/Filter_icon.svg"
                        alt="sorting-icon"
                        onClick={handleSortSku}
                      />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="p-12 fw-600 bg-color-drag-drop-box text-nowrap"
                  ></th>
                </tr>
              </thead>
              <tbody>
                {sortedCommentData && sortedCommentData?.map((item) => {
                  return (
                    <CommentRowParentMessage
                      parentMessage={item}
                      apiCallCommentAfterDeleteAndWritingComment={
                        apiCallCommentAfterDeleteAndWritingComment
                      }
                    />
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCommentPanel;
