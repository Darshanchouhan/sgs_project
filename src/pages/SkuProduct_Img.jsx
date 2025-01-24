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

  const NoImages = images.length === 0;

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
      <div className="offcanvas-body p-32">
        {selectedImage ? (
          <div className="full-view-container">
            <button
              type="button"
              className="btn d-flex align-items-center p-0 border-0 fs-16 fw-600 text-secondary back-to-gallery-button"
              onClick={handleBackToGallery}
            >
              <img src="/assets/images/back-action-icon.svg" className="w-32 me-2" alt="icon" />
              Back to Packaging Images
            </button>
            <div className="img-container border border-color-light-border rounded-3 text-center bg-white mt-5 mx-auto">
              <img
                src={selectedImage.url}
                alt="Full View"
                className="full-view-image w-100"
              />
            </div>
          </div>
        ) : (
          <div className="image-section">
            <div className="d-flex flex-column">
              <div className="mb-32">
                <h2 className="fw-600 fs-24 text-color-black mb-2">
                  Packaging Images
                </h2>
                <ul className="fs-16 fw-400 fst-italic text-color-list-item ps-3 mb-0">
                  <li>Attach at least 1 image of the package or individual packaging components below.</li>
                  <li>The image does not need to contain final graphics and can be unlabeled.</li>
                  <li>The package can also be a mockup or a representative package that you produce and does not have to be CVS branded.</li>
                  <li>All label requests must include an image of the package or packaging components.</li>
                </ul>
              </div>
              {NoImages ? (
                <div className="noImagesAdded-block text-center">
                  <div>
                    <img src="/assets/images/BoxImg.png" alt="box-img" />
                  </div>
                  <p className="fs-16 fw-600 text-color-labels mt-3 mb-4">No images added yet. Drag & Drop images / Click the below button to upload images.</p>
                  <button
                    type="button"
                    className="btn btn-outline-secondary px-4 py-10"
                    onClick={handleAddImage}>
                    + Add Packaging Images
                  </button>
                </div>
              ) : (
                <div className="gallery-grid">
                  <div className="drag-drop-img-box d-flex align-items-center justify-content-center bg-color-drag-drop-box border border-secondary text-center p-40">
                    <div>
                      <p className="fs-14 fw-400 text-color-labels mb-3">Drag & Drop images / Click the below button to upload images.</p>
                      <button
                        type="button"
                        className="btn btn-outline-secondary px-4 py-2"
                        onClick={handleAddImage}>
                        + Add Packaging Images
                      </button>
                    </div>
                  </div>
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
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkuProduct_Img;
