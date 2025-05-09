import { useState } from "react";
import PKODetailsSKUTableRow from "./PKODetailsSKUTableRow";

const PKODetailsSKUStatusAndTable = ({skuDataIncoming}) => {
  const [selectedSkuStatus, setSelectedSkuStatus] = useState("All SKUs");

  return (
    <>
      <div className="d-flex align-items-center justify-content-between mt-30">
        <div className="d-flex align-items-center">
          <div className="input-group border border-secondary rounded-2 fs-14 me-4">
            <label
              className="d-flex align-items-center ps-10 bg-white rounded-2 mb-0 border-0 fs-14 text-color-labels"
              htmlFor="inputGroupSkuStatus"
            >
              SKU Status
            </label>
            <select
              className="form-select border-color-labels border-0 fs-14 fw-600 ps-10 pe-40 text-secondary"
              id="inputGroupSkuStatus"
              value={selectedSkuStatus}
              onChange={(e) => setSelectedSkuStatus(e.target.value)}
            >
              <option value="All SKUs">All SKUs</option>
              <option value="Completed">Approved</option>
              <option value="Not Started">Not Started</option>
              <option value="Draft">Draft</option>
              <option value="In Review">In Review</option>
            </select>
          </div>
          <h3 className="fs-18 fw-600 text-nowrap mb-0">{skuDataIncoming && (selectedSkuStatus === "All SKUs" ? skuDataIncoming : skuDataIncoming?.filter((item)=>item?.status === selectedSkuStatus))?.length} Total SKUs</h3>
        </div>
      </div>

      {/* Table Section */}
      <div className="table-container-skus-tbl-admin mt-3 table-responsive mainScrollable-table">
        <table className="table table-bordered table-striped fs-14">
          <thead>
            <tr>
              <th className="h-48 align-middle w-150">SKU ID</th>
              <th className="h-48 align-middle">Description</th>
              <th className="h-48 align-middle">Form Completion %</th>
              <th className="h-48 align-middle">Status</th>
              <th className="h-48 align-middle"></th>
            </tr>
          </thead>
          <tbody>
          {skuDataIncoming && (selectedSkuStatus === "All SKUs" ? skuDataIncoming : skuDataIncoming?.filter((item)=>item?.status === selectedSkuStatus))?.map((skuRowData, index) => {
            return(
             <PKODetailsSKUTableRow key={index+1} skuRowData={skuRowData}/>
            )})}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default PKODetailsSKUStatusAndTable;
