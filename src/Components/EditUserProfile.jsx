import React, { useState, useEffect } from "react";
import axios from "axios";

const EditUserProfile = ({ user, setUsers, onClose }) => {
  const [formData, setFormData] = useState({
    userName: user.userName,
    email: user.email || "",
    gender: user.gender || "",
    address: user.address || "",
    phoneNumber: user.phoneNumber || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle editing the user profile
  const handleEdit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      // Send PUT request to edit profile
      const response = await axios.put(
        `https://localhost:7136/api/Authentication/EditProfile/${user.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Update the users list and close the modal
      setUsers((prevUsers) =>
        prevUsers.map((usr) => (usr.id === user.id ? { ...usr, ...formData } : usr))
      );
      onClose(); // Close the modal after editing
    } catch (err) {
      setError(err.response?.data?.Message || "An error occurred while editing the user.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleEdit} className="edit-form">
      <label>Username:</label>
      <input
        type="text"
        name="userName"
        value={formData.userName}
        onChange={handleChange}
        required
      />
      <label>Email:</label>
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
      />
      <label>Gender:</label>
      <input
        type="text"
        name="gender"
        value={formData.gender}
        onChange={handleChange}
      />
      <label>Address:</label>
      <input
        type="text"
        name="address"
        value={formData.address}
        onChange={handleChange}
      />

      {error && <p className="error">{error}</p>}

      <div className="modal-actions">
        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </button>
        <button type="button" onClick={onClose}>Cancel</button>
      </div>
    </form>
  );
};

export default EditUserProfile;
