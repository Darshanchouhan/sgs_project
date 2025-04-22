// import React from "react";
// import "./../styles/style.css";
// import Header from "../components/Header";

// const AdminDashboardFirst = () => {

//   return (
//     <div>
//       {/* Navbar */}
//       <Header></Header>
//       <div className="d-flex">
//         <div className="sideNav bg-secondary text-white w-72 d-flex flex-column justify-content-between">
//           <ul className="list-unstyled m-0 w-100">
//             <li>
//               <button type="button" className="btn py-3 w-100 text-white rounded-0 border-top border-bottom border-color-white active">
//                 <img src="/assets/images/home-icon-sidenav.svg" alt="home-icon" />
//               </button>
//             </li>
//             <li>
//               <button type="button" className="btn py-3 w-100 text-white rounded-0 border-top border-bottom border-color-white">
//                 <img src="/assets/images/to-do-icon.svg" alt="to-do-icon" />
//               </button>
//             </li>
//             <li>
//               <button type="button" className="btn py-3 w-100 text-white rounded-0 border-top border-bottom border-color-white">
//                 <img src="/assets/images/settings-icon.svg" alt="setting-icon" />
//               </button>
//             </li>
//           </ul>
//           <ul className="list-unstyled m-0 w-100">
//             <li>
//                 <button type="button" className="btn py-3 w-100 text-white rounded-0 border-top border-bottom border-color-white" data-bs-toggle="modal" data-bs-target="#sentReminderModal">
//                   <img src="/assets/images/reminder-icon-sidenav.svg" alt="reminder-icon" />
//                 </button>
//               </li>
//               <li>
//                 <button type="button" className="btn py-3 w-100 text-white rounded-0 border-top border-bottom border-color-white">
//                   <img src="/assets/images/comment-icon-sidenav.svg" alt="comments-icon" />
//                 </button>
//               </li>
//           </ul>
//         </div>
//         <div className="w-100 h-100">
//           {/* Page Header */}
//           <div className="py-3 bg-color-light-shade">
//             <div className="container-fluid px-20 px-md-4">
//               <div className="d-flex align-items-center justify-content-between">
//                 <h2 className="fs-16 fw-400 text-color-close-icon-box mb-0">Welcome to <span className="fw-600">Smart Packaging Data</span></h2>
//                 <button type="button" className="btn p-0 fs-14 fw-600 text-secondary">
//                   <img src="/assets/images/download-icon.svg" alt="download-icon" className="me-2" />
//                   Download
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Main Section */}
//           <div className="container-fluid px-20 px-md-4 pt-30 container-height d-flex flex-column">
//             <div className="row">
//               {/* PKO Summary */}
//               <div className="col-12 col-md-6 mb-3 mb-md-0">
//                 <div className="card border-0 rounded-3 shadow-1 px-4 py-3 h-100">
//                   <div className="card-header fs-18 px-0 py-0 text-color-typo-primary fw-600 border-0 bg-transparent">PKO Summary</div>
//                   <div className="card-body pt-2 pb-0 border-0 px-0 d-flex align-items-center justify-content-between">
//                     <div className="w-30">
//                       <ul className="list-unstyled w-100 mb-0">
//                         <li className="d-flex align-items-center justify-content-between mb-3">
//                           <p className="fs-14 text-color-typo-primary mb-0">
//                             Active
//                           </p>
//                           <span className="fs-16 fw-600">
//                             8
//                           </span>
//                         </li>
//                         <li className="d-flex align-items-center justify-content-between mb-3">
//                           <p className="fs-14 text-color-typo-primary mb-0">
//                             Closed
//                           </p>
//                           <span className="fs-16 fw-600">
//                             4
//                           </span>
//                         </li>
//                         <li className="d-flex align-items-center justify-content-between mb-3 border-top pt-1">
//                           <p className="fs-14 text-color-typo-primary mb-0">
//                             Total PKOs
//                           </p>
//                           <span className="fs-16 fw-600">
//                             12
//                           </span>
//                         </li>
//                       </ul>
//                     </div>
//                     <div className="d-flex align-items-center justify-content-between w-60 h-100 gap-4">
//                       <div className="position-relative w-180 h-180">
//                         <img src="https://dummyimage.com/180x180/c2c2c2/000000&text=Donut+chart" alt="dummy-image" />
//                       </div>
//                       <ul className="list-unstyled w-100 mb-0">
//                           <li className="d-flex align-items-center justify-content-between mb-3">
//                             <div className="d-flex align-items-center gap-2">
//                               <span className="status-dot not-started"></span>
//                               <p className="fs-12 text-color-typo-primary mb-0">
//                                 Not Started
//                               </p>
//                             </div>
//                             <span className="fs-12 fw-700">
//                               4
//                             </span>
//                           </li>
//                           <li className="d-flex align-items-center justify-content-between mb-3">
//                             <div className="d-flex align-items-center gap-2">
//                               <span className="status-dot in-progress"></span>
//                               <p className="fs-12 text-color-typo-primary mb-0">
//                                 In Progress
//                               </p>
//                             </div>
//                             <span className="fs-12 fw-700">
//                               2
//                             </span>
//                           </li>
//                           <li className="d-flex align-items-center justify-content-between mb-3">
//                             <div className="d-flex align-items-center gap-2">
//                               <span className="status-dot completed"></span>
//                               <p className="fs-12 text-color-typo-primary mb-0">
//                                 Completed
//                               </p>
//                             </div>
//                             <span className="fs-12 fw-700">
//                               2
//                             </span>
//                           </li>
//                         </ul>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* SKU Summary */}
//               <div className="col-12 col-md-6 mb-3 mb-md-0">
//               <div className="card border-0 rounded-3 shadow-1 px-4 py-3 h-100">
//                   <div className="card-header fs-18 px-0 py-0 text-color-typo-primary fw-600 border-0 bg-transparent">SKU Summary</div>
//                   <div className="card-body pt-2 pb-0 border-0 px-0 d-flex align-items-center">
//                     <ul className="list-unstyled w-100 mb-0">
//                       <li className="d-flex align-items-center justify-content-between gap-4 pb-4 border-bottom mb-4">
//                         <div className="w-50 d-flex align-items-center justify-content-between">
//                           <p className="fs-16 fw-600 d-flex lh-19 mb-0"><img src="/assets/images/users-icon.svg" alt="users-icon" className="me-3" />Forms<br /> Submitted</p>
//                           <span className="fs-16 fw-700">420</span>
//                         </div>
//                         <div className="w-50 d-flex align-items-center justify-content-between">
//                           <p className="fs-16 fw-600 d-flex lh-19 mb-0"><img src="/assets/images/users-icon.svg" alt="users-icon" className="me-3" />Pending<br /> Submissions</p>
//                           <span className="fs-16 fw-700">105</span>
//                         </div>
//                       </li>
//                       <li className="d-flex align-items-center justify-content-between gap-4">
//                         <div className="w-50 d-flex align-items-center justify-content-between">
//                           <p className="fs-16 fw-600 d-flex lh-19 mb-0"><img src="/assets/images/file-document-icon.svg" alt="file-icon" className="me-3" />Forms<br /> Approved</p>
//                           <span className="fs-16 fw-700">380</span>
//                         </div>
//                         <div className="w-50 d-flex align-items-center justify-content-between">
//                           <p className="fs-16 fw-600 d-flex lh-19 mb-0"><img src="/assets/images/file-document-icon.svg" alt="file-icon" className="me-3" />Pending<br /> Approvals</p>
//                           <span className="fs-16 fw-700">40</span>
//                         </div>
//                       </li>
//                     </ul>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="d-flex align-items-center justify-content-between mt-30">
//               <div className="d-flex align-items-center">
//                 <div className="input-group border border-secondary rounded-2 fs-14 me-4">
//                   <label
//                     className="d-flex align-items-center ps-10 bg-white rounded-2 mb-0 border-0 fs-14 text-color-labels"
//                     htmlFor="inputGroupPkoStatus"
//                   >
//                     PKO Status
//                   </label>
//                   <select
//                     className="form-select border-color-labels border-0 fs-14 fw-600 ps-10 pe-40 text-secondary"
//                     id="inputGroupPkoStatus"
//                     value="All PKOs"
//                   >
//                     <option value="All PKOs">All PKOs</option>
//                     <option value="Active">Active</option>
//                   </select>
//                 </div>
//                 <h3 className="fs-18 fw-600 text-nowrap mb-0">12 Total PKOs</h3>
//               </div>
//               <div className="d-flex align-items-center d-none">
//                 <h3 className="fs-18 fw-600 text-nowrap mb-0 me-3">3 PKOs Selected</h3>
//                 <button className="send-reminder-btn btn btn-outline-secondary py-6 ps-40 pe-3 fs-14 fw-600 rounded-1 d-flex" data-bs-toggle="modal" data-bs-target="#sendReminderModal">Send Reminder</button>
//               </div>
//             </div>

