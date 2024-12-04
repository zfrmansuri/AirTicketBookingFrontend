import React, { useEffect, useState } from 'react';
import axios from 'axios';

const GetAllFlights = () => {
  const [flights, setFlights] = useState([]); // Default to an empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch flight details from the API
    const fetchFlights = async () => {
      try {
        const response = await axios.get('https://localhost:7136/api/Flight/GetAllFlights', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        console.log('API Response:', response);

        // Extract flights from $values if present
        setFlights(response.data.$values || []);
      } catch (err) {
        console.error('API Error:', err);
        setError('Failed to fetch flight details');
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
  }, []);

  if (loading) {
    return <div>Loading flights...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>All Flights</h2>
      <table>
        <thead>
          <tr>
            <th>Flight Number</th>
            <th>Origin</th>
            <th>Destination</th>
            <th>Departure Date</th>
            <th>Seats Available</th>
            <th>Price Per Seat</th>
          </tr>
        </thead>
        <tbody>
          {flights.map(flight => (
            <tr key={flight.flightId}>
              <td>{flight.flightNumber}</td>
              <td>{flight.origin}</td>
              <td>{flight.destination}</td>
              <td>{new Date(flight.departureDate).toLocaleString()}</td>
              <td>{flight.availableSeats}</td>
              <td>{flight.pricePerSeat}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GetAllFlights;
