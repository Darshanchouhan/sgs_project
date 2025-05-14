import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const PKODetailsSKUTableRow = ( {skuRowData} ) => {
  const {pkoId} = useParams(); // Assuming you are using react-router-dom for routing
  const navigate = useNavigate();
    
  const handleForwardClick = () => {
    navigate(`/adminskudetails/${pkoId}/${skuRowData?.sku_id}`);
  };

    return(
        <tr>
            <td className="align-middle">{skuRowData?.sku_id}</td>
            <td className="align-middle">
              <span className="text-truncate d-inline-block w-50">
                {skuRowData?.description}
              </span>
            </td>
            <td className="align-middle">
              <div className="d-flex align-items-center justify-content-between w-100">
                <div className="w-50">
                  <div
                    className="progress"
                    role="progressbar"
                    aria-label="Basic example"
                    aria-valuenow="100"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    <div
                      className="progress-bar"
                      style={{ width: `${skuRowData?.form_completion_percent || "0%"}`, background: "#155DC9" }}
                    ></div>
                  </div>
                </div>
                <span>{skuRowData?.form_completion_percent}</span>
              </div>
            </td>
            <td className="align-middle text-center">
            {skuRowData?.status === "Not Started" ? <span className="fs-14 fw-600 text-nowrap px-12 py-6 d-inline-block border rounded-pill not-started-pill w-120">
                  Not Started
              </span> : skuRowData?.status === "Completed" ?
              <span className="fs-14 fw-600 text-nowrap px-12 py-6 d-inline-block border rounded-pill completed-pill w-120">
                Approved
              </span> : skuRowData?.status === "In Review" ?
              <span className="fs-14 fw-600 text-nowrap px-12 py-6 d-inline-block border rounded-pill in-review-pill w-120">
                In Review
              </span> : skuRowData?.status === "Draft" ?
              <span className="fs-14 fw-600 text-nowrap px-12 py-6 d-inline-block border rounded-pill draft-pill w-120">
                Draft
              </span> : <></>}
            </td>
            <td className="align-middle text-center">
              <button
                className="btn p-0 border-0 shadow-none"
                onClick={handleForwardClick}
              >
                <img
                  src="/assets/images/forward-arrow-img.png"
                  alt="Forward"
                />
              </button>
            </td>
            </tr>
    )
}

export default PKODetailsSKUTableRow;