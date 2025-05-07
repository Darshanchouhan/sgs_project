import React, { useEffect } from "react";
import axiosInstance from "../../../../services/axiosInstance";

const SentReminderModal = () => {
  const [reminderData, setReminderData] = React.useState([]);

  const reminderAPICall = async() => {
    try{
       const response = await axiosInstance.get(`/reminders/`);
       if(response?.status === 200){
         setReminderData(response?.data);
       }
    }
    catch(err){
      console.log(err,"reminder get error");
    }
   }

  useEffect(()=>{
    reminderAPICall();
  },[window.location.pathname]);

  return (
    <div
      className="modal fade sent-reminder-modal-popup"
      id="sentReminderModal"
      tabIndex="-1"
      aria-labelledby="sentReminderModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered bg-transparent p-0">
        <div className="modal-content rounded-1">
          <div className="modal-header px-32 py-4 border-0">
            <h1
              className="modal-title fs-16 fw-600 text-color-typo-primary mb-0"
              id="sentReminderModalLabel"
            >
              Sent Reminders
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body px-32 py-0 pb-4">
            <ul className="list-unstyled m-0">
            {reminderData && reminderData?.map((item)=>{
              return(
              <li className="border-bottom pb-20 mb-20">
                <div className="d-flex align-items-center mb-10">
                  <h2 className="fs-18 fw-600 text-color-typo-primary mb-0">
                    {item?.created_date}
                  </h2>
                  <span className="mx-1 lh-8">|</span>
                  <h3 className="fs-18 fw-600 text-primary mb-0" title={item?.pko_ids}>{item?.pko_ids?.length} PKOs</h3>
                </div>
                <p className="fs-16 fw-400 text-color-typo-primary mb-0">
                  {item?.message}
                </p>
              </li>
              )
            })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SentReminderModal;
