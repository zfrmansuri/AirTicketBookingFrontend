import React, { useState, useEffect } from "react";
import axios from "axios";
import UserModal from "./UserModal";
import "../CSS/Users.css";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]); // Users filtered by the search box
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRole, setSelectedRole] = useState("User"); // Default role is "User"
  const [selectedUser, setSelectedUser] = useState(null); // State to store the selected user for the modal
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const [searchTerm, setSearchTerm] = useState(""); // Search term for filtering users

  const USERS_PER_PAGE = 6; // Maximum users to display per page

  // Function to fetch users by role
  const fetchUsersByRole = async (role) => {
    setLoading(true);
    setError(null);
    setSelectedRole(role);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `https://localhost:7136/api/Authentication/GetUsersByRole/${role}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const usersData = response.data?.$values || [];
      setUsers(usersData);
      setFilteredUsers(usersData); // Initialize filteredUsers with all users
      setSearchTerm(""); // Reset search box
      setCurrentPage(1); // Reset pagination
    } catch (err) {
      console.error("Failed to fetch users by role:", err);
      setError(err.response?.data?.message || "An error occurred while fetching users.");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Close the modal
  const handleCloseModal = () => {
    setSelectedUser(null);
  };

  // Handle user delete by filtering out the deleted user
  const handleUserDelete = (id) => {
    setUsers(users.filter((user) => user.id !== id));
    setFilteredUsers(filteredUsers.filter((user) => user.id !== id));
  };

  // Filter users by search term (username or email)
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(
        users.filter(
          (user) =>
            user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
        )
      );
    }
    setCurrentPage(1); // Reset to the first page after filtering
  }, [searchTerm, users]);

  // Fetch "User" role data by default on component mount
  useEffect(() => {
    fetchUsersByRole("User");
  }, []);

  // Calculate pagination indices
  const startIndex = (currentPage - 1) * USERS_PER_PAGE;
  const currentPageUsers = filteredUsers.slice(startIndex, startIndex + USERS_PER_PAGE);

  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);

  return (
    <div className="usersContainer">
      <h2>Manage Users</h2>

      {/* Search Box */}
      <div className="searchBar">
        <input
          type="text"
          placeholder="Search by username or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Role Selection Buttons */}
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

      {/* Users Table */}
      <table className="usersTable">
        <thead>
          <tr>
            <th>User ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Gender</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentPageUsers.length > 0 ? (
            currentPageUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.userName}</td>
                <td>{user.email || "N/A"}</td>
                <td>{user.gender || "N/A"}</td>
                <td>{user.address || "N/A"}</td>
                <td>
                  <button
                    className="editButton"
                    onClick={() => setSelectedUser(user)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))
          ) : (
            !loading &&
            !error && (
              <tr>
                <td colSpan="6" className="noData">
                  No users found for role: {selectedRole}
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}

      {/* User Modal */}
      {selectedUser && (
        <UserModal
          user={selectedUser}
          onClose={handleCloseModal}
          onDelete={handleUserDelete}
          setUsers={setUsers}
        />
      )}
    </div>
  );
};

export default Users;
