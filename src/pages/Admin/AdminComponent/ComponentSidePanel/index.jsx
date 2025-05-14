const ComponentSidePanel = () => {
  return (
    <div className="col-12 col-md-3">
      <div className="componentInfo-block py-4 bg-white rounded-3 position-sticky top-0">
        <p className="fs-14 fw-600 cursor-pointer px-3 mb-4 text-danger">
          Component Information
        </p>
        <p className="fs-14 fw-600 cursor-pointer px-3 mb-4 text-color-labels">
          Material Information
        </p>
      </div>
    </div>
  );
};

export default ComponentSidePanel;
