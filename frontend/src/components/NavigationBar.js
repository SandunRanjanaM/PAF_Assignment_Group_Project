import React from 'react';
import '../styles/NavigationBar.css';
import { FaHome, FaBook, FaClipboardList, FaCalendarAlt } from 'react-icons/fa';

const NavigationBar = () => {
  return (
    <nav className="navigation-bar">
      <div className="nav-header">
        <span className="nav-logo">Talentry</span>
      </div>
      <ul className="nav-list">
        <li className="nav-item active">
          <FaHome className="nav-icon" />
          <span>Dashboard</span>
        </li>
        <li className="nav-item">
          <FaBook className="nav-icon" />
          <span>Learning plans & progress</span>
        </li>
        <li className="nav-item">
          <FaClipboardList className="nav-icon" />
          <span>Comments & Discussions</span>
        </li>
        <li className="nav-item">
          <FaCalendarAlt className="nav-icon" />
          <span>User profile</span>
        </li>
      </ul>
    </nav>
  );
};

export default NavigationBar; 