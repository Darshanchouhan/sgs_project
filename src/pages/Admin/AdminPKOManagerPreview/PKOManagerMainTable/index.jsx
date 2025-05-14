const PKOManagerMainTable = () => {
  return (
    <>
      <div>
        <div className="d-flex align-items-center">
          <span className="badge fs-14 rounded-4 px-18 py-2 me-3 cursor-pointer text-secondary bg-color-badge fw-600 active">
            PKOs 6
          </span>
          <span className="badge fs-14 fw-400 text-color-close-icon-box bg-color-light-border rounded-4 px-18 py-2 me-3 cursor-pointer">
            Vendors 6
          </span>
          <span className="badge fs-14 fw-400 text-color-close-icon-box bg-color-light-border rounded-4 px-18 py-2 me-3 cursor-pointer">
            SKUs 30
          </span>
          <span className="badge fs-14 fw-400 text-color-close-icon-box bg-color-light-border rounded-4 px-18 py-2 me-3 cursor-pointer">
            PKO Mapping 30
          </span>
        </div>
        <div className="my-4 table-responsive pkoManagerMainTable-holder">
          <table className="table table-bordered table-striped fs-14 fw-400 text-color-typo-primary mb-0">
            <thead className="sticky-top">
              <tr>
                <th scope="col" className="p-12 fw-600 bg-color-light-shade">
                  PKO Project ID
                </th>
                <th scope="col" className="p-12 fw-600 bg-color-light-shade">
                  Packaging info. due to Marks
                </th>
                <th scope="col" className="p-12 fw-600 bg-color-light-shade">
                  Business Unit
                </th>
                <th scope="col" className="p-12 fw-600 bg-color-light-shade">
                  Category
                </th>
                <th scope="col" className="p-12 fw-600 bg-color-light-shade">
                  Sub-category
                </th>
                <th scope="col" className="p-12 fw-600 bg-color-light-shade">
                  Segment
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-12">PRJ1131</td>
                <td className="p-12">25/2/2025</td>
                <td className="p-12">Healthcare</td>
                <td className="p-12">Personal Cleansing</td>
                <td className="p-12">Bath</td>
                <td className="p-12">Bath Additives</td>
              </tr>
              <tr>
                <td className="p-12">PRJ1131</td>
                <td className="p-12">25/2/2025</td>
                <td className="p-12">Healthcare</td>
                <td className="p-12">Personal Cleansing</td>
                <td className="p-12">Bath</td>
                <td className="p-12">Bath Additives</td>
              </tr>
              <tr>
                <td className="p-12">PRJ1131</td>
                <td className="p-12">25/2/2025</td>
                <td className="p-12">Healthcare</td>
                <td className="p-12">Personal Cleansing</td>
                <td className="p-12">Bath</td>
                <td className="p-12">Bath Additives</td>
              </tr>
              <tr>
                <td className="p-12">PRJ1131</td>
                <td className="p-12">25/2/2025</td>
                <td className="p-12">Healthcare</td>
                <td className="p-12">Personal Cleansing</td>
                <td className="p-12">Bath</td>
                <td className="p-12">Bath Additives</td>
              </tr>
              <tr>
                <td className="p-12">PRJ1131</td>
                <td className="p-12">25/2/2025</td>
                <td className="p-12">Healthcare</td>
                <td className="p-12">Personal Cleansing</td>
                <td className="p-12">Bath</td>
                <td className="p-12">Bath Additives</td>
              </tr>
              <tr>
                <td className="p-12">PRJ1131</td>
                <td className="p-12">25/2/2025</td>
                <td className="p-12">Healthcare</td>
                <td className="p-12">Personal Cleansing</td>
                <td className="p-12">Bath</td>
                <td className="p-12">Bath Additives</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default PKOManagerMainTable;
