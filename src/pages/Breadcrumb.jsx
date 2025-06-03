import { useEffect, useState } from "react";
import axiosInstance from "../services/axiosInstance";
import VendorCommentPanel from "../components/VendorCommentPanel";

const Breadcrumb = ({
  onBackClick,
  onSaveClick,
  isFormFilled, // Receive the prop
  componentName = "Default Component",
  pkoId = "N/A",
  description = "N/A",
  isFormLocked,
  currentSkuDetails = {},
  pkoData = {},
  allSupplierPkoData = [],
  allSupplierSkus = [],
}) => {
  const [commentDropdownData, setCommentDropdownData] = useState({
    pkos: [],
    skus: [],
  });
  const skuState = JSON.parse(localStorage.getItem("sku_page_state"));
  const selectedSkuId = skuState?.skuId;
  const selectedPkoId = skuState?.pkoData?.pko_id;

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const supplierId = localStorage.getItem("cvs_supplier");
        const vendorRes = await axiosInstance.get(`vendors/${supplierId}`);
        const vendor = vendorRes.data?.[supplierId];
        const pkos = vendor?.pkos || [];

        const pkoRes = await axiosInstance.get("pkos/");
        const pkoMap = pkoRes.data;

        const allSkus = [];

        pkos.forEach((pko) => {
          const pkoDetails = pkoMap[pko.pko_id];
          if (pkoDetails?.skus?.length) {
            pkoDetails.skus.forEach((sku) =>
              allSkus.push({ ...sku, pko_id: pko.pko_id }),
            );
          }
        });

        setCommentDropdownData({
          pkos,
          skus: allSkus,
        });
      } catch (err) {
        console.error(
          "Failed to fetch dropdown data for VendorCommentPanel:",
          err,
        );
      }
    };

    fetchDropdownData();
  }, []);

  return (
    <div className="py-10 bg-color-light-shade">
      <div className="container-fluid px-5">
        <div className="d-flex align-items-center justify-content-between">
          {/* Back Button and Component Name */}
          <div className="d-flex align-items-center">
            <button
              type="button"
              className="btn p-0 border-none bg-transparent me-4"
              onClick={onBackClick}
            >
              <img src="/assets/images/back-action-icon.svg" alt="Back Icon" />
            </button>
            <div className="d-flex flex-column">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <a
                      href="#"
                      className="text-decoration-none text-secondary fw-600 fs-14"
                    >
                      PKO Project ID: {pkoId}
                    </a>
                  </li>
                  <li className="breadcrumb-item">
                    <a
                      href="#"
                      className="text-decoration-none fw-600 fs-14 text-secondary"
                    >
                      {description}
                    </a>
                  </li>
                </ol>
              </nav>
              <h6 className="fw-600 text-color-typo-primary mb-0 mt-2">
                {componentName}
              </h6>
            </div>
          </div>

          {/* Save & Close Button */}
          <div className="d-flex align-items-center">
            {/* <button
              className="save-button fs-14 fw-600 border-0 px-4 py-12"
              data-bs-toggle="modal"
              data-bs-target="#analysisModal"
            // onClick={onSaveClick}
            >
              Save & Draft
            </button> */}
            <button
              className="save-button fs-14 fw-600 border-0 px-4 py-12 h-44"
              style={{
                backgroundColor: isFormLocked
                  ? "#cccccc"
                  : isFormFilled
                    ? "#d43014"
                    : "#cccccc",
                color: isFormLocked
                  ? "#666666"
                  : isFormFilled
                    ? "#ffffff"
                    : "#666666",
                cursor: isFormLocked ? "not-allowed" : "pointer",
                opacity: isFormLocked ? 0.5 : 1,
              }}
              onClick={!isFormLocked ? onSaveClick : undefined}
              disabled={isFormLocked}
            >
              Save as Draft
            </button>
            <div>
              <button
                type="button"
                className="btn p-0 border-none bg-transparent ps-3 border-start"
                data-bs-toggle="offcanvas"
                data-bs-target="#offcanvasVendorCommentPanel"
                aria-controls="offcanvasVendorCommentPanel"
              >
                <img
                  src="/assets/images/vendor-comment-icon.svg"
                  alt="vendor-comment-icon"
                />
              </button>

              <VendorCommentPanel
                dropdownData={{
                  pkos: commentDropdownData.pkos,
                  skus: commentDropdownData.skus,
                  componentsBySku: {},
                }}
                initialSelectedPkoId={selectedPkoId}
                initialFilterPkoId={selectedPkoId}
                initialSelectedSkuId={selectedSkuId}
                initialFilterSkuId={selectedSkuId}
                initialSelectedComponentName={componentName}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Breadcrumb;
