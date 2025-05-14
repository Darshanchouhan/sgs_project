import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import AdminApproveSKUModal from "../../AdminApproveSKUModal";
import AdminRequestChangesModal from "../../AdminRequestChangesModal";
import axiosInstance from "../../../../services/axiosInstance";

const SKUDetailsSubHeaderStrip = ({
  descriptionIncoming,
  statusIncoming,
  submitted_date,
  cvsSupplierId,
  setApiCallAgain,
}) => {
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  const navigate = useNavigate();

  const { pkoId, skuId } = useParams();

  const navigateToHome = () => {
    navigate("/admindashboard");
  };

  const navigateToPKOpage = () => {
    navigate(`/adminpkodetails/${pkoId}`);
  };

  const formatDateToReadableString = (isoDateStr) => {
    const date = new Date(isoDateStr);
    const options = { day: "numeric", month: "long", year: "numeric" };
    return date.toLocaleDateString("en-GB", options);
  };

  const ApproveSKU = async () => {
    try {
      await axiosInstance.post(`notifications/`, {
        status_change: "InreviewToApproved",
        pkoid: pkoId,
        skuid: skuId,
        cvs_supplier: cvsSupplierId,
      });
      try {
        await axiosInstance.put(`skus/${skuId}/?pko_id=${pkoId}`, {
          pko_id: pkoId,
          status: "Approved",
        });
        setIsApproveModalOpen(false);
        setApiCallAgain((prev) => prev + 1);
      } catch (error) {
        console.error("Error modifying in DB approve status SKU:", error);
      }
    } catch (error) {
      console.error("Error changing approve status SKU:", error);
    }
  };

  const RequestChanges = async () => {
    try {
      await axiosInstance.post(`notifications/`, {
        status_change: "DraftToInreview",
        pkoid: pkoId,
        skuid: skuId,
        cvs_supplier: cvsSupplierId,
      });
      try {
        await axiosInstance.put(`skus/${skuId}/?pko_id=${pkoId}`, {
          pko_id: pkoId,
          status: "Draft",
        });
        setIsRequestModalOpen(false);
        setApiCallAgain((prev) => prev + 1);
      } catch (error) {
        console.error("Error modifying in DB approve status SKU:", error);
      }
    } catch (error) {
      console.error("Error changing approve status SKU:", error);
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
                      onClick={navigateToHome}
                      className="text-decoration-none text-secondary fw-600 fs-14 cursor-pointer"
                    >
                      Home
                    </a>
                  </li>
                  <li className="breadcrumb-item">
                    <a
                      onClick={navigateToPKOpage}
                      className="text-decoration-none text-secondary fw-600 fs-14 cursor-pointer"
                    >
                      {pkoId}
                    </a>
                  </li>
                  <li className="breadcrumb-item">
                    <a className="text-decoration-none text-color-list-item fw-600 fs-14">
                      {descriptionIncoming}
                    </a>
                  </li>
                </ol>
              </nav>
              <div className="d-flex align-items-center mt-2">
                <h2 className="fs-24 fw-600 text-color-close-icon-box me-3 mb-0">
                  {descriptionIncoming}
                </h2>
                <span
                  className={`fs-14 fw-600 text-nowrap px-18 py-6 d-inline-block border rounded-pill ${statusIncoming === "Inreview" ? "in-review-pill" : statusIncoming === "Approved" ? "completed-pill" : statusIncoming === "Draft" ? "draft-pill" : "not-started-pill"}`}
                >
                  {statusIncoming === "Inreview" ? "In Review" : statusIncoming}
                </span>
              </div>
            </div>
            <div className="d-flex align-items-center">
              <span className="fs-16 fst-italic text-black">
                Date Submitted: {formatDateToReadableString(submitted_date)}
              </span>
              {statusIncoming === "Inreview" && (
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

export default SKUDetailsSubHeaderStrip;
