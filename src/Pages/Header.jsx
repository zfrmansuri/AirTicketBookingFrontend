import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";  // Import jwtDecode for decoding the token
import "../CSS/Header.css";
import logo from "../Images/logo.png";

// Function to check if the user is authenticated
const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  if (!token) return false;
  try {
    const decodedToken = jwtDecode(token);
    return decodedToken.exp * 1000 > Date.now(); // Check if token is expired
  } catch (error) {
    return false;
  }
};

// Header component
const Header = () => {
  const navigate = useNavigate();

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token from localStorage
    navigate("/"); // Redirect to home page after logout
    window.location.reload();
  };

  return (
    <header className="sticky-header">
      <nav className="HeaderContainer">
        <div className="logoContainer">
          <img src={logo} alt="logo" />
        </div>
        <div className="HomeNavigationContainer">
          <Link to="/">Home</Link>
          <Link to="/flights">Manage</Link>
        </div>
        <div className="loginRegister">
          {isAuthenticated() ? (
            <button onClick={handleLogout}>Logout</button>  // Show Logout button if authenticated
          ) : (
            <>
              <Link to="/login">Login / Register</Link>  
              {/* <Link to="/register">Register</Link>   */}
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
