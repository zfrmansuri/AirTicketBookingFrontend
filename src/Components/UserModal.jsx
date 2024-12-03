import React, { useState } from "react";
import axios from "axios";
import "../CSS/Users.css"; // Assuming you have the necessary styles

const UserModal = ({ user, onClose, onDelete }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://localhost:7136/api/Authentication/DeleteProfile/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      onDelete(user.id); // Notify parent to remove deleted user
      onClose(); // Close the modal after deletion
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.Message || "An error occurred while deleting the user.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>User Details</h3>
        <p><strong>Username:</strong> {user.userName}</p>
        <p><strong>Email:</strong> {user.email || "N/A"}</p>
        <p><strong>Gender:</strong> {user.gender || "N/A"}</p>
        <p><strong>Address:</strong> {user.address || "N/A"}</p>

        {error && <p className="error">{error}</p>}

        <button onClick={handleDelete} disabled={loading}>
          {loading ? "Deleting..." : "Delete Profile"}
        </button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default UserModal;
