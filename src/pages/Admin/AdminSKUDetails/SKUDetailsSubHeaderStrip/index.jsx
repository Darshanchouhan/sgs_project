import { useNavigate } from "react-router-dom";

const SKUDetailsSubHeaderStrip = () => {
  const navigate = useNavigate();

  const navigateToHome = () => {
    navigate("/admindashboard");
  };

  const navigateToPKOpage = () => {
    navigate("/adminpkodetails");
  };

  return (
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
                    PRJ1188
                  </a>
                </li>
                <li className="breadcrumb-item">
                  <a
                    href="#"
                    className="text-decoration-none text-color-list-item fw-600 fs-14"
                  >
                    CVS Ibuprofen 200mg
                  </a>
                </li>
              </ol>
            </nav>
            <div className="d-flex align-items-center mt-2">
              <h2 className="fs-24 fw-600 text-color-close-icon-box me-3 mb-0">
                CVS Ibuprofen 200mg
              </h2>
              <span className="fs-14 fw-600 text-nowrap px-18 py-6 d-inline-block border rounded-pill in-review-pill">
                In Review
              </span>
            </div>
          </div>
          <div className="d-flex align-items-center">
            <span className="fs-16 fst-italic text-black">
              Date Submitted: 5 May 2025
            </span>
            <button
              type="button"
              className="btn btn-outline-secondary px-4 py-10 fs-14 fw-600 mx-3"
              data-bs-toggle="modal"
              data-bs-target="#requestChangesModal"
            >
              Request Changes
            </button>
            <button
              type="button"
              className="btn text-white bg-color-blue px-4 py-10 fs-14 fw-600"
              data-bs-toggle="modal"
              data-bs-target="#approveSKUModal"
            >
              Approve SKU
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SKUDetailsSubHeaderStrip;
