// src/components/AttendancePage.js

import React, { useState, useEffect } from "react";
import axios from "axios";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

function getToken() {
  return localStorage.getItem("token");
}

function AttendancePage() {
  const [coords, setCoords] = useState(null);  // { lat, lng }
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ============================
  //   GET CURRENT LOCATION
  // ============================
  const getLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation tidak didukung oleh browser ini.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (err) => {
        setError("Gagal mendapatkan lokasi: " + err.message);
      }
    );
  };

  // Dapatkan lokasi saat halaman dimuat
  useEffect(() => {
    getLocation();
  }, []);

  // ============================
  //   HANDLE CHECK-IN
  // ============================
  const handleCheckIn = async () => {
    setError("");
    setMessage("");

    if (!coords) {
      setError("Lokasi belum didapatkan. Mohon izinkan akses lokasi.");
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      };

      const response = await axios.post(
        "http://localhost:3001/api/presensi/check-in",
        {
          latitude: coords.lat,
          longitude: coords.lng,
        },
        config
      );

      setMessage(response.data.message);
    } catch (err) {
      setError(err.response ? err.response.data.message : "Check-in gagal");
    }
  };

  // ============================
  //   HANDLE CHECK-OUT
  // ============================
  const handleCheckOut = async () => {
    setError("");
    setMessage("");

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      };

      const response = await axios.post(
        "http://localhost:3001/api/presensi/check-out",
        {},
        config
      );

      setMessage(response.data.message);
    } catch (err) {
      setError(err.response ? err.response.data.message : "Check-out gagal");
    }
  };

  // ============================
  //   RETURN UI COMPONENT
  // ============================
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">

        <h2 className="text-3xl font-bold mb-6 text-gray-800">
          Lakukan Presensi
        </h2>

        {message && <p className="text-green-600 mb-4">{message}</p>}
        {error && <p className="text-red-600 mb-4">{error}</p>}

        <div className="flex space-x-4">
          <button
            onClick={handleCheckIn}
            className="w-full py-3 px-4 bg-green-600 text-white font-semibold rounded-md shadow-sm hover:bg-green-700"
          >
            Check-In
          </button>

          <button
            onClick={handleCheckOut}
            className="w-full py-3 px-4 bg-red-600 text-white font-semibold rounded-md shadow-sm hover:bg-red-700"
          >
            Check-Out
          </button>
        </div>

        {/* ============================
                MAP VIEW
        ============================ */}
        {coords && (
          <div className="my-4 border rounded-lg overflow-hidden">
            <MapContainer
              center={[coords.lat, coords.lng]}
              zoom={15}
              style={{ height: "300px", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />
              <Marker position={[coords.lat, coords.lng]}>
                <Popup>Lokasi Presensi Anda</Popup>
              </Marker>
            </MapContainer>
          </div>
        )}

      </div>
    </div>
  );
}

export default AttendancePage;
