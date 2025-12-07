import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ReportPage() {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedImage, setSelectedImage] = useState(null); // State untuk modal foto

  const fetchReports = async (query = "") => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(
        "http://localhost:3001/api/reports/daily",
        config
      );

      let data = response.data.data || [];

      // Filter berdasarkan nama User
      if (query.trim() !== "") {
        data = data.filter((item) =>
          item.user?.nama?.toLowerCase().includes(query.toLowerCase())
        );
      }

      setReports(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal mengambil data laporan.");
    }
  };

  useEffect(() => {
    fetchReports("");
  }, [navigate]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchReports(searchTerm);
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Laporan Presensi Harian
      </h1>

      <form onSubmit={handleSearchSubmit} className="mb-6 flex space-x-2">
        <input
          type="text"
          placeholder="Cari berdasarkan nama..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        />
        <button
          type="submit"
          className="py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
        >
          Cari
        </button>
      </form>

      {error && (
        <p className="text-red-600 bg-red-100 p-4 rounded-md mb-4">{error}</p>
      )}

      {!error && (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold">ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold">Nama</th>
                <th className="px-4 py-3 text-left text-xs font-semibold">Check-In</th>
                <th className="px-4 py-3 text-left text-xs font-semibold">Check-Out</th>
                <th className="px-4 py-3 text-left text-xs font-semibold">Latitude</th>
                <th className="px-4 py-3 text-left text-xs font-semibold">Longitude</th>
                <th className="px-4 py-3 text-left text-xs font-semibold">Bukti Foto</th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {reports.length > 0 ? (
                reports.map((presensi) => (
                  <tr key={presensi.id}>
                    <td className="px-4 py-2">{presensi.id}</td>

                    <td className="px-4 py-2">
                      {presensi.user ? presensi.user.nama : " "}
                    </td>

                    <td className="px-4 py-2">
                      {new Date(presensi.checkIn).toLocaleString("id-ID", {
                        timeZone: "Asia/Jakarta",
                      })}
                    </td>

                    <td className="px-4 py-2">
                      {presensi.checkOut
                        ? new Date(presensi.checkOut).toLocaleString("id-ID", {
                          timeZone: "Asia/Jakarta",
                        })
                        : "Belum Check-Out"}
                    </td>

                    <td className="px-4 py-2">
                      {presensi.latitude ?? "-"}
                    </td>

                    <td className="px-4 py-2">
                      {presensi.longitude ?? "-"}
                    </td>

                    <td className="px-4 py-2">
                      {presensi.buktiFoto ? (
                        <img
                          src={`http://localhost:3001/${presensi.buktiFoto}`}
                          alt="Bukti"
                          className="w-16 h-16 object-cover rounded cursor-pointer hover:opacity-75"
                          onClick={() => setSelectedImage(`http://localhost:3001/${presensi.buktiFoto}`)}
                        />
                      ) : (
                        <span className="text-gray-400 italic">Tidak ada</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-gray-500">
                    Tidak ada data yang ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL UNTUK MENAMPILKAN FOTO FULL SIZE */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75" onClick={() => setSelectedImage(null)}>
          <div className="relative p-4">
            <button
              className="absolute top-2 right-2 text-white text-2xl font-bold bg-gray-800 rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-700"
              onClick={() => setSelectedImage(null)}
            >
              &times;
            </button>
            <img
              src={selectedImage}
              alt="Bukti Full"
              className="max-w-full max-h-screen rounded shadow-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ReportPage;
