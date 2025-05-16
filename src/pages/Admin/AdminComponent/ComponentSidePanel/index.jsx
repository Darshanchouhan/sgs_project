const ComponentSidePanel = ({groupingSectionName, activeSection, setActiveSection}) => {
  return (
    <div className="col-12 col-md-3">
      <div className="componentInfo-block py-4 bg-white rounded-3 position-sticky top-0">
        {groupingSectionName && groupingSectionName?.map((itemName)=>{
          return(<p onClick={()=>setActiveSection(itemName)} className={`fs-14 fw-600 cursor-pointer px-3 mb-4 ${activeSection === itemName ? "text-danger" : "text-color-labels"}`}>
          {itemName}
        </p>)})}
      </div>
    </div>
  );
};

export default ComponentSidePanel;
