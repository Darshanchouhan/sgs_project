import React, { useEffect, useState } from "react";
import TablepkoPage from "./TablepkoPage";
import filterIcon from "../../../../../public/assets/images/Filter_icon.svg";

const DashboardPKOStatusAndTable = (props) => {
  const {tablepkoData} = props;
  const [selectedStatus,setSelectedStatus] = useState("All PKOs");
  const [selectedPKOIds,setSelectedPKOIds] = useState([]);
  const [filterTablepkoData, setFilterTablepkoData] = useState(tablepkoData);

  useEffect(() => {
    setFilterTablepkoData(tablepkoData)
  },[tablepkoData])

  const handleSelectAllPKO = (e) => {
    const allPKOIds = tablepkoData?.map((item) => item?.['pko_id']);
    if(e.target.checked) {
      setSelectedPKOIds(allPKOIds); // Select all if not already selected
    }
    else{
      setSelectedPKOIds([]); // Deselect all if already selected
    }
  }

  const handleSortSupplier = () => {
    if (filterTablepkoData) {
      const sortedData = [...filterTablepkoData].sort((a, b) =>
        a.supplier_name.localeCompare(b.supplier_name, undefined, { sensitivity: 'base' })
      );
      setFilterTablepkoData(sortedData);
    }
  }

  const handleSortDate = () => {
    if (filterTablepkoData) {
      const sortedData = [...filterTablepkoData].sort((a, b) => {
        return new Date(a.due_date) - new Date(b.due_date)
      });
      setFilterTablepkoData(sortedData);
    }
    }
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
        <div className= {`${selectedPKOIds?.length < 1 ? "d-flex align-items-center d-none" : "d-flex align-items-center"}`}>
          <h3 className="fs-18 fw-600 text-nowrap mb-0 me-3">{selectedPKOIds?.length} PKOs Selected</h3>
          <button className="send-reminder-btn btn btn-outline-secondary py-6 ps-40 pe-3 fs-14 fw-600 rounded-1 d-flex" data-bs-toggle="modal" data-bs-target="#sendReminderModal">Send Reminder</button>
        </div>
      </div>

      {/* Table Section */}
      <div className="table-container-pko-tbl-admin mt-3 table-responsive">
        <table className="table table-bordered table-striped fs-14">
          <thead>
            <tr>
              <th className="h-48 align-middle text-center">
                <input className="form-check-input mt-0" type="checkbox" checked={tablepkoData?.map((item) => item?.['pko_id'])?.length === selectedPKOIds?.length} aria-label="Checkbox for selection" onChange={handleSelectAllPKO}/>
              </th>
              <th className="h-48 align-middle">PKO Project ID</th>
              <th className="h-48 align-middle">Supplier <img className="cursor-pointer" src={filterIcon} onClick={handleSortSupplier}/></th>
              <th className="h-48 align-middle">Due Date <img className="cursor-pointer" src={filterIcon} onClick={handleSortDate}/></th>
              <th className="h-48 align-middle">SKU Forms submitted</th>
              <th className="h-48 align-middle">SKU Forms Approved</th>
              <th className="h-48 align-middle">PKO Status</th>
              <th className="h-48 align-middle"></th>
            </tr>
          </thead>
          <tbody>
          {(selectedStatus === "All PKOs" ? filterTablepkoData : selectedStatus === "Active" ? filterTablepkoData?.filter((item)=>{return item?.status === "Active"}) : filterTablepkoData?.filter((item)=>{return item?.status === "Closed"}))?.map((pkoItemIncoming, index) => {
                return (
                  <TablepkoPage
                    key={index + 1}
                    pkoItemIncoming={pkoItemIncoming}
                  />
                );
              })}
          </tbody>
        </table>
      </div>
     {/* Send Reminder modal popup */}
       <div
        className="modal fade send-reminder-modal-popup"
        id="sendReminderModal"
        tabIndex="-1"
        aria-labelledby="sendReminderModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered bg-transparent p-0">
          <div className="modal-content rounded-1">
            <div className="modal-header px-32 pt-4 pb-20 border-0">
              <h1
                className="modal-title fs-16 fw-600 text-color-typo-primary mb-0"
                id="sendReminderModalLabel"
              >
                Send Reminder
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body px-32 py-0">
              <h2 className="fs-16 fw-600 text-primary mb-3">{selectedPKOIds?.length} PKOs selected</h2>
              <label for="reminderMessageTextarea" className="fs-14 fw-400 text-color-typo-primary">Your Message</label>
              <div className="form-floating">
                <textarea className="form-control px-12 py-2" placeholder="Leave a comment here" id="reminderMessageTextarea" defaultValue="The PKO submission deadline is approaching! Please ensure you submit your forms before the closing date to have your input counted. Thank you!" style={{ height: '130px'}}></textarea>
              </div>
            </div>
            <div className="modal-footer d-flex align-items-center justify-content-end flex-nowrap px-32 py-4 border-0">
              <button
                type="button"
                className="btn btn-outline-primary fs-14 fw-600 px-4 py-10 rounded-1 me-3"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button className="btn btn-primary fs-14 fw-600 px-4 py-10 rounded-1">
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </>)
}

export default DashboardPKOStatusAndTable;
