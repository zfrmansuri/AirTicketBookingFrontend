import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import '../CSS/AdminDashboard.css';
import FlightSearch from '../Components/FlightSearch';
import BookingHistory from '../Components/BookingHistory';

const UserDashboard = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Toggle the menu state
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Exclude these paths from rendering the default FlightSearch
  const excludePaths = ["/flights", "/seat-selection/"];

  return (
    <div className={`user-dashboard-container ${isMenuOpen ? 'menu-open' : ''}`}>
      {/* Hamburger Menu */}
      <div className="hamburger-menu" onClick={toggleMenu}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </div>

      {/* Sidebar */}
      <div className={`sidebar ${isMenuOpen ? 'open' : ''}`}>
        <h2>User Dashboard</h2>
        <ul>
          <li><Link to="/user-dashboard/flight-search">Flight Search</Link></li>
          <li><Link to="/user-dashboard/booking-history">My Booking History</Link></li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <Routes>
        {!excludePaths.some(path => location.pathname.startsWith(path)) && (
            <Route path="/" element={<FlightSearch />} />
          )}
          <Route path="/flight-search" element={<FlightSearch />} />
          <Route path="/booking-history" element={<BookingHistory />} />
          {/* <Route path="/" element={<FlightSearch />} />  */}
        </Routes>
      </div>
    </div>
  );
};

export default UserDashboard;
