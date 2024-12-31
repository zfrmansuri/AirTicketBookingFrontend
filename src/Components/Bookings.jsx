import React, { useEffect, useState } from "react";
import axios from "axios";
import "../CSS/Bookings.css";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 7;

  const handleViewClick = (booking) => {
    setSelectedBooking(booking);
    setIsPopupVisible(true);
  };

  const handleClosePopup = () => {
    setIsPopupVisible(false);
  };

  // const handleCancelClick = async (bookingId, bookingDate) => {
    
  //   console.log(bookingDate)
  //   console.log(Date.now())
  //   if(bookingDate < Date.now()){
  //     window.alert("You Can't Cancel Earlier Bookings");
  //     return
  //   }
  //   const confirmCancel = window.confirm("Are you sure you want to cancel this booking?");
  //   if (!confirmCancel) return;

  //   try {
  //     const token = localStorage.getItem("token");
  //     const response = await axios.delete(
  //       `https://localhost:7136/api/Booking/CancelBooking?booking_Id=${bookingId}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     if (response.status === 200) {
  //       alert("Booking canceled successfully.");
  //       setBookings((prevBookings) =>
  //         prevBookings.filter((b) => b.bookingId !== bookingId)
  //       );
  //     }
  //   } catch (error) {
  //     console.error("Failed to cancel booking:", error);
  //     alert(error.response?.data?.Message || "An error occurred while canceling the booking.");
  //   }
  // };


  const handleCancelClick = async (bookingId, bookingDate) => {
    const bookingDateTime = new Date(bookingDate); // Convert bookingDate to Date object
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set today's time to midnight
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1); // Get yesterday's date
    
    if (bookingDateTime < yesterday) {
      window.alert("You can't cancel bookings for Departed Flights.");
      return;
    }
  
    const confirmCancel = window.confirm("Are you sure you want to cancel this booking?");
    if (!confirmCancel) return;
  
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `https://localhost:7136/api/Booking/CancelBooking?booking_Id=${bookingId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.status === 200) {
        alert("Booking canceled successfully.");
        setBookings((prevBookings) =>
          prevBookings.filter((b) => b.bookingId !== bookingId)
        );
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
        const response = await axios.get(
          "https://localhost:7136/api/Booking/ListAllBooking",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = response.data;

        if (data && data.$values && data.$values.length > 0) {
          setBookings(data.$values);
        } else {
          setError(data.message || "No bookings found.");
        }
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
        const backendMessage =
          err.response?.data?.message || "An error occurred while fetching bookings.";
        setError(backendMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const totalPages = Math.ceil(bookings.length / bookingsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const paginatedBookings = bookings.slice(
    (currentPage - 1) * bookingsPerPage,
    currentPage * bookingsPerPage
  );

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
        <>
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
              {paginatedBookings.map((booking) => (
                <tr key={booking.bookingId}>
                  <td>{booking.bookingId}</td>
                  <td>{booking.userName || "N/A"}</td>
                  <td>{`${booking.origin} to ${booking.destination} (${booking.flightNumber})`}</td>
                  <td>{new Date(booking.bookingDate).toLocaleDateString()}</td>
                  <td>{booking.status}</td>
                  <td>
                    <button
                      className="viewButton"
                      onClick={() => handleViewClick(booking)}
                    >
                      View
                    </button>
                    <button
                      className="cancelButton"
                      onClick={() => handleCancelClick(booking.bookingId ,booking.bookingDate )}
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="pagination">
            <button
              className="paginationButton"
              onClick={handlePrevious}
              disabled={currentPage === 1}
            >
              &lt; Previous
            </button>
            <span className="pageInfo">
              {currentPage} of {totalPages}
            </span>
            <button
              className="paginationButton"
              onClick={handleNext}
              disabled={currentPage === totalPages}
            >
              Next &gt;
            </button>
          </div>
        </>
      ) : (
        <p>No data available. You have no bookings at this time.</p>
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
        <p>
          <strong>Booking ID :</strong> {booking.bookingId}
        </p>
        <p>
          <strong>Customer Name :</strong> {booking.userName}
        </p>
        <p>
          <strong>Flight Number :</strong> {booking.flightNumber}
        </p>
        <p>
          <strong>Origin :</strong> {booking.origin}
        </p>
        <p>
          <strong>Destination :</strong> {booking.destination}
        </p>
        <p>
          <strong>Booking Date :</strong>{" "}
          {new Date(booking.bookingDate).toLocaleDateString()}
        </p>
        <p>
          <strong>Number of Seats :</strong> {booking.numberOfSeats}
        </p>
        <p>
          <strong>Total Price :</strong> ₹{booking.totalPrice}
        </p>
        <p>
          <strong>Status :</strong> {booking.status}
        </p>
        <button onClick={onClose} className="closeButton">
          Close
        </button>
      </div>
    </div>
  );
};

export default Bookings;
