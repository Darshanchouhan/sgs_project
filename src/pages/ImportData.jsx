import React from "react";
import "./../styles/style.css";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Popover from './CustomPopover';

const Importdata = ({ 
    title, 
    chooseComponentDrop, 
    openModal, 
    infoTxt,
    popoverTitle,
    popoverConfirmTxt,
    popoverInfoIcon 
}) => {

    return (
        <div className="modal fade import-data-modal-popup" id={openModal} tabIndex="-1" aria-labelledby="importDataModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered bg-transparent p-0">
                <div className="modal-content rounded-1 bg-color-light-gray-shade">
                    <div className="modal-header px-20 ps-35 pt-20 pb-3 border-bottom border-primary">
                        <h1 className="modal-title fs-16 fw-600 text-color-typo-primary" id="importDataModalLabel">{title}</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body px-35 py-40">
                        <div className="pb-32 border-bottom border-color-list-item">
                            <h2 className="fs-14 fw-400 text-color-typo-primary mb-12">Import SKU Data from</h2>
                            <div className="d-flex align-items-center">
                                <label className="d-flex align-items-center fs-14 fw-400 text-color-typo-primary me-32 mb-0"><input type="radio" className="me-2 " name="sku-data" value="From same PKO" />From same PKO</label>
                                <label className="d-flex align-items-center fs-14 fw-400 text-color-typo-primary me-32 mb-0"><input type="radio" className="me-2 " name="sku-data" value="From other PKO" />From other PKO</label>
                            </div>
                        </div>
                        <form className="py-4">
                            <div className="form-group mb-28">
                                <label className="fs-14 fw-400 text-color-typo-primary">PKO ID</label>
                                <div className="input-group align-items-center select-arrow-pos">
                                    <select className="w-100" tabIndex="0">
                                        <option value="">Select</option>
                                        <option value="MN-2912">MN-2912</option>
                                        <option value="MN-2980">MN-2980</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-group mb-28">
                                <label className="fs-14 fw-400 text-color-typo-primary">Choose SKU</label>
                                <div className="input-group align-items-center select-arrow-pos">
                                    <select className="w-100" tabIndex="0">
                                        <option value="">Select</option>
                                        <option value="SKU 1">SKU 1</option>
                                        <option value="SKU 2">SKU 2</option>
                                    </select>
                                </div>
                            </div>
                            {chooseComponentDrop && (
                                <div className="form-group mb-28">
                                    <label className="fs-14 fw-400 text-color-typo-primary">Choose Component</label>
                                    <div className="input-group align-items-center select-arrow-pos">
                                        <select className="w-100" tabIndex="0">
                                            <option value="">Select a component</option>
                                            <option value="SKU 1">Component 1</option>
                                            <option value="SKU 2">Component 2</option>
                                        </select>
                                    </div>
                                </div>
                            )}
                        </form>
                    </div>
                    <div className="modal-footer d-flex align-items-center justify-content-between flex-nowrap bg-white px-4 py-6">
                        <div className="d-flex align-items-center">
                            <InfoOutlinedIcon
                                className="info-icon ms-0 me-6"
                            />
                            <p className="fs-12 fw-600 text-color-list-item mb-0">{infoTxt}</p>
                        </div>
                        <div className="d-flex align-items-center">
                            <button type="button" className="btn btn-outline-primary fs-14 fw-600 px-4 py-12 rounded-1 me-12" data-bs-dismiss="modal">Cancel</button>
                            <Popover
                              title={popoverTitle}
                              confirmTxt={popoverConfirmTxt}
                              icon={popoverInfoIcon}
                            >
                                <button className="btn btn-primary fs-14 fw-600 px-4 py-12 rounded-1">Import</button>
                            </Popover>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Importdata;
