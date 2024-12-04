import React, { useState } from "react";
import axios from "axios";
import "../CSS/AddNewFlight.css"; // Include the new CSS file

const AddNewFlight = () => {
  const [flightDetails, setFlightDetails] = useState({
    flightNumber: "",
    origin: "",
    destination: "",
    departureDate: "",
    availableSeats: "",
    pricePerSeat: "",
  });

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFlightDetails({ ...flightDetails, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (
      !flightDetails.flightNumber ||
      !flightDetails.origin ||
      !flightDetails.destination ||
      !flightDetails.departureDate ||
      flightDetails.availableSeats <= 0 ||
      flightDetails.pricePerSeat <= 0
    ) {
      setError("All fields are required and must have valid values!");
      return;
    }

    try {
      const response = await axios.post(
        "https://localhost:7136/api/Flight/AddFlight",
        flightDetails,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        setSuccessMessage("New flight added successfully!");
        setFlightDetails({
          flightNumber: "",
          origin: "",
          destination: "",
          departureDate: "",
          availableSeats: "",
          pricePerSeat: "",
        });
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || "An error occurred while adding the flight.");
      } else if (error.request) {
        setError("Network error. Please try again.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="add-flight-page">
      <div className="add-flight-container">
        <h2 className="add-flight-title">Add New Flight</h2>
        <form className="add-flight-form" onSubmit={handleSubmit}>
          <div className="row">
            <input
              type="text"
              name="flightNumber"
              placeholder="Flight Number"
              className="add-flight-input-field"
              value={flightDetails.flightNumber}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="origin"
              placeholder="Origin"
              className="add-flight-input-field"
              value={flightDetails.origin}
              onChange={handleInputChange}
            />
          </div>
          <div className="row">
            <input
              type="text"
              name="destination"
              placeholder="Destination"
              className="add-flight-input-field"
              value={flightDetails.destination}
              onChange={handleInputChange}
            />
            <input
              type="datetime-local"
              name="departureDate"
              placeholder="Departure Date"
              className="add-flight-input-field"
              value={flightDetails.departureDate}
              onChange={handleInputChange}
            />
          </div>
          <div className="row">
            <input
              type="number"
              name="availableSeats"
              placeholder="Available Seats"
              className="add-flight-input-field"
              value={flightDetails.availableSeats}
              onChange={handleInputChange}
              min="1"
            />
            <input
              type="number"
              name="pricePerSeat"
              placeholder="Price per Seat"
              className="add-flight-input-field"
              value={flightDetails.pricePerSeat}
              onChange={handleInputChange}
              min="1"
            />
          </div>
          {error && <p className="add-flight-error-message">{error}</p>}
          <button type="submit" className="add-flight-button">Add Flight</button>
        </form>
        {successMessage && <p className="success-message">{successMessage}</p>}
      </div>
    </div>
  );
};

export default AddNewFlight;
