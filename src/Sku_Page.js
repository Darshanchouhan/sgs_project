import React, { useContext } from "react";
import Navbar from "./Navbar";
import Breadcrumb from "./Breadcrumb";
import "./style.css";
import { SkuContext } from "./SkuContext"; // Import Context
import addActiveIndicator from "./assets/images/active-Indicator.svg";
import addPackagePlusIcon from "./assets/images/package-plus-icon.svg";
import boxImage from "./assets/images/BoxImg.png"; // Importing the box image
import crossIcon from "./assets/images/clear-cross-cancel.png"; // Import cross icon
import plusIcon from "./assets/images/plus-add_blue.png";
import forwardArrowIcon from "./assets/images/forward-arrow-img.png"; // Import forward arrow image
import imageIcon from "./assets/images/image-pic.png";
import { useNavigate } from "react-router-dom";
import Autosave from "./AutoSave";

const Sku_Page = () => {
  const { skuData, setSkuData } = useContext(SkuContext); // Use Context
  const navigate = useNavigate();

  const saveSkuData = async () => {
    // Save the SKU data to the backend
    console.log("Autosaving SKU Data:", skuData);
    await fetch("https://demo.gramener.com/api/sku/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(skuData),
    });
  };



  // Handle input change for dimensions and weights
  const handleInputChange = (field, value) => {
    setSkuData((prev) => ({
      ...prev,
      dimensionsAndWeights: {
        ...prev.dimensionsAndWeights,
        [field]: value,
      },
    }));
  };

  // Handle adding a component
  const handleAddComponent = () => {
    if (skuData.newComponent.trim()) {
      setSkuData((prev) => ({
        ...prev,
        components: [
          ...prev.components,
          { name: prev.newComponent, formStatus: "Pending" },
        ],
        newComponent: "",
        showInput: false,
        hasAddedFirstComponent: true,
        isCancelDisabled: false,
      }));
    }
  };

  // Handle cancel action
  const handleCancel = () => {
    setSkuData((prev) => ({
      ...prev,
      newComponent: "",
      showInput: false,
    }));
  };

 // Navigate to PkgDataForm
