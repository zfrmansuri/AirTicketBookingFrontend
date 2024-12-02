import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { searchFlights } from "../Api/flightAPI";
import "../CSS/FlightListPage.css"
import arrowImg from "../Images/arrow.svg";
import airplaneImg from "../Images/airplane.svg"


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
        console.log("another one", date);
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
    <div className="flightListWrapper">
      {
        flights.length > 0 ? (
          <>
            {flights.map((flight) => (
                        <div className="flightListItem">

                <div className="flightName">
                  <h3>Flight Id:</h3>
                  <div className="flightNameImg">
                    <img src={airplaneImg} alt="img" style={{width:"15px"}} className="flightIdImg"/>
                    <p>{flight.flightNumber}</p>
                  </div>
                </div>
                <div className="flightOriginDestination">
                  <p>{flight.origin}</p>
                  <img src={arrowImg} alt="img" className="flightIdImg"/>
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
        )
      }
    </div>

  );
};


export default FlightListPage;
