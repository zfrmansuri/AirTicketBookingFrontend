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
  const [userName, setUserName] = useState("");
  const [flights, setFlights] = useState([]);
  const [origins, setOrigins] = useState([]);
  const [filteredDestinations, setFilteredDestinations] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const decodedToken = jwtDecode(token);
        const name = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
        setUserName(name);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  // useEffect(() => {
  //   const fetchFlights = async () => {
  //     try {
  //       const response = await fetch("https://localhost:7136/api/Flight/GetAllFlightsForEveryone");
  //       const data = await response.json();
  //       if (data && data.$values) {
  //         setFlights(data.$values);

  //         const uniqueOrigins = [...new Set(data.$values.map((flight) => flight.origin))];
  //         setOrigins(uniqueOrigins);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching flights:", error);
  //     }
  //   };

  //   fetchFlights();
  // }, []);


  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const response = await fetch("https://localhost:7136/api/Flight/GetAllFlightsForEveryone");
        const data = await response.json();
  
        if (data && data.$values) {
          const today = new Date();
          today.setHours(0, 0, 0, 0); // Set time to start of the day
  
          // Filter flights for today and future
          const validFlights = data.$values.filter((flight) => {
            const flightDate = new Date(flight.departureDate); // Assuming `departureDate` holds the flight date
            return flightDate >= today; // Include only today and future dates
          });
  
          setFlights(validFlights);
  
          // Extract unique origins
          const uniqueOrigins = [...new Set(validFlights.map((flight) => flight.origin))];
          setOrigins(uniqueOrigins);
        }
      } catch (error) {
        console.error("Error fetching flights:", error);
      }
    };
  
    fetchFlights();
  }, []);
  


  useEffect(() => {
    if (origin) {
      const destinations = flights
        .filter((flight) => flight.origin === origin)
        .map((flight) => flight.destination);
      setFilteredDestinations([...new Set(destinations)]);
    } else {
      setFilteredDestinations([]);
    }
  }, [origin, flights]);

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

  const isFormValid = origin && destination && date; // Ensure all fields are filled

  return (
    <div className="flightSearchContainer">
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
            <select
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="originInput"
            >
              <option value="">Select Origin</option>
              {origins.map((origin, index) => (
                <option key={index} value={origin}>
                  {origin}
                </option>
              ))}
            </select>
          </div>
          <div className="inputWrapper">
            <img src={destinationImg} alt="Destination Icon" className="inputIcon" />
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="destinationInput"
              disabled={!origin}
            >
              <option value="">Select Destination</option>
              {filteredDestinations.map((destination, index) => (
                <option key={index} value={destination}>
                  {destination}
                </option>
              ))}
            </select>
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
              minDate={new Date()} // Set minimum selectable date to today
            />
            <img
              src={DateImg}
              alt="Calendar Icon"
              className="calendarIcon"
            />
          </div>
        </div>
        <button
          type="button"
          onClick={handleSearch}
          className="SearchButton"
          disabled={!isFormValid} // Disable button if form is incomplete
        >
          Search Flights
        </button>
      </form>
    </div>
  );
};

export default FlightSearch;
