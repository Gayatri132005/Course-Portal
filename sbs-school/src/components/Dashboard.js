import React from 'react';
import "../components/style.css";
import SideNav from "./SideNav";
import { Outlet, useNavigate } from "react-router-dom";

export const Dashboard = () => {
  const navigate = useNavigate(); // ✅ Call the hook

  const logoutHandler = () => {
    localStorage.clear();
    navigate('/login'); // ✅ Use absolute path
  };

  return (
    <div className="dashboard-main-container">
      <div className="dashboard-container">
        <SideNav />
        <div className="nav"></div>

        <div className="main-container">
          <div className="top-bar">
            <div className="logo-container">
              <img 
                alt="profile logo" 
                className="profile-logo" 
                src={require("../assets/book logo.png")} 
              />
            </div>
            <div className="profile-container">
              {/* <h1 className="profile-name">{localStorage.getItem('fullName')}</h1> */}
              <button className="logout-btn" onClick={logoutHandler}>Logout</button>
            </div>
          </div>

          <div className="outlet-area">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
