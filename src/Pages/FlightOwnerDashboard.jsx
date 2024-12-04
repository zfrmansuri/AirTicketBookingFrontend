import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom'; // Import Link for navigation
import FlightSearch from '../Components/FlightSearch'; // Flight Search Component
import BookingHistory from '../Components/BookingHistory'; // Booking History Component
import Bookings from '../Components/Bookings'; // Bookings Component
import AddNewFlight from '../Components/AddNewFlight'; // Add New Flight Component (You can create this component)
import GetAllFlights from '../Components/GetAllFlights';

const FlightOwnerDashboard = () => {
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
        <h2>Flight Owner Dashboard</h2>
        <ul>
          <li><Link to="/flightowner-dashboard/flight-search">Flight Search</Link></li>
          <li><Link to="/flightowner-dashboard/booking-history">My Booking History</Link></li>
          <li><Link to="/flightowner-dashboard/bookings">All Bookings</Link></li>
          <li><Link to="/flightowner-dashboard/add-new-flight">Add New Flight</Link></li>
          <li><Link to="/flightowner-dashboard/get-all-flights">All Flights</Link></li> {/* New Link */}
        </ul>
      </div>

      {/* Main Content Area */}
      <div className="main-content">
        <Routes>
          <Route path="/flight-search" element={<FlightSearch />} />
          <Route path="/booking-history" element={<BookingHistory />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/add-new-flight" element={<AddNewFlight />} /> {/* Add new flight page */}
          <Route path="/get-all-flights" element={<GetAllFlights />} /> {/* New Route */}

          <Route path="/" element={<FlightSearch />} /> {/* Default route */}

        </Routes>
      </div>
    </div>
  );
};

export default FlightOwnerDashboard;
