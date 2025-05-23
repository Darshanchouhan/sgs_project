import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom"; // Import useParams to get URL parameters
import { dateStatusCheck } from "../../AdminDashboard/index";

const PKODetailsSubHeaderStrip = ({ pkoStatus }) => {
  const { pkoId } = useParams(); // Assuming you are using react-router-dom for routing
  const navigate = useNavigate();

  const navigateToHome = () => {
    navigate("/admindashboard");
  };

  return (
    <div className="py-3 bg-white">
      <div className="container-fluid px-20 px-md-4">
        <div className="d-flex align-items-start justify-content-between">
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
                    // href="#"
                    className="text-decoration-none text-color-list-item fw-600 fs-14"
                  >
                    {pkoId}
                  </a>
                </li>
              </ol>
            </nav>
            <div className="d-flex align-items-center mt-2">
              <h2 className="fs-24 fw-600 text-color-close-icon-box me-3 mb-0">
                {pkoId}
              </h2>
              {pkoStatus && (
                <>
                  {dateStatusCheck(pkoStatus) === "Active" ? (
                    <span className="fs-14 fw-600 text-nowrap px-18 py-6 d-inline-block border rounded-pill active-pill">
                      {dateStatusCheck(pkoStatus)}
                    </span>
                  ) : (
                    <span className="fs-14 fw-600 text-nowrap px-18 py-6 d-inline-block border rounded-pill closed-pill">
                      {dateStatusCheck(pkoStatus)}
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
          <button type="button" className="btn p-0 fs-14 fw-600 text-secondary">
            <img
              src="/assets/images/download-icon.svg"
              alt="download-icon"
              className="me-2"
            />
            Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default PKODetailsSubHeaderStrip;
