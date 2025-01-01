import React, { useState } from "react";
import "./../styles/style.css";

const initialImageState = {
  "Product Images": [],
  "Component Images - Box": [],
  "Component Images - Protective Film": [],
};

const SkuProduct_Img = () => {
  const [images, setImages] = useState(initialImageState);

  const handleAddImage = (section) => {
    // Open file input dialog
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = true;

    input.onchange = (event) => {
      const files = Array.from(event.target.files);
      setImages((prev) => {
        const updatedImages = [...prev[section], ...files].slice(0, 5);
        return { ...prev, [section]: updatedImages };
      });
    };

    input.click();
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
        <div className="image-section px-3">
          {/*Map through image section */}
          {Object.keys(images).map((title, index) => (
            <div key={index} className="d-flex flex-column mb-5">
              {/* Header Section */}
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h2 className="fw-600 fs-24 text-color-black">{title}</h2>
                <div className="d-flex align-items-center gap-2">
                  <span className="fs-14 text-secondary">
                    {images[title].length}/5 images uploaded
                  </span>
                  <button
                    className={`btn bg-transparent shadow-none fs-14 d-flex py-0 align-items-center fw-600 text-secondary px-0 ${
                      images[title].length >= 5
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    onClick={() => handleAddImage(title)}
                    disabled={images[title].length >= 5}
                  >
                    <img
                      src="/assets/images/image-pic.png"
                      alt="ImgIcon"
                      className="me-2"
                    />
                    + Add product images
                  </button>
                </div>
              </div>

              {/* Image List */}
              {images[title].length === 0 ? (
                <p className="text-muted fst-italic">No images added</p>
              ) : (
                <ul className="d-flex align-items-center list-unstyled gap-3 flex-wrap">
                  {images[title].map((img, i) => (
                    <li key={i}>
                      <img
                        src={
                          img instanceof File
                            ? URL.createObjectURL(img)
                            : "/assets/images/BoxImg.png"
                        }
                        alt="Uploaded"
                        className="img-thumbnail"
                      />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkuProduct_Img;
