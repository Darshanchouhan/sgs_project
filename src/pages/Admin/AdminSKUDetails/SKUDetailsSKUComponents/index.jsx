const SKUDetailsSKUComponents = () => {
    return (
        <div className="col-12 col-md-7">
            <div
                className="card bg-white border border-color-light-border rounded-3 p-4 h-100"
                style={{ maxHeight: "400px", overflowY: "auto" }}
            >
                <div className="d-flex justify-content-between align-items-center">
                    <h6 className="fs-22 fw-600 text-color-typo-primary mb-0">
                        SKU Components
                        <span className="badge text-primary bg-color-badge rounded-4 px-3 py-6 ms-2">4</span>
                    </h6>
                </div>
                <div>
                    {/* Components Table */}
                    <table className="table table-bordered fs-14 w-100 bg-transparent table-striped component-tbl mt-4">
                        <thead>
                            <tr>
                                <th scope="col">Component Type</th>
                                <th scope="col">Component Name</th>
                                <th className="text-center" scope="col"></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="text-start align-middle">
                                    Box
                                </td>
                                <td className="align-middle">
                                    Name_1108
                                </td>
                                <td className="text-center align-middle">
                                    <img
                                        src="/assets/images/forward-arrow-img.png"
                                        alt="Forward"
                                        className="ms-2"
                                        style={{
                                            cursor: "pointer",
                                            width: "40px",
                                            height: "40px",
                                        }}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td className="text-start align-middle">
                                    Bottle Body
                                </td>
                                <td className="align-middle">
                                    Name_1109
                                </td>
                                <td className="text-center align-middle">
                                    <img
                                        src="/assets/images/forward-arrow-img.png"
                                        alt="Forward"
                                        className="ms-2"
                                        style={{
                                            cursor: "pointer",
                                            width: "40px",
                                            height: "40px",
                                        }}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td className="text-start align-middle">
                                    Label Wrap
                                </td>
                                <td className="align-middle">
                                    Name_1110
                                </td>
                                <td className="text-center align-middle">
                                    <img
                                        src="/assets/images/forward-arrow-img.png"
                                        alt="Forward"
                                        className="ms-2"
                                        style={{
                                            cursor: "pointer",
                                            width: "40px",
                                            height: "40px",
                                        }}
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default SKUDetailsSKUComponents;