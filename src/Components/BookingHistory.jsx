import React, { useEffect, useState } from "react";
import "../CSS/BookingHistory.css"; // CSS styles

const BookingHistory = () => {
  const [bookingHistory, setBookingHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedDetails, setExpandedDetails] = useState(null); // For toggling details view

  // Function to get the token from local storage
  const getToken = () => {
    const token = localStorage.getItem("token");
    return token;
  };

  // Fetch booking history on component mount
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

  // Delete a booking by ID
  const handleDeleteBooking = async (bookingId) => {
    const token = getToken();

    if (!token) {
      setError("User not authorized. No token found.");
      return;
    }

    try {
      const response = await fetch(`https://localhost:7136/api/Booking/CancelBooking/${bookingId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Booking not found.");
        } else {
          throw new Error("Failed to cancel booking.");
        }
      }

      const result = await response.json();
      alert(result.Message); // Show success message

      // Remove the canceled booking from the list
      setBookingHistory((prev) => prev.filter((booking) => booking.bookingId !== bookingId));
    } catch (err) {
      alert(err.message);
    }
  };

  // Toggle booking details
  const toggleDetails = (bookingId) => {
    setExpandedDetails((prev) => (prev === bookingId ? null : bookingId));
  };

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
              <p>
                <strong>Date:</strong> {new Date(booking.bookingDate).toLocaleDateString()}
              </p>
              <p>
                <strong>Seats:</strong> {booking.numberOfSeats}
              </p>
              <p>
                <strong>Total Price:</strong> ₹{booking.totalPrice}
              </p>
              <p>
                <strong>Status:</strong> {booking.status}
              </p>

              {/* Details Button */}
              <button onClick={() => toggleDetails(booking.bookingId)}>
                {expandedDetails === booking.bookingId ? "Hide Details" : "Show Details"}
              </button>

              {/* Delete Button */}
              <button onClick={() => handleDeleteBooking(booking.bookingId)} className="deleteButton">
                Delete
              </button>

              {/* Additional Details */}
              {expandedDetails === booking.bookingId && (
                <div className="bookingDetails">
                  <p><strong>Flight ID:</strong> {booking.flightId}</p>
                  <p><strong>Passenger Name:</strong> {booking.passengerName}</p>
                  <p><strong>Contact:</strong> {booking.contactInfo}</p>
                  {/* Add any other details available */}
                </div>
              )}
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
