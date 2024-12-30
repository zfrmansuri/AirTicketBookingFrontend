import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { getFlightDetails } from "../Api/flightAPI";
import AdminDashboard from "../Pages/AdminDashboard";
import FlightOwnerDashboard from "../Pages/FlightOwnerDashboard";
import UserDashboard from "../Pages/UserDashboard";
import "../CSS/SeatSelectionPage.css";
import axios from "axios";

const getUserRole = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const decodedToken = jwtDecode(token);
    return decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

const SeatSelectionPage = () => {
  const { flightId } = useParams();
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [pricePerSeat, setPricePerSeat] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);

  useEffect(() => {
    const fetchFlightDetails = async () => {
      try {
        const data = await getFlightDetails(flightId);
        setSeats(data.flightSeats.$values);
        setPricePerSeat(data.pricePerSeat);
      } catch (err) {
        setError(err.response?.data?.Message || "Error fetching flight details.");
      } finally {
        setLoading(false);
      }
    };

    fetchFlightDetails();

    const role = getUserRole();
    if (role) {
      switch (role) {
        case "Admin":
          setDashboard(<AdminDashboard />);
          break;
        case "FlightOwner":
          setDashboard(<FlightOwnerDashboard />);
          break;
        case "User":
          setDashboard(<UserDashboard />);
          break;
        default:
          setDashboard(<p>Unauthorized Role</p>);
      }
    }
  }, [flightId]);

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }
  if (error) return <p>{error}</p>;

  const handleSeatClick = (seatId) => {
    if (selectedSeats.length >= 5 && !selectedSeats.includes(seatId)) {
      alert("You can book a maximum of 5 seats.");
      return;
    }

    if (!selectedSeats.includes(seatId)) {
      setSelectedSeats([...selectedSeats, seatId]);
    } else {
      setSelectedSeats(selectedSeats.filter((id) => id !== seatId));
    }
  };

  const handleConfirmBooking = async () => {
    const payload = {
      flightId: Number(flightId),
      seatIds: selectedSeats.map(
        (seatId) => seats.find((s) => s.flightSeatId === seatId)?.seatNumber
      ),
    };

    const token = localStorage.getItem("token");

    if (!token) {
      alert("You must be logged in to book tickets.");
      return;
    }

    try {
      const response = await axios.post(
        "https://localhost:7136/api/Booking/BookTicket",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Booking Completed Successfully!");
      console.log(response.data);
      window.location.reload();
    } catch (error) {
      console.error("Error booking tickets:", error);
      alert(error.response?.data?.message || "Booking Failed. Please try again.");
    }
  };

  const groupedSeats = [];
  for (let i = 0; i < seats.length; i += 4) {
    groupedSeats.push(seats.slice(i, i + 4));
  }

  const totalPrice = selectedSeats.length * pricePerSeat;

  return (
    <div>
      {dashboard}

      <div className="seat-selection-container">
        {/* Left Side - Selected Seats Summary */}
        <div className="selected-seats-summary">
          <h3>Selected Seats</h3>
          <table>
            <thead className="selected-seat-table-head">
              <tr>
                <th>Seat Details</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {selectedSeats.map((seatId) => {
                const seat = seats.find((s) => s.flightSeatId === seatId);
                return (
                  <tr key={seatId}>
                    <td>{seat.seatNumber}</td>
                    <td>₹ {pricePerSeat}</td>
                  </tr>
                );
              })}
              <tr className="selected-seat-table-subtotal">
                <td><b>Sub total</b></td>
                <td><b>₹ {totalPrice}</b></td>
              </tr>
            </tbody>
          </table>
          <button
            className="continue-button"
            onClick={() => setShowConfirmationPopup(true)}
          >
            Book Now
          </button>
        </div>

        {/* Right Side - Seat Plan */}
        <div className="seat-plan">
          <div className="front">Front</div>
          {groupedSeats.map((seatRow, index) => (
            <div key={index} className="seat-row">
              {seatRow.map((seat) => (
                <div
                  key={seat.flightSeatId}
                  className={`seat ${!seat.isAvailable ? "booked" : selectedSeats.includes(seat.flightSeatId) ? "selected" : "available"
                    }`}
                  onClick={() => seat.isAvailable && handleSeatClick(seat.flightSeatId)}
                >
                  {seat.seatNumber}
                </div>
              ))}
            </div>
          ))}
          <div className="rear">Rear</div>
        </div>

        <div className="seat-allocation-guide">
          <div><span className="guide-booked"></span>Booked Seats</div>
          <div><span className="guid-available"></span>Available Seats</div>
          <div><span className="guid-selected"></span>Selected Seats</div>
        </div>
      </div>

      {/* Confirmation Popup */}
      {showConfirmationPopup && (
        <div className="seat-confirmation-popup">
          <div className="seat-popup-content">
            <h3>Confirm Booking</h3>
            <p>
              Are you sure you want to book {selectedSeats.length} seats for a total of ₹
              {totalPrice}?
            </p>
            <div className="seat-popup-buttons">
              <button
                className="seat-confirm-button"
                onClick={() => {
                  setShowConfirmationPopup(false);
                  handleConfirmBooking();
                }}
              >
                Confirm
              </button>
              <button
                className="seat-cancel-button"
                onClick={() => setShowConfirmationPopup(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeatSelectionPage;
