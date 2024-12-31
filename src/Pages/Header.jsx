// import React from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { jwtDecode } from "jwt-decode";  // Import jwtDecode for decoding the token
// import "../CSS/Header.css";
// import logo from "../Images/logo.png";

// // Function to check if the user is authenticated
// const isAuthenticated = () => {
//   const token = localStorage.getItem("token");
//   if (!token) return false;
//   try {
//     const decodedToken = jwtDecode(token);
//     return decodedToken.exp * 1000 > Date.now(); // Check if token is expired
//   } catch (error) {
//     return false;
//   }
// };

// // Header component
// const Header = () => {
//   const navigate = useNavigate();

//   // Handle Logout
//   const handleLogout = () => {
//     localStorage.removeItem("token"); // Remove token from localStorage
//     navigate("/"); // Redirect to home page after logout
//     window.location.reload();
//   };

//   return (
//     <header className="sticky-header">
//       <nav className="HeaderContainer">
//         <div className="logoContainer">
//           <img src={logo} alt="logo" />
//         </div>
//         <div className="HomeNavigationContainer">
//           {/* <Link to="/">Home</Link>
//           <Link to="/flights">Manage</Link> */}
//           <p>SimplyFly</p>
//         </div>
//         <div className="loginRegister">
//           {isAuthenticated() ? (
//             <button onClick={handleLogout}>Logout</button>  // Show Logout button if authenticated
//           ) : (
//             <>
//               <Link to="/login">Login / Register</Link>  
//               {/* <Link to="/register">Register</Link>   */}
//             </>
//           )}
//         </div>
//       </nav>
//     </header>
//   );
// };

// export default Header;

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";  // Import jwtDecode for decoding the token
import "../CSS/Header.css";
import logo from "../Images/logo.png";
import AdminDashboard from "./AdminDashboard";
import UserDashboard from "./UserDashboard";
import FlightOwnerDashboard from "./FlightOwnerDashboard";
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
  const [dashboard, setDashboard] = useState(null);
  const [role, setRole] = useState("")

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token from localStorage
    navigate("/"); // Redirect to home page after logout
    window.location.reload();
  };
  const getUserRole = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      const decodedToken = jwtDecode(token);
      const roles = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]; // Microsoft Identity role claim
      console.log(roles);

      // Set the role first, then set the dashboard
      setRole(roles);
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  // useEffect to call getUserRole once on component mount
  useEffect(() => {
    getUserRole();
  }, []); // Empty dependency array to run only on component mount

  // useEffect to update the dashboard after role is set
  useEffect(() => {
    if (role) {
      // Once role is available, set the dashboard based on the role
      if (role === "Admin") setDashboard(<AdminDashboard />);
      else if (role === "User") setDashboard(<UserDashboard />);
      else if (role === "FlightOwner") setDashboard(<FlightOwnerDashboard />);
      else setDashboard(null);
    }
  }, [role]); // This useEffect will run when role changes
  const getRoleBasedLink = () => {
    if (role === "Admin") return "/admin-dashboard/flight-search";
    if (role === "User") return "/user-dashboard/flight-search";
    if (role === "FlightOwner") return "/flightowner-dashboard/flight-search";
  };
  return (
    <header className="sticky-header">
      <nav className="HeaderContainer" style={{top: 0}}>
        <div className="logoContainer">
          {/* <img src={logo} alt="logo" /> */}
        </div>
        <div className="HomeNavigationContainer" >
        {dashboard}
         <Link to={getRoleBasedLink()}><p>SimplyFly</p></Link>
          <Link to="/about-us" className="Navigation-Links" style={{"margin-left": "5vw"}}>About Us</Link> {/* Add About Us */}
          <Link to="/contact-us" className="Navigation-Links">Contact Us</Link> {/* Add Contact Us */}
        </div>
        <div className="loginRegister">
          {isAuthenticated() ? (
            <button onClick={handleLogout}>Logout</button>  // Show Logout button if authenticated
          ) : (
            <>
              <Link to="/login">Login / Register</Link>  
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
