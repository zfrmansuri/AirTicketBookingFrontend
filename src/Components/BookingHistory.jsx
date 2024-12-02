// src/Components/BookingHistory.js
import React from "react";
import "../CSS/BookingHistory.css"; // CSS styles

const BookingHistory = () => {
  return (
    <div className="bookingHistoryContainer">
      <h2>Booking History</h2>
      <table className="bookingHistoryTable">
        <thead>
          <tr>
            <th>Booking ID</th>
            <th>Customer</th>
            <th>Flight</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {/* Sample booking row */}
          <tr>
            <td>101</td>
            <td>Jane Smith</td>
            <td>Flight 234</td>
            <td>2024-12-10</td>
            <td>Confirmed</td>
          </tr>
          {/* More rows */}
        </tbody>
      </table>
    </div>
  );
};

export default BookingHistory;
