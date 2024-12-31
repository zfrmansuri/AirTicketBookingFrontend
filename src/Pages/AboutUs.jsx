import React from "react";
import "../CSS/AboutContact.css";
import flightImage from "../Images/flight.png";

const AboutUs = () => {
  return (
    <div className="aboutUsContainer">
      <div className="imageContainer">
        <img src={flightImage} alt="Flight" />
      </div>
      <div className="descriptionContainer">
        <h1>About Us</h1>
        <p>
          Welcome to SimplyFly! We are committed to providing you with the best 
          travel experiences. From managing flights to personalized services, 
          SimplyFly makes your journeys seamless and memorable.
        </p>
      </div>
    </div>
  );
};

export default AboutUs;
