// src/pages/Dashboard.jsx
import { useState, useEffect } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

const Dashboard = () => {
  const { user } = useAuth();

  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal state: null = closed, "add" = add mode, or a student object = edit mode
  const [modalMode, setModalMode] = useState(null);
  const [formData, setFormData] = useState({ name: "", age: "", course: "" });
  const [deleteTarget, setDeleteTarget] = useState(null);

  // ------------------------------------------------------
  // Fetch all students when the dashboard loads
  // ------------------------------------------------------
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await api.get("/students");
      setStudents(res.data.data);
    } catch (err) {
      setError("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // ------------------------------------------------------
  // Search filter — filters the already-fetched list by name (client-side)
  // ------------------------------------------------------
  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ------------------------------------------------------
  // Modal handlers
  // ------------------------------------------------------
  const openAddModal = () => {
    setFormData({ name: "", age: "", course: "" });
    setModalMode("add");
  };

  const openEditModal = (student) => {
    setFormData({ name: student.name, age: student.age, course: student.course });
    setModalMode(student); // store the student object itself so we know which one to update
  };

  const closeModal = () => setModalMode(null);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === "add") {
        await api.post("/students", formData);
      } else {
        // modalMode is the student object being edited
        await api.put(`/students/${modalMode._id}`, formData);
      }
      closeModal();
      fetchStudents(); // refresh the list
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  // ------------------------------------------------------
  // Delete handlers
  // ------------------------------------------------------
  const confirmDelete = (student) => setDeleteTarget(student);

  const handleDelete = async () => {
    try {
      await api.delete(`/students/${deleteTarget._id}`);
      setDeleteTarget(null);
      fetchStudents();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed (Admin only)");
      setDeleteTarget(null);
    }
  };

  return (
    <div>
      <Navbar />

      <div className="dashboard-container">
        <div className="dashboard-header">
          <input
            className="search-box"
            type="text"
            placeholder="Search student by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="btn-add" onClick={openAddModal}>
            + Add Student
          </button>
        </div>

        {error && <div className="error-msg">{error}</div>}

        {user?.role === "student" && (
          <div className="info-note">
            You are logged in as a <b>Student</b>. You can view, add, and edit
            students, but only an <b>Admin</b> can delete a record.
          </div>
        )}

        {loading ? (
          <p>Loading students...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Age</th>
                <th>Course</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="4">No students found</td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student._id}>
                    <td>{student.name}</td>
                    <td>{student.age}</td>
                    <td>{student.course}</td>
                    <td>
                      <div className="action-btns">
                        <button
                          className="btn-edit"
                          onClick={() => openEditModal(student)}
                        >
                          Edit
                        </button>
                        {/* Delete button only shows for admins - students don't even see it */}
                        {user?.role === "admin" && (
                          <button
                            className="btn-delete"
                            onClick={() => confirmDelete(student)}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Add / Edit Modal */}
      {modalMode && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>{modalMode === "add" ? "Add Student" : "Edit Student"}</h3>
            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Course</label>
                <input
                  type="text"
                  name="course"
                  value={formData.course}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div className="modal-actions">
                <button className="btn-primary" type="submit">
                  Save
                </button>
                <button
                  className="btn-cancel"
                  type="button"
                  onClick={closeModal}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Delete Student</h3>
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

export default Dashboard;
