import React from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = token ? jwtDecode(token) : null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold cursor-pointer" onClick={() => navigate("/")}>
          Presensi App
        </h1>

        <div className="flex items-center space-x-4">
          {/* Jika sudah login */}
          {user && <span>Selamat datang, {user.nama}</span>}

          {/* Tombol Presensi untuk mahasiswa */}
          {user && user.role === "mahasiswa" && (
            <button
              onClick={() => navigate("/presensi")}
              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
            >
              Presensi
            </button>
          )}

          {/* Tombol Admin */}
          {user && user.role === "admin" && (
            <button
              onClick={() => navigate("/reports")}
              className="bg-gray-200 text-black px-3 py-1 rounded hover:bg-gray-300"
            >
              Laporan Admin
            </button>
          )}

          {/* Login & Register jika belum login */}
          {!user && (
            <>
              <button
                onClick={() => navigate("/login")}
                className="bg-gray-200 text-black px-3 py-1 rounded hover:bg-gray-300"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/register")}
                className="bg-gray-200 text-black px-3 py-1 rounded hover:bg-gray-300"
              >
                Register
              </button>
            </>
          )}

          {/* Logout jika sudah login */}
          {user && (
            <button
              onClick={handleLogout}
              className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
