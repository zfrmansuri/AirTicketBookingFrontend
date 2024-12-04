import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation, Link } from "react-router-dom"; // Import Link
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
      console.log(err);
      // setError(err.response?.data?.title || "Registration failed.");
      const validationErrors = err.response?.data?.errors || {};
      const errorMessages = [];

      for (const field in validationErrors) {
        if (Object.hasOwn(validationErrors, field)) {
          errorMessages.push(...validationErrors[field]);
        }
      }

      setError(errorMessages.length ? errorMessages : ["Registration failed."]);
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
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="input-field"
              value={formData.email}
              onChange={handleChange}
              required
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
              required
            />
            <select
              name="gender"
              className="input-field"
              value={formData.gender}
              onChange={handleChange}
              required
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
              required
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
              required
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              className="input-field"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          {/* {error && <p className="error-message">{error.map}</p>} */}

          {error && (
            <div className="error-messages">
              {error.map((errMsg, index) => (
                <p key={index} className="error-message">
                  {errMsg}
                </p>
              ))}
            </div>
          )}

          <button type="submit" className="register-button">
            Signup
          </button>
        </form>
        <p className="signup-text">
          Already have an account?{" "}
          <Link to="/login" className="login-link">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
