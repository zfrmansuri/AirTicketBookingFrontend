import React, { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import AdminDashboard from "../Pages/AdminDashboard";
import UserDashboard from "../Pages/UserDashboard";
import FlightOwnerDashboard from "../Pages/FlightOwnerDashboard";

const Dashboard = () => {
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      // If no token is found, redirect to login
      navigate("/login");
    } else {
      // Decode the JWT token
      try {
        const decodedToken = jwt_decode(token);
        setRole(decodedToken.role); // Assuming the role is stored in the token
      } catch (error) {
        console.error("Invalid token", error);
        navigate("/login"); // If token is invalid, redirect to login
      }
    }
  }, [navigate]);

  // Render the dashboard based on role
  if (role === "Admin") {
    return <AdminDashboard />;
  } else if (role === "User") {
    return <UserDashboard />;
  } else if (role === "FlightOwner") {
    return <FlightOwnerDashboard />;
  } else {
    return <div>Loading...</div>; // If role is not set, show loading
  }
};

export default Dashboard;
