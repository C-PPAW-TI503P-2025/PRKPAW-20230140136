import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import AttendancePage from "./components/AttendancePage";
import ReportPage from "./components/ReportPage";
import SensorPage from "./components/SensorPage";

import { jwtDecode } from "jwt-decode";

// Middleware Komponen
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/login" replace />;

  return children;
};

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/login" replace />;

  const user = jwtDecode(token);

  if (user.role !== "admin") {
    return <Navigate to="/presensi" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-grow">
          <Routes>

            {/* Halaman Public */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Halaman khusus yang butuh login */}
            <Route
              path="/presensi"
              element={
                <ProtectedRoute>
                  <AttendancePage />
                </ProtectedRoute>
              }
            />

            {/* Halaman Monitoring IoT - Bisa diakses semua user yang login */}
            <Route
              path="/monitoring"
              element={
                <ProtectedRoute>
                  <SensorPage />
                </ProtectedRoute>
              }
            />

            {/* Halaman khusus ADMIN */}
            <Route
              path="/reports"
              element={
                <AdminRoute>
                  <ReportPage />
                </AdminRoute>
              }
            />

            {/* Default */}
            <Route path="/" element={<Navigate to="/login" replace />} />

          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
