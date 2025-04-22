import { useState } from 'react';
import SentReminderModal from './SentReminderModal.jsx';

const DashboardSidebar = () => {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
        <SentReminderModal />
        <div className="sideNav bg-secondary text-white w-72 d-flex flex-column justify-content-between">
            <ul className="list-unstyled m-0 w-100">
                <li>
                    <button type="button" className="btn py-3 w-100 text-white rounded-0 border-top border-bottom border-color-white active">
                        <img src="/assets/images/home-icon-sidenav.svg" alt="home-icon" />
                    </button>
                </li>
                <li>
                    <button type="button" className="btn py-3 w-100 text-white rounded-0 border-top border-bottom border-color-white">
                        <img src="/assets/images/to-do-icon.svg" alt="to-do-icon" />
                    </button>
                </li>
                <li>
                    <button type="button" className="btn py-3 w-100 text-white rounded-0 border-top border-bottom border-color-white">
                        <img src="/assets/images/settings-icon.svg" alt="setting-icon" />
                    </button>
                </li>
            </ul>
            <ul className="list-unstyled m-0 w-100">
                <li>
                    <button type="button" className="btn py-3 w-100 text-white rounded-0 border-top border-bottom border-color-white" data-bs-toggle="modal" data-bs-target="#sentReminderModal">
                        <img src="/assets/images/reminder-icon-sidenav.svg" alt="reminder-icon" />
                    </button>
                </li>
                <li>
                    <button type="button" className="btn py-3 w-100 text-white rounded-0 border-top border-bottom border-color-white">
                        <img src="/assets/images/comment-icon-sidenav.svg" alt="comments-icon" />
                    </button>
                </li>
            </ul>
        </div>
        </>
    )
}

export default DashboardSidebar;