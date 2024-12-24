// ModalLoad.js
import React, { useEffect } from 'react';

const ModalLoad = () => {
    useEffect(() => {
        // Ensure that window.bootstrap is defined
        if (window.bootstrap) {
            const modalElement = document.getElementById('onloadModal');
            const modal = new window.bootstrap.Modal(modalElement);
            modal.show();
        } else {
            console.error("Bootstrap is not loaded properly.");
        }
    }, []);

    return (
        <div className="modal fade" id="onloadModal" tabIndex="-1" role="dialog" aria-labelledby="onloadModalLabel" aria-hidden="true">
            <div className="modal-dialog" role="document" style={{ maxWidth: '80%' }}>
                <div className="modal-content">
                    <div className="modal-header pt-5 justify-content-end border-0 pb-40 px-40">
                        <button type="button" className="btn btn-primary fs-14 fw-600 px-18 d-flex align-items-center">Continue to your dashboard <img src="/assets/images/arrow-right-forward.svg" alt="arrow-right" /></button>
                    </div>
                    <div className="modal-body border-0 pt-40 ps-60 pb-5 pe-154">
                        <h1 className="fs-32 fw-600 text-secondary mb-12">Sustainable Packaging Platform</h1>
                        <p className="fw-600 text-color-labels">Packaging data collection enables the CVS Our brands to submit packaging related data accurately with automated validation checks during the process of data submission, and expert based validation post submission</p>
                        <div className="d-flex align-items-start justify-content-between my-70 gap-5 text-center">
                            <div className="d-flex flex-column">
                                <img src="/assets/images/package.svg" height="88px" alt="package" />
                                <p className="fs-14 text-color-modal-text pt-20">To establish a packaging baseline for all CVS Our Brands products</p>
                            </div>
                            <div className="d-flex flex-column">
                                <img src="/assets/images/inform-brand-package.svg" height="88px" alt="package" />
                                <p className="fs-14 text-color-modal-text pt-20">Inform an Our Brands packaging strategy (focused on EPR cost mitigation) and target setting.</p>
                            </div>
                            <div className="d-flex flex-column">
                                <img src="/assets/images/accurate-reporting.svg" height="88px" alt="package" />
                                <p className="fs-14 text-color-modal-text pt-20">To enable accurate reporting for compliance with plastics and packaging regulations.</p>
                            </div>
                        </div>
                        <h2 className="fs-22 fw-600 text-color-typo-primary mb-30">What will CVS product vendors have to do?</h2>
                        <p className="fs-14 text-color-typo-primary">The CVS Our brands will have to complete filling up of forms for sharing information related to packaging for a list of pre-identified product SKUs and submit all forms for review before the last date of submission.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalLoad;