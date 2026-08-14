// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import MyProfile from "./pages/MyProfile";
import MyTasks from "./pages/MyTasks";
import ManageUsers from "./pages/ManageUsers";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Default route redirects to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* Protected routes - accessible to any logged-in user */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <MyProfile />
              </ProtectedRoute>
            }
          />

          {/* Student-only page (still requires login; admins can also view but usually won't) */}
          <Route
            path="/my-tasks"
            element={
              <ProtectedRoute>
                <MyTasks />
              </ProtectedRoute>
            }
          />

          {/* Admin-only page */}
          <Route
            path="/manage-users"
            element={
              <AdminRoute>
                <ManageUsers />
              </AdminRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
