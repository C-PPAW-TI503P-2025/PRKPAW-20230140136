// src/components/DashboardPage.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function DashboardPage() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      // Tidak ada token -> redirect ke login
      navigate('/login');
      return;
    }

    try {
      const decoded = jwtDecode(token);

      // Sesuai dengan payload backend (id, nama, role)
      setUserName(decoded.nama || 'User');
      setRole(decoded.role || '');

      // Optional: jika token kadaluarsa, otomatis logout
      const currentTime = Date.now() / 1000;
      if (decoded.exp && decoded.exp < currentTime) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } catch (err) {
      // Jika token tidak valid, hapus dan redirect ke login
      localStorage.removeItem('token');
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white p-10 rounded-lg shadow-md w-full max-w-2xl text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-3">
          Login Berhasil!
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          Selamat datang,{' '}
          <span className="font-semibold">{userName}</span>{' '}
          {role && <span className="text-sm text-gray-500">({role})</span>}
        </p>

        <div className="space-y-4">
          <p className="text-gray-600">
            Ini adalah dashboard sederhana. Kamu bisa menambahkan komponen lain
            di sini seperti daftar tugas, profil, atau data lainnya sesuai role.
          </p>

          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={handleLogout}
              className="py-2 px-6 bg-red-500 text-white rounded-md font-semibold hover:bg-red-600"
            >
              Logout
            </button>

            <button
              onClick={() => alert('Contoh aksi dijalankan!')}
              className="py-2 px-6 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700"
            >
              Contoh Aksi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
