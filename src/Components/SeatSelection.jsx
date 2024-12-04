import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // For decoding the JWT
import { getFlightDetails } from "../Api/flightAPI";
import AdminDashboard from "../Pages/AdminDashboard";
import FlightOwnerDashboard from "../Pages/FlightOwnerDashboard";
import UserDashboard from "../Pages/UserDashboard";
import "../CSS/SeatSelectionPage.css"; // Add CSS file
import axios from "axios"; // For API requests

// Helper function to get the user's role from the JWT
const getUserRole = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const decodedToken = jwtDecode(token);
    return decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]; // Microsoft Identity role claim
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

    // Set the appropriate dashboard based on user role
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

  if (loading) return <p>Loading flight details...</p>;
  if (error) return <p>{error}</p>;

  const handleSeatClick = (seatId) => {
    if (!selectedSeats.includes(seatId)) {
      setSelectedSeats([...selectedSeats, seatId]);
    } else {
      setSelectedSeats(selectedSeats.filter((id) => id !== seatId));
    }
  };

  const handleBooking = async () => {
    if(selectedSeats.length <= 0){
      alert("Please Select Atleast One Seat to Book!")
    }
    else{
      const payload = {
        flightId: Number(flightId),
        seatIds: selectedSeats.map(
          (seatId) => seats.find((s) => s.flightSeatId === seatId)?.seatNumber
        ), // Map seat IDs to their seat numbers
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
          <button className="continue-button" onClick={handleBooking}>
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
    </div>
  );
};

export default SeatSelectionPage;
