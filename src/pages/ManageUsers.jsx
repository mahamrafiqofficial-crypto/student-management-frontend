// src/pages/ManageUsers.jsx
import { useState, useEffect } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/users");
      setUsers(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.put(`/users/${userId}/role`, { role: newRole });
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update role");
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/users/${deleteTarget._id}`);
      setDeleteTarget(null);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete user");
      setDeleteTarget(null);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="dashboard-container">
        <h2 style={{ marginBottom: "16px" }}>Manage Users</h2>

        {error && <div className="error-msg">{error}</div>}

        {loading ? (
          <p>Loading users...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u._id, e.target.value)}
                    >
                      <option value="student">Student</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td>
                    <button
                      className="btn-delete"
                      onClick={() => setDeleteTarget(u)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {deleteTarget && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Delete User</h3>
            <p>
              Are you sure you want to delete <b>{deleteTarget.name}</b>?
            </p>
            <div className="modal-actions">
              <button className="btn-delete" onClick={handleDelete}>
                Yes, Delete
              </button>
              <button
                className="btn-cancel"
                onClick={() => setDeleteTarget(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
