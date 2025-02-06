import React from 'react';
import "./SideBar.css"
import Cookies from "js-cookie"

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="logo">
        <div className="logo-circle">
          <h3>AI Notes</h3>
        </div>
      </div>
      
      <nav className="nav-menu">
        <a href="/" className="nav-item active">
          <div className="nav-icon home-icon">🏠</div>
          <span>Home</span>
        </a>
        <a href="/favourites" className="nav-item">
          <div className="nav-icon star-icon">⭐</div>
          <span>Favourites</span>
        </a>
      </nav>

      <div className="user-profile">
        <div className="avatar">
          <span>{Cookies.get("username")[0]}</span>
        </div>
        <span className="username">{Cookies.get("username")}</span>
        <span className="dropdown-arrow">▼</span>
      </div>
    </div>
  );
};

export default Sidebar;
