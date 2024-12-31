import React from "react";
import "../CSS/AboutContact.css";
import flightImage from "../Images/flight.png";

const ContactUs = () => {
  return (
    <div className="contactUsContainer">
      <div className="imageContainer">
        <img src={flightImage} alt="Flight" />
      </div>
      <div className="descriptionContainer">
        <h1>Contact Us</h1>
        <p>
          Have questions or need assistance? Reach out to us at:
          <br />
          <strong>Email:</strong> support@simplyfly.com
          <br />
          <strong>Phone:</strong> +1 800 123 4567
        </p>
      </div>
    </div>
  );
};

export default ContactUs;
