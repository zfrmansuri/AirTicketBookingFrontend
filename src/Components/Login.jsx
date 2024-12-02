import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import "../CSS/Login.css"; // Include the CSS file for styling

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const redirectTo = location.state?.from || "/";

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("https://localhost:7136/api/Authentication/Login", {
                email,
                password,
            });
            localStorage.setItem("token", response.data.token.token); // Save JWT
            console.log(response.data.token.token)
            navigate(redirectTo); // Redirect to the page where the user came from
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
                {/* <a href="#" className="forgot-password">Forgot password?</a> */}
                <p className="signup-text">
                    Don't have an account? <span onClick={handleRegisterRedirect} className="signup-link">Signup</span>
                </p>
            </div>
        </div>
    );
};

export default Login;
