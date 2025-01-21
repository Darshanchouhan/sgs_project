import React, { useState, useEffect } from "react";
import "./../styles/style.css";

const SkuProduct_Img = ({ updateProductImageCount, setImagesToUpload }) => {
  const [images, setImages] = useState([]); // State for new images only
  const [selectedImage, setSelectedImage] = useState(null);

  // Update the product image count whenever the images array changes
  useEffect(() => {
    if (updateProductImageCount) {
      updateProductImageCount(images.length);
    }
  }, [images, updateProductImageCount]);

  const handleAddImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = true;

    input.onchange = (event) => {
      const files = Array.from(event.target.files);
      const newImages = files.map((file) => ({
        file,
        url: URL.createObjectURL(file), // Generate temporary URL for display
      }));

      setImages((prev) => [...prev, ...newImages]); // Add new images to state
      setImagesToUpload((prev) => [...prev, ...files]); // Update parent with new files
    };

    input.click();
  };

  const handleFullView = (image) => {
    setSelectedImage(image);
  };

  const handleDelete = (imageToDelete) => {
    setImages((prev) => prev.filter((img) => img.url !== imageToDelete.url));
    setImagesToUpload((prev) =>
      prev.filter((file) => file !== imageToDelete.file),
    ); // Remove from upload list
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
              src={selectedImage.url}
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
                {images.map((img, i) => (
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
                    <img src={img.url} alt="Uploaded" />
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
