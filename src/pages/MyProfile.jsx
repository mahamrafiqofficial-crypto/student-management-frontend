// src/pages/MyProfile.jsx
import { useState, useEffect } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

const MyProfile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ------------------------------------------------------
  // Fetch the logged-in user's own profile from the backend
  // ------------------------------------------------------
  const fetchProfile = async () => {
    try {
      const res = await api.get("/users/me");
      setFormData({ name: res.data.data.name, email: res.data.data.email });
    } catch (err) {
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setSaving(true);

    try {
      await api.put("/users/me", formData);
      setMessage("Profile updated successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="dashboard-container">
        <h2 style={{ marginBottom: "16px" }}>My Profile</h2>

        {loading ? (
          <p>Loading profile...</p>
        ) : (
          <div className="profile-card">
            {message && <div className="success-msg">{message}</div>}
            {error && <div className="error-msg">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Role</label>
                <input
                  type="text"
                  value={user?.role}
                  disabled
                  style={{ background: "#f0f0f0" }}
                />
              </div>

              <button className="btn-primary" type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProfile;
