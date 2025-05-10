import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/NavigationBar.css';
import { FaHome, FaBook, FaClipboardList, FaCalendarAlt } from 'react-icons/fa';

const NavigationBar = () => {
  const location = useLocation();

  return (
    <nav className="navigation-bar">
      <div className="nav-header">
        <span className="nav-logo">Talentry</span>
      </div>
      <ul className="nav-list">
        <li className={`nav-item ${location.pathname === '/posts' ? 'active' : ''}`}>
          <Link to="/posts" className="nav-link">
            <FaHome className="nav-icon" />
            <span>Dashboard</span>
          </Link>
        </li>
        <li className={`nav-item ${location.pathname === '/progresses' ? 'active' : ''}`}>
          <Link to="/progresses" className="nav-link">
            <FaBook className="nav-icon" />
            <span>Learning plans & progress</span>
          </Link>
        </li>
        <li className={`nav-item ${location.pathname === '/NotificationViewer' ? 'active' : ''}`}>
          <Link to="/NotificationViewer" className="nav-link">
            <FaClipboardList className="nav-icon" />
            <span>Notifications</span>
          </Link>
        </li>
        <li className={`nav-item ${location.pathname === '/profile' ? 'active' : ''}`}>
          <Link to="/profile" className="nav-link">
            <FaCalendarAlt className="nav-icon" />
            <span>User profile</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavigationBar; 