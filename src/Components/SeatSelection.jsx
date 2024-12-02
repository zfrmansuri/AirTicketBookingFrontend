import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getFlightDetails } from "../Api/flightAPI"; // Add API call to fetch flight details

const SeatSelectionPage = () => {
  const { flightId } = useParams();
  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFlightDetails = async () => {
      try {
        const data = await getFlightDetails(flightId);
        console.log("flight details", data)
        console.log("flight details", data.flightSeats.$values)
        setFlight(data.flightSeats.$values);
      } catch (err) {
        setError(err.response?.data?.Message || "Error fetching flight details.");
      } finally {
        setLoading(false);
      }
    };

    fetchFlightDetails();
  }, [flightId]);

  if (loading) return <p>Loading flight details...</p>;
  if (error) return <p>{error}</p>;

  const handleSeatSelection = (seatId) => {
    console.log(`Seat ${seatId} selected.`);
    // Add booking logic here
  };

  return (
    <div>
      <h2>Seat Selection for Flight {flight.flightNumber}</h2>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {flight.map((seat) => (
          <div
            key={seat.flightSeatId}
            onClick={() => seat.isAvailable && handleSeatSelection(seat.flightSeatId)}
            style={{
              width: "50px",
              height: "50px",
              margin: "5px",
              backgroundColor: seat.isAvailable ? "green" : "red",
              cursor: seat.isAvailable ? "pointer" : "not-allowed",
            }}
          >
            {seat.seatNumber}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeatSelectionPage;