//             {/* Table Section */}
//             <div className="table-container-pko-tbl-admin mt-3 table-responsive">
//               <table className="table table-bordered table-striped fs-14">
//                 <thead>
//                   <tr>
//                     <th className="h-48 align-middle text-center">
//                       <input className="form-check-input mt-0" type="checkbox" value="" aria-label="Checkbox for selection" />
//                     </th>
//                     <th className="h-48 align-middle">PKO Project ID</th>
//                     <th className="h-48 align-middle">Supplier</th>
//                     <th className="h-48 align-middle">Due Date</th>
//                     <th className="h-48 align-middle">SKU Forms submitted</th>
//                     <th className="h-48 align-middle">SKU Forms Approved</th>
//                     <th className="h-48 align-middle">PKO Status</th>
//                     <th className="h-48 align-middle"></th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   <tr>
//                     <td className="align-middle text-center">
//                       <input className="form-check-input mt-0" type="checkbox" value="" aria-label="Checkbox for selection" />
//                     </td>
//                     <td className="align-middle">PRJ1188</td>
//                     <td className="align-middle">PERRIGO COMPANY INC</td>
//                     <td className="align-middle text-end">29/3/2025</td>
//                     <td className="align-middle">
//                       <div className="d-flex align-items-center justify-content-between w-100">
//                         <div className="w-50">
//                           <div className="progress" role="progressbar" aria-label="Basic example" aria-valuenow="80" aria-valuemin="0" aria-valuemax="100">
//                             <div className="progress-bar" style={{ width: '80%', background: '#155DC9' }}></div>
//                           </div>
//                         </div>
//                         <span><span className="text-color-responce-pending">180</span> / 200</span>
//                       </div>
//                     </td>
//                     <td className="align-middle text-end">150 / 180 Approved</td>
//                     <td className="align-middle text-center">
//                       <span
//                         className="fs-14 fw-600 text-nowrap px-12 py-6 d-inline-block border rounded-pill active-pill">
//                         Active
//                       </span>
//                     </td>
//                     <td className="align-middle text-center">
//                       <button className="btn p-0 border-0 shadow-none">
//                         <img
//                           src="/assets/images/forward-arrow-img.png"
//                           alt="Forward"
//                         />
//                       </button>
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="align-middle text-center">
//                       <input className="form-check-input mt-0" type="checkbox" value="" aria-label="Checkbox for selection" />
//                     </td>
//                     <td className="align-middle">PRJ1196</td>
//                     <td className="align-middle">A.L SCHUTZMAN COMPANY</td>
//                     <td className="align-middle text-end">1/11/2025</td>
//                     <td className="align-middle">
//                       <div className="d-flex align-items-center justify-content-between w-100">
//                         <div className="w-50">
//                           <div className="progress" role="progressbar" aria-label="Basic example" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100">
//                             <div className="progress-bar" style={{ width: '100%', background: '#155DC9' }}></div>
//                           </div>
//                         </div>
//                         <span><span className="text-color-responce-pending">200</span> / 200</span>
//                       </div>
//                     </td>
//                     <td className="align-middle text-end">200 / 200 Approved</td>
//                     <td className="align-middle text-center">
//                       <span
//                         className="fs-14 fw-600 text-nowrap px-12 py-6 d-inline-block border rounded-pill closed-pill">
//                         Closed
//                       </span>
//                     </td>
//                     <td className="align-middle text-center">
//                       <button className="btn p-0 border-0 shadow-none">
//                         <img
//                           src="/assets/images/forward-arrow-img.png"
//                           alt="Forward"
//                         />
//                       </button>
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="align-middle text-center">
//                       <input className="form-check-input mt-0" type="checkbox" value="" aria-label="Checkbox for selection" />
//                     </td>
//                     <td className="align-middle">PRJ1188</td>
//                     <td className="align-middle">PERRIGO COMPANY INC</td>
//                     <td className="align-middle text-end">29/3/2025</td>
//                     <td className="align-middle">
//                       <div className="d-flex align-items-center justify-content-between w-100">
//                         <div className="w-50">
//                           <div className="progress" role="progressbar" aria-label="Basic example" aria-valuenow="80" aria-valuemin="0" aria-valuemax="100">
//                             <div className="progress-bar" style={{ width: '80%', background: '#155DC9' }}></div>
//                           </div>
//                         </div>
//                         <span><span className="text-color-responce-pending">180</span> / 200</span>
//                       </div>
//                     </td>
//                     <td className="align-middle text-end">150 / 180 Approved</td>
//                     <td className="align-middle text-center">
//                       <span
//                         className="fs-14 fw-600 text-nowrap px-12 py-6 d-inline-block border rounded-pill active-pill">
//                         Active
//                       </span>
//                     </td>
//                     <td className="align-middle text-center">
//                       <button className="btn p-0 border-0 shadow-none">
//                         <img
//                           src="/assets/images/forward-arrow-img.png"
//                           alt="Forward"
//                         />
//                       </button>
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="align-middle text-center">
//                       <input className="form-check-input mt-0" type="checkbox" value="" aria-label="Checkbox for selection" />
//                     </td>
//                     <td className="align-middle">PRJ1196</td>
//                     <td className="align-middle">A.L SCHUTZMAN COMPANY</td>
//                     <td className="align-middle text-end">1/11/2025</td>
//                     <td className="align-middle">
//                       <div className="d-flex align-items-center justify-content-between w-100">
//                         <div className="w-50">
//                           <div className="progress" role="progressbar" aria-label="Basic example" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100">
//                             <div className="progress-bar" style={{ width: '100%', background: '#155DC9' }}></div>
//                           </div>
//                         </div>
//                         <span><span className="text-color-responce-pending">200</span> / 200</span>
//                       </div>
//                     </td>
//                     <td className="align-middle text-end">200 / 200 Approved</td>
//                     <td className="align-middle text-center">
//                       <span
//                         className="fs-14 fw-600 text-nowrap px-12 py-6 d-inline-block border rounded-pill closed-pill">
//                         Closed
//                       </span>
//                     </td>
//                     <td className="align-middle text-center">
//                       <button className="btn p-0 border-0 shadow-none">
//                         <img
//                           src="/assets/images/forward-arrow-img.png"
//                           alt="Forward"
//                         />
//                       </button>
//                     </td>
//                   </tr> 
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Send Reminder modal popup */}
//       <div
//         className="modal fade send-reminder-modal-popup"
//         id="sendReminderModal"
//         tabIndex="-1"
//         aria-labelledby="sendReminderModalLabel"
//         aria-hidden="true"
//       >
//         <div className="modal-dialog modal-dialog-centered bg-transparent p-0">
//           <div className="modal-content rounded-1">
//             <div className="modal-header px-32 pt-4 pb-20 border-0">
//               <h1
//                 className="modal-title fs-16 fw-600 text-color-typo-primary mb-0"
//                 id="sendReminderModalLabel"
//               >
//                 Send Reminder
//               </h1>
//               <button
//                 type="button"
//                 className="btn-close"
//                 data-bs-dismiss="modal"
//                 aria-label="Close"
//               ></button>
//             </div>
//             <div className="modal-body px-32 py-0">
//               <h2 className="fs-16 fw-600 text-primary mb-3">3 PKOs selected</h2>
//               <label for="reminderMessageTextarea" className="fs-14 fw-400 text-color-typo-primary">Your Message</label>
//               <div className="form-floating">
//                 <textarea className="form-control px-12 py-2" placeholder="Leave a comment here" id="reminderMessageTextarea" value="The PKO submission deadline is approaching! Please ensure you submit your forms before the closing date to have your input counted. Thank you!" style={{ height: '130px'}}></textarea>
//               </div>
//             </div>
//             <div className="modal-footer d-flex align-items-center justify-content-end flex-nowrap px-32 py-4 border-0">
//               <button
//                 type="button"
//                 className="btn btn-outline-primary fs-14 fw-600 px-4 py-10 rounded-1 me-3"
//                 data-bs-dismiss="modal"
//               >
//                 Cancel
//               </button>
//               <button className="btn btn-primary fs-14 fw-600 px-4 py-10 rounded-1">
//                 Send
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>


