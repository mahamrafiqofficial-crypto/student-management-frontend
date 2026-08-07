// src/components/ProtectedRoute.jsx
// Wraps any page that should only be visible to logged-in users.
// If there's no logged-in user, it redirects to the login page.

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
