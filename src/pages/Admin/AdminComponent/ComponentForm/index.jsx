import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const ComponentForm = () => {
    return (
        <div className="col-12 col-md-9">
            <div className="form-section mt-4">
                <h6 className="text-color-typo-secondary fw-600 form-heading d-flex align-items-center text-nowrap mb-3">
                    Component Information
                </h6>
                <div className="form-fields d-block">
                    <div className="row">
                        <div className="col-12 col-md-6">
                            <div className="form-group mt-4">
                                <div className="d-flex justify-content-between align-items-center mb-2 h-26">
                                    <label className="mb-0">Packaging component function <span className="text-secondary">*</span></label>
                                    <span className="ms-2">
                                        <div>
                                            <InfoOutlinedIcon className="info-icon" />
                                        </div>
                                    </span>
                                </div>
                                <div className="input-group align-items-center">
                                    <input maxLength="100" className="h-42 w-100 " type="text" placeholder="Please explain" tabIndex="0" value="Paperboard box to contain product" readOnly />
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-6">
                            <div className="form-group mt-4">
                                <div className="d-flex justify-content-between align-items-center mb-2 h-26">
                                    <label className="mb-0">Packaging component <span className="text-secondary">*</span></label>
                                    <span className="ms-2">
                                        <div>
                                            <InfoOutlinedIcon className="info-icon" />
                                        </div>
                                    </span>
                                </div>
                                <div className="input-group align-items-center select-arrow-pos">
                                    <select
                                        className="w-100 bg-white"
                                        tabIndex="0"
                                        readOnly
                                        disabled
                                    >
                                        <option value="Bag">Box</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-6">
                            <div className="form-group mt-4">
                                <div className="d-flex justify-content-between align-items-center mb-2 h-26">
                                    <label className="mb-0">Packaging component function <span className="text-secondary">*</span></label>
                                    <span className="ms-2">
                                        <div>
                                            <InfoOutlinedIcon className="info-icon" />
                                        </div>
                                    </span>
                                </div>
                                <div className="input-group align-items-center">
                                    <input maxLength="100" className="h-42 w-100 " type="text" placeholder="Please explain" tabIndex="0" value="Paperboard box to contain product" readOnly />
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-6">
                            <div className="form-group mt-4">
                                <div className="d-flex justify-content-between align-items-center mb-2 h-26">
                                    <label className="mb-0">Packaging component <span className="text-secondary">*</span></label>
                                    <span className="ms-2">
                                        <div>
                                            <InfoOutlinedIcon className="info-icon" />
                                        </div>
                                    </span>
                                </div>
                                <div className="input-group align-items-center select-arrow-pos">
                                    <select
                                        className="w-100 bg-white"
                                        tabIndex="0"
                                        readOnly
                                        disabled
                                    >
                                        <option value="Bag">Box</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-6">
                            <div className="form-group mt-4">
                                <div className="d-flex justify-content-between align-items-center mb-2 h-26">
                                    <label className="mb-0">Length <span className="text-secondary">*</span></label>
                                    <span className="ms-2">
                                        <div>
                                            <InfoOutlinedIcon className="info-icon" />
                                        </div>
                                    </span>
                                </div>
                                <div className="input-group align-items-center">
                                    <input className="h-42 w-75" type="text" placeholder="Enter a value" tabIndex="0" value="2.0" readOnly />
                                    <select className="bg-color-light-shade form-list w-25" tabIndex="0" readOnly disabled>
                                        <option value="lbs">lbs</option>
                                        <option value="oz">oz</option>
                                        <option value="g">g</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-6">
                            <div className="form-group mt-4">
                                <div className="d-flex justify-content-between align-items-center mb-2 h-26">
                                    <label className="mb-0">Length <span className="text-secondary">*</span></label>
                                    <span className="ms-2">
                                        <div>
                                            <InfoOutlinedIcon className="info-icon" />
                                        </div>
                                    </span>
                                </div>
                                <div className="input-group align-items-center">
                                    <input className="h-42 w-75" type="text" placeholder="Enter a value" tabIndex="0" value="2.0" readOnly />
                                    <select className="bg-color-light-shade form-list w-25" tabIndex="0" readOnly disabled>
                                        <option value="lbs">lbs</option>
                                        <option value="oz">oz</option>
                                        <option value="g">g</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-6">
                            <div className="form-group mt-4">
                                <div className="d-flex justify-content-between align-items-center mb-2 h-26">
                                    <label className="mb-0 ">What type of closure is used in the packaging? <span className="text-secondary">*</span></label>
                                    <span className="ms-2">
                                        <div>
                                            <InfoOutlinedIcon className="info-icon" />
                                        </div>
                                    </span>
                                </div>
                                <div className="align-items-center me-2">
                                    <label className="me-3">
                                        <input type="radio" className="me-2" name="01" value="Yes" checked />Yes
                                    </label>
                                    <label className="me-3">
                                        <input type="radio" className="me-2" name="01" value="No" />No
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ComponentForm;