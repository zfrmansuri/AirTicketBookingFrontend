// src/Components/Bookings.js
import React from "react";
import "../CSS/Bookings.css"; // CSS styles

const Bookings = () => {
  return (
    <div className="bookingsContainer">
      <h2>Manage Bookings</h2>
      <table className="bookingsTable">
        <thead>
          <tr>
            <th>Booking ID</th>
            <th>Customer Name</th>
            <th>Flight</th>
            <th>Booking Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* Sample row */}
          <tr>
            <td>200</td>
            <td>Mark Lee</td>
            <td>Flight 567</td>
            <td>2024-12-01</td>
            <td>Confirmed</td>
            <td>
              <button>View</button>
              <button>Cancel</button>
            </td>
          </tr>
          {/* More rows */}
        </tbody>
      </table>
    </div>
  );
};

export default Bookings;
