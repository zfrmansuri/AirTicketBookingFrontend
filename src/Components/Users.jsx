// src/Components/Users.js
import React from "react";
import "../CSS/Users.css"; // CSS styles

const Users = () => {
  return (
    <div className="usersContainer">
      <h2>Manage Users</h2>
      <table className="usersTable">
        <thead>
          <tr>
            <th>User ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* Sample row, ideally populated dynamically */}
          <tr>
            <td>1</td>
            <td>john_doe</td>
            <td>john.doe@example.com</td>
            <td>User</td>
            <td>
              <button>Edit</button>
              <button>Delete</button>
            </td>
          </tr>
          {/* More rows */}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
