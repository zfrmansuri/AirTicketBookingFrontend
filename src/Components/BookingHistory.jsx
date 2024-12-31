// import React, { useEffect, useState } from "react";
// import "../CSS/Bookings.css"; // Reusing CSS from Bookings.jsx for consistent styling

// const BookingHistory = () => {
//   const [bookingHistory, setBookingHistory] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const bookingsPerPage = 7;

//   const getToken = () => {
//     const token = localStorage.getItem("token");
//     return token;
//   };

//   useEffect(() => {
//     const fetchBookingHistory = async () => {
//       const token = getToken();

//       if (!token) {
//         setError("User not authorized. No token found.");
//         setLoading(false);
//         return;
//       }

//       try {
//         const response = await fetch(
//           "https://localhost:7136/api/Booking/GetBookingHistory_Of_LoggedUser",
//           {
//             method: "GET",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         if (!response.ok) {
//           if (response.status === 401) {
//             throw new Error("User not authorized.");
//           } else if (response.status === 404) {
//             throw new Error("No booking history found.");
//           } else {
//             throw new Error("Failed to fetch booking history.");
//           }
//         }

//         const data = await response.json();

//         if (data && data.$values) {
//           setBookingHistory(data.$values);
//         } else {
//           setError("Unexpected response format.");
//         }
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBookingHistory();
//   }, []);

//   const deleteBooking = async (bookingId) => {
//     const token = getToken();

//     if (!token) {
//       alert("User not authorized. No token found.");
//       return;
//     }

//     try {
//       const response = await fetch(
//         `https://localhost:7136/api/Booking/CancelBooking?booking_Id=${bookingId}`,
//         {
//           method: "DELETE",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (!response.ok) {
//         if (response.status === 404) {
//           throw new Error("Booking not found.");
//         } else {
//           throw new Error("Failed to delete booking.");
//         }
//       }

//       const result = await response.json();
//       alert(result.Message || "Booking deleted successfully");
//       setBookingHistory((prev) => prev.filter((b) => b.bookingId !== bookingId));
//     } catch (err) {
//       alert(err.message);
//     }
//   };

//   const totalPages = Math.ceil(bookingHistory.length / bookingsPerPage);

//   const handleNext = () => {
//     if (currentPage < totalPages) {
//       setCurrentPage((prev) => prev + 1);
//     }
//   };

//   const handlePrevious = () => {
//     if (currentPage > 1) {
//       setCurrentPage((prev) => prev - 1);
//     }
//   };

//   const paginatedBookings = bookingHistory.slice(
//     (currentPage - 1) * bookingsPerPage,
//     currentPage * bookingsPerPage
//   );

//   if (loading) {
//     return <div className="bookingsContainer">Loading...</div>;
//   }

//   if (error) {
//     return <div className="bookingsContainer error">{error}</div>;
//   }

//   return (
//     <div className="bookingsContainer">
//       <h2>My Booking History</h2>
//       {bookingHistory.length > 0 ? (
//         <>
//           <table className="bookingsTable">
//             <thead>
//               <tr>
//                 <th>Booking ID</th>
//                 <th>Flight</th>
//                 <th>Date</th>
//                 <th>Seats</th>
//                 <th>Total Price</th>
//                 <th>Status</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {paginatedBookings.map((booking) => (
//                 <tr key={booking.bookingId}>
//                   <td>{booking.bookingId}</td>
//                   <td>{booking.origin} to {booking.destination} ({booking.flightNumber})</td>
//                   <td>{new Date(booking.bookingDate).toLocaleDateString()}</td>
//                   <td>{booking.numberOfSeats}</td>
//                   <td>₹{booking.totalPrice}</td>
//                   <td>{booking.status}</td>
//                   <td>
//                     <button
//                       className="cancelButton"
//                       onClick={() => {
//                         if (window.confirm("Are you sure you want to cancel this booking?")) {
//                           deleteBooking(booking.bookingId);
//                         }
//                       }}
//                     >
//                       Cancel
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           {/* Pagination Controls */}
//           <div className="pagination">
//             <button
//               className="paginationButton"
//               onClick={handlePrevious}
//               disabled={currentPage === 1}
//             >
//               &lt; Previous
//             </button>
//             <span className="pageInfo">
//               {currentPage} of {totalPages}
//             </span>
//             <button
//               className="paginationButton"
//               onClick={handleNext}
//               disabled={currentPage === totalPages}
//             >
//               Next &gt;
//             </button>
//           </div>
//         </>
//       ) : (
//         <p>No booking history found.</p>
//       )}
//     </div>
//   );
// };

// export default BookingHistory;



import React, { useEffect, useState } from "react";
import "../CSS/Bookings.css"; // Reusing CSS from Bookings.jsx for consistent styling

const BookingHistory = () => {
  const [bookingHistory, setBookingHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 7;

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
        const response = await fetch(
          "https://localhost:7136/api/Booking/GetBookingHistory_Of_LoggedUser",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

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

  const deleteBooking = async (bookingId, bookingDate) => {
    const token = getToken();

    if (!token) {
      alert("User not authorized. No token found.");
      return;
    }

    // Validate booking date
    const bookingDateTime = new Date(bookingDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set today's time to midnight
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1); // Get yesterday's date

    if (bookingDateTime < yesterday) {
      alert("You can't cancel bookings made before yesterday.");
      return;
    }

    try {
      const response = await fetch(
        `https://localhost:7136/api/Booking/CancelBooking?booking_Id=${bookingId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Booking not found.");
        } else {
          throw new Error("Failed to delete booking.");
        }
      }

      const result = await response.json();
      alert(result.Message || "Booking deleted successfully");
      setBookingHistory((prev) => prev.filter((b) => b.bookingId !== bookingId));
    } catch (err) {
      alert(err.message);
    }
  };

  const totalPages = Math.ceil(bookingHistory.length / bookingsPerPage);

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

  const paginatedBookings = bookingHistory.slice(
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
      <h2>My Booking History</h2>
      {bookingHistory.length > 0 ? (
        <>
          <table className="bookingsTable">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Flight</th>
                <th>Date</th>
                <th>Seats</th>
                <th>Total Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedBookings.map((booking) => (
                <tr key={booking.bookingId}>
                  <td>{booking.bookingId}</td>
                  <td>{booking.origin} to {booking.destination} ({booking.flightNumber})</td>
                  <td>{new Date(booking.bookingDate).toLocaleDateString()}</td>
                  <td>{booking.numberOfSeats}</td>
                  <td>₹{booking.totalPrice}</td>
                  <td>{booking.status}</td>
                  <td>
                    <button
                      className="cancelButton"
                      onClick={() => {
                        if (window.confirm("Are you sure you want to cancel this booking?")) {
                          deleteBooking(booking.bookingId, booking.bookingDate);
                        }
                      }}
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
        <p>No booking history found.</p>
      )}
    </div>
  );
};

export default BookingHistory;
