import React, { useState } from 'react';
import axios from 'axios';
import "../CSS/Register.css"; // Use the same CSS file as Register.jsx

// Success modal component
const SuccessModal = ({ message, onClose }) => (
  <div className="modal-overlay">
    <div className="modal-content">
      <h2>{message}</h2>
      <button onClick={onClose}>Close</button>
    </div>
  </div>
);

const RegisterFlightOwner = () => {
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    phoneNumber: '',
    gender: 'Male',
    address: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false); // State to control modal visibility
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post(
        'https://localhost:7136/api/Authentication/RegisterFlightOwner',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setSuccessMessage(response.data.Message);
      setError('');
      setFormData({
        userName: '',
        email: '',
        phoneNumber: '',
        gender: 'Male',
        address: '',
        password: '',
        confirmPassword: ''
      });

      // Show the success modal after successful registration
      setShowSuccessModal(true);
    } catch (err) {
      setError('Error registering flight owner. Please try again.');
      setSuccessMessage('');
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false); // Close the modal when the close button is clicked
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <h2 className="register-title">Register as Flight Owner</h2>
        <form className="register-form" onSubmit={handleSubmit}>
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
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="register-button">Register</button>
        </form>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <SuccessModal
          message={successMessage || "Registration successful!"}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default RegisterFlightOwner;
