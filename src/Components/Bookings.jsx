import React, { useEffect, useState } from "react";
import axios from "axios";
import "../CSS/Bookings.css";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const handleViewClick = (booking) => {
    setSelectedBooking(booking);
    setIsPopupVisible(true);
  };

  const handleClosePopup = () => {
    setIsPopupVisible(false);
  };

  const handleCancelClick = async (bookingId) => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this booking?");
    if (!confirmCancel) return;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(`https://localhost:7136/api/Booking/CancelBooking?booking_Id=${bookingId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        alert("Booking canceled successfully.");
        // Update the bookings list by removing the canceled booking
        setBookings((prevBookings) => prevBookings.filter((b) => b.bookingId !== bookingId));
      }
    } catch (error) {
      console.error("Failed to cancel booking:", error);
      alert(error.response?.data?.Message || "An error occurred while canceling the booking.");
    }
  };

  useEffect(() => {
    const fetchBookings = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("User not authorized. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get("https://localhost:7136/api/Booking/ListAllBooking", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = response.data;

        if (data && data.$values) {
          setBookings(data.$values);
        } else {
          setError("Unexpected response format.");
        }
      } catch (err) {
        setError("Failed to fetch bookings.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) {
    return <div className="bookingsContainer">Loading...</div>;
  }

  if (error) {
    return <div className="bookingsContainer error">{error}</div>;
  }

  return (
    <div className="bookingsContainer">
      <h2>Manage All Bookings</h2>
      {bookings.length > 0 ? (
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
            {bookings.map((booking) => (
              <tr key={booking.bookingId}>
                <td>{booking.bookingId}</td>
                <td>{booking.userName || "N/A"}</td>
                <td>{`${booking.origin} to ${booking.destination} (${booking.flightNumber})`}</td>
                <td>{new Date(booking.bookingDate).toLocaleDateString()}</td>
                <td>{booking.status}</td>
                <td>
                  <button className="viewButton" onClick={() => handleViewClick(booking)}>
                    View
                  </button>
                  <button
                    className="cancelButton"
                    onClick={() => handleCancelClick(booking.bookingId)}
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No bookings available.</p>
      )}

      {isPopupVisible && selectedBooking && (
        <BookingPopup booking={selectedBooking} onClose={handleClosePopup} />
      )}
    </div>
  );
};

const BookingPopup = ({ booking, onClose }) => {
  return (
    <div className="popupOverlay">
      <div className="popupContent">
        <h3>Booking Details</h3>
        <p><strong>Booking ID:</strong> {booking.bookingId}</p>
        <p><strong>Customer Name:</strong> {booking.userName}</p>
        <p><strong>Flight Number:</strong> {booking.flightNumber}</p>
        <p><strong>Origin:</strong> {booking.origin}</p>
        <p><strong>Destination:</strong> {booking.destination}</p>
        <p><strong>Booking Date:</strong> {new Date(booking.bookingDate).toLocaleDateString()}</p>
        <p><strong>Number of Seats:</strong> {booking.numberOfSeats}</p>
        <p><strong>Total Price:</strong> ₹{booking.totalPrice}</p>
        <p><strong>Status:</strong> {booking.status}</p>
        <button onClick={onClose} className="closeButton">Close</button>
      </div>
    </div>
  );
};

export default Bookings;
