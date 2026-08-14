// src/pages/MyTasks.jsx
import { useState, useEffect } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTasks = async () => {
    try {
      setLoading(true);
      // Backend automatically returns only this student's own tasks
      const res = await api.get("/tasks");
      setTasks(res.data.data);
    } catch (err) {
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
      fetchTasks(); // refresh list after update
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update task");
    }
  };

  const statusColor = {
    pending: "#dc2626",
    "in-progress": "#d97706",
    completed: "#16a34a",
  };

  return (
    <div>
      <Navbar />
      <div className="dashboard-container">
        <h2 style={{ marginBottom: "16px" }}>My Assigned Tasks</h2>

        {error && <div className="error-msg">{error}</div>}

        {loading ? (
          <p>Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p>No tasks assigned to you yet.</p>
        ) : (
          <div className="task-list">
            {tasks.map((task) => (
              <div className="task-card" key={task._id}>
                <div className="task-card-header">
                  <h3>{task.title}</h3>
                  <span
                    className="status-badge"
                    style={{ background: statusColor[task.status] }}
                  >
                    {task.status}
                  </span>
                </div>
                {task.description && <p>{task.description}</p>}
                <p className="task-meta">
                  Assigned by: {task.assignedBy?.name || "Admin"}
                </p>

                <div className="form-group" style={{ marginTop: "10px" }}>
                  <label>Update Status</label>
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(task._id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTasks;
