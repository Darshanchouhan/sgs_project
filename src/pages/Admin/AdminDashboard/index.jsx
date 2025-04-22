import React, {useState,useEffect} from "react";
import "../../../styles/style.scss";
import Header from "../../../components/Header";
import SidebarDashboard from "./DashboardSidebar";
import DashboardSidebar from "./DashboardHeader";
import DashboardPKOSummary from "./DashboardPKOSummary";
import DashboardSKUSummary from "./DashboardSKUSummary";
import DashboardPKOStatusAndTable from "./DashboardPKOStatusAndTable"
import axiosInstance from "../../../services/axiosInstance";

const AdminDashboard = () => { 
  const [dasboardAPIData, setDasboardAPIData] = useState();
  const [loading, setLoading] = useState(true);

  const dasboardAPICall = async() => {
    setLoading(true);
      try {
        const response = await axiosInstance.get("pko-dashboard/");
        const data = response.data;

        setDasboardAPIData(data); // Process the fetched data
        setLoading(false);
      } catch (error) {
        console.error("Error fetching questionnaire data:", error);
      } finally {
        setLoading(false);
      }
   }

  useEffect(()=>{
    dasboardAPICall();
  },[])
  return (
    <div>
      {/* Navbar */}
      <Header></Header>
      {loading && (
        <div className="loader">
          <div className="loaderOverlay d-flex align-items-center justify-content-center bg-secondary rounded-4">
            <img
              src="/assets/images/loading_gif.gif"
              alt="Loading..."
              width="120px"
              height="120px"
            />
          </div>
        </div>
      )}
      <div className="d-flex">
        <SidebarDashboard/>
        
        <div className="w-100 h-100">
          {/* Page Header */}
          <DashboardSidebar/>

          {/* Main Section */}
          <div className="container-fluid px-20 px-md-4 pt-30 container-height d-flex flex-column">
            <div className="row">
              {/* PKO Summary */}
              <DashboardPKOSummary pkoIncomingData={dasboardAPIData?.pko_summary}/>

              {/* SKU Summary */}
              <DashboardSKUSummary skuIncomingData={dasboardAPIData?.sku_summary}/>
            </div>

            {/* SKO Status & Table Section */}
            <DashboardPKOStatusAndTable tablepkoData={dasboardAPIData?.pko_details}/>
          </div>
        </div>
      </div>

      {/* Send Reminder modal popup */}
      <div
        className="modal fade send-reminder-modal-popup"
        id="sendReminderModal"
        tabIndex="-1"
        aria-labelledby="sendReminderModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered bg-transparent p-0">
          <div className="modal-content rounded-1">
            <div className="modal-header px-32 pt-4 pb-20 border-0">
              <h1
                className="modal-title fs-16 fw-600 text-color-typo-primary mb-0"
                id="sendReminderModalLabel"
              >
                Send Reminder
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body px-32 py-0">
              <h2 className="fs-16 fw-600 text-primary mb-3">3 PKOs selected</h2>
              <label for="reminderMessageTextarea" className="fs-14 fw-400 text-color-typo-primary">Your Message</label>
              <div className="form-floating">
                <textarea className="form-control px-12 py-2" placeholder="Leave a comment here" id="reminderMessageTextarea" value="The PKO submission deadline is approaching! Please ensure you submit your forms before the closing date to have your input counted. Thank you!" style={{ height: '130px'}}></textarea>
              </div>
            </div>
            <div className="modal-footer d-flex align-items-center justify-content-end flex-nowrap px-32 py-4 border-0">
              <button
                type="button"
                className="btn btn-outline-primary fs-14 fw-600 px-4 py-10 rounded-1 me-3"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button className="btn btn-primary fs-14 fw-600 px-4 py-10 rounded-1">
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
