import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminApproveSKUModal from "../../AdminApproveSKUModal";
import AdminRequestChangesModal from "../../AdminRequestChangesModal";
import axiosInstance from "../../../../services/axiosInstance";

const ComponentSubHeaderStrip = ({
  skuComponentDataIncoming,
  componentsAllId,
  setLoading,
  setApiCallAgain,
}) => {
  const navigate = useNavigate();
  const { pkoId, skuId, componentId } = useParams(); // Assuming you are using react-router-dom for routing

  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  const formatDateToReadableString = (isoDateStr) => {
    const date = new Date(isoDateStr);
    const options = { day: "numeric", month: "long", year: "numeric" };
    return date.toLocaleDateString("en-GB", options);
  };

  const handleClick = (stepType) => {
    const currentIndex = componentsAllId.indexOf(Number(componentId));

    if (currentIndex === -1) {
      console.error("Current value not found in array.");
      return;
    }
    let stepIndex;
    if (stepType === "Next") {
      // Calculate next index (wrap to 0 if at end)
      stepIndex = (currentIndex + 1) % componentsAllId.length;
    } else {
      stepIndex = (currentIndex - 1 + componentsAllId.length) % componentsAllId.length;
    }
    return componentsAllId[stepIndex];
  };

  const ApproveSKU = async () => {
    setLoading(true);
    try {
      await axiosInstance.post(`notifications/`, {
        status_change: "InreviewToApproved",
        pkoid: pkoId,
        skuid: skuId,
        cvs_supplier: localStorage.getItem("adminComponentSupplierId"),
      });
      try {
        await axiosInstance.put(`skus/${skuId}/?pko_id=${pkoId}`, {
          pko_id: pkoId,
          status: "Approved",
        });
        setIsApproveModalOpen(false);
        localStorage.setItem("adminComponentStatus", "Approved");
        setApiCallAgain((prev) => prev + 1);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error modifying in DB approve status SKU:", error);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error changing approve status SKU:", error);
    }
  };

  const RequestChanges = async () => {
    setLoading(true);
    try {
      await axiosInstance.post(`notifications/`, {
        status_change: "InreviewToDraft",
        pkoid: pkoId,
        skuid: skuId,
        cvs_supplier: localStorage.getItem("adminComponentSupplierId"),
      });
      try {
        await axiosInstance.put(`skus/${skuId}/?pko_id=${pkoId}`, {
          pko_id: pkoId,
          status: "Draft",
        });
        setIsRequestModalOpen(false);
        localStorage.setItem("adminComponentStatus", "Draft");
        setApiCallAgain((prev) => prev + 1);
        setLoading(false);
      } catch (error) {
        console.error("Error modifying in DB approve status SKU:", error);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error changing approve status SKU:", error);
      setLoading(false);
    }
  };

  const handleOpenApproveModal = () => {
    setIsApproveModalOpen(true);
  };

  const handleOpenRequestModal = () => {
    setIsRequestModalOpen(true);
  };

  return (
    <>
      <div className="py-3 bg-white">
        <div className="container-fluid px-20 px-md-4">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex flex-column">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <a
                      onClick={() => navigate(`/`)}
                      className="text-decoration-none text-secondary fw-600 fs-14 cursor-pointer"
                    >
                      Home
                    </a>
                  </li>
                  <li className="breadcrumb-item">
                    <a
                      onClick={() => navigate(`/adminpkodetails/${pkoId}`)}
                      className="text-decoration-none text-secondary fw-600 fs-14 cursor-pointer"
                    >
                      {pkoId}
                    </a>
                  </li>
                  <li className="breadcrumb-item">
                    <a
                      onClick={() =>
                        navigate(`/adminskudetails/${pkoId}/${skuId}`)
                      }
                      className="text-decoration-none text-secondary fw-600 fs-14 cursor-pointer"
                    >
                      {localStorage.getItem("adminComponentSkuName")}
                    </a>
                  </li>
                  <li className="breadcrumb-item">
                    <a className="text-decoration-none text-color-list-item fw-600 fs-14">
                      {skuComponentDataIncoming?.component_type}
                    </a>
                  </li>
                </ol>
              </nav>
              <div className="d-flex align-items-center mt-2">
                {componentsAllId?.length > 1 && <button
                  type="button"
                  className="btn p-0 border-none bg-transparent"
                >
                  <img
                    src="/assets/images/back-action-icon.svg"
                    style={{ width: "36px", height: "36px" }}
                    alt="Back Icon"
                    onClick={() =>
                      navigate(
                        `/admincomponent/${pkoId}/${skuId}/${handleClick("Previous")}`,
                      )
                    }
                  />
                </button>}
                <h2 className={`fs-24 fw-600 text-color-close-icon-box ${componentsAllId?.length > 1 ? "mx-3" : "mx-0"} mb-0`}>
                  {skuComponentDataIncoming?.component_type}
                </h2>
                {componentsAllId?.length > 1 && <button
                  type="button"
                  className="btn p-0 border-none bg-transparent"
                >
                  <img
                    src="/assets/images/forward-action-icon.svg"
                    style={{ width: "36px", height: "36px" }}
                    alt="Back Icon"
                    onClick={() =>
                      navigate(
                        `/admincomponent/${pkoId}/${skuId}/${handleClick("Next")}`,
                      )
                    }
                  />
                </button>}
              </div>
            </div>
            <div className="d-flex align-items-center">
              <span className="fs-16 fst-italic text-black">
                Date Submitted:{" "}
                {formatDateToReadableString(
                  skuComponentDataIncoming?.updated_date,
                )}
              </span>
              {localStorage.getItem("adminComponentStatus") === "Inreview" && (
                <>
                  <button
                    type="button"
                    className="btn btn-outline-secondary px-4 py-10 fs-14 fw-600 mx-3"
                    data-bs-toggle="modal"
                    data-bs-target="#requestChangesModal"
                    onClick={handleOpenRequestModal}
                  >
                    Request Changes
                  </button>
                  <button
                    type="button"
                    className="btn text-white bg-color-blue px-4 py-10 fs-14 fw-600"
                    data-bs-toggle="modal"
                    data-bs-target="#approveSKUModal"
                    onClick={handleOpenApproveModal}
                  >
                    Approve SKU
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Approve SKU Modal Popup */}
      <AdminApproveSKUModal
        isApproveOpen={isApproveModalOpen}
        onApproveClose={() => setIsApproveModalOpen(false)}
        ApproveSKU={ApproveSKU}
      />

      {/* Request Changes Modal Popup */}
      <AdminRequestChangesModal
        isRequestOpen={isRequestModalOpen}
        onRequestClose={() => setIsRequestModalOpen(false)}
        RequestChanges={RequestChanges}
      />
    </>
  );
};

export default ComponentSubHeaderStrip;
