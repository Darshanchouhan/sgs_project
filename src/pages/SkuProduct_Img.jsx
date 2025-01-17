import React, { useState, useEffect, useContext } from "react";
import "./../styles/style.css";
import { SkuContext } from "./SkuContext";

const SkuProduct_Img = ({
  updateProductImageCount,
  imagesFromDB, // Prop for images fetched from the database
  setImagesToUpload,
}) => {
  const [images, setImages] = useState({
    "Product Images": [],
  });
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    // Initialize product images from DB
    setImages((prev) => ({
      ...prev,
      "Product Images": imagesFromDB || [],
    }));
  }, [imagesFromDB]);

  useEffect(() => {
    if (updateProductImageCount) {
      updateProductImageCount(images["Product Images"]?.length || 0);
    }
  }, [images["Product Images"], updateProductImageCount]);

  const handleAddImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = true;

    input.onchange = (event) => {
      const files = Array.from(event.target.files);
      setImages((prev) => ({
        ...prev,
        "Product Images": [...prev["Product Images"], ...files].slice(0, 5),
      }));
      setImagesToUpload((prev) => [...prev, ...files]);
    };

    input.click();
  };

  const handleFullView = (image) => {
    setSelectedImage(image);
  };

  const handleDelete = (imageToDelete) => {
    setImages((prev) => ({
      ...prev,
      "Product Images": prev["Product Images"].filter(
        (img) => img !== imageToDelete,
      ),
    }));
  };

  const handleBackToGallery = () => {
    setSelectedImage(null);
  };

  return (
    <div
      className="offcanvas offcanvas-end width-80 bg-color-light-shade"
      tabIndex="-1"
      id="offcanvasRight-image"
      aria-labelledby="offcanvasRight-imageLabel"
    >
      <div className="offcanvas-header">
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        ></button>
      </div>
      <div className="offcanvas-body">
        {selectedImage ? (
          <div className="full-view-container">
            <button
              className="back-to-gallery-button"
              onClick={handleBackToGallery}
            >
              Back to Gallery View
            </button>
            <img
              src={
                selectedImage instanceof File
                  ? URL.createObjectURL(selectedImage)
                  : selectedImage
              }
              alt="Full View"
              className="full-view-image"
            />
          </div>
        ) : (
          <div className="image-section px-3">
            <div className="d-flex flex-column mb-5">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h2 className="fw-600 fs-24 text-color-black">
                  Packaging Images
                </h2>
                <img
                  src="/assets/images/image-pic.png"
                  alt="Add Images"
                  className="cursor-pointer "
                  onClick={handleAddImage}
                />
              </div>
              <div className="gallery-grid">
                {images["Product Images"].map((img, i) => (
                  <div
                    key={i}
                    className="gallery-item"
                    onMouseEnter={(e) => {
                      e.currentTarget.classList.add("hovered");
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.classList.remove("hovered");
                    }}
                  >
                    <img
                      src={
                        img instanceof File ? URL.createObjectURL(img) : null // Replace placeholder with null to show no image
                      }
                      alt="Uploaded"
                      style={img ? {} : { display: "none" }} // Hide the <img> element when null
                    />
                    <div className="image-actions">
                      <div
                        className="action"
                        onClick={() => handleFullView(img)}
                      >
                        <img
                          src="/assets/images/maximize-full-screen.png"
                          alt="Full View"
                          className="action-icon"
                        />
                        <span>Full View</span>
                      </div>
                      <div className="divider"></div>
                      <div className="action" onClick={() => handleDelete(img)}>
                        <img
                          src="/assets/images/trash-delete-bin.png"
                          alt="Delete"
                          className="action-icon"
                        />
                        <span>Delete</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkuProduct_Img;
