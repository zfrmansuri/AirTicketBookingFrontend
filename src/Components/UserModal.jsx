import React, { useState } from "react";
import axios from "axios";
import EditUserProfile from "./EditUserProfile"; // Import the EditUserProfile component
import "../CSS/Users.css"; // Assuming you have the necessary styles

const UserModal = ({ user, onClose, onDelete, setUsers }) => {
  const [showEdit, setShowEdit] = useState(false); // Flag to toggle between edit and view mode
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle user deletion
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

        {showEdit ? (
          // Render the EditUserProfile component when in edit mode
          <EditUserProfile user={user} setUsers={setUsers} onClose={onClose} />
        ) : (
          <>
            <p><strong>Username :</strong> {user.userName}</p>
            <p><strong>Email :</strong> {user.email || "N/A"}</p>
            <p><strong>Gender :</strong> {user.gender || "N/A"}</p>
            <p><strong>Address :</strong> {user.address || "N/A"}</p>

            {error && <p className="error">{error}</p>}

            <div className="modal-actions">
              <button onClick={() => setShowEdit(true)}>Edit Profile</button>
              <button onClick={handleDelete} disabled={loading}>
                {loading ? "Deleting..." : "Delete Profile"}
              </button>
              <button onClick={onClose}>Close</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserModal;
