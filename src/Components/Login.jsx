import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "../CSS/Login.css";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [validationError, setValidationError] = useState({ email: "", password: "" }); // Track field-specific validation errors
    const navigate = useNavigate();
    const location = useLocation();
    const redirectTo = location.state?.from || "/";

    const validateEmail = (value) => {
        if (!value.trim()) {
            return "Email is required.";
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            return "Invalid email format.";
        }
        return "";
    };

    const validatePassword = (value) => {
        if (!value.trim()) {
            return "Password is required.";
        }
        if (value.length < 6) {
            return "Password must be at least 6 characters long.";
        }
        return "";
    };

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        setValidationError((prev) => ({
            ...prev,
            email: validateEmail(value),
        }));
    };

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);
        setValidationError((prev) => ({
            ...prev,
            password: validatePassword(value),
        }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        const emailError = validateEmail(email);
        const passwordError = validatePassword(password);

        if (emailError || passwordError) {
            setValidationError({ email: emailError, password: passwordError });
            return;
        }

        try {
            const response = await axios.post("https://localhost:7136/api/Authentication/Login", {
                email,
                password,
            });

            const token = response.data.token.token;
            localStorage.setItem("token", token);

            const decodedToken = jwtDecode(token);
            const userRole = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

            if (redirectTo === "/") {
                if (userRole === "Admin") {
                    navigate("/admin-dashboard/flight-search");
                } else if (userRole === "User") {
                    navigate("/user-dashboard/flight-search");
                } else if (userRole === "FlightOwner") {
                    navigate("/flightowner-dashboard/flight-search");
                } else {
                    console.error("Unknown user role");
                }
            } else {
                navigate(redirectTo);
            }

        } catch (err) {
            console.log(err)
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
                    <div className="input-container">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={handleEmailChange}
                            className={`input-field ${validationError.email ? "input-error" : ""}`}
                        />
                        {validationError.email && <p className="validation-error">{validationError.email}</p>}
                    </div>
                    <div className="input-container">
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={handlePasswordChange}
                            className={`input-field ${validationError.password ? "input-error" : ""}`}
                        />
                        {validationError.password && <p className="validation-error">{validationError.password}</p>}
                    </div>
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
