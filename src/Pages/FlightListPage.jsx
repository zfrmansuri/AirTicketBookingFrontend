import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode"; // For decoding the JWT
import { searchFlights } from "../Api/flightAPI";
import AdminDashboard from "./AdminDashboard";
import FlightOwnerDashboard from "./FlightOwnerDashboard";
import UserDashboard from "./UserDashboard";
import "../CSS/FlightListPage.css";
import arrowImg from "../Images/arrow.svg";
import airplaneImg from "../Images/airplane.svg";

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

const FlightListPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { origin, destination, date } = location.state || {};
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    // Fetch and set flights
    const fetchFlights = async () => {
      try {
        console.log("Fetching flights for date:", date);
        const response = await searchFlights(origin, destination, date);
        console.log("Raw API response:", response);

        const flightData = response?.data.$values || []; // Handle API response structure
        console.log("Extracted flight data:", flightData);

        setFlights(flightData);
      } catch (err) {
        console.error("Error fetching flights:", err);
        setError(err.response?.data?.message || "Error fetching flights.");
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();

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
  }, [origin, destination, date]);

  if (loading) return <p>Loading flights...</p>;
  if (error) return <p>{error}</p>;

  const handleBookNow = (flightId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      // Redirect to login if not authenticated
      navigate("/login", { state: { from: `/seat-selection/${flightId}` } });
    } else {
      // Redirect to seat selection if authenticated
      navigate(`/seat-selection/${flightId}`);
    }
  };

  return (
    <div>
      {dashboard}
      <div className="flightListWrapper">
      {/* {dashboard} */}
        {flights.length > 0 ? (
          <>
            {flights.map((flight) => (
              <div className="flightListItem" key={flight.flightId}>
                <div className="flightName">
                  <h3>Flight Id:</h3>
                  <div className="flightNameImg">
                    <img src={airplaneImg} alt="img" style={{ width: "15px" }} className="flightIdImg" />
                    <p>{flight.flightNumber}</p>
                  </div>
                </div>
                <div className="flightOriginDestination">
                  <p>{flight.origin}</p>
                  <img src={arrowImg} alt="img" className="flightIdImg" />
                  <p>{flight.destination}</p>
                </div>
                <div className="flightPriceBookSeatContainer">
                  <h3>${flight.pricePerSeat}</h3>
                  <p>Seats: {flight.availableSeats}</p>
                  <button onClick={() => handleBookNow(flight.flightId)}>Select Seat</button>
                </div>
              </div>
            ))}
          </>
        ) : (
          <p>No flights found matching the criteria.</p>
        )}
      </div>
    </div>
  );
};

export default FlightListPage;
