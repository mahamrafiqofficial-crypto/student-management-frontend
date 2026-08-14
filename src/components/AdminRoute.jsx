// src/components/AdminRoute.jsx
// Wraps pages that should only be accessible to Admin users.
// Students get redirected back to the dashboard if they try to access
// an admin-only route directly via URL.

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default AdminRoute;
