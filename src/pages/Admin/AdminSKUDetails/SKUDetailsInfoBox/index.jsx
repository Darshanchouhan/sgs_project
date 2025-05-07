const SKUDetailsInfoBox = () => {
  return (
    <div className="px-28 py-20 border border-color-disabled-lite bg-white rounded-3 mb-3">
      <div className="row">
        <div className="col-12 d-flex align-items-center">
          <div className="sku-details-box col-12">
            <div className="d-flex flex-column">
              <p className="sku-details-label">Description</p>
              <h6 className="sku-details-value long-description">
                CVS Ibuprofen 200mg
              </h6>
            </div>
            <div className="d-flex flex-column">
              <p className="sku-details-label">SKU ID</p>
              <h6 className="sku-details-value ">232570</h6>
            </div>
            <div className="d-flex flex-column">
              <p className="sku-details-label">UPC#</p>
              <h6 className="sku-details-value ">5042838226</h6>
            </div>
            <div className="d-flex flex-column">
              <p className="sku-details-label">Business Unit</p>
              <h6 className="sku-details-value ">Health Care</h6>
            </div>
            <div className="d-flex flex-column">
              <p className="sku-details-label">Category</p>
              <h6 className="sku-details-value ">Pain</h6>
            </div>
            <div className="d-flex flex-column">
              <p className="sku-details-label">Subcategory</p>
              <h6 className="sku-details-value ">Ibuprofen</h6>
            </div>
            <div className="d-flex flex-column">
              <p className="sku-details-label">Brand</p>
              <h6 className="sku-details-value ">CVS Health</h6>
            </div>
            <div className="d-flex flex-column">
              <p className="sku-details-label">Segment</p>
              <h6 className="sku-details-value ">-</h6>
            </div>
            <div className="d-flex flex-column">
              <p className="sku-details-label">Size</p>
              <h6 className="sku-details-value ">5oz</h6>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SKUDetailsInfoBox;
