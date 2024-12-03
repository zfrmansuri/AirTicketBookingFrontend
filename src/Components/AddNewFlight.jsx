// src/Components/AddNewFlight.js
import React, { useState } from 'react';
import axios from 'axios';

const AddNewFlight = () => {
  const [flightDetails, setFlightDetails] = useState({
    flightNumber: '',
    origin: '',
    destination: '',
    departureDate: '', // This will be in ISO format (e.g., "2024-12-03T12:56:44.299Z")
    availableSeats: 0,
    pricePerSeat: 0,
  });

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFlightDetails({ ...flightDetails, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset error and success message
    setError('');
    setSuccessMessage('');

    // Ensure all fields are filled out before submitting
    if (
      !flightDetails.flightNumber ||
      !flightDetails.origin ||
      !flightDetails.destination ||
      !flightDetails.departureDate ||
      flightDetails.availableSeats <= 0 ||
      flightDetails.pricePerSeat <= 0
    ) {
      setError('All fields are required and must have valid values!');
      return;
    }

    // Prepare data in the required format
    const flightData = {
      flightNumber: flightDetails.flightNumber,
      origin: flightDetails.origin,
      destination: flightDetails.destination,
      departureDate: flightDetails.departureDate, // Use ISO string format
      availableSeats: flightDetails.availableSeats,
      pricePerSeat: flightDetails.pricePerSeat,
    };

    try {
      // Make API call to add the flight
      const response = await axios.post(
        'https://localhost:7136/api/Flight/AddFlight', // Replace with actual API endpoint
        flightData,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`, // Add the token if required for authentication
          },
        }
      );
      
      if (response.status === 200) {
        setSuccessMessage('New flight added successfully!');
        setFlightDetails({
          flightNumber: '',
          origin: '',
          destination: '',
          departureDate: '',
          availableSeats: 0,
          pricePerSeat: 0,
        });
      }
    } catch (error) {
      if (error.response) {
        // Backend error (i.e., HTTP status code outside of 2xx)
        setError(error.response.data.message || 'An error occurred while adding the flight.');
      } else if (error.request) {
        // Network error or no response
        setError('Network error. Please try again.');
      } else {
        // General error or unexpected issues
        setError('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <div>
      <h2>Add New Flight</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Flight Number:</label>
          <input
            type="text"
            name="flightNumber"
            value={flightDetails.flightNumber}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Origin:</label>
          <input
            type="text"
            name="origin"
            value={flightDetails.origin}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Destination:</label>
          <input
            type="text"
            name="destination"
            value={flightDetails.destination}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Departure Date:</label>
          <input
            type="datetime-local"
            name="departureDate"
            value={flightDetails.departureDate}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Available Seats:</label>
          <input
            type="number"
            name="availableSeats"
            value={flightDetails.availableSeats}
            onChange={handleInputChange}
            required
            min="1"
          />
        </div>
        <div>
          <label>Price per Seat:</label>
          <input
            type="number"
            name="pricePerSeat"
            value={flightDetails.pricePerSeat}
            onChange={handleInputChange}
            required
            min="1"
          />
        </div>
        <button type="submit">Add Flight</button>
      </form>

      {/* Display error or success messages */}
      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
    </div>
  );
};

export default AddNewFlight;
