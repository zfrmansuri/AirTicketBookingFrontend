import React, { useState } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import "../CSS/AdminDashboard.css";
import FlightSearch from "../Components/FlightSearch";
import Users from "../Components/Users";
import BookingHistory from "../Components/BookingHistory";
import Bookings from "../Components/Bookings";
import RegisterFlightOwner from "../Components/RegisterFlightOwner";
import SeatSelection from "../Components/SeatSelection";
import GetAllFlights from "../Components/GetAllFlights"; // All Flights Component

const AdminDashboard = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Toggle the menu state
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Exclude these paths from rendering the default FlightSearch
  const excludePaths = ["/flights", "/seat-selection/"];

  return (
    <div className={`dashboard-container ${isMenuOpen ? "menu-open" : ""}`}>
      {/* Hamburger Menu */}
      <div className="hamburger-menu" onClick={toggleMenu}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </div>

      {/* Backdrop */}
      <div
        className={`backdrop ${isMenuOpen ? "visible" : ""}`}
        onClick={toggleMenu}
      ></div>

      {/* Sidebar */}
      <div className={`sidebar ${isMenuOpen ? "open" : ""}`}>
        <h2>Admin Dashboard</h2>
        <ul>
          <li>
            <Link to="/admin-dashboard/flight-search">Flight Search</Link>
          </li>
          <li>
            <Link to="/admin-dashboard/users">Manage People</Link>
          </li>
          <li>
            <Link to="/admin-dashboard/booking-history">
              My Booking History
            </Link>
          </li>
          <li>
            <Link to="/admin-dashboard/bookings">All Bookings</Link>
          </li>
          <li>
            <Link to="/admin-dashboard/register-flight-owner">
              Register Flight Owner
            </Link>
          </li>
          <li>
            <Link to="/admin-dashboard/get-all-flights">All Flights</Link>
          </li>{" "}
          {/* New Link */}
        </ul>
      </div>

      {/* Main Content Area */}
      <div className="main-content">
        <Routes>
          {!excludePaths.some((path) => location.pathname.startsWith(path)) && (
            <Route path="/" element={<FlightSearch />} />
          )}
          <Route path="/flight-search" element={<FlightSearch />} />
          <Route path="/users" element={<Users />} />
          <Route path="/booking-history" element={<BookingHistory />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route
            path="/register-flight-owner"
            element={<RegisterFlightOwner />}
          />
          <Route path="/get-all-flights" element={<GetAllFlights />} />{" "}
          {/* New Route */}
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;
