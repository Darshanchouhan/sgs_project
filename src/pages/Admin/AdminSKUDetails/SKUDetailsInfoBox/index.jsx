const SKUDetailsInfoBox = ({ skuDataIncoming }) => {
  return (
    <div className="px-28 py-20 border border-color-disabled-lite bg-white rounded-3 mb-3">
      <div className="row">
        <div className="col-12 d-flex align-items-center">
          <div className="sku-details-box col-12">
            <div className="d-flex flex-column">
              <p className="sku-details-label">Description</p>
              <h6 className="sku-details-value long-description">
                {skuDataIncoming?.description}
              </h6>
            </div>
            <div className="d-flex flex-column">
              <p className="sku-details-label">SKU ID</p>
              <h6 className="sku-details-value ">{skuDataIncoming?.sku_id}</h6>
            </div>
            <div className="d-flex flex-column">
              <p className="sku-details-label">UPC#</p>
              <h6 className="sku-details-value ">{skuDataIncoming?.upc}</h6>
            </div>
            <div className="d-flex flex-column">
              <p className="sku-details-label">Business Unit</p>
              <h6 className="sku-details-value ">
                {skuDataIncoming?.businessunit
                  ? skuDataIncoming?.businessunit
                  : "N/A"}
              </h6>
            </div>
            <div className="d-flex flex-column">
              <p className="sku-details-label">Category</p>
              <h6 className="sku-details-value ">
                {skuDataIncoming?.category}
              </h6>
            </div>
            <div className="d-flex flex-column">
              <p className="sku-details-label">Subcategory</p>
              <h6 className="sku-details-value ">
                {skuDataIncoming?.subcategory}
              </h6>
            </div>
            <div className="d-flex flex-column">
              <p className="sku-details-label">Brand</p>
              <h6 className="sku-details-value ">{skuDataIncoming?.brand}</h6>
            </div>
            <div className="d-flex flex-column">
              <p className="sku-details-label">Segment</p>
              <h6 className="sku-details-value ">
                {skuDataIncoming?.segment ? skuDataIncoming?.segment : "N/A"}
              </h6>
            </div>
            <div className="d-flex flex-column">
              <p className="sku-details-label">Size</p>
              <h6 className="sku-details-value ">{skuDataIncoming?.size}</h6>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SKUDetailsInfoBox;
