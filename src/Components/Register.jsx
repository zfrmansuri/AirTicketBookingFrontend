import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import "../CSS/Register.css"; // Assuming you have the CSS file ready

const Register = () => {
    const [formData, setFormData] = useState({
        userName: "",
        email: "",
        phoneNumber: "",
        gender: "",
        address: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const redirectTo = location.state?.from || "/";

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                "https://localhost:7136/api/Authentication/RegisterUser",
                formData
            );
            console.log(response);
            const loginResponse = await axios.post(
                "https://localhost:7136/api/Authentication/Login",
                {
                    email: formData.email,
                    password: formData.password,
                }
            );
            localStorage.setItem("token", loginResponse.data.token); // Save JWT
            navigate(redirectTo); // Redirect to the page where the user came from
        } catch (err) {
            console.log(err)
            setError(err.response?.data?.title || "Registration failed.");
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="register-page">
            <div className="register-container">
                <h2 className="register-title">Signup</h2>
                <form className="register-form" onSubmit={handleRegister}>
                    <div className="row">
                        <input
                            type="text"
                            name="userName"
                            placeholder="Full Name"
                            className="input-field"
                            value={formData.userName}
                            onChange={handleChange}
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            className="input-field"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="row">
                        <input
                            type="text"
                            name="phoneNumber"
                            placeholder="Phone Number"
                            className="input-field"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                        />
                        <select
                            name="gender"
                            className="input-field"
                            value={formData.gender}
                            onChange={handleChange}
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div>
                        <input
                            type="text"
                            name="address"
                            placeholder="Address"
                            className="input-field full-width"
                            value={formData.address}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="row">
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            className="input-field"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            className="input-field"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                        />
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit" className="register-button">Signup</button>
                </form>
                <p className="signup-text">
                    Already have an account? <span className="login-link">Login</span>
                </p>
            </div>
        </div>
    );
};

export default Register;
