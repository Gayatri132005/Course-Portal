import React from 'react';
import { Link } from 'react-router-dom';
import "../components/style.css";
import { useLocation } from "react-router-dom";

export const SideNav = () => {
      const location=useLocation();
    return (
        <div className="nav-container">
            <div className="brand-container">
                <img className="profile-logo" alt="brand-logo" src={require("../assets/book logo.png")} />
                <div className="brand-text">
                    <h2 className="brand-name">Artificial intelligence</h2>
                    <p className="brand-slogan">Manage your app in easy way</p>
                </div>
            </div>
           <div className="menu-container">
             <Link  to="/dashboard/home" className={location.pathname === '/dashboard/home' ?'menu-active-link':'menu-link'}><i className="fa-solid fa-house"></i>Home</Link>
             <Link  to="/dashboard/courses" className={location.pathname === "/dashboard/courses" ?'menu-active-link':'menu-link'}><i class="fa-solid fa-book"></i> All Courses</Link>
             <Link  to="/dashboard/add-course" className={location.pathname === "/dashboard/add-course"  ?'menu-active-link':'menu-link'}><i class="fa-solid fa-plus"></i> Add Courses</Link>
             <Link  to="/dashboard/students"  className={location.pathname === "/dashboard/students"   ?'menu-active-link':'menu-link'}><i class="fa-solid fa-users"></i>All Student</Link>
             <Link   to="/dashboard/add-student" className={location.pathname === "/dashboard/add-student" ?'menu-active-link':'menu-link'}><i class="fa-solid fa-user-plus"></i>Add Student</Link>
           
             
             <Link  to="/dashboard/collect-fee" className={location.pathname === "/dashboard/collect-fee"  ?'menu-active-link':'menu-link'}><i class="fa-solid fa-money-bill-wave"></i> Collection Fee</Link>
             <Link  to="/dashboard/payment-history"  className={location.pathname === "/dashboard/payment-history" ?'menu-active-link':'menu-link'}><i class="fa-solid fa-store"></i> Payment History</Link>
           </div>

           <div className="contact-us">
            <p><i class="fa-solid fa-phone"></i>Contact Us :</p>
            <p>: 8767669395</p>
           </div>
        </div>
        
    )
}
export default SideNav;
