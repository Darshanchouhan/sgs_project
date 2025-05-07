import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const TablepkoPage = (props) => {
  const navigate = useNavigate();
  const { selectedPKOIds, setSelectedPKOIds, pkoItemIncoming } = props;
  const [valueCheckbox, setValueCheckbox] = useState("");

  const dateConverter = (dateString) => {
    const [year, month, day] = dateString.split("T")[0].split("-");
    return `${day}-${month}-${year}`;
  };

  const navigateToPkoDetails = () => {
    navigate("/adminpkodetails");
  };

  const handleCheckboxSelect = () => {
    const pkoId = pkoItemIncoming?.["pko_id"];
    if (selectedPKOIds.includes(pkoId)) {
      setSelectedPKOIds(selectedPKOIds.filter((id) => id !== pkoId));
    } else {
      setSelectedPKOIds([...selectedPKOIds, pkoId]);
    }
  };

  useEffect(() => {
    setValueCheckbox(selectedPKOIds?.includes(pkoItemIncoming?.["pko_id"]));
  }, [selectedPKOIds]);

  return (
    <tr>
      <td className="align-middle text-center">
        <input
          className="form-check-input mt-0"
          type="checkbox"
          checked={valueCheckbox}
          aria-label="Checkbox for selection"
          onChange={handleCheckboxSelect}
        />
      </td>
      <td className="align-middle">{pkoItemIncoming?.["pko_id"]}</td>
      <td className="align-middle">{pkoItemIncoming?.["supplier_name"]}</td>
      <td className="align-middle text-end text-nowrap">
        {dateConverter(pkoItemIncoming?.["due_date"])}
      </td>
      <td className="align-middle">
        <div className="d-flex align-items-center justify-content-between w-100">
          <div className="w-50">
            <div
              className="progress"
              role="progressbar"
              aria-valuenow={`${(Number(pkoItemIncoming?.["skuformsubmitted"].split("/")[0]) / (Number(pkoItemIncoming?.["skuformsubmitted"].split("/")[1]) === 0 ? 1 : Number(pkoItemIncoming?.["skuformsubmitted"].split("/")[1]))) * 100}`}
              aria-valuemin="0"
              aria-valuemax="100"
            >
              <div
                className="progress-bar"
                style={{
                  width: `${(Number(pkoItemIncoming?.["skuformsubmitted"].split("/")[0]) / (Number(pkoItemIncoming?.["skuformsubmitted"].split("/")[1]) === 0 ? 1 : Number(pkoItemIncoming?.["skuformsubmitted"].split("/")[1]))) * 100}%`,
                  background: "#155DC9",
                }}
              ></div>
            </div>
          </div>
          <span>
            <span className="text-color-responce-pending">
              {Number(pkoItemIncoming?.["skuformsubmitted"].split("/")[0])}
            </span>{" "}
            / {Number(pkoItemIncoming?.["skuformsubmitted"].split("/")[1])}
          </span>
        </div>
      </td>
      <td className="align-middle text-end">
        {pkoItemIncoming?.["skuformsapproved"].replace("/", " / ")} Approved
      </td>
      <td className="align-middle text-center">
        {pkoItemIncoming?.["status"] === "Active" ? (
          <span className="fs-14 fw-600 text-nowrap px-12 py-6 d-inline-block border rounded-pill active-pill">
            Active
          </span>
        ) : (
          <span className="fs-14 fw-600 text-nowrap px-12 py-6 d-inline-block border rounded-pill closed-pill">
            Closed
          </span>
        )}
      </td>
      <td className="align-middle text-center">
        <button
          className="btn p-0 border-0 shadow-none"
          onClick={navigateToPkoDetails}
        >
          <img src="/assets/images/forward-arrow-img.png" alt="Forward" />
        </button>
      </td>
    </tr>
  );
};

export default TablepkoPage;
