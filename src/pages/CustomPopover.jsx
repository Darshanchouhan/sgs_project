import React, { useState, useRef, useEffect } from "react";

const Popover = ({ children, title, confirmTxt, icon, onConfirm }) => {
  const [show, setShow] = useState(false);
  const popoverRef = useRef(null);

  const togglePopover = () => setShow((prev) => !prev);

  // Close popover on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setShow(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="position-relative d-inline-block" ref={popoverRef}>
      <div onClick={togglePopover} style={{ cursor: "pointer" }}>
        {children}
      </div>
      {show && (
        <div
          className="popover bs-popover-top show position-absolute z-3"
          style={{ bottom: "125%", left: "0%", transform: "translateX(-50%)" }}
        >
          <div
            className="popover-arrow"
            style={{ position: "absolute", left: "59%" }}
          ></div>
          <div className="popover-body p-0">
            <div>
              <div className="d-flex align-items-center p-20 border-bottom border-color-desabled-lite">
                <p className="fs-14 fw-400 text-black text-nowrap mb-0">
                  <span className="me-12">
                    <img src={icon} alt="error-icon" />
                  </span>
                  {title}
                </p>
              </div>
              <div className="d-flex align-items-center justify-content-between px-12 py-12">
                <p className="fs-14 fw-600 text-black text-nowrap mb-0">
                  {confirmTxt}
                </p>
                <div className="d-flex align-items-center">
                  <button className="btn btn-outline-primary fs-14 fw-600 px-4 py-2 rounded-1 me-12">
                    No
                  </button>
                  <button
                    className="btn btn-primary fs-14 fw-600 px-4 py-2 rounded-1"
                    onClick={() => {
                      onConfirm(); // ✅ call the confirm callback
                      setShow(false); // close popover
                    }}
                  >
                    Yes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Popover;
