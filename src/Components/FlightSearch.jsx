import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/FlightSearch.css";
import originImg from "../Images/Origin.svg"; // Path to origin icon
import destinationImg from "../Images/Destination.svg"; 
import DateImg from "../Images/Date.svg";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Import styles

const FlightSearch = () => {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState(null); // React DatePicker expects null for no value
  const navigate = useNavigate();

  const handleSearch = () => {
    const adjustedDate = date ? new Date(date) : null;
    if (adjustedDate) {
      adjustedDate.setDate(adjustedDate.getDate() + 1); // Increment the date by 1
    }

    navigate("/flights", {
      state: {
        origin,
        destination,
        date: adjustedDate
      },
    });
  };

  return (
    <div className="flightSearchContainer">
      <h2 className="flightSearchContainer-leftHeading">Get Your Ticket Online, <br></br>Easy and Safely</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="originDestinationContainer">
          <div className="inputWrapper">
            <img src={originImg} alt="Origin Icon" className="inputIcon" />
            <input
              type="text"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              placeholder="Origin"
              className="originInput"
            />
          </div>
          <div className="inputWrapper">
            <img src={destinationImg} alt="Destination Icon" className="inputIcon" />
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Destination"
              className="destinationInput"
            />
          </div>
        </div>
        <div className="dateContainer">
          <div className="dateWrapper">
            <DatePicker
              className="DatePicker" 
              selected={date}
              onChange={(date) => setDate(date)} // DatePicker returns a Date object
              placeholderText="Select date" // Custom placeholder
              dateFormat="yyyy-MM-dd" // Desired format for display
            />
            <img
              src={DateImg} // Path to the calendar icon
              alt="Calendar Icon"
              className="calendarIcon"
            />
          </div>
        </div>
        <button type="button" onClick={handleSearch} className="SearchButton">
          Search Flights
        </button>
      </form>
    </div>
  );
};

export default FlightSearch;