const handleForwardClick = (index) => {
  const selectedComponent = skuData.components[index]; // Get the selected component
  if (selectedComponent) {
    navigate("/pkgdataform", { state: { componentName: selectedComponent.name } });
  }
};


  return (
    <>
      <Navbar />
      <Breadcrumb />
      <Autosave saveFunction={saveSkuData} dependencies={[skuData]} />
      <div className="container-fluid px-5 d-flex flex-column container-height">
        
        {/* Header Section */}
        <div className="d-flex align-items-center justify-content-between py-3">
          <div className="d-flex align-items-center">
            <h6 className="fs-18 text-color-black mb-0">PKO Project ID: PRJ1188</h6>
            <img src={addActiveIndicator} alt="Active Indicator" className="ms-12" />
          </div>
          <p className="text-color-black fst-italic mb-0 opacity-70">
            Submission Last Date: 5 Dec 2025
          </p>
        </div>

         {/* SKU Details */}
         <div className="px-28 py-20 border border-color-disabled-lite bg-color-light-gray">
          <div className="row">
            <div className="col-12 col-md-10">
              <div className="d-flex align-items-start gap-70">
                {[
                  { label: "Description", value: "CVS Ibuprofen 200mg" },
                  { label: "Subcategory", value: "Ibuprofen" },
                  { label: "SKU ID", value: "232570" },
                  { label: "Brand", value: "CVS Health" },
                  { label: "UPC#", value: "5042838226" },
                  { label: "Segment", value: "-" },
                  { label: "Business Unit", value: "Health Care" },
                  { label: "Size", value: "5oz" },
                  { label: "Category", value: "Pain" },
                ].map((item, index) => (
                  <div key={index} className="d-flex flex-column mb-30">
                    <p className="text-color-labels fs-14 mb-1">{item.label}</p>
                    <h6 className="fs-16 fw-600 text-color-typo-primary">{item.value}</h6>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="mt-4 h-100">
          <div className="row h-100">
            {/* Primary Packaging Details */}
            <div className="col-12 col-md-5">
              <div className="card bg-color-light-gray border border-color-light-border rounded-3 p-4 h-100"
              style={{ maxHeight: "400px", overflowY: "auto" }}>
                <div className="d-flex align-items-center justify-content-between">
                  <h6 className="fs-22 fw-600 text-color-black">Primary Packaging Details</h6>
                  <img src={addPackagePlusIcon} alt="Package Plus Icon" />
                </div>
                <p className="fs-14 text-color-labels mb-30">
                  Provide all relevant primary packaging details for the SKU
                </p>
               {/* Unique Package Description Section */}
<div className="d-flex flex-column mb-3">
  <label className="fs-14 text-color-typo-primary mb-2">
    Unique package system description
  </label>
  <input
    type="text"
    className="form-control fs-14 px-12 border border-color-typo-secondary rounded-2 h-44"
    placeholder="Type something"
    value={skuData.uniquePackageDescription || ""} // Retain the value using context
    onChange={(e) =>
      setSkuData((prev) => ({
        ...prev,
        uniquePackageDescription: e.target.value, // Update context value
      }))
    }
  />
</div>

                {/* Dimensions and Weights Section */}
                <div className="d-flex flex-column">
  {[
    ["Height", "Width"],
    ["Depth", "Net Weight"],
    ["Tare Weight", "Gross Weight"],
  ].map((pair, rowIndex) => (
    <div className="row mb-3" key={rowIndex}>
      {pair.map((dimension, colIndex) => (
        <div className="col-md-6" key={colIndex}>
          <label className="fs-14 text-color-typo-primary mb-2">
            {dimension}
          </label>
          <div className="d-flex align-items-center border border-color-typo-secondary rounded-2">
            <input
              type="number"
              step="any"
              className="form-control border-0 rounded-0 px-2"
              placeholder="123"
              style={{ flex: 2 }}
              value={skuData.dimensionsAndWeights[dimension.toLowerCase().replace(" ", "")] || ""}
              onChange={(e) =>
                handleInputChange(
                  dimension.toLowerCase().replace(" ", ""),
                  e.target.value
                )
              }
            />
            <select
              className="form-select border-0 bg-color-light-shade text-color-typo-primary px-2"
              style={{ flex: 1 }}
              value={skuData.dimensionsAndWeights[`${dimension.toLowerCase().replace(" ", "")}Unit`] || "unit"}
              onChange={(e) =>
                setSkuData((prev) => ({
                  ...prev,
                  dimensionsAndWeights: {
                    ...prev.dimensionsAndWeights,
                    [`${dimension.toLowerCase().replace(" ", "")}Unit`]: e.target.value,
                  },
                }))
              }
            >
              <option value="unit">unit</option>
              <option value="kg">kg</option>
              <option value="lb">lb</option>
              <option value="cm">cm</option>
              <option value="mm">mm</option>
              <option value="in">in</option>
            </select>
          </div>
        </div>
      ))}
    </div>
  ))}
</div>


                {/* How2Recycle Label and Is this a Multipack */}
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="flex-fill">
                    <label className="fs-14 text-color-typo-primary mb-2">How2Recycle Label</label>
                    <select
                      className="form-select border border-color-typo-secondary rounded-2 h-44 px-12 fs-14"
                      value={skuData.recycleLabel}
                      onChange={(e) =>
                        setSkuData((prev) => ({
                          ...prev,
                          recycleLabel: e.target.value,
                        }))
                      }
                    >
                      <option value="">Select an option</option>
                      <option value="option1">Option 1</option>
                      <option value="option2">Option 2</option>
                    </select>
                  </div>

                  <div className="flex-fill">
                    <label className="fs-14 text-color-typo-primary mb-2">Is this a Multipack?</label>
                    <select
                      className="form-select border border-color-typo-secondary rounded-2 h-44 px-12 fs-14"
                      value={skuData.isMultipack}
                      onChange={(e) =>
                        setSkuData((prev) => ({
                          ...prev,
                          isMultipack: e.target.value,
                        }))
                      }
                    >
                      <option value="">Select an option</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                </div>

                {/* Additional Comments Section */}
                <div className="d-flex flex-column">
                  <label className="fs-14 text-color-typo-primary mb-2">Additional Comments</label>
                  <textarea
                    className="form-control border border-color-typo-secondary rounded-2 fs-14 px-12"
                    rows="3"
                    placeholder="Type any additional comments"
                    value={skuData.additionalComments}
                    onChange={(e) =>
                      setSkuData((prev) => ({
                        ...prev,
                        additionalComments: e.target.value,
                      }))
                    }
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Components Table Section */}
            <div className="col-12 col-md-7">
              <div className="card bg-color-light-gray border border-color-light-border rounded-3 p-4 h-100">
                <div className="d-flex justify-content-between align-items-center">
                  <h6 className="fs-22 fw-600 text-color-black mb-3">SKU Components</h6>
                  {skuData.hasAddedFirstComponent && (
                    <button
                      className="btn btn-outline-primary"
                      onClick={() =>
                        setSkuData((prev) => ({ ...prev, showInput: true }))
                      }
                    >
                      + Add SKU Components
                    </button>
                  )}
                </div>

                {!skuData.showTable ? (
                  <div className="text-center">
                    <img src={boxImage} alt="Box" className="mb-3" style={{ width: "80px" }} />
                    <p className="fs-14 text-color-labels mb-3">
                      Add components for this product to enter packaging-related information. You
                      can add multiple components.
                    </p>
                    <button
                      className="btn btn-outline-primary"
                      onClick={() =>
                        setSkuData((prev) => ({ ...prev, showTable: true }))
                      }
                    >
                      + Add SKU Components
                    </button>
                  </div>
                ) : (
                  <div>
                    <table className="table fs-14 w-100 ">
                      <thead>
                        <tr>
                          <th scope="col">Component Name</th>
                          <th scope="col">Form Status</th>
                          <th scope="col">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {skuData.components.map((component, index) => (
                          <tr key={index}>
                            <td>{component.name}</td>
                            <td>{component.formStatus}</td>
                            <td>
                              <span>
                                {index}{" "}
                                <img
                                  src={imageIcon}
                                  alt="Image"
                                  style={{ width: "16px", marginRight: "8px" }}
                                />
                              </span>
                              <img
                                src={forwardArrowIcon}
                                alt="Forward"
                                className="ms-2"
                                style={{ cursor: "pointer", width: "24px", height: "24px" }}
                                onClick={() => handleForwardClick(index)}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {skuData.showInput && (
                      <div className="d-flex align-items-center gap-3">
                        <input
                          type="text"
                          className="form-control border border-color-typo-secondary rounded-2 h-44 w-280"
                          placeholder="Enter Component Name"
                          value={skuData.newComponent}
                          onChange={(e) =>
                            setSkuData((prev) => ({
                              ...prev,
                              newComponent: e.target.value,
                            }))
                          }
                        />
                        <div
                          className="d-flex align-items-center cursor-pointer text-color-primary"
                          onClick={handleAddComponent}
                        >
                          <img
                            src={plusIcon}
                            alt="Add"
                            className="me-2"
                            style={{ width: "16px", height: "16px" }}
                          />
                          <span>Add Component</span>
                        </div>
                        <div
                          className={`d-flex align-items-center cursor-pointer text-color-primary ${
                            skuData.isCancelDisabled ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                          onClick={!skuData.isCancelDisabled ? handleCancel : null}
                        >
                          <img
                            src={crossIcon}
                            alt="Cancel"
                            className="me-2"
                            style={{ width: "16px", height: "16px" }}
                          />
                          <span>Cancel</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sku_Page;
