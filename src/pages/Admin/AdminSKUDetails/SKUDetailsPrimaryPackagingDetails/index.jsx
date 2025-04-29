import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const SKUDetailsPrimaryPackagingDetails = () => {
    return (
        <div className="col-12 col-md-5">
            <div
                className="card bg-white border border-color-light-border rounded-3 p-4 h-100 small-arrow"
                style={{ maxHeight: "400px", overflowY: "auto" }}
            >
                <div className="d-flex align-items-center justify-content-between">
                    <h6 className="fs-22 fw-600 text-color-typo-primary">
                        Primary Packaging Details
                    </h6>
                </div>
                <p className="fs-14 text-color-labels mb-30">
                    Primary packaging details of this SKU
                </p>

                <div className="row">
                    <div className="col-12 col-12 mb-3">
                        <label className="fs-14 text-color-typo-primary mb-2 d-block">Unique package system description
                            <span> *</span>
                        </label>
                        <div className="d-flex align-items-center gap-2">
                            <input type="text" className="form-control fs-14 px-12 border border-color-typo-secondary rounded-2 h-44" placeholder="Please explain" tabIndex="0" value="PET bottle is of lightweight and recyclable material" readOnly />
                        </div>
                    </div>
                    <div className="col-12 col-md-6 mb-3">
                        <div className="d-flex align-items-center gap-2">
                            <span className="fs-14 text-color-typo-primary">Package Dimensions</span>
                            <div>
                                <InfoOutlinedIcon
                                    className="info-icon"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-md-6 mb-3">
                        <div className="d-flex align-items-center gap-2">
                            <span className="fs-14 text-color-typo-primary">Package Weight</span>
                            <div>
                                <InfoOutlinedIcon
                                    className="info-icon"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-md-6 mb-3">
                        <label className="fs-14 text-color-typo-primary mb-2 d-block">
                            Height
                            <span> *</span>
                        </label>
                        <div className="d-flex align-items-center gap-2">
                            <div className="d-flex align-items-center border border-color-typo-secondary rounded-2 ">
                                {/* Input Field */}
                                <input
                                    type="number"
                                    step="any"
                                    className="form-control border-0 rounded-2 px-2"
                                    placeholder="Enter a value"
                                    style={{ flex: 2 }}
                                    value="123"
                                    readOnly
                                />

                                {/* Unit Dropdown */}
                                <select
                                    className="form-select background-position border-0 bg-color-light-shade text-color-typo-primary px-12 w-72 fw-400"
                                    value=""
                                    readOnly
                                    disabled
                                >
                                    <option value="inch">
                                        inch
                                    </option>
                                    <option value="cm">
                                        cm
                                    </option>
                                    <option value="mm">
                                        mm
                                    </option>
                                </select>
                            </div>
                            <InfoOutlinedIcon
                                className="info-icon"
                            />
                        </div>
                    </div>
                    <div className="col-12 col-md-6 mb-3">
                        <label className="fs-14 text-color-typo-primary mb-2 d-block">
                            Width
                            <span> *</span>
                        </label>
                        <div className="d-flex align-items-center gap-2">
                            <div className="d-flex align-items-center border border-color-typo-secondary rounded-2 ">
                                {/* Input Field */}
                                <input
                                    type="number"
                                    step="any"
                                    className="form-control border-0 rounded-2 px-2"
                                    placeholder="Enter a value"
                                    style={{ flex: 2 }}
                                    value="123"
                                    readOnly
                                />

                                {/* Unit Dropdown */}
                                <select
                                    className="form-select background-position border-0 bg-color-light-shade text-color-typo-primary px-12 w-72 fw-400"
                                    value=""
                                    readOnly
                                    disabled
                                >
                                    <option value="inch">
                                        inch
                                    </option>
                                    <option value="cm">
                                        cm
                                    </option>
                                    <option value="mm">
                                        mm
                                    </option>
                                </select>
                            </div>
                            <InfoOutlinedIcon
                                className="info-icon"
                            />
                        </div>
                    </div>
                    <div className="col-12 col-12 mb-3">
                        <label className="fs-14 text-color-typo-primary mb-2 d-block">Additional comments</label>
                        <div className="d-flex align-items-center gap-2">
                            <input type="text" className="form-control fs-14 px-12 border border-color-typo-secondary rounded-2 h-44" placeholder="Please explain" tabIndex="0" value="Lorem Ipsum" readOnly />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SKUDetailsPrimaryPackagingDetails;