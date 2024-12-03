// src/Pages/AdminDashboard.js
import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom'; // Import Link for navigation
import '../CSS/AdminDashboard.css'; // Your CSS file for layout
import FlightSearch from '../Components/FlightSearch'; // Make sure this path is correct
import Users from '../Components/Users'; // Assuming Users component exists
import BookingHistory from '../Components/BookingHistory'; // Assuming BookingHistory component exists
import Bookings from '../Components/Bookings'; // Assuming Bookings component exists
import RegisterFlightOwner from '../Components/RegisterFlightOwner'; // Import the new component

const AdminDashboard = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Toggle the menu state
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className={`dashboard-container ${isMenuOpen ? 'menu-open' : ''}`}>
  {/* Hamburger Menu */}
  <div className="hamburger-menu" onClick={toggleMenu}>
    <span className="bar"></span>
    <span className="bar"></span>
    <span className="bar"></span>
  </div>

  {/* Backdrop */}
  <div
    className={`backdrop ${isMenuOpen ? 'visible' : ''}`}
    onClick={toggleMenu} /* Clicking the backdrop closes the menu */
  ></div>

  {/* Sidebar */}
  <div className={`sidebar ${isMenuOpen ? 'open' : ''}`}>
    <h2>Admin Dashboard</h2>
    <ul>
      <li><Link to="/admin-dashboard/flight-search">Flight Search</Link></li>
      <li><Link to="/admin-dashboard/users">Manage People</Link></li>
      <li><Link to="/admin-dashboard/booking-history">My Booking History</Link></li>
      <li><Link to="/admin-dashboard/bookings">All Bookings</Link></li>
      <li><Link to="/admin-dashboard/register-flight-owner">Register Flight Owner</Link></li>
    </ul>
  </div>

  {/* Main Content Area */}
  <div className="main-content">
    <Routes>
      <Route path="/flight-search" element={<FlightSearch />} />
      <Route path="/users" element={<Users />} />
      <Route path="/booking-history" element={<BookingHistory />} />
      <Route path="/bookings" element={<Bookings />} />
      <Route path="/register-flight-owner" element={<RegisterFlightOwner />} />
      <Route path="/" element={<FlightSearch />} />
    </Routes>
  </div>
</div>

  );
};

export default AdminDashboard;
