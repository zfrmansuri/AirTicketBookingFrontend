import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../CSS/Users.css'; // Assuming the CSS file is named Users.css

const GetAllFlights = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [ownerNames, setOwnerNames] = useState({});

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const response = await axios.get('https://localhost:7136/api/Flight/GetAllFlights', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        // console.log(response.data)
        const flightsData = response.data.$values || [];
        setFlights(response.data.$values || []);
        console.log(response.data.$values)

        // Fetch usernames for flightOwnerId
        const usernames = {};
        await Promise.all(
          flightsData.map(async (flight) => {
            if (flight.flightOwnerId) {
              const ownerResponse = await axios.get(
                `https://localhost:7136/api/Flight/GetUserNameById?id=${flight.flightOwnerId}`,
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                  },
                }
              );
              usernames[flight.flightOwnerId] = ownerResponse.data.username;
            }
          })
        );

        setOwnerNames(usernames);

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
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
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
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
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
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
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
    return <div className="loading-indicator">Loading flights...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="usersContainer">
      <h2>All Flights</h2>
      <table className="usersTable">
        <thead>
          <tr>
            <th>Flight Number</th>
            <th>Flight Owner</th> {/* New Column */}
            <th>Origin</th>
            <th>Destination</th>
            <th>Departure Date</th>
            <th>Total Seats</th>
            <th>Price Per Seat</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {flights.map((flight) => (
            <tr key={flight.flightId}>
              <td>{flight.flightNumber}</td>
              <td>{ownerNames[flight.flightOwnerId] || 'Loading...'}</td> {/* Flight Owner */}
              <td>{flight.origin}</td>
              <td>{flight.destination}</td>
              <td>{new Date(flight.departureDate).toLocaleString()}</td>
              <td>{flight.availableSeats}</td>
              <td>{flight.pricePerSeat}</td>
              <td>
                <button
                  className="editButton"
                  onClick={() => fetchFlightDetails(flight.flightId)}
                >
                  Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isPopupOpen && selectedFlight && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{isEditMode ? 'Edit Flight' : 'Flight Details'}</h3>
            {isEditMode ? (
              <div>
                <div className="edit-form-indiviual-field">
                  <label>
                    Flight Number:
                    <input
                      name="flightNumber"
                      value={selectedFlight.flightNumber}
                      onChange={handleInputChange}
                    />
                  </label>
                </div>
                <div className="edit-form-indiviual-field">
                  <label>
                    Origin:
                    <input
                      name="origin"
                      value={selectedFlight.origin}
                      onChange={handleInputChange}
                    />
                  </label>
                </div>
                <div className="edit-form-indiviual-field">
                  <label>
                    Destination:
                    <input
                      name="destination"
                      value={selectedFlight.destination}
                      onChange={handleInputChange}
                    />
                  </label>
                </div>
                <div className="edit-form-indiviual-field">
                  <label>
                    Departure Date:
                    <input
                      name="departureDate"
                      type="datetime-local"
                      value={new Date(selectedFlight.departureDate)
                        .toISOString()
                        .slice(0, -8)}
                      onChange={handleInputChange}
                    />
                  </label>
                </div>
                <div className="edit-form-indiviual-field">
                  <label>
                    Available Seats:
                    <input
                      name="availableSeats"
                      type="number"
                      value={selectedFlight.availableSeats}
                      onChange={handleInputChange}
                    />
                  </label>
                </div>
                <div className="edit-form-indiviual-field">
                  <label>
                    Price Per Seat:
                    <input
                      name="pricePerSeat"
                      type="number"
                      value={selectedFlight.pricePerSeat}
                      onChange={handleInputChange}
                    />
                  </label>
                </div>
                <button className="editButton" onClick={updateFlight}>
                  Save
                </button>
                <button className="editButton" onClick={() => setIsEditMode(false)}>
                  Cancel
                </button>
              </div>
            ) : (
              <div>
                <p>
                  <strong>Flight Number:</strong> {selectedFlight.flightNumber}
                </p>
                <p>
                  <strong>Origin:</strong> {selectedFlight.origin}
                </p>
                <p>
                  <strong>Destination:</strong> {selectedFlight.destination}
                </p>
                <p>
                  <strong>Departure Date:</strong>{' '}
                  {new Date(selectedFlight.departureDate).toLocaleString()}
                </p>
                <p>
                  <strong>Seats Available:</strong> {selectedFlight.availableSeats}
                </p>
                <p>
                  <strong>Price Per Seat:</strong> {selectedFlight.pricePerSeat}
                </p>
                <button
                  className="get-all-flights-editButton"
                  onClick={() => setIsEditMode(true)}
                >
                  Edit
                </button>
                <button
                  className="editButton"
                  style={{ backgroundColor: 'red', color: 'white' }}
                  onClick={() => deleteFlight(selectedFlight.flightId)}
                >
                  Delete
                </button>
              </div>
            )}
            <button className="get-all-flights-close-btn" onClick={closePopup}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GetAllFlights;



