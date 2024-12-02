import React from "react";

const FlightList = ({ flights, onSelectFlight }) => {
  return (
    <div>
      {flights.map((flight) => (
        <div key={flight.id} className="flight-item">
          <h4>{flight.name}</h4>
          <p>Departure: {flight.departure}</p>
          <p>Destination: {flight.destination}</p>
          <button onClick={() => onSelectFlight(flight.id)}>Select Seat</button>
        </div>
      ))}
    </div>
  );
};

export default FlightList;