//       {/* Sent Reminder modal popup */}
//       <div
//         className="modal fade sent-reminder-modal-popup"
//         id="sentReminderModal"
//         tabIndex="-1"
//         aria-labelledby="sentReminderModalLabel"
//         aria-hidden="true"
//       >
//         <div className="modal-dialog modal-dialog-centered bg-transparent p-0">
//           <div className="modal-content rounded-1">
//             <div className="modal-header px-32 py-4 border-0">
//               <h1
//                 className="modal-title fs-16 fw-600 text-color-typo-primary mb-0"
//                 id="sentReminderModalLabel"
//               >
//                 Sent Reminders
//               </h1>
//               <button
//                 type="button"
//                 className="btn-close"
//                 data-bs-dismiss="modal"
//                 aria-label="Close"
//               ></button>
//             </div>
//             <div className="modal-body px-32 py-0 pb-4">
//               <ul className="list-unstyled m-0">
//                 <li className="border-bottom pb-20 mb-20">
//                   <div className="d-flex align-items-center mb-10">
//                     <h2 className="fs-18 fw-600 text-color-typo-primary mb-0">06 Apr 2025</h2>
//                     <span className="mx-1 lh-8">|</span>
//                     <h3 className="fs-18 fw-600 text-primary mb-0">3 PKOs</h3>
//                   </div>
//                   <p className="fs-16 fw-400 text-color-typo-primary mb-0">The deadline to complete the PKO form is approaching! Please submit your responses soon to ensure your input is included. Thank you!</p>
//                 </li>
//                 <li className="border-bottom pb-20 mb-20">
//                   <div className="d-flex align-items-center mb-10">
//                     <h2 className="fs-18 fw-600 text-color-typo-primary mb-0">06 Apr 2025</h2>
//                     <span className="mx-1 lh-8">|</span>
//                     <h3 className="fs-18 fw-600 text-primary mb-0">3 PKOs</h3>
//                   </div>
//                   <p className="fs-16 fw-400 text-color-typo-primary mb-0">The deadline to complete the PKO form is approaching! Please submit your responses soon to ensure your input is included. Thank you!</p>
//                 </li>
//                 <li className="border-bottom pb-20 mb-20">
//                   <div className="d-flex align-items-center mb-10">
//                     <h2 className="fs-18 fw-600 text-color-typo-primary mb-0">06 Apr 2025</h2>
//                     <span className="mx-1 lh-8">|</span>
//                     <h3 className="fs-18 fw-600 text-primary mb-0">3 PKOs</h3>
//                   </div>
//                   <p className="fs-16 fw-400 text-color-typo-primary mb-0">The deadline to complete the PKO form is approaching! Please submit your responses soon to ensure your input is included. Thank you!</p>
//                 </li>
//                 <li className="border-bottom pb-20 mb-20">
//                   <div className="d-flex align-items-center mb-10">
//                     <h2 className="fs-18 fw-600 text-color-typo-primary mb-0">06 Apr 2025</h2>
//                     <span className="mx-1 lh-8">|</span>
//                     <h3 className="fs-18 fw-600 text-primary mb-0">3 PKOs</h3>
//                   </div>
//                   <p className="fs-16 fw-400 text-color-typo-primary mb-0">The deadline to complete the PKO form is approaching! Please submit your responses soon to ensure your input is included. Thank you!</p>
//                 </li>
//                 <li className="border-bottom pb-20 mb-20">
//                   <div className="d-flex align-items-center mb-10">
//                     <h2 className="fs-18 fw-600 text-color-typo-primary mb-0">06 Apr 2025</h2>
//                     <span className="mx-1 lh-8">|</span>
//                     <h3 className="fs-18 fw-600 text-primary mb-0">3 PKOs</h3>
//                   </div>
//                   <p className="fs-16 fw-400 text-color-typo-primary mb-0">The deadline to complete the PKO form is approaching! Please submit your responses soon to ensure your input is included. Thank you!</p>
//                 </li>
//               </ul>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboardFirst;
