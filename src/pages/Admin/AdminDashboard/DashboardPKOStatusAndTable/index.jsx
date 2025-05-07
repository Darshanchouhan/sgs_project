import React, { useEffect, useState } from "react";
import TablepkoPage from "./TablepkoPage";
import filterIcon from "../../../../../public/assets/images/Filter_icon.svg";
import axiosInstance from "../../../../services/axiosInstance";
import SendReminderModal from "./SendReminderModal";

const DashboardPKOStatusAndTable = (props) => {
  const { tablepkoData } = props;
  const [selectedStatus, setSelectedStatus] = useState("All PKOs");
  const [selectedPKOIds, setSelectedPKOIds] = useState([]);
  const [filterTablepkoData, setFilterTablepkoData] = useState(tablepkoData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [text, setText] = useState(
    "The PKO submission deadline is approaching! Please ensure you submit your forms before the closing date to have your input counted. Thank you!",
  );

  useEffect(() => {
    setFilterTablepkoData(tablepkoData);
  }, [tablepkoData]);

  const handleSelectAllPKO = (e) => {
    const allPKOIds = tablepkoData?.map((item) => item?.["pko_id"]);
    if (e.target.checked) {
      setSelectedPKOIds(allPKOIds); // Select all if not already selected
    } else {
      setSelectedPKOIds([]); // Deselect all if already selected
    }
  };

  const handleSortSupplier = () => {
    if (filterTablepkoData) {
      const sortedData = [...filterTablepkoData].sort((a, b) =>
        a.supplier_name.localeCompare(b.supplier_name, undefined, {
          sensitivity: "base",
        }),
      );
      setFilterTablepkoData(sortedData);
    }
  };

  const handleSortDate = () => {
    if (filterTablepkoData) {
      const sortedData = [...filterTablepkoData].sort((a, b) => {
        return new Date(a.due_date) - new Date(b.due_date);
      });
      setFilterTablepkoData(sortedData);
    }
  };

  const wordCount = (str) => {
    return str
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
  };

  const handleChange = (e) => {
    const input = e.target.value;
    const words = wordCount(input);

    if (words <= 50) {
      console.log("inside");
      setText(input);
    }
  };

  const handleSubmitReminder = async () => {
    try {
      const response = await axiosInstance.post(`/reminders/`, {
        pko_ids: selectedPKOIds,
        message: text,
      });
      if (response?.status === 200) {
        setText(
          "The PKO submission deadline is approaching! Please ensure you submit your forms before the closing date to have your input counted. Thank you!",
        );
        setIsModalOpen(false);
        setSelectedPKOIds([]);
      }
    } catch (err) {
      console.log(err, "error in sending reminder");
    }
  };

  const handleOpenReminderPopUp = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="d-flex align-items-center justify-content-between mt-30">
        <div className="d-flex align-items-center">
          <div className="input-group border border-secondary rounded-2 fs-14 me-4">
            <label
              className="d-flex align-items-center ps-10 bg-white rounded-2 mb-0 border-0 fs-14 text-color-labels"
              htmlFor="inputGroupPkoStatus"
            >
              PKO Status
            </label>
            <select
              className="form-select border-color-labels border-0 fs-14 fw-600 ps-10 pe-40 text-secondary"
              id="inputGroupPkoStatus"
              value={selectedStatus}
              onChange={(event) => setSelectedStatus(event.target.value)}
            >
              <option value="All PKOs">All PKOs</option>
              <option value="Active">Active</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
          <h3 className="fs-18 fw-600 text-nowrap mb-0">
            {selectedStatus === "All PKOs"
              ? tablepkoData?.length
              : selectedStatus === "Active"
                ? tablepkoData?.filter((item) => {
                    return item?.status === "Active";
                  })?.length
                : tablepkoData?.filter((item) => {
                    return item?.status === "Closed";
                  })?.length}{" "}
            {selectedStatus === "All PKOs"
              ? "Total PKOs"
              : selectedStatus === "Active"
                ? "Active PKOs"
                : "Closed PKOs"}
          </h3>
        </div>
        <div
          className={`${selectedPKOIds?.length < 1 ? "d-flex align-items-center d-none" : "d-flex align-items-center"}`}
        >
          <h3 className="fs-18 fw-600 text-nowrap mb-0 me-3">
            {selectedPKOIds?.length} PKOs Selected
          </h3>
          <button
            className="send-reminder-btn btn btn-outline-secondary py-6 ps-40 pe-3 fs-14 fw-600 rounded-1 d-flex"
            data-bs-toggle="modal"
            data-bs-target="#sendReminderModal"
            onClick={handleOpenReminderPopUp}
          >
            Send Reminder
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="table-container-pko-tbl-admin mt-3 table-responsive mainScrollable-table">
        <table className="table table-bordered table-striped fs-14">
          <thead>
            <tr>
              <th className="h-48 align-middle text-center text-nowrap">
                <input
                  className="form-check-input mt-0"
                  type="checkbox"
                  checked={
                    tablepkoData?.map((item) => item?.["pko_id"])?.length ===
                    selectedPKOIds?.length
                  }
                  aria-label="Checkbox for selection"
                  onChange={handleSelectAllPKO}
                />
              </th>
              <th className="h-48 align-middle text-nowrap">PKO Project ID</th>
              <th className="h-48 align-middle text-nowrap">
                <div className="d-flex justify-content-between align-items-center">
                  Supplier{" "}
                  <img
                    className="cursor-pointer"
                    src={filterIcon}
                    onClick={handleSortSupplier}
                  />
                </div>
              </th>
              <th className="h-48 align-middle text-nowrap">
                <div className="d-flex justify-content-between align-items-center">
                  Due Date{" "}
                  <img
                    className="cursor-pointer"
                    src={filterIcon}
                    onClick={handleSortDate}
                  />
                </div>
              </th>
              <th className="h-48 align-middle text-nowrap">
                SKU Forms submitted
              </th>
              <th className="h-48 align-middle text-nowrap">
                SKU Forms Approved
              </th>
              <th className="h-48 align-middle text-nowrap">PKO Status</th>
              <th className="h-48 align-middle text-nowrap"></th>
            </tr>
          </thead>
          <tbody>
            {(selectedStatus === "All PKOs"
              ? filterTablepkoData
              : selectedStatus === "Active"
                ? filterTablepkoData?.filter((item) => {
                    return item?.status === "Active";
                  })
                : filterTablepkoData?.filter((item) => {
                    return item?.status === "Closed";
                  })
            )?.map((pkoItemIncoming, index) => {
              return (
                <TablepkoPage
                  key={index + 1}
                  pkoItemIncoming={pkoItemIncoming}
                  selectedPKOIds={selectedPKOIds}
                  setSelectedPKOIds={setSelectedPKOIds}
                />
              );
            })}
          </tbody>
        </table>
      </div>
      <SendReminderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedPKOIds={selectedPKOIds}
        text={text}
        handleChange={handleChange}
        handleSubmitReminder={handleSubmitReminder}
        wordCount={wordCount}
        setText={setText}
      />
    </>
  );
};

export default DashboardPKOStatusAndTable;
