import { useState } from "react";
import useAuthentication from "../../../../hooks/useAuthentication"; // Import the custom hook
import { useNavigate } from "react-router-dom";

const DashboardSidebar = () => {
  const [showModal, setShowModal] = useState(false);
  const { logoutUserAction } = useAuthentication(); // Using the custom hook
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUserAction(); // Call the logout function from the custom hook
  };

  const navigateToHome = () => {
    navigate("/admindashboard");
  };

  return (
    <>
      <div className="sideNav bg-secondary text-white w-72 d-flex flex-column justify-content-between">
        <ul className="list-unstyled m-0 w-100">
          <li>
            <button
              type="button"
              className="btn py-3 w-100 text-white rounded-0 border-top border-bottom border-color-white active"
              onClick={navigateToHome}
            >
              <img src="/assets/images/home-icon-sidenav.svg" alt="home-icon" />
            </button>
          </li>
          <li>
            <button
              type="button"
              className="btn py-3 w-100 text-white rounded-0 border-top border-bottom border-color-white"
            >
              <img src="/assets/images/to-do-icon.svg" alt="to-do-icon" />
            </button>
          </li>
          {/* <li>
              <button type="button" className="btn py-3 w-100 text-white rounded-0 border-top border-bottom border-color-white">
                <img src="/assets/images/settings-icon.svg" alt="setting-icon" />
              </button>
            </li> */}
        </ul>
        <ul className="list-unstyled m-0 w-100">
          <li>
            <button
              type="button"
              className="btn py-3 w-100 text-white rounded-0 border-top border-bottom border-color-white"
              onClick={handleLogout}
            >
              <img src="/assets/images/log-out-icon.svg" alt="logout-icon" />
            </button>
          </li>
          <li>
            <button
              type="button"
              className="btn py-3 w-100 text-white rounded-0 border-top border-bottom border-color-white"
            >
              <img
                src="/assets/images/user-icon-sidenav.svg"
                alt="user-icon-sidenav"
              />
            </button>
          </li>
        </ul>
      </div>
    </>
  );
};

export default DashboardSidebar;
