import React, { useEffect, useState } from 'react';
import axios from 'axios';

const GetAllFlights = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFlight, setSelectedFlight] = useState(null); // Flight for the popup
  const [isPopupOpen, setIsPopupOpen] = useState(false); // State to control popup visibility
  const [isEditMode, setIsEditMode] = useState(false); // State to toggle between view and edit modes

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const response = await axios.get('https://localhost:7136/api/Flight/GetAllFlights', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setFlights(response.data.$values || []);
      } catch (err) {
        setError('Failed to fetch flight details');
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
  }, []);

  const fetchFlightDetails = async (flightId) => {
    try {
      const response = await axios.get(`https://localhost:7136/api/Flight/GetFlightDetails/${flightId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setSelectedFlight(response.data);
      setIsPopupOpen(true);
    } catch (err) {
      console.error('Failed to fetch flight details:', err);
    }
  };

  const deleteFlight = async (flightId) => {
    try {
      await axios.delete(`https://localhost:7136/api/Flight/RemoveFlight/${flightId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      alert('Flight deleted successfully!');
      setFlights(flights.filter((flight) => flight.flightId !== flightId));
      setIsPopupOpen(false);
    } catch (err) {
      console.error('Failed to delete flight:', err);
      alert('Error deleting flight.');
    }
  };

  const updateFlight = async () => {
    try {
      await axios.put(
        `https://localhost:7136/api/Flight/UpdateFlight/${selectedFlight.flightId}`,
        selectedFlight,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      alert('Flight updated successfully!');
      setFlights((prev) =>
        prev.map((flight) =>
          flight.flightId === selectedFlight.flightId ? selectedFlight : flight
        )
      );
      setIsEditMode(false);
      setIsPopupOpen(false);
    } catch (err) {
      console.error('Failed to update flight:', err);
      alert('Error updating flight.');
    }
  };

  const closePopup = () => {
    setSelectedFlight(null);
    setIsPopupOpen(false);
    setIsEditMode(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedFlight({ ...selectedFlight, [name]: value });
  };

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
            <th>Actions</th>
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
              <td>
                <button onClick={() => fetchFlightDetails(flight.flightId)} style={{ marginRight: '10px' }}>
                  Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Popup Window */}
      {isPopupOpen && selectedFlight && (
        <div className="popup">
          <div className="popup-content">
            <h3>{isEditMode ? 'Edit Flight' : 'Flight Details'}</h3>
            {isEditMode ? (
              <div>
                <label>
                  Flight Number:
                  <input
                    name="flightNumber"
                    value={selectedFlight.flightNumber}
                    onChange={handleInputChange}
                  />
                </label>
                <label>
                  Origin:
                  <input
                    name="origin"
                    value={selectedFlight.origin}
                    onChange={handleInputChange}
                  />
                </label>
                <label>
                  Destination:
                  <input
                    name="destination"
                    value={selectedFlight.destination}
                    onChange={handleInputChange}
                  />
                </label>
                <label>
                  Departure Date:
                  <input
                    name="departureDate"
                    type="datetime-local"
                    value={new Date(selectedFlight.departureDate).toISOString().slice(0, -8)}
                    onChange={handleInputChange}
                  />
                </label>
                <label>
                  Available Seats:
                  <input
                    name="availableSeats"
                    type="number"
                    value={selectedFlight.availableSeats}
                    onChange={handleInputChange}
                  />
                </label>
                <label>
                  Price Per Seat:
                  <input
                    name="pricePerSeat"
                    type="number"
                    value={selectedFlight.pricePerSeat}
                    onChange={handleInputChange}
                  />
                </label>
                <button onClick={updateFlight} style={{ backgroundColor: 'green', color: 'white', marginRight: '10px' }}>
                  Save
                </button>
                <button onClick={() => setIsEditMode(false)}>Cancel</button>
              </div>
            ) : (
              <div>
                <p><strong>Flight Number:</strong> {selectedFlight.flightNumber}</p>
                <p><strong>Origin:</strong> {selectedFlight.origin}</p>
                <p><strong>Destination:</strong> {selectedFlight.destination}</p>
                <p><strong>Departure Date:</strong> {new Date(selectedFlight.departureDate).toLocaleString()}</p>
                <p><strong>Seats Available:</strong> {selectedFlight.availableSeats}</p>
                <p><strong>Price Per Seat:</strong> {selectedFlight.pricePerSeat}</p>
                <button onClick={() => setIsEditMode(true)} style={{ marginRight: '10px' }}>Edit</button>
                <button onClick={() => deleteFlight(selectedFlight.flightId)} style={{ backgroundColor: 'red', color: 'white' }}>
                  Delete
                </button>
              </div>
            )}
            <button onClick={closePopup} style={{ marginTop: '10px' }}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GetAllFlights;