import React, { useEffect, useState } from "react";
import "./../styles/style.css";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Popover from "./CustomPopover";
import axiosInstance from "../services/axiosInstance";

const Importdata = ({
  title,
  chooseComponentDrop,
  openModal,
  infoTxt,
  popoverTitle,
  popoverConfirmTxt,
  popoverInfoIcon,
  onConfirmImport,
  currentPkoId,
}) => {
  const [pkoList, setPkoList] = useState([]);
  const [skuList, setSkuList] = useState([]);
  const [selectedPkoId, setSelectedPkoId] = useState("");
  const [selectedSkuId, setSelectedSkuId] = useState("");
  const [selectedRadio, setSelectedRadio] = useState(() =>
    currentPkoId ? "From same PKO" : "From other PKO",
  );
  const [defaultPkoId, setDefaultPkoId] = useState("");
  const [componentList, setComponentList] = useState([]); // <-- add this
  const [selectedComponentName, setSelectedComponentName] = useState("");

  useEffect(() => {
    const fetchVendorPkoData = async () => {
      try {
        const supplierId = localStorage.getItem("cvs_supplier");
        if (!supplierId) return;

        const vendorResponse = await axiosInstance.get(`vendors/${supplierId}`);
        const vendorData = vendorResponse.data?.[supplierId];

        if (vendorData && vendorData.pkos?.length) {
          setPkoList(vendorData.pkos);
          // Use currentPkoId if it's in the list, else fallback to the first
          const pkoToSelect =
            vendorData.pkos.find((pko) => pko.pko_id === currentPkoId)
              ?.pko_id || vendorData.pkos[0].pko_id;
          setDefaultPkoId(pkoToSelect);
          setSelectedPkoId(pkoToSelect);
          // setSelectedRadio(pkoToSelect === vendorData.pkos[0].pko_id ? "From same PKO" : "From other PKO");
          // Fetch full details from pkos/ endpoint
          const pkoResponse = await axiosInstance.get("pkos/");
          const pkoDetail = pkoResponse.data?.[pkoToSelect];
          setSkuList(pkoDetail?.skus || []);
        }
      } catch (error) {
        console.error("Failed to fetch vendor or PKO data", error);
      }
    };

    fetchVendorPkoData();
  }, [currentPkoId]);

  const handlePkoChange = async (e) => {
    const selectedId = e.target.value;
    setSelectedPkoId(selectedId);
    setSelectedSkuId(""); // Reset sku
    setSelectedRadio(
      selectedId === defaultPkoId ? "From same PKO" : "From other PKO",
    ); // Check against default

    try {
      // Fetch full PKO data from the pkos/ endpoint
      const response = await axiosInstance.get("pkos/");
      const pkoData = response.data?.[selectedId];

      if (pkoData?.skus) {
        setSkuList(pkoData.skus);
        console.log("Fetched SKUs for PKO:", selectedId, pkoData.skus);
      } else {
        setSkuList([]);
        console.warn("No SKUs found for this PKO");
      }
    } catch (error) {
      console.error("Failed to fetch PKO details:", error);
      setSkuList([]);
    }
  };

  useEffect(() => {
    const fetchComponentNames = async () => {
      if (!selectedSkuId || !selectedPkoId || !chooseComponentDrop) return;

      try {
        const response = await axiosInstance.get(
          `/skus/${selectedSkuId}/?pko_id=${encodeURIComponent(selectedPkoId)}`,
        );

        const components = response.data?.components || [];
        const names = components.map((comp) => comp.name).filter(Boolean);
        setComponentList(names);
      } catch (error) {
        console.error("Error fetching components for selected SKU:", error);
        setComponentList([]);
      }
    };

    fetchComponentNames();
  }, [selectedSkuId, selectedPkoId, chooseComponentDrop]);

  useEffect(() => {
    const modalElement = document.getElementById(openModal);
    if (!modalElement) return;

    const handleModalShown = () => {
      // Wait until selectedPkoId is available
      if (selectedPkoId && defaultPkoId) {
        setSelectedRadio(
          selectedPkoId === defaultPkoId ? "From same PKO" : "From other PKO",
        );
      }
    };

    modalElement.addEventListener("shown.bs.modal", handleModalShown);

    return () => {
      modalElement.removeEventListener("shown.bs.modal", handleModalShown);
    };
  }, [openModal, selectedPkoId, defaultPkoId]);

  return (
    <div
      className="modal fade import-data-modal-popup"
      id={openModal}
      tabIndex="-1"
      aria-labelledby="importDataModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered bg-transparent p-0">
        <div className="modal-content rounded-1 bg-color-light-gray-shade">
          <div className="modal-header px-20 ps-35 pt-20 pb-3 border-bottom border-primary">
            <h1
              className="modal-title fs-16 fw-600 text-color-typo-primary"
              id="importDataModalLabel"
            >
              {title}
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body px-35 py-40">
            <div className="pb-32 border-bottom border-color-list-item">
              <h2 className="fs-14 fw-400 text-color-typo-primary mb-12">
                Import SKU Data from
              </h2>
              <div className="d-flex align-items-center">
                <label className="d-flex align-items-center fs-14 fw-400 text-color-typo-primary me-32 mb-0">
                  <input
                    type="radio"
                    className="me-2 "
                    name="sku-data"
                    value="From same PKO"
                    checked={selectedRadio === "From same PKO"}
                    onChange={(e) => setSelectedRadio(e.target.value)}
                  />
                  From same PKO
                </label>
                <label className="d-flex align-items-center fs-14 fw-400 text-color-typo-primary me-32 mb-0">
                  <input
                    type="radio"
                    className="me-2 "
                    name="sku-data"
                    value="From other PKO"
                    checked={selectedRadio === "From other PKO"}
                    onChange={(e) => setSelectedRadio(e.target.value)}
                  />
                  From other PKO
                </label>
              </div>
            </div>
            <form className="py-4">
              <div className="form-group mb-28">
                <label className="fs-14 fw-400 text-color-typo-primary">
                  PKO ID
                </label>
                <div className="input-group align-items-center select-arrow-pos">
                  {/* PKO ID Dropdown */}
                  <select
                    className="w-100"
                    value={selectedPkoId}
                    onChange={handlePkoChange}
                  >
                    <option value="">Select</option>
                    {pkoList.map((pko) => (
                      <option key={pko.pko_id} value={pko.pko_id}>
                        {pko.pko_id}
                      </option>
                    ))}
                  </select>{" "}
                </div>
              </div>
              <div className="form-group mb-28">
                <label className="fs-14 fw-400 text-color-typo-primary">
                  Choose SKU
                </label>
                <div className="input-group align-items-center select-arrow-pos">
                  {/* SKU Dropdown */}
                  <select
                    className="w-100"
                    value={selectedSkuId}
                    onChange={(e) => setSelectedSkuId(e.target.value)}
                  >
                    <option value="">Select</option>
                    {skuList.map((sku, index) => {
                      const id = typeof sku === "string" ? sku : sku?.sku_id;
                      return (
                        <option key={id || index} value={id}>
                          {id}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
              {chooseComponentDrop && (
                <div className="form-group mb-28">
                  <label className="fs-14 fw-400 text-color-typo-primary">
                    Choose Component
                  </label>
                  <div className="input-group align-items-center select-arrow-pos">
                    {/* <select className="w-100" tabIndex="0">
  <option value="">Select a component</option>
  {componentList.map((compName, index) => (
    <option key={index} value={compName}>
      {compName}
    </option>
  ))}
</select> */}
                    <select
                      className="w-100"
                      value={selectedComponentName}
                      onChange={(e) => setSelectedComponentName(e.target.value)}
                      tabIndex="0"
                    >
                      <option value="">Select a component</option>
                      {componentList.map((compName, index) => (
                        <option key={index} value={compName}>
                          {compName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </form>
          </div>
          <div className="modal-footer d-flex align-items-center justify-content-between flex-nowrap bg-white px-4 py-6">
            <div className="d-flex align-items-center">
              <InfoOutlinedIcon className="info-icon ms-0 me-6" />
              <p className="fs-12 fw-600 text-color-list-item mb-0">
                {infoTxt}
              </p>
            </div>
            <div className="d-flex align-items-center">
              <button
                type="button"
                className="btn btn-outline-primary fs-14 fw-600 px-4 py-12 rounded-1 me-12"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <Popover
                title={popoverTitle}
                confirmTxt={popoverConfirmTxt}
                icon={popoverInfoIcon}
                onConfirm={() =>
                  onConfirmImport &&
                  selectedSkuId &&
                  selectedPkoId &&
                  onConfirmImport(
                    selectedSkuId,
                    selectedPkoId,
                    selectedComponentName,
                  )
                }
              >
                <button className="btn btn-primary fs-14 fw-600 px-4 py-12 rounded-1">
                  Import
                </button>
              </Popover>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Importdata;
