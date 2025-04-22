import React, {useState} from 'react';
import TablepkoPage from "./TablepkoPage"

const DashboardPKOStatusAndTable = (props) => {
  const {tablepkoData} = props;
  const [selectedStatus,setSelectedStatus] = useState("All PKOs");

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
              onChange={(event)=>setSelectedStatus(event.target.value)}
            >
              <option value="All PKOs">All PKOs</option>
              <option value="Active">Active</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
          <h3 className="fs-18 fw-600 text-nowrap mb-0">{selectedStatus === "All PKOs" ? tablepkoData?.length : selectedStatus === "Active" ? tablepkoData?.filter((item)=>{return item?.status === "Active"})?.length : tablepkoData?.filter((item)=>{return item?.status === "Closed"})?.length} {selectedStatus === "All PKOs" ? "Total PKOs" : selectedStatus === "Active" ? "Active PKOs" : "Closed PKOs"}</h3>
        </div>
        <div className="d-flex align-items-center d-none">
          <h3 className="fs-18 fw-600 text-nowrap mb-0 me-3">3 PKOs Selected</h3>
          <button className="send-reminder-btn btn btn-outline-secondary py-6 ps-40 pe-3 fs-14 fw-600 rounded-1 d-flex" data-bs-toggle="modal" data-bs-target="#sendReminderModal">Send Reminder</button>
        </div>
      </div>

      {/* Table Section */}
      <div className="table-container-pko-tbl-admin mt-3 table-responsive">
        <table className="table table-bordered table-striped fs-14">
          <thead>
            <tr>
              <th className="h-48 align-middle text-center">
                <input className="form-check-input mt-0" type="checkbox" value="" aria-label="Checkbox for selection" />
              </th>
              <th className="h-48 align-middle">PKO Project ID</th>
              <th className="h-48 align-middle">Supplier</th>
              <th className="h-48 align-middle">Due Date</th>
              <th className="h-48 align-middle">SKU Forms submitted</th>
              <th className="h-48 align-middle">SKU Forms Approved</th>
              <th className="h-48 align-middle">PKO Status</th>
              <th className="h-48 align-middle"></th>
            </tr>
          </thead>
          <tbody>
          {(selectedStatus === "All PKOs" ? tablepkoData : selectedStatus === "Active" ? tablepkoData?.filter((item)=>{return item?.status === "Active"}) : tablepkoData?.filter((item)=>{return item?.status === "Closed"}))?.sort((a, b) => {
            // Optional: Sort by PKO ID or any other property to maintain a consistent order
                    return a.pko_id.localeCompare(b.pko_id); // Sort by PKO ID (string comparison)
                  })?.map((pkoItemIncoming, index) => {
            return(
              <TablepkoPage key={index+1} pkoItemIncoming={pkoItemIncoming}/>
            )
          })}
          </tbody>
        </table>
      </div>
    </>)
}

export default DashboardPKOStatusAndTable;