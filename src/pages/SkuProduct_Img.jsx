import React, { useState, useEffect } from "react";
import "./../styles/style.css";
import axiosInstance from "../services/axiosInstance";

const SkuProduct_Img = ({
  updateProductImageCount,
  setImagesToUpload,
  imagesFromDB,
  skuId,
  pkoId,
  handleAddProductImageClick,
  refreshAddProductImage,
}) => {
  const [images, setImages] = useState([]); // State for new images only
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(""); // Error state
  // const [imagesToUpload, setImagesToUpload] = useState([]); // Images to upload

  // Combine fetched images and new images
  // const combinedImages = [...(imagesFromDB || []), ...images];
  const combinedImages = [...(imagesFromDB || [])];

  // console.log(combinedImages,"combinedImages")

  // const viewImageUrl = "http://localhost:8001/media/"
  const viewImageUrl = "https://demo.gramener.com/media/";

  // Update the product image count whenever the images array changes
  useEffect(() => {
    if (updateProductImageCount) {
      updateProductImageCount(combinedImages.length);
    }
  }, [combinedImages, updateProductImageCount]);

  // ✅ Use `useEffect` to trigger handleUploadImages after state update
  useEffect(() => {
    if (images.length > 0) {
      handleUploadImages();
    }
  }, [images]); // Runs when images state is updated

  // **Moved `handleUploadImages` inside `SkuProduct_Img`**
  const handleUploadImages = async () => {
    console.log("upload image called", images, imagesFromDB, combinedImages);
    if (images.length > 0 && skuId && pkoId) {
      try {
        const formData = new FormData();
        images.forEach((image) => {
          formData.append("images", image.file); // Append image files
        });
        formData.append("pko_id", pkoId);

        await axiosInstance.post(`skus/${skuId}/upload-images/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        // ✅ Clear images after successful upload
        setImages([]);
        setImagesToUpload([]);
        refreshAddProductImage();
        alert("Images uploaded successfully!");
      } catch (error) {
        console.error("Error uploading images:", error);
        alert("Failed to upload images. Please try again.");
      }
    }
  };

  const handleAddImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".jpg,.jpeg,.png,.gif"; // Specify accepted file types
    input.multiple = false;

    input.onchange = (event) => {
      const file = event.target.files[0];

      if (!file) return;

      if (file.size > 5 * 1024 * 1024) {
        alert(
          "The selected image is more than 5MB. Please select an image less than 5MB."
        );
        return;
      }

      const newImages = [
        {
          file,
          url: URL.createObjectURL(file),
        },
      ];

      setImages(newImages); // ✅ Replace the state instead of appending
      setImagesToUpload([file]); // ✅ Replace the upload list
    };

    input.click();
  };

  const handleDrop = (event) => {
    event.preventDefault();

    const files = Array.from(event.dataTransfer.files);

    if (files.length > 1) {
      alert("Only one image can be selected at a time.");
      return;
    }

    // return if file doesn't exist
    const file = files[0];
    if (!file) return;

    // check type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    if (!validTypes.includes(file.type)) {
      alert(
        "Invalid file type. Please select a .jpg, .jpeg, .png, or .gif image."
      );
      return;
    }

    // check for 5Mb size
    if (file.size > 5 * 1024 * 1024) {
      alert(
        "The selected image is more than 5MB. Please select an image less than 5MB."
      );
      return;
    }

    const newImages = [
      {
        file,
        url: URL.createObjectURL(file),
      },
    ];

    setImages(newImages);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  // const handleAddImage = async () => {
  //   const input = document.createElement("input");
  //   input.type = "file";
  //   input.accept = "image/*";
  //   input.multiple = true;

  //   input.onchange = async (event) => {
  //     const files = Array.from(event.target.files);
  //     const newImages = files.map((file) => ({
  //       file,
  //       url: URL.createObjectURL(file), // Generate temporary URL for display
  //     }));

  //     setImages((prev) => [...prev, ...newImages]); // Add new images to state
  //     setImagesToUpload((prev) => [...prev, ...files]); // Update parent with new files

  //   };

  //   input.click();
  // };

  const handleFullView = (image) => {
    setSelectedImage(image);
  };

  const handleSkuDelete = async (imagePath) => {
    try {
      setLoading(true);
      await axiosInstance.delete(`/skus/${skuId}/upload-images/`, {
        data: { image: imagePath, pko_id: pkoId, sku_id: skuId },
      });

      // Remove the image from the combined list
      // setImages((prev) => prev.filter((img) => img.url !== imagePath));
      // setImagesToUpload((prev) => prev.filter((file) => file.name !== imagePath));
      refreshAddProductImage();
      setError(""); // Clear any previous error
    } catch (err) {
      console.error("Error deleting SKU image:", err);
      setError("Error deleting SKU image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToGallery = () => {
    setSelectedImage(null);
  };

  // const NoImages = images.length === 0;

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
              <img
                src="/assets/images/back-action-icon.svg"
                className="w-32 me-2"
                alt="icon"
              />
              Back to Packaging Images
            </button>
            <div className="img-container border border-color-light-border rounded-3 text-center bg-white mt-5 mx-auto">
              <img
                src={selectedImage}
                alt="Full View"
                className="full-view-image w-100"
              />
            </div>
          </div>
        ) : (
          <div className="image-section">
            <div className="d-flex flex-column">
              <div className="mb-32">
                <h2 className="fw-600 fs-24 text-color-typo-primary mb-2">
                  Packaging Images
                </h2>
                <ul className="fs-16 fw-400 fst-italic text-color-list-item ps-3 mb-0">
                  <li>
                    Attach at least 1 image of the package or individual
                    packaging components below.
                  </li>
                  <li>
                    Image files must be in one of the following formats: '.jpg',
                    '.jpeg', '.png', or '.gif' and image size should be less
                    than 5 MB.
                  </li>
                  <li>
                    The image does not need to contain final graphics and can be
                    unlabeled.
                  </li>
                  <li>
                    The package can also be a mockup or a representative package
                    that you produce and does not have to be CVS branded.
                  </li>
                  <li>
                    All label requests must include an image of the package or
                    packaging components.
                  </li>
                </ul>
              </div>
              {combinedImages.length === 0 ? (
                <div
                  className="noImagesAdded-block text-center"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  <div>
                    <img src="/assets/images/BoxImg.png" alt="box-img" />
                  </div>
                  <p className="fs-16 fw-600 text-color-labels mt-3 mb-4">
                    No images added yet. Click the below button to upload
                    images.
                  </p>
                  <button
                    type="button"
                    className="btn btn-outline-secondary px-4 py-10"
                    onClick={handleAddImage}
                  >
                    + Add Packaging Images
                  </button>
                  <p className="fs-14 fw-400 text-color-labels mt-3">
                    Or drag and drop images here
                  </p>
                </div>
              ) : (
                <div className="gallery-grid">
                  <div
                    className="drag-drop-img-box d-flex align-items-center justify-content-center bg-color-drag-drop-box border border-secondary text-center p-40"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                  >
                    <div>
                      <p className="fs-14 fw-400 text-color-labels mb-3">
                        Click the below button to upload images.
                      </p>
                      <button
                        type="button"
                        className="btn btn-outline-secondary px-4 py-2"
                        onClick={handleAddImage}
                      >
                        + Add Packaging Images
                      </button>
                      <p className="fs-14 fw-400 text-color-labels mt-3">
                        Or drag and drop images here
                      </p>
                    </div>
                  </div>
                  {combinedImages &&
                    combinedImages?.map((img, i) => {
                      // console.log(img.url,"image")
                      return (
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
                              `${viewImageUrl}${img.image}` ||
                              `${viewImageUrl}${img.thumbnail}`
                            }
                            alt="Uploaded"
                          />
                          <div className="image-actions">
                            <div
                              className="action"
                              onClick={() =>
                                handleFullView(`${viewImageUrl}${img.image}`)
                              }
                            >
                              <img
                                src="/assets/images/maximize-full-screen.png"
                                alt="Full View"
                                className="action-icon"
                              />
                              <span>Full View</span>
                            </div>
                            <div className="divider"></div>
                            <div
                              className="action"
                              onClick={() => handleSkuDelete(img.image)}
                            >
                              <img
                                src="/assets/images/trash-delete-bin.png"
                                alt="Delete"
                                className="action-icon"
                              />
                              <span>Delete</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
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
