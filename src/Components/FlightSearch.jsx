import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "../CSS/FlightSearch.css";
import originImg from "../Images/Origin.svg";
import destinationImg from "../Images/Destination.svg";
import DateImg from "../Images/Date.svg";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const FlightSearch = () => {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState(null);
  const [userName, setUserName] = useState("")
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        let decodedToken = jwtDecode(token);
        decodedToken = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
        setUserName(decodedToken);
      }
    } catch (error) {
      console.log(error)
    }
  }, []);
  

  const handleSearch = () => {
    const adjustedDate = date ? new Date(date) : null;
    if (adjustedDate) {
      adjustedDate.setDate(adjustedDate.getDate() + 1);
    }

    navigate("/flights", {
      state: {
        origin,
        destination,
        date: adjustedDate,
      },
    });
  };

  return (
    <div className="flightSearchContainer">
      {/* <h2 className="flightSearchContainer-leftHeading">
        Get Your Ticket Online, <br />
        Easy and Safely
      </h2> */}

      <h2 className="flightSearchContainer-leftHeading">
        {userName ? (
          <>
            Hey <span>{userName}</span>, <br />
            Welcome to SimplyFly
          </>
        ) : (
          <>
            Get Your Ticket Online, <br />
            Easy and Safely
          </>
        )}
      </h2>


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
              onChange={(date) => setDate(date)}
              placeholderText="Select date"
              dateFormat="yyyy-MM-dd"
            />
            <img
              src={DateImg}
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
