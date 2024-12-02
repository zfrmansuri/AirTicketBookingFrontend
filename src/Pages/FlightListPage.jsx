import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { searchFlights } from "../Api/flightAPI";

const FlightListPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { origin, destination, date } = location.state || {};
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        console.log("another one",date);
        const response = await searchFlights(origin, destination, date);
        console.log("Raw API response:", response);

        // Extract the array from $values
        const flightData = response?.data.$values || []; // Default to an empty array if $values is not present
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
        // navigate("/seat-selection");
        navigate(`/seat-selection/${flightId}`);
    }
};

  return (
    <div>
      <h2>Available Flights</h2>
      {flights.length > 0 ? (
        <ul>
          {flights.map((flight) => (
            <li key={flight.flightId}>
              <h3>Flight Number: {flight.flightNumber}</h3>
              <p>Origin: {flight.origin}</p>
              <p>Destination: {flight.destination}</p>
              <p>Price: ${flight.pricePerSeat}</p>
              <p>Seats Available: {flight.availableSeats}</p>
              <button onClick={() => handleBookNow(flight.flightId)}>Book Now</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No flights found matching the criteria.</p>
      )}
    </div>
  );
};


export default FlightListPage;
