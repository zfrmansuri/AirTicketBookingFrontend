import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";  // Correct import
import "../CSS/Login.css"; // Include the CSS file for styling

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const redirectTo = location.state?.from || "/"; // Set redirect after login

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("https://localhost:7136/api/Authentication/Login", {
                email,
                password,
            });
            const token = response.data.token.token;
            localStorage.setItem("token", token); // Save JWT

            // Decode the token to get the user's role
            const decodedToken = jwtDecode(token);
            console.log(decodedToken); // Log the decoded token to check the role

            // Navigate based on role
            const userRole = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]; // Access role from decoded token

            if (userRole === "Admin") {
                navigate("/admin-dashboard");  // Admin Dashboard
            } else if (userRole === "User") {
                navigate("/user-dashboard");  // User Dashboard
            } else if (userRole === "FlightOwner") {
                navigate("/flightowner-dashboard");  // FlightOwner Dashboard
            } else {
                // Default redirect if role is not matched
                navigate(redirectTo);
            }
        } catch (err) {
            setError("Invalid login credentials.");
        }
    };

    const handleRegisterRedirect = () => {
        navigate("/register", { state: { from: redirectTo } });
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <h2 className="login-title">Login</h2>
                <form onSubmit={handleLogin} className="login-form">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input-field"
                    />
                    <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input-field"
                    />
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit" className="login-button">Login</button>
                </form>
                <p className="signup-text">
                    Don't have an account? <span onClick={handleRegisterRedirect} className="signup-link">Signup</span>
                </p>
            </div>
        </div>
    );
};

export default Login;
