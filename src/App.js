import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Correct import for jwtDecode
import FlightSearch from "./Components/FlightSearch";
import FlightListPage from "./Pages/FlightListPage";
import SeatSelectionPage from "./Components/SeatSelection";
import Login from "./Components/Login";
import Register from "./Components/Register";
import Header from "./Pages/Header";
import AdminDashboard from "./Pages/AdminDashboard";
import UserDashboard from "./Pages/UserDashboard";
import FlightOwnerDashboard from "./Pages/FlightOwnerDashboard";
import Users from "./Components/Users";  // Assuming Users page exists
import BookingHistory from "./Components/BookingHistory";  // Assuming BookingHistory page exists
import Bookings from "./Components/Bookings";  // Assuming Bookings page exists
import "./App.css";

// Function to check if the user is authenticated and has a valid token
const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  if (!token) return false;
  try {
    const decodedToken = jwtDecode(token);  // Correct usage of jwtDecode
    return decodedToken.exp * 1000 > Date.now(); // Check if token is expired
  } catch (error) {
    return false;
  }
};

// Function to get the user's role from the decoded token
const getUserRole = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const decodedToken = jwtDecode(token);  // Correct usage of jwtDecode
    return decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]; // Example for Microsoft Identity
  } catch (error) {
    return null;
  }
};

// Protect routes based on the role
const ProtectedRoute = ({ children, roleRequired }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" />; // Redirect to login if not authenticated
  }

  const userRole = getUserRole();
  if (userRole !== roleRequired) {
    return <Navigate to="/" />; // Redirect to homepage if the role doesn't match
  }

  return children;
};

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<FlightSearch />} />
        <Route path="/flights" element={<FlightListPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/seat-selection/:flightId" element={<SeatSelectionPage />} />

        {/* Protected Routes */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute roleRequired="Admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        >
          {/* Nested Routes for Admin Dashboard */}
          <Route path="flight-search" element={<FlightSearch />} />
          <Route path="users" element={<Users />} />
          <Route path="booking-history" element={<BookingHistory />} />
          <Route path="bookings" element={<Bookings />} />
        </Route>

        <Route
          path="/user-dashboard"
          element={
            <ProtectedRoute roleRequired="User">
              <UserDashboard />
            </ProtectedRoute>
          }
        >
          {/* Nested Routes for User Dashboard */}
          {/* Add any user-specific routes here */}
        </Route>

        <Route
          path="/flightowner-dashboard"
          element={
            <ProtectedRoute roleRequired="FlightOwner">
              <FlightOwnerDashboard />
            </ProtectedRoute>
          }
        >
          {/* Nested Routes for FlightOwner Dashboard */}
          {/* Add any flight owner specific routes here */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
