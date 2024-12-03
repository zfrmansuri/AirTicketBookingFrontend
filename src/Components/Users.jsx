import React, { useState, useEffect } from "react";
import axios from "axios";
import UserModal from "./UserModal";
import "../CSS/Users.css";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRole, setSelectedRole] = useState("User"); // Default role is "User"
  const [selectedUser, setSelectedUser] = useState(null); // State to store the selected user for the modal

  // Function to fetch users by role
  const fetchUsersByRole = async (role) => {
    setLoading(true);
    setError(null);
    setSelectedRole(role);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`https://localhost:7136/api/Authentication/GetUsersByRole/${role}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Extract and map `$values` from the response
      const usersData = response.data?.$values || [];
      setUsers(usersData);
    } catch (err) {
      console.error("Failed to fetch users by role:", err);
      setError(err.response?.data?.Message || "An error occurred while fetching users.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch "User" role data by default on component mount
  useEffect(() => {
    fetchUsersByRole("User");
  }, []);

  // Close the modal
  const handleCloseModal = () => {
    setSelectedUser(null);
  };

  // Handle user delete by filtering out the deleted user
  const handleUserDelete = (id) => {
    setUsers(users.filter((user) => user.id !== id)); // Remove user from the list after deletion
  };

  return (
    <div className="usersContainer">
      <h2>Manage Users</h2>

      <div className="roleButtons">
        <button
          className={`roleButton ${selectedRole === "Admin" ? "active" : ""}`}
          onClick={() => fetchUsersByRole("Admin")}
        >
          Admin
        </button>
        <button
          className={`roleButton ${selectedRole === "User" ? "active" : ""}`}
          onClick={() => fetchUsersByRole("User")}
        >
          User
        </button>
        <button
          className={`roleButton ${selectedRole === "FlightOwner" ? "active" : ""}`}
          onClick={() => fetchUsersByRole("FlightOwner")}
        >
          Flight Owner
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      <table className="usersTable">
        <thead>
          <tr>
            <th>User ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Gender</th>
            <th>Address</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id} onClick={() => setSelectedUser(user)}> {/* When a row is clicked, open the modal */}
                <td>{user.id}</td>
                <td>{user.userName}</td>
                <td>{user.email || "N/A"}</td>
                <td>{user.gender || "N/A"}</td>
                <td>{user.address || "N/A"}</td>
              </tr>
            ))
          ) : (
            !loading &&
            !error && (
              <tr>
                <td colSpan="5" className="noData">
                  No users found for role: {selectedRole}
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>

      {/* Show modal if a user is selected */}
      {selectedUser && (
        <UserModal
          user={selectedUser}
          onClose={handleCloseModal}
          onDelete={handleUserDelete}
        />
      )}
    </div>
  );
};

export default Users;
