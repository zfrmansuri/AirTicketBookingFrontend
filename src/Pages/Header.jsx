import React from "react";
import { Link } from "react-router-dom";
import "../CSS/Header.css"
import logo from "../Images/logo.png"

const Header = () => {
  return (
    <header className="sticky-header">
      <nav className="HeaderContainer">
        <div className="logoContainer">
          <img src={logo} alt="logo" />
        </div>
        <div className="navigationContainer">
          <Link to="/">Home</Link>
          <Link to="/flights">Manage</Link>
        </div>
        <div className="loginRegister">
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>
      </nav>
    </header>
  );
};

export default Header
