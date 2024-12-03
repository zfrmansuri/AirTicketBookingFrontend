import React, { useEffect, useState } from "react";
import "../CSS/BookingHistory.css"; // CSS styles

const BookingHistory = () => {
  const [bookingHistory, setBookingHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to get the token from local storage
  const getToken = () => {
    const token = localStorage.getItem("token");
    return token;
  };

  useEffect(() => {
    const fetchBookingHistory = async () => {
      const token = getToken();

      if (!token) {
        setError("User not authorized. No token found.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("https://localhost:7136/api/Booking/GetBookingHistory_Of_LoggedUser", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Pass token in Authorization header
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("User not authorized.");
          } else if (response.status === 404) {
            throw new Error("No booking history found.");
          } else {
            throw new Error("Failed to fetch booking history.");
          }
        }

        const data = await response.json();

        // Extract $values from the response
        if (data && data.$values) {
          setBookingHistory(data.$values);
        } else {
          setError("Unexpected response format.");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingHistory();
  }, []);

  if (loading) {
    return <div className="bookingHistoryContainer">Loading...</div>;
  }

  if (error) {
    return <div className="bookingHistoryContainer error">{error}</div>;
  }

  return (
    <div className="bookingHistoryContainer">
      <h2>My Booking History</h2>
      {bookingHistory.length > 0 ? (
        <div className="bookingCardsContainer">
          {bookingHistory.map((booking) => (
            <div className="bookingCard" key={booking.bookingId}>
              <h3>Booking ID: {booking.bookingId}</h3>
              <p><strong>Date:</strong> {new Date(booking.bookingDate).toLocaleDateString()}</p>
              <p><strong>Seats:</strong> {booking.numberOfSeats}</p>
              <p><strong>Total Price:</strong> ₹{booking.totalPrice}</p>
              <p><strong>Status:</strong> {booking.status}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No bookings found.</p>
      )}
    </div>
  );
};

export default BookingHistory;
