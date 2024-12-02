import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom'; // Import Link for navigation
import '../CSS/AdminDashboard.css'; // Your CSS file for layout
import FlightSearch from '../Components/FlightSearch'; // Make sure this path is correct
import Users from '../Components/Users'; // Assuming Users component exists
import BookingHistory from '../Components/BookingHistory'; // Assuming BookingHistory component exists
import Bookings from '../Components/Bookings'; // Assuming Bookings component exists

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

      {/* Sidebar */}
      <div className={`sidebar ${isMenuOpen ? 'open' : ''}`}>
        <h2>Admin Dashboard</h2>
        <ul>
          <li><Link to="/admin-dashboard/flight-search">Flight Search</Link></li> {/* Link to FlightSearch */}
          <li><Link to="/admin-dashboard/users">Users</Link></li> {/* Link to Users page */}
          <li><Link to="/admin-dashboard/booking-history">Booking History</Link></li> {/* Link to Booking History */}
          <li><Link to="/admin-dashboard/bookings">Bookings</Link></li> {/* Link to Bookings */}
        </ul>
      </div>

      {/* Main Content Area */}
      <div className="main-content">
        <Routes>
          {/* Nested route for Admin Dashboard */}
          <Route path="/flight-search" element={<FlightSearch />} /> {/* Route for Flight Search */}
          <Route path="/users" element={<Users />} /> {/* Route for Users */}
          <Route path="/booking-history" element={<BookingHistory />} /> {/* Route for Booking History */}
          <Route path="/bookings" element={<Bookings />} /> {/* Route for Bookings */}
          
          {/* Default route if no specific path is matched */}
          <Route path="/" element={<FlightSearch />} /> {/* Default route */}
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;
