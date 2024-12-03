import React, { useState } from 'react';
import axios from 'axios'; // Import Axios for API requests

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
    gender: 'Male', // Default value for gender
    address: '',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false); // State to control modal visibility

  // Handle input field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submission
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
            'Authorization': `Bearer ${localStorage.getItem('token')}`, // Add token if needed
            'Content-Type': 'application/json'
          }
        }
      );

      setMessage(response.data.Message);
      setError(''); // Clear error if registration is successful
      setFormData({
        userName: '',
        email: '',
        gender: 'Male',
        address: '',
        phoneNumber: '',
        password: '',
        confirmPassword: ''
      }); // Clear the form after successful submission

      // Show the success modal after registration
      setShowSuccessModal(true);
    } catch (err) {
      setMessage('');
      setError('Error registering flight owner. Please try again.');
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false); // Close the modal when the close button is clicked
  };

  return (
    <div className="register-flight-owner">
      <h2>Register a Flight Owner</h2>
      <form onSubmit={handleSubmit}>
        {/* User Name */}
        <div>
          <label htmlFor="userName">User Name:</label>
          <input
            type="text"
            id="userName"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            required
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Gender */}
        <div>
          <label htmlFor="gender">Gender:</label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Address */}
        <div>
          <label htmlFor="address">Address:</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>

        {/* Phone Number */}
        <div>
          <label htmlFor="phoneNumber">Phone Number:</label>
          <input
            type="text"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        {/* Error and Success Messages */}
        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}

        {/* Submit Button */}
        <button type="submit">Register Flight Owner</button>
      </form>

      {/* Show the success modal if registration is successful */}
      {showSuccessModal && (
        <SuccessModal message="Registration successful!" onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default RegisterFlightOwner;
