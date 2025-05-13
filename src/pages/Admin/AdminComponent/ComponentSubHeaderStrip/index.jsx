import { useNavigate, useParams } from "react-router-dom";

const ComponentSubHeaderStrip = () => {

  const navigate = useNavigate();
  const {pkoId, skuId} = useParams(); // Assuming you are using react-router-dom for routing

  return (
    <div className="py-3 bg-white">
      <div className="container-fluid px-20 px-md-4">
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex flex-column">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item">
                  <a
                    onClick={() => navigate(`/`)}
                    className="text-decoration-none text-secondary fw-600 fs-14 cursor-pointer"
                  >
                    Home
                  </a>
                </li>
                <li className="breadcrumb-item">
                  <a
                    onClick={() => navigate(`/adminpkodetails/${pkoId}`)}
                    className="text-decoration-none text-secondary fw-600 fs-14 cursor-pointer"
                  >
                    {pkoId}
                  </a>
                </li>
                <li className="breadcrumb-item">
                  <a
                    onClick={() => navigate(`/adminskudetails/${pkoId}/${skuId}`)}
                    className="text-decoration-none text-secondary fw-600 fs-14 cursor-pointer"
                  >
                    CVS Ibuprofen 200mg
                  </a>
                </li>
                <li className="breadcrumb-item">
                  <a
                    className="text-decoration-none text-color-list-item fw-600 fs-14"
                  >
                    Box
                  </a>
                </li>
              </ol>
            </nav>
            <div className="d-flex align-items-center mt-2">
              <button
                type="button"
                className="btn p-0 border-none bg-transparent"
              >
                <img
                  src="/assets/images/back-action-icon.svg"
                  style={{ width: "36px", height: "36px" }}
                  alt="Back Icon"
                />
              </button>
              <h2 className="fs-24 fw-600 text-color-close-icon-box mx-3 mb-0">
                Box
              </h2>
              <button
                type="button"
                className="btn p-0 border-none bg-transparent"
              >
                <img
                  src="/assets/images/forward-action-icon.svg"
                  style={{ width: "36px", height: "36px" }}
                  alt="Back Icon"
                />
              </button>
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

export default ComponentSubHeaderStrip;
