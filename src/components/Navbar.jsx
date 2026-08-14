// src/components/Navbar.jsx
// A shared navigation bar used across all protected pages.
// Shows different links depending on whether the logged-in user is an Admin or a Student.

import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h1>Student Management System</h1>
        <div className="nav-links">
          {user?.role === "admin" ? (
            <>
              <Link
                to="/dashboard"
                className={isActive("/dashboard") ? "nav-link active" : "nav-link"}
              >
                Students
              </Link>
              <Link
                to="/manage-users"
                className={isActive("/manage-users") ? "nav-link active" : "nav-link"}
              >
                Manage Users
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/dashboard"
                className={isActive("/dashboard") ? "nav-link active" : "nav-link"}
              >
                Students
              </Link>
              <Link
                to="/my-tasks"
                className={isActive("/my-tasks") ? "nav-link active" : "nav-link"}
              >
                My Tasks
              </Link>
            </>
          )}
          <Link
            to="/profile"
            className={isActive("/profile") ? "nav-link active" : "nav-link"}
          >
            My Profile
          </Link>
        </div>
      </div>

      <div className="user-info">
        <span>{user?.name}</span>
        <span className={`role-badge role-${user?.role}`}>
          {user?.role?.toUpperCase()}
        </span>
        <button className="btn-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
