// src/components/SensorPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Registrasi komponen Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

function SensorPage() {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [],
    });
    const [cahayaChartData, setCahayaChartData] = useState({
        labels: [],
        datasets: [],
    });
    const [latestData, setLatestData] = useState({
        suhu: 0,
        kelembaban: 0,
        cahaya: 0
    });
    const [loading, setLoading] = useState(true);

    // Fungsi ambil data
    const fetchData = async () => {
        try {
            // Panggil API Backend kita
            const response = await axios.get('http://localhost:3001/api/iot/history');
            const dataSensor = response.data.data;

            if (dataSensor.length === 0) {
                setLoading(false);
                return;
            }

            // Siapkan sumbu X (Waktu) dan sumbu Y (Nilai)
            const labels = dataSensor.map(item =>
                new Date(item.createdAt).toLocaleTimeString('id-ID', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                })
            );

            const dataSuhu = dataSensor.map(item => item.suhu);
            const dataLembab = dataSensor.map(item => item.kelembaban);
            const dataCahaya = dataSensor.map(item => item.cahaya);

            // Set data untuk grafik Suhu & Kelembaban
            setChartData({
                labels: labels,
                datasets: [
                    {
                        label: 'Suhu (°C)',
                        data: dataSuhu,
                        borderColor: 'rgb(255, 99, 132)', // Merah
                        backgroundColor: 'rgba(255, 99, 132, 0.5)',
                        tension: 0.2,
                        yAxisID: 'y',
                    },
                    {
                        label: 'Kelembaban (%)',
                        data: dataLembab,
                        borderColor: 'rgb(53, 162, 235)', // Biru
                        backgroundColor: 'rgba(53, 162, 235, 0.5)',
                        tension: 0.2,
                        yAxisID: 'y',
                    },
                ],
            });

            // Set data untuk grafik Cahaya (LDR) - Grafik terpisah
            setCahayaChartData({
                labels: labels,
                datasets: [
                    {
                        label: 'Cahaya (LDR)',
                        data: dataCahaya,
                        borderColor: 'rgb(255, 205, 86)', // Kuning
                        backgroundColor: 'rgba(255, 205, 86, 0.5)',
                        tension: 0.2,
                    },
                ],
            });

            // Set data terakhir untuk kartu indikator
            const latest = dataSensor[dataSensor.length - 1];
            setLatestData({
                suhu: latest.suhu,
                kelembaban: latest.kelembaban,
                cahaya: latest.cahaya
            });

            setLoading(false);
        } catch (err) {
            setLoading(false);
        }
    };

    // Panggil data pertama kali & set Auto Refresh tiap 5 detik
    useEffect(() => {
        fetchData();

        const interval = setInterval(() => {
            fetchData();
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    // Opsi tampilan grafik Suhu & Kelembaban
    const tempHumidityOptions = {
        responsive: true,
        interaction: {
            mode: 'index',
            intersect: false,
        },
        plugins: {
            legend: { position: 'top' },
            title: {
                display: true,
                text: 'Monitoring Suhu & Kelembaban Real-time',
                font: { size: 16 }
            },
        },
        scales: {
            y: {
                type: 'linear',
                display: true,
                position: 'left',
                title: {
                    display: true,
                    text: 'Suhu (°C) / Kelembaban (%)'
                }
            },
        },
    };

    // Opsi tampilan grafik Cahaya (LDR)
    const cahayaOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: {
                display: true,
                text: 'Monitoring Intensitas Cahaya (LDR)',
                font: { size: 16 }
            },
        },
        scales: {
            y: {
                title: {
                    display: true,
                    text: 'Nilai LDR (0-4095)'
                }
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-800 mb-8">Dashboard IoT Monitoring</h1>

                {/* Kartu Indikator - Data Terakhir */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Kartu Suhu */}
                    <div className="bg-gradient-to-br from-red-400 to-red-600 rounded-lg shadow-lg p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold opacity-90">Suhu Terkini</p>
                                <p className="text-4xl font-bold mt-2">{latestData.suhu.toFixed(1)}°C</p>
                            </div>
                            <div className="text-6xl opacity-30">🌡️</div>
                        </div>
                    </div>

                    {/* Kartu Kelembaban */}
                    <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg shadow-lg p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold opacity-90">Kelembaban Terkini</p>
                                <p className="text-4xl font-bold mt-2">{latestData.kelembaban.toFixed(1)}%</p>
                            </div>
                            <div className="text-6xl opacity-30">💧</div>
                        </div>
                    </div>

                    {/* Kartu Cahaya */}
                    <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg shadow-lg p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold opacity-90">Cahaya Terkini</p>
                                <p className="text-4xl font-bold mt-2">{latestData.cahaya}</p>
                            </div>
                            <div className="text-6xl opacity-30">💡</div>
                        </div>
                    </div>
                </div>

                {/* Grafik Suhu & Kelembaban */}
                <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            <p className="mt-4 text-gray-600">Memuat data sensor...</p>
                        </div>
                    ) : chartData.labels.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-600">Belum ada data sensor. Pastikan ESP32 sudah mengirim data.</p>
                        </div>
                    ) : (
                        <Line options={tempHumidityOptions} data={chartData} />
                    )}
                </div>

                {/* Grafik Cahaya (LDR) - Terpisah */}
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
                            <p className="mt-4 text-gray-600">Memuat data cahaya...</p>
                        </div>
                    ) : cahayaChartData.labels.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-600">Belum ada data cahaya.</p>
                        </div>
                    ) : (
                        <Line options={cahayaOptions} data={cahayaChartData} />
                    )}
                </div>

                {/* Info Auto Refresh */}
                <div className="mt-6 text-center text-sm text-gray-500">
                    <p>📊 Data diperbarui otomatis setiap 5 detik</p>
                </div>
            </div>
        </div>
    );
}

export default SensorPage;
